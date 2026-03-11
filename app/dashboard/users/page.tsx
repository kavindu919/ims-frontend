"use client";
import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";
import { FiEdit2 } from "react-icons/fi";
import { fetchAllUsers } from "@/services/user.Services";
import { PaginationProps } from "@/utils/interfaces/commanInterface";
import Pagination from "@/components/Pagination";
import PopupButton from "@/components/PopupButton";
import CreateUserModal from "@/components/users/CreateUserModal";
import EditUserModal from "@/components/users/EditUserModal";
import UserFilters from "@/components/users/UserFilters";
import { useDebounce } from "@/hook/useDebounce";
import { User, UserQueryProps } from "@/utils/interfaces/userInterface";
import { roleColors } from "@/utils/helper/roleBadge.helper";

const Page = () => {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<User[]>([]);
  const [openCreatePopup, setOpenCreatePopup] = useState(false);
  const [openEditPopup, setOpenEditPopup] = useState(false);
  const [editData, setEditData] = useState<User | null>(null);
  const [page, setPage] = useState<PaginationProps>({
    total: 0,
    page: 1,
    limit: 20,
  });
  const [query, setQuery] = useState<UserQueryProps>({
    search: "",
    role: "",
    is_active: "",
    sortBy: "created_at",
    sortOrder: "desc",
    page: 1,
    limit: 20,
  });

  const debounced = useDebounce(400, query.search);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchAllUsers({ ...query, search: debounced ?? "" });
      if (res.success) {
        setData(res.users);
        setPage(res.meta);
      } else {
        toast.error(res.message);
      }
    } catch (error: any) {
      toast.error(error.message || "Unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }, [
    query.page,
    query.limit,
    query.sortBy,
    query.sortOrder,
    query.role,
    query.is_active,
    debounced,
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  const handleEditClose = useCallback(() => {
    setEditData(null);
    setOpenEditPopup(false);
  }, []);

  const handleEditSuccess = useCallback(() => {
    handleEditClose();
    fetchData();
  }, [handleEditClose, fetchData]);
  const handleCreateSuccess = useCallback(() => {
    setOpenCreatePopup(false);
    fetchData();
  }, [fetchData]);

  const handlePageChange = useCallback(
    (newPage: number) => setQuery((prev) => ({ ...prev, page: newPage })),
    [],
  );
  const handleEditClick = useCallback((user: User) => {
    setEditData(user);
    setOpenEditPopup(true);
  }, []);

  return (
    <div className="h-full w-full space-y-4 pb-24">
      <header className="flex flex-row items-center justify-between">
        <h5 className="text-xs text-slate-500 uppercase">
          {pathname.substring(1).split("/").join(" / ")}
        </h5>
        <PopupButton
          text="Create User"
          type="button"
          isLoading={loading}
          disabled={loading}
          onClick={() => setOpenCreatePopup(true)}
        />
      </header>

      <section className="flex flex-row gap-3">
        <UserFilters query={query} setQuery={setQuery} />
      </section>

      <section>
        <table className="tableoutline">
          <thead className="tablehead">
            <tr>
              <th className="tableheadcell">Name</th>
              <th className="tableheadcell">Email</th>
              <th className="tableheadcell">Role</th>
              <th className="tableheadcell">Status</th>
              <th className="tableheadcell">Created By</th>
              <th className="tableheadcell">Created</th>
              <th className="tableheadcell">Actions</th>
            </tr>
          </thead>
          <tbody className="tablebody">
            {loading ? (
              [...Array(5)].map((_, index) => (
                <tr key={index}>
                  <td colSpan={7} className="px-4 py-3">
                    <div className="h-5 w-full animate-pulse rounded-md bg-slate-100" />
                  </td>
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-sm font-medium text-slate-400">
                      No users found
                    </p>
                    <p className="text-xs text-slate-300">
                      Create a user to get started
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.id} className="tablerow">
                  <td className="tabledata font-medium text-slate-700">
                    {item.name ?? "-"}
                  </td>
                  <td className="tabledata text-slate-500">
                    {item.email ?? "-"}
                  </td>
                  <td className="tabledata">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${roleColors[item.role] ?? "bg-slate-100 text-slate-600"}`}
                    >
                      {item.role}
                    </span>
                  </td>
                  <td className="tabledata">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${item.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                    >
                      {item.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="tabledata text-slate-500">
                    {item.created_by?.name ?? "-"}
                  </td>
                  <td className="tabledata text-slate-400">
                    {item.created_at
                      ? new Date(item.created_at).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="tabledata">
                    <button
                      className="rounded-md p-1.5 text-slate-400 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-600"
                      onClick={() => handleEditClick(item)}
                    >
                      <FiEdit2 size={14} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>

      <section className="flex w-full flex-row items-center justify-center p-3">
        <Pagination
          currentPage={page.page}
          totalPages={Math.ceil(page.total / page.limit)}
          onPageChange={handlePageChange}
        />
      </section>

      {openCreatePopup && (
        <CreateUserModal
          isOpen={openCreatePopup}
          onClose={() => setOpenCreatePopup(false)}
          onSuccess={handleCreateSuccess}
        />
      )}

      {openEditPopup && editData && (
        <EditUserModal
          isOpen={openEditPopup}
          data={editData}
          onClose={handleEditClose}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
};

export default Page;
