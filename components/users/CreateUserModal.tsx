"use client";

import React, { memo, useCallback, useState } from "react";
import { IoClose } from "react-icons/io5";
import FormInput from "@/components/FormInput";
import FormDropdown from "@/components/FormDropdown";
import toast from "react-hot-toast";
import { ZodError, z } from "zod";
import { createUser } from "@/services/user.Services";
import { userSchema } from "@/utils/validation/user.Schema";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const CreateUserModal = memo(({ isOpen, onClose, onSuccess }: Props) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{
    name: string;
    email: string;
    password: string;
    role: string;
  }>({
    name: "",
    email: "",
    password: "",
    role: "staff",
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
        const validData = userSchema.parse(data);
        const res = await createUser(validData);
        if (res.success) {
          toast.success(res.message);
          setData({ name: "", email: "", password: "", role: "staff" });
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
        toast.error(error?.message || "Failed to create user");
      } finally {
        setLoading(false);
      }
    },
    [data, onClose, onSuccess],
  );

  const handleClose = useCallback(() => {
    if (!loading) {
      setData({ name: "", email: "", password: "", role: "staff" });
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
            <h5 className="text-lg font-semibold">Create User</h5>
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
                    Create a new system user.
                  </h5>
                </header>
                <section className="flex flex-col gap-3">
                  <FormInput
                    label="Full Name"
                    name="name"
                    type="text"
                    value={data.name}
                    placeholder="e.g. Kavindu Jayakody"
                    onChange={handleChange}
                    disabled={loading}
                    required
                  />
                  <FormInput
                    label="Email Address"
                    name="email"
                    type="email"
                    value={data.email}
                    placeholder="e.g. kavindu@gmail.com"
                    onChange={handleChange}
                    disabled={loading}
                    required
                  />
                  <FormInput
                    label="Password"
                    name="password"
                    type="password"
                    value={data.password}
                    placeholder="Min 8 characters"
                    onChange={handleChange}
                    disabled={loading}
                    required
                  />
                  <FormDropdown
                    label="Role"
                    name="role"
                    options={[
                      { value: "staff", label: "Staff" },
                      { value: "admin", label: "Admin" },
                    ]}
                    value={data.role}
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
                {loading ? "Creating..." : "Create User"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
});

export default CreateUserModal;
