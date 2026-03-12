"use client";

import React, { memo, useCallback, useState } from "react";
import { IoClose } from "react-icons/io5";
import FormInput from "@/components/FormInput";
import FormDropdown from "@/components/FormDropdown";
import toast from "react-hot-toast";
import { ZodError, z } from "zod";
import { adjustItemQuantity } from "@/services/inventoryItem.Services";
import { adjestInventorySchema } from "@/utils/validation/inventorySchema";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  data: { id: number; name: string; quantity: number };
}

const AdjustQuantityModal = memo(
  ({ isOpen, onClose, onSuccess, data }: Props) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
      type: "increment",
      amount: "",
      reason: "",
    });

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
          const validData = adjestInventorySchema.parse({
            ...formData,
            amount: Number(formData.amount),
          });
          const res = await adjustItemQuantity({ id: data.id, ...validData });
          if (res.success) {
            toast.success(res.message);
            setFormData({ type: "increment", amount: "", reason: "" });
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
          toast.error(error?.message || "Failed to adjust quantity");
        } finally {
          setLoading(false);
        }
      },
      [formData, data, onClose, onSuccess],
    );

    const handleClose = useCallback(() => {
      if (!loading) {
        setFormData({ type: "increment", amount: "", reason: "" });
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
          <div className="w-full max-w-md overflow-hidden rounded-lg bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <h5 className="text-lg font-semibold">Adjust Quantity</h5>
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
                    <h4 className="text-base font-medium">{data.name}</h4>
                    <h5 className="text-sm text-slate-400">
                      Current quantity:{" "}
                      <span className="font-semibold text-slate-600">
                        {data.quantity}
                      </span>
                    </h5>
                  </header>
                  <section className="flex flex-col gap-3">
                    <FormDropdown
                      label="Type"
                      name="type"
                      options={[
                        { value: "increment", label: "Increment (Add)" },
                        { value: "decrement", label: "Decrement (Remove)" },
                      ]}
                      value={formData.type}
                      onChange={handleChange}
                      disabled={loading}
                    />
                    <FormInput
                      label="Amount"
                      name="amount"
                      type="number"
                      value={formData.amount}
                      placeholder="e.g. 5"
                      min={0}
                      onChange={handleChange}
                      disabled={loading}
                      required
                    />
                    <FormInput
                      label="Reason (optional)"
                      name="reason"
                      type="text"
                      value={formData.reason}
                      placeholder="e.g. Restocked from supplier"
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
                  {loading ? "Adjusting..." : "Adjust Quantity"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </>
    );
  },
);

export default AdjustQuantityModal;
