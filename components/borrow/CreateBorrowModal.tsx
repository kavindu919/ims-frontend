"use client";

import React, { memo, useCallback, useState } from "react";
import { IoClose } from "react-icons/io5";
import FormInput from "@/components/FormInput";
import FormDropdown from "@/components/FormDropdown";
import toast from "react-hot-toast";
import { ZodError, z } from "zod";
import { createBorrowRecord } from "@/services/borrowRecord.Services";
import { createBorrowRecordSchema } from "@/utils/validation/borrowRecord.Schema";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  items: { value: string; label: string }[];
}

const CreateBorrowModal = memo(
  ({ isOpen, onClose, onSuccess, items }: Props) => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({
      item_id: "",
      borrower_name: "",
      contact: "",
      borrow_date: "",
      expected_return_date: "",
      quantity_borrowed: "",
      notes: "",
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
          const validData = createBorrowRecordSchema.parse({
            ...data,
            item_id: Number(data.item_id),
            quantity_borrowed: Number(data.quantity_borrowed),
          });
          const res = await createBorrowRecord(validData);
          if (res.success) {
            toast.success(res.message);
            setData({
              item_id: "",
              borrower_name: "",
              contact: "",
              borrow_date: "",
              expected_return_date: "",
              quantity_borrowed: "",
              notes: "",
            });
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
          toast.error(error?.message || "Failed to create borrow record");
        } finally {
          setLoading(false);
        }
      },
      [data, onClose, onSuccess],
    );

    const handleClose = useCallback(() => {
      if (!loading) {
        setData({
          item_id: "",
          borrower_name: "",
          contact: "",
          borrow_date: "",
          expected_return_date: "",
          quantity_borrowed: "",
          notes: "",
        });
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
              <h5 className="text-lg font-semibold">Create Borrow Record</h5>
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
                    <h4 className="text-base font-medium">Borrow Details</h4>
                    <h5 className="text-sm font-normal text-slate-400">
                      Fill in the borrowing information.
                    </h5>
                  </header>
                  <section className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <FormDropdown
                        label="Item"
                        name="item_id"
                        options={items}
                        value={data.item_id}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </div>
                    <FormInput
                      label="Borrower Name"
                      name="borrower_name"
                      type="text"
                      value={data.borrower_name}
                      placeholder="e.g. kavindu Jayakody"
                      onChange={handleChange}
                      disabled={loading}
                      required
                    />
                    <FormInput
                      label="Contact"
                      name="contact"
                      type="tel"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={data.contact}
                      placeholder="e.g. 0771234567"
                      onChange={handleChange}
                      disabled={loading}
                      required
                    />
                    <FormInput
                      label="Borrow Date"
                      name="borrow_date"
                      type="date"
                      value={data.borrow_date}
                      placeholder=""
                      onChange={handleChange}
                      disabled={loading}
                      required
                    />
                    <FormInput
                      label="Expected Return Date"
                      name="expected_return_date"
                      type="date"
                      value={data.expected_return_date}
                      placeholder=""
                      onChange={handleChange}
                      disabled={loading}
                      required
                    />
                    <FormInput
                      label="Quantity"
                      name="quantity_borrowed"
                      type="number"
                      value={data.quantity_borrowed}
                      placeholder="e.g. 1"
                      min={1}
                      onChange={handleChange}
                      disabled={loading}
                      required
                    />
                    <div className="md:col-span-2">
                      <FormInput
                        label="Notes (optional)"
                        name="notes"
                        type="text"
                        value={data.notes}
                        placeholder="Any additional notes"
                        onChange={handleChange}
                        disabled={loading}
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
                  {loading ? "Creating..." : "Create Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </>
    );
  },
);

export default CreateBorrowModal;
