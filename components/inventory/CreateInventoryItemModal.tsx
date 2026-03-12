"use client";

import React, { memo, useCallback, useState } from "react";
import { IoClose } from "react-icons/io5";
import FormInput from "@/components/FormInput";
import FormDropdown from "@/components/FormDropdown";
import toast from "react-hot-toast";
import { ZodError, z } from "zod";
import { createInventoryItem } from "@/services/inventoryItem.Services";
import { inventorySchema } from "@/utils/validation/inventorySchema";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  storagePlaces: { value: string; label: string }[];
}

const CreateInventoryItemModal = memo(
  ({ isOpen, onClose, onSuccess, storagePlaces }: Props) => {
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState<File | null>(null);
    const [data, setData] = useState({
      name: "",
      code: "",
      quantity: "",
      serial_number: "",
      description: "",
      storage_place_id: "",
      status: "in_store",
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
          const validData = inventorySchema.parse({
            ...data,
            quantity: Number(data.quantity),
            storage_place_id: Number(data.storage_place_id),
          });

          const formData = new FormData();
          Object.entries(validData).forEach(([key, value]) => {
            if (value !== undefined && value !== "")
              formData.append(key, String(value));
          });
          if (image) formData.append("image", image);

          const res = await createInventoryItem(formData);
          if (res.success) {
            toast.success(res.message);
            setData({
              name: "",
              code: "",
              quantity: "",
              serial_number: "",
              description: "",
              storage_place_id: "",
              status: "in_store",
            });
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
          toast.error(error?.message || "Failed to create inventory item");
        } finally {
          setLoading(false);
        }
      },
      [data, image, onClose, onSuccess],
    );

    const handleClose = useCallback(() => {
      if (!loading) {
        setData({
          name: "",
          code: "",
          quantity: "",
          serial_number: "",
          description: "",
          storage_place_id: "",
          status: "in_store",
        });
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
              <h5 className="text-lg font-semibold">Create Inventory Item</h5>
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
                      Fill in the inventory item information.
                    </h5>
                  </header>
                  <section className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <FormInput
                      label="Item Name"
                      name="name"
                      type="text"
                      value={data.name}
                      placeholder="e.g. Network Switch"
                      onChange={handleChange}
                      disabled={loading}
                      required
                    />
                    <FormInput
                      label="Item Code"
                      name="code"
                      type="text"
                      value={data.code}
                      placeholder="e.g. NET-SW-001"
                      onChange={handleChange}
                      disabled={loading}
                      required
                    />
                    <FormInput
                      label="Quantity"
                      name="quantity"
                      type="number"
                      value={data.quantity}
                      placeholder="0"
                      min={0}
                      onChange={handleChange}
                      disabled={loading}
                      required
                    />
                    <FormInput
                      label="Serial Number"
                      name="serial_number"
                      type="text"
                      value={data.serial_number}
                      placeholder="Optional"
                      onChange={handleChange}
                      disabled={loading}
                    />
                    <FormDropdown
                      label="Storage Place"
                      name="storage_place_id"
                      options={storagePlaces.map((item) => ({
                        value: item.value,
                        label: item.label,
                      }))}
                      value={data.storage_place_id}
                      onChange={handleChange}
                      disabled={loading}
                    />
                    <FormDropdown
                      label="Status"
                      name="status"
                      options={[
                        { value: "in_store", label: "In Store" },
                        { value: "borrowed", label: "Borrowed" },
                        { value: "damaged", label: "Damaged" },
                        { value: "missing", label: "Missing" },
                      ]}
                      value={data.status}
                      onChange={handleChange}
                      disabled={loading}
                    />
                    <div className="md:col-span-2">
                      <FormInput
                        label="Description"
                        name="description"
                        type="text"
                        value={data.description}
                        placeholder="Optional description"
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </div>
                    <div className="flex flex-col gap-1 md:col-span-2">
                      <label className="text-sm font-medium text-slate-700">
                        Image (optional)
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
                  {loading ? "Creating..." : "Create Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </>
    );
  },
);

export default CreateInventoryItemModal;
