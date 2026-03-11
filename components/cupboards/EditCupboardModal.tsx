"use client";

import React, { memo, useCallback, useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import FormInput from "@/components/FormInput";
import toast from "react-hot-toast";
import { ZodError } from "zod";
import { updateCupboard } from "@/services/cupboard.Services";
import { CreateCupboardInterface } from "@/utils/interfaces/cupboardInterface";
import { cupboardSchema } from "@/utils/validation/cupboard.Schema";

interface EditCupboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  data: {
    id: number;
    name: string;
    location: string | null;
    description: string | null;
  };
}

const EditCupboardModal = memo(
  ({ isOpen, onClose, onSuccess, data }: EditCupboardModalProps) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [formData, setFormData] = useState<CreateCupboardInterface>({
      name: "",
      location: "",
      description: "",
    });

    useEffect(() => {
      if (data) {
        setFormData({
          name: data.name,
          location: data.location ?? "",
          description: data.description ?? "",
        });
      }
    }, [data]);

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
      },
      [],
    );

    const handleSubmit = useCallback(
      async (e: React.FormEvent) => {
        e.preventDefault();
        try {
          setLoading(true);
          const validData = cupboardSchema.parse(formData);
          const res = await updateCupboard({ id: data.id, ...validData });

          if (res.success) {
            toast.success(res.message);
            onSuccess?.();
            onClose();
          } else {
            toast.error(res.message);
          }
        } catch (error: any) {
          if (error instanceof ZodError) {
            toast.error(error.issues[0]?.message || "Validation error");
            return;
          }
          toast.error(error?.message || "Failed to update cupboard");
        } finally {
          setLoading(false);
        }
      },
      [formData, data, onClose, onSuccess],
    );

    const handleClose = useCallback(() => {
      if (!loading) {
        onClose();
      }
    }, [loading, onClose]);

    if (!isOpen) return null;

    return (
      <>
        <div
          className="fixed inset-0 z-40 bg-black/50 transition-opacity"
          onClick={handleClose}
        />

        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg overflow-hidden rounded-lg bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div>
                <h5 className="text-lg font-semibold">Edit Cupboard</h5>
              </div>
              <button
                onClick={handleClose}
                disabled={loading}
                className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
              >
                <IoClose size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-3 p-6">
                <div className="flex flex-col gap-3 rounded-lg border border-slate-300 px-3 py-4">
                  <header className="flex flex-col items-start justify-start gap-1">
                    <h4 className="text-base font-medium">Cupboard Details</h4>
                    <h5 className="text-sm font-normal text-slate-400">
                      Update the cupboard information.
                    </h5>
                  </header>
                  <section className="flex flex-col gap-3">
                    <FormInput
                      label="Cupboard Name"
                      name="name"
                      type="text"
                      value={formData.name}
                      placeholder="e.g. Cabinet A"
                      onChange={handleChange}
                      disabled={loading}
                      required
                    />
                    <FormInput
                      label="Location"
                      name="location"
                      type="text"
                      value={formData.location}
                      placeholder="e.g. Server Room, Main Office"
                      onChange={handleChange}
                      disabled={loading}
                    />
                    <FormInput
                      label="Description"
                      name="description"
                      type="text"
                      value={formData.description}
                      placeholder="e.g. Stores networking equipment"
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </section>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-6 py-4">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={loading}
                  className="rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-secondary h-10 w-36 cursor-pointer rounded-md border border-slate-300 text-sm font-bold text-white shadow-md focus:drop-shadow-xl disabled:opacity-50"
                >
                  {loading ? "Updating..." : "Update Cupboard"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </>
    );
  },
);

export default EditCupboardModal;
