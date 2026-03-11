"use client";
import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";
import { FiEdit2 } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";
import { TbAdjustments } from "react-icons/tb";
import { MdOutlineSwapHoriz } from "react-icons/md";
import {
  fetchAllInventoryItems,
  deleteInventoryItem,
} from "@/services/inventoryItem.Services";
import { fetchAllStoragePlaces } from "@/services/storagePlace.Services";
import { PaginationProps } from "@/utils/interfaces/commanInterface";
import Pagination from "@/components/Pagination";
import PopUpModalComponent from "@/components/PopUpModalComponent";
import PopupButton from "@/components/PopupButton";
import CreateInventoryItemModal from "@/components/inventory/CreateInventoryItemModal";
import EditInventoryItemModal from "@/components/inventory/EditInventoryItemModal";
import AdjustQuantityModal from "@/components/inventory/AdjustQuantityModal";
import ChangeStatusModal from "@/components/inventory/ChangeStatusModal";
import InventoryFilters from "@/components/inventory/InventoryFilters";
import { useDebounce } from "@/hook/useDebounce";
import {
  InventoryItem,
  InventoryQueryProps,
} from "@/utils/interfaces/inventoryInterface";
import { statusColors } from "@/utils/helper/changeStatus.helper";

const page = () => {
  const pathname = usePathname();
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState<{
    id: number;
    isOpen: boolean;
  }>({ id: 0, isOpen: false });
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<InventoryItem[]>([]);
  const [storagePlaces, setStoragePlaces] = useState<
    { value: string; label: string }[]
  >([]);
  const [openCreatePopup, setOpenCreatePopup] = useState(false);
  const [openEditPopup, setOpenEditPopup] = useState(false);
  const [openAdjustPopup, setOpenAdjustPopup] = useState(false);
  const [openStatusPopup, setOpenStatusPopup] = useState(false);
  const [editData, setEditData] = useState<InventoryItem | null>(null);
  const [adjustData, setAdjustData] = useState<{
    id: number;
    name: string;
    quantity: number;
  } | null>(null);
  const [statusData, setStatusData] = useState<{
    id: number;
    name: string;
    status: string;
  } | null>(null);
  const [page, setPage] = useState<PaginationProps>({
    total: 0,
    page: 1,
    limit: 20,
  });
  const [query, setQuery] = useState<InventoryQueryProps>({
    search: "",
    status: "",
    storage_place_id: "",
    sortBy: "name",
    sortOrder: "asc",
    page: 1,
    limit: 20,
  });

  const debounced = useDebounce(400, query.search);

  useEffect(() => {
    const fetchStoragePlaces = async () => {
      try {
        const res = await fetchAllStoragePlaces({
          search: "",
          cupboard_id: "",
          sortBy: "name",
          sortOrder: "asc",
          page: 1,
          limit: 100,
        });
        if (res.success) {
          setStoragePlaces(
            res.places.map((p: any) => ({
              value: String(p.id),
              label: `${p.cupboard?.name} — ${p.name}`,
            })),
          );
        }
      } catch {}
    };
    fetchStoragePlaces();
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchAllInventoryItems({
        ...query,
        search: debounced ?? "",
      });
      if (res.success) {
        setData(res.items);
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
    query.status,
    query.storage_place_id,
    debounced,
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDeleteClick = useCallback(
    (id: number) => setIsDeletePopupOpen({ id, isOpen: true }),
    [],
  );
  const handleDeleteClose = useCallback(
    () => setIsDeletePopupOpen({ id: 0, isOpen: false }),
    [],
  );
  const handlePageChange = useCallback(
    (newPage: number) => setQuery((prev) => ({ ...prev, page: newPage })),
    [],
  );

  const handleDeleteConfirm = useCallback(
    async (id: number) => {
      try {
        setLoading(true);
        const res = await deleteInventoryItem(id);
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

  const handleEditClick = useCallback((item: InventoryItem) => {
    setEditData(item);
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

  const handleAdjustClick = useCallback((item: InventoryItem) => {
    setAdjustData({ id: item.id, name: item.name, quantity: item.quantity });
    setOpenAdjustPopup(true);
  }, []);
  const handleAdjustClose = useCallback(() => {
    setAdjustData(null);
    setOpenAdjustPopup(false);
  }, []);
  const handleAdjustSuccess = useCallback(() => {
    handleAdjustClose();
    fetchData();
  }, [handleAdjustClose, fetchData]);

  const handleStatusClick = useCallback((item: InventoryItem) => {
    setStatusData({ id: item.id, name: item.name, status: item.status });
    setOpenStatusPopup(true);
  }, []);
  const handleStatusClose = useCallback(() => {
    setStatusData(null);
    setOpenStatusPopup(false);
  }, []);
  const handleStatusSuccess = useCallback(() => {
    handleStatusClose();
    fetchData();
  }, [handleStatusClose, fetchData]);

  const handleCreateSuccess = useCallback(() => {
    setOpenCreatePopup(false);
    fetchData();
  }, [fetchData]);

  return (
    <div className="h-full w-full space-y-4 pb-24">
      <header className="flex flex-row items-center justify-between">
        <h5 className="text-xs text-slate-500 uppercase">
          {pathname.substring(1).split("/").join(" / ")}
        </h5>
        <PopupButton
          text="Create Item"
          type="button"
          isLoading={loading}
          disabled={loading}
          onClick={() => setOpenCreatePopup(true)}
        />
      </header>

      <section className="flex flex-row gap-3">
        <InventoryFilters
          query={query}
          setQuery={setQuery}
          storagePlaces={storagePlaces}
        />
      </section>

      <section>
        <table className="tableoutline">
          <thead className="tablehead">
            <tr>
              <th className="tableheadcell">Name</th>
              <th className="tableheadcell">Code</th>
              <th className="tableheadcell">Quantity</th>
              <th className="tableheadcell">Storage Place</th>
              <th className="tableheadcell">Status</th>
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
                      No inventory items found
                    </p>
                    <p className="text-xs text-slate-300">
                      Create an item to get started
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
                    {item.code ?? "-"}
                  </td>
                  <td className="tabledata text-slate-500">
                    {item.quantity ?? 0}
                  </td>
                  <td className="tabledata text-slate-500">
                    {item.storage_place
                      ? `${item.storage_place.cupboard?.name} — ${item.storage_place.name}`
                      : "-"}
                  </td>
                  <td className="tabledata">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${statusColors[item.status] ?? "bg-slate-100 text-slate-600"}`}
                    >
                      {item.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="tabledata text-slate-400">
                    {item.created_at
                      ? new Date(item.created_at).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="tabledata">
                    <div className="flex items-center gap-2">
                      <button
                        className="rounded-md p-1.5 text-slate-400 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-600"
                        onClick={() => handleEditClick(item)}
                        title="Edit"
                      >
                        <FiEdit2 size={14} />
                      </button>
                      <button
                        className="rounded-md p-1.5 text-slate-400 transition-colors duration-150 hover:bg-blue-50 hover:text-blue-500"
                        onClick={() => handleAdjustClick(item)}
                        title="Adjust Quantity"
                      >
                        <TbAdjustments size={16} />
                      </button>
                      <button
                        className="rounded-md p-1.5 text-slate-400 transition-colors duration-150 hover:bg-purple-50 hover:text-purple-500"
                        onClick={() => handleStatusClick(item)}
                        title="Change Status"
                      >
                        <MdOutlineSwapHoriz size={16} />
                      </button>
                      <button
                        className="rounded-md p-1.5 text-slate-400 transition-colors duration-150 hover:bg-red-50 hover:text-red-500"
                        onClick={() => handleDeleteClick(item.id)}
                        title="Delete"
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
          title="Delete Inventory Item"
          onClose={handleDeleteClose}
          loading={loading}
          onConfirm={() => handleDeleteConfirm(isDeletePopupOpen.id)}
          confirmText={loading ? "Deleting..." : "Delete"}
          cancelText="Cancel"
        >
          <span>Are you sure you want to delete this item?</span>
        </PopUpModalComponent>
      )}

      {openCreatePopup && (
        <CreateInventoryItemModal
          isOpen={openCreatePopup}
          onClose={() => setOpenCreatePopup(false)}
          onSuccess={handleCreateSuccess}
          storagePlaces={storagePlaces}
        />
      )}

      {openEditPopup && editData && (
        <EditInventoryItemModal
          isOpen={openEditPopup}
          data={editData}
          onClose={handleEditClose}
          onSuccess={handleEditSuccess}
          storagePlaces={storagePlaces}
        />
      )}

      {openAdjustPopup && adjustData && (
        <AdjustQuantityModal
          isOpen={openAdjustPopup}
          data={adjustData}
          onClose={handleAdjustClose}
          onSuccess={handleAdjustSuccess}
        />
      )}

      {openStatusPopup && statusData && (
        <ChangeStatusModal
          isOpen={openStatusPopup}
          data={statusData}
          onClose={handleStatusClose}
          onSuccess={handleStatusSuccess}
        />
      )}
    </div>
  );
};

export default page;
