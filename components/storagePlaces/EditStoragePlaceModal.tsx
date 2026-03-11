"use client";

import React, { memo, useCallback, useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import FormInput from "@/components/FormInput";
import FormDropdown from "@/components/FormDropdown";
import toast from "react-hot-toast";
import { ZodError, z } from "zod";
import { updateStoragePlace } from "@/services/storagePlace.Services";
import { fetchAllCupboards } from "@/services/cupboard.Services";
import { storageSchema } from "@/utils/validation/storageValidation";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  data: {
    id: number;
    name: string;
    cupboard_id: number;
    description: string | null;
  };
  cupboards: { value: string; label: string }[];
}

const EditStoragePlaceModal = memo(
  ({ isOpen, onClose, onSuccess, data, cupboards }: Props) => {
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
      name: "",
      cupboard_id: "",
      description: "",
    });

    useEffect(() => {
      if (data) {
        setFormData({
          name: data.name,
          cupboard_id: String(data.cupboard_id),
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
          const validData = storageSchema.parse({
            ...formData,
            cupboard_id: Number(formData.cupboard_id),
          });
          const res = await updateStoragePlace({ id: data.id, ...validData });
          if (res.success) {
            toast.success(res.message);
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
          toast.error(error?.message || "Failed to update storage place");
        } finally {
          setLoading(false);
        }
      },
      [formData, data, onClose, onSuccess],
    );

    const handleClose = useCallback(() => {
      if (!loading) onClose();
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
              <h5 className="text-lg font-semibold">Edit Storage Place</h5>
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
                  <header className="flex flex-col gap-1">
                    <h4 className="text-base font-medium">
                      Storage Place Details
                    </h4>
                    <h5 className="text-sm font-normal text-slate-400">
                      Update the storage place information.
                    </h5>
                  </header>
                  <section className="flex flex-col gap-3">
                    <FormDropdown
                      label="Cupboard"
                      name="cupboard_id"
                      options={cupboards.map((item) => ({
                        value: item.value,
                        label: item.label,
                      }))}
                      value={formData.cupboard_id}
                      onChange={handleChange}
                      disabled={loading}
                    />
                    <FormInput
                      label="Name"
                      name="name"
                      type="text"
                      value={formData.name}
                      placeholder="e.g. Shelf 1"
                      onChange={handleChange}
                      disabled={loading}
                      required
                    />
                    <FormInput
                      label="Description"
                      name="description"
                      type="text"
                      value={formData.description}
                      placeholder="e.g. Top shelf for networking gear"
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
                  className="bg-secondary h-10 w-40 cursor-pointer rounded-md border border-slate-300 text-sm font-bold text-white shadow-md disabled:opacity-50"
                >
                  {loading ? "Updating..." : "Update Place"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </>
    );
  },
);

export default EditStoragePlaceModal;
