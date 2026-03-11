"use client";

import React, { memo, useCallback, useState } from "react";
import { IoClose } from "react-icons/io5";
import FormDropdown from "@/components/FormDropdown";
import toast from "react-hot-toast";
import { changeItemStatus } from "@/services/inventoryItem.Services";
import {
  allowedTransitions,
  statusLableChange,
} from "@/utils/helper/changeStatus.helper";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  data: { id: number; name: string; status: string };
}

const ChangeStatusModal = memo(
  ({ isOpen, onClose, onSuccess, data }: Props) => {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("");

    const options = allowedTransitions[data?.status] ?? [];

    const handleSubmit = useCallback(
      async (e: React.FormEvent) => {
        e.preventDefault();
        if (!status) {
          toast.error("Please select a status");
          return;
        }
        try {
          setLoading(true);
          const res = await changeItemStatus({ id: data.id, status });
          if (res.success) {
            toast.success(res.message);
            setStatus("");
            onSuccess?.();
            onClose();
          } else {
            toast.error(res.message);
          }
        } catch (error: any) {
          toast.error(error?.message || "Failed to change status");
        } finally {
          setLoading(false);
        }
      },
      [status, data, onClose, onSuccess],
    );

    const handleClose = useCallback(() => {
      if (!loading) {
        setStatus("");
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
              <h5 className="text-lg font-semibold">Change Status</h5>
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
                      Current status:{" "}
                      <span className="font-semibold text-slate-600">
                        {statusLableChange(data.status)}
                      </span>
                    </h5>
                  </header>
                  <FormDropdown
                    label="New Status"
                    name="status"
                    options={[
                      { value: "", label: "Select new status" },
                      ...options,
                    ]}
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    disabled={loading}
                  />
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
                  {loading ? "Updating..." : "Update Status"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </>
    );
  },
);

export default ChangeStatusModal;
