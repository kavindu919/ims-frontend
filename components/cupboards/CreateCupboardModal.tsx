"use client";

import React, { memo, useCallback, useState } from "react";
import { IoClose } from "react-icons/io5";
import toast from "react-hot-toast";
import { ZodError } from "zod";
import FormInput from "../FormInput";
import { createCupboard } from "@/services/cupboard.Services";
import { cupboardSchema } from "@/utils/validation/cupboard.Schema";
import { CreateCupboardInterface } from "@/utils/interfaces/cupboardInterface";

interface CreateCupboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const CreateCupboardModal = memo(
  ({ isOpen, onClose, onSuccess }: CreateCupboardModalProps) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<CreateCupboardInterface>({
      name: "",
      location: "",
      description: "",
    });

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
      },
      [],
    );

    const handleSubmit = useCallback(
      async (e: React.FormEvent) => {
        e.preventDefault();
        try {
          setLoading(true);
          const validData = cupboardSchema.parse(data);
          const res = await createCupboard(validData);
          if (res.success) {
            toast.success(res.message);
            setData({ name: "", location: "", description: "" });
            onSuccess?.();
            onClose();
          } else {
            toast.error(res.message);
          }
        } catch (error: any) {
          if (error instanceof ZodError) {
            toast.error(error.issues[0]?.message);
            return;
          }
          toast.error(error?.message);
        } finally {
          setLoading(false);
        }
      },
      [data, onClose, onSuccess],
    );

    const handleClose = useCallback(() => {
      if (!loading) {
        setData({ name: "", location: "", description: "" });
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
                <h5 className="text-lg font-semibold">Create Cupboard</h5>
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
                      Add a new storage cupboard to the system.
                    </h5>
                  </header>
                  <section className="flex flex-col gap-3">
                    <FormInput
                      label="Cupboard Name"
                      name="name"
                      type="text"
                      value={data.name}
                      placeholder="e.g. Cabinet A"
                      onChange={handleChange}
                      disabled={loading}
                      required
                    />
                    <FormInput
                      label="Location"
                      name="location"
                      type="text"
                      value={data.location}
                      placeholder="e.g. Server Room, Main Office"
                      onChange={handleChange}
                      disabled={loading}
                    />
                    <FormInput
                      label="Description"
                      name="description"
                      type="text"
                      value={data.description}
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
                  {loading ? "Creating..." : "Create Cupboard"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </>
    );
  },
);

export default CreateCupboardModal;
