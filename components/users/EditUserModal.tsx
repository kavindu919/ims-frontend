"use client";

import React, { memo, useCallback, useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import FormInput from "@/components/FormInput";
import FormDropdown from "@/components/FormDropdown";
import toast from "react-hot-toast";
import { ZodError, z } from "zod";
import { updateUser } from "@/services/user.Services";
import { edituserSchema, userSchema } from "@/utils/validation/user.Schema";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  data: {
    id: number;
    name: string;
    email: string;
    role: string;
    is_active: boolean;
  };
}

const EditUserModal = memo(({ isOpen, onClose, onSuccess, data }: Props) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "staff",
    password: "",
    is_active: "true",
  });

  useEffect(() => {
    if (data) {
      setFormData({
        name: data.name,
        email: data.email,
        role: data.role,
        password: "",
        is_active: String(data.is_active),
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
        const validData = edituserSchema.parse({
          ...formData,
          id: data.id,
        });
        const res = await updateUser(validData);
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
        toast.error(error?.message || "Failed to update user");
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
            <h5 className="text-lg font-semibold">Edit User</h5>
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
                  <h4 className="text-base font-medium">User Details</h4>
                  <h5 className="text-sm font-normal text-slate-400">
                    Leave password blank to keep unchanged.
                  </h5>
                </header>
                <section className="flex flex-col gap-3">
                  <FormInput
                    label="Full Name"
                    name="name"
                    type="text"
                    value={formData.name}
                    placeholder="e.g. Kavindu Jayakody"
                    onChange={handleChange}
                    disabled={loading}
                    required
                  />
                  <FormInput
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    placeholder="e.g. kavindu@gmail.com"
                    onChange={handleChange}
                    disabled={loading}
                    required
                  />
                  <FormInput
                    label="New Password (optional)"
                    name="password"
                    type="password"
                    value={formData.password}
                    placeholder="Leave blank to keep current"
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <FormDropdown
                    label="Role"
                    name="role"
                    options={[
                      { value: "staff", label: "Staff" },
                      { value: "admin", label: "Admin" },
                    ]}
                    value={formData.role}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <FormDropdown
                    label="Status"
                    name="is_active"
                    options={[
                      { value: "true", label: "Active" },
                      { value: "false", label: "Inactive" },
                    ]}
                    value={formData.is_active}
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
                className="bg-secondary h-10 w-36 cursor-pointer rounded-md border border-slate-300 text-sm font-bold text-white shadow-md disabled:opacity-50"
              >
                {loading ? "Updating..." : "Update User"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
});

export default EditUserModal;
