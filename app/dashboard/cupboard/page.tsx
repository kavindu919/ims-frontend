"use client";
import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";
import { FiEdit2 } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";
import {
  fetchAllCupboards,
  deleteCupboard,
} from "@/services/cupboard.Services";
import {
  CupboardProps,
  CupboardQueryProps,
} from "@/utils/interfaces/cupboardInterface";
import { PaginationProps } from "@/utils/interfaces/commanInterface";
import Pagination from "@/components/Pagination";
import CreateCupboardModal from "@/components/cupboards/CreateCupboardModal";
import PopUpModalComponent from "@/components/PopUpModalComponent";
import PopupButton from "@/components/PopupButton";
import EditCupboardModal from "@/components/cupboards/EditCupboardModal";
import { useDebounce } from "@/hook/useDebounce";
import CupboardFilters from "@/components/cupboards/CupboardFilters";

const page = () => {
  const pathname = usePathname();
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState<{
    id: number;
    isOpen: boolean;
  }>({ id: 0, isOpen: false });
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<CupboardProps[]>([]);
  const [openCreatePopup, setOpenCreatePopup] = useState<boolean>(false);
  const [page, setPage] = useState<PaginationProps>({
    total: 0,
    page: 1,
    limit: 20,
  });
  const [editData, setEditData] = useState<CupboardProps | null>(null);
  const [openEditPopup, setOpenEditPopup] = useState<boolean>(false);
  const [query, setQuery] = useState<CupboardQueryProps>({
    search: "",
    sortBy: "name",
    sortOrder: "asc",
    page: 1,
    limit: 20,
  });

  const debounced = useDebounce(400, query.search);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchAllCupboards({
        ...query,
        search: debounced ?? "",
      });
      if (res.success) {
        setData(res.cupboards);
        setPage(res.meta);
      } else {
        toast.error(res.message);
      }
    } catch (error: any) {
      toast.error(error.message || "Unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }, [query.page, query.limit, query.sortBy, query.sortOrder, debounced]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDeleteClick = useCallback((id: number) => {
    setIsDeletePopupOpen({ id, isOpen: true });
  }, []);

  const handleDeleteClose = useCallback(() => {
    setIsDeletePopupOpen({ id: 0, isOpen: false });
  }, []);

  const handleDeleteConfirm = useCallback(
    async (id: number) => {
      try {
        setLoading(true);
        const res = await deleteCupboard(id);
        if (res.success) {
          toast.success(res.message);
          handleDeleteClose();
          fetchData();
        } else {
          toast.error(res.message);
        }
      } catch (error: any) {
        toast.error(error.message || "Unexpected error occurred");
      } finally {
        setLoading(false);
      }
    },
    [fetchData, handleDeleteClose],
  );

  const handlePageChange = useCallback((newPage: number) => {
    setQuery((prev) => ({ ...prev, page: newPage }));
  }, []);

  const handleCreateSuccess = useCallback(() => {
    setOpenCreatePopup(false);
    fetchData();
  }, [fetchData]);

  const handleEditClick = useCallback((cupboard: CupboardProps) => {
    setEditData(cupboard);
    setOpenEditPopup(true);
  }, []);

  const handleEditClose = useCallback(() => {
    setEditData(null);
    setOpenEditPopup(false);
  }, []);

  const handleEditSuccess = useCallback(() => {
    handleEditClose();
    fetchData();
  }, [handleEditClose, fetchData]);

  return (
    <div className="h-full w-full space-y-4 pb-24">
      <header className="flex flex-row items-center justify-between">
        <h5 className="text-xs text-slate-500 uppercase">
          {pathname.substring(1).split("/").join(" / ")}
        </h5>
        <PopupButton
          text="Create Cupboard"
          type="button"
          isLoading={loading}
          disabled={loading}
          onClick={() => setOpenCreatePopup(true)}
        />
      </header>

      <section className="flex flex-row gap-3">
        <CupboardFilters query={query} setQuery={setQuery} />
      </section>

      <section>
        <table className="tableoutline">
          <thead className="tablehead">
            <tr>
              <th className="tableheadcell">Name</th>
              <th className="tableheadcell">Location</th>
              <th className="tableheadcell">Description</th>
              <th className="tableheadcell">Storage Places</th>
              <th className="tableheadcell">Created</th>
              <th className="tableheadcell">Actions</th>
            </tr>
          </thead>
          <tbody className="tablebody">
            {loading ? (
              [...Array(5)].map((_, index) => (
                <tr key={index}>
                  <td colSpan={6} className="px-4 py-3">
                    <div className="h-5 w-full animate-pulse rounded-md bg-slate-100" />
                  </td>
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-sm font-medium text-slate-400">
                      No cupboards found
                    </p>
                    <p className="text-xs text-slate-300">
                      Create a cupboard to get started
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
                    {item.location ?? "-"}
                  </td>
                  <td className="tabledata text-slate-500">
                    {item.description ?? "-"}
                  </td>
                  <td className="tabledata text-slate-500">
                    {item.storage_places_count ?? 0}
                  </td>
                  <td className="tabledata text-slate-400">
                    {item.created_at
                      ? new Date(item.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "-"}
                  </td>
                  <td className="tabledata">
                    <div className="flex items-center gap-2">
                      <button
                        className="rounded-md p-1.5 text-slate-400 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-600"
                        onClick={() => handleEditClick(item)}
                      >
                        <FiEdit2 size={14} />
                      </button>
                      <button
                        className="rounded-md p-1.5 text-slate-400 transition-colors duration-150 hover:bg-red-50 hover:text-red-500"
                        onClick={() => handleDeleteClick(item.id)}
                      >
                        <MdDeleteOutline size={16} />
                      </button>
                    </div>
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

      {isDeletePopupOpen.isOpen && (
        <PopUpModalComponent
          isOpen={isDeletePopupOpen.isOpen}
          title="Delete Cupboard"
          onClose={handleDeleteClose}
          loading={loading}
          onConfirm={() => handleDeleteConfirm(isDeletePopupOpen.id)}
          confirmText={loading ? "Deleting..." : "Delete"}
          cancelText="Cancel"
        >
          <span>Are you sure you want to delete this cupboard?</span>
        </PopUpModalComponent>
      )}

      {openCreatePopup && (
        <CreateCupboardModal
          isOpen={openCreatePopup}
          onClose={() => setOpenCreatePopup(false)}
          onSuccess={handleCreateSuccess}
        />
      )}

      {openEditPopup && editData && (
        <EditCupboardModal
          isOpen={openEditPopup}
          data={editData}
          onClose={handleEditClose}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
};

export default page;
