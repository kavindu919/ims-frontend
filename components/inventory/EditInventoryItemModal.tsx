"use client";

import React, { memo, useCallback, useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import FormInput from "@/components/FormInput";
import FormDropdown from "@/components/FormDropdown";
import toast from "react-hot-toast";
import { ZodError } from "zod";
import { updateInventoryItem } from "@/services/inventoryItem.Services";
import { editinventorySchema } from "@/utils/validation/inventorySchema";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  storagePlaces: { value: string; label: string }[];
  data: {
    id: number;
    name: string;
    code: string;
    serial_number: string | null;
    description: string | null;
    storage_place_id: number;
    status: string;
  };
}

const EditInventoryItemModal = memo(
  ({ isOpen, onClose, onSuccess, storagePlaces, data }: Props) => {
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState<File | null>(null);
    const [formData, setFormData] = useState({
      name: "",
      code: "",
      serial_number: "",
      description: "",
      storage_place_id: "",
    });

    useEffect(() => {
      if (data) {
        setFormData({
          name: data.name,
          code: data.code,
          serial_number: data.serial_number ?? "",
          description: data.description ?? "",
          storage_place_id: String(data.storage_place_id),
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
          const validData = editinventorySchema.parse({
            ...formData,
            storage_place_id: Number(formData.storage_place_id),
          });

          const form = new FormData();
          form.append("id", String(data.id));
          Object.entries(validData).forEach(([key, value]) => {
            if (value !== undefined && value !== "")
              form.append(key, String(value));
          });
          if (image) form.append("image", image);

          const res = await updateInventoryItem(form);
          if (res.success) {
            toast.success(res.message);
            setImage(null);
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
          toast.error(error?.message || "Failed to update inventory item");
        } finally {
          setLoading(false);
        }
      },
      [formData, image, data, onClose, onSuccess],
    );

    const handleClose = useCallback(() => {
      if (!loading) {
        setImage(null);
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
          <div className="w-full max-w-2xl overflow-hidden rounded-lg bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <h5 className="text-lg font-semibold">Edit Inventory Item</h5>
              <button
                onClick={handleClose}
                disabled={loading}
                className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
              >
                <IoClose size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="max-h-[70vh] space-y-3 overflow-y-auto p-6">
                <div className="flex flex-col gap-3 rounded-lg border border-slate-300 px-3 py-4">
                  <header className="flex flex-col gap-1">
                    <h4 className="text-base font-medium">Item Details</h4>
                    <h5 className="text-sm font-normal text-slate-400">
                      Update the inventory item information.
                    </h5>
                  </header>
                  <section className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <FormInput
                      label="Item Name"
                      name="name"
                      type="text"
                      value={formData.name}
                      placeholder="e.g. Network Switch"
                      onChange={handleChange}
                      disabled={loading}
                      required
                    />
                    <FormInput
                      label="Item Code"
                      name="code"
                      type="text"
                      value={formData.code}
                      placeholder="e.g. NET-SW-001"
                      onChange={handleChange}
                      disabled={loading}
                      required
                    />
                    <FormInput
                      label="Serial Number"
                      name="serial_number"
                      type="text"
                      value={formData.serial_number}
                      placeholder="Optional"
                      onChange={handleChange}
                      disabled={true}
                    />
                    <FormDropdown
                      label="Storage Place"
                      name="storage_place_id"
                      options={[
                        { value: "", label: "Select a storage place" },
                        ...storagePlaces,
                      ]}
                      value={formData.storage_place_id}
                      onChange={handleChange}
                      disabled={loading}
                    />
                    <div className="md:col-span-2">
                      <FormInput
                        label="Description"
                        name="description"
                        type="text"
                        value={formData.description}
                        placeholder="Optional description"
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </div>
                    <div className="flex flex-col gap-1 md:col-span-2">
                      <label className="text-sm font-medium text-slate-700">
                        Replace Image (optional)
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={loading}
                        onChange={(e) => setImage(e.target.files?.[0] || null)}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                      />
                    </div>
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
                  {loading ? "Updating..." : "Update Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </>
    );
  },
);

export default EditInventoryItemModal;
