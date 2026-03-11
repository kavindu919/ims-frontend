"use client";
import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";
import { MdOutlineKeyboardReturn } from "react-icons/md";
import {
  fetchAllBorrowRecords,
  returnBorrowedItem,
} from "@/services/borrowRecord.Services";
import { fetchAllInventoryItems } from "@/services/inventoryItem.Services";
import { PaginationProps } from "@/utils/interfaces/commanInterface";
import Pagination from "@/components/Pagination";
import PopUpModalComponent from "@/components/PopUpModalComponent";
import PopupButton from "@/components/PopupButton";

import { useDebounce } from "@/hook/useDebounce";
import {
  BorrowQueryProps,
  BorrowRecord,
} from "@/utils/interfaces/burrowRecordInterface";
import BorrowFilters from "@/components/borrow/BorrowFilters";
import CreateBorrowModal from "@/components/borrow/CreateBorrowModal";
import { useUser } from "@/hook/useUser";

const statusColors: Record<string, string> = {
  borrowed: "bg-blue-100 text-blue-700",
  returned: "bg-green-100 text-green-700",
};

const page = () => {
  const pathname = usePathname();
  const [isReturnPopupOpen, setIsReturnPopupOpen] = useState<{
    id: number;
    isOpen: boolean;
  }>({ id: 0, isOpen: false });
  const [items, setItems] = useState<{ value: string; label: string }[]>([]);
  const [openCreatePopup, setOpenCreatePopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<BorrowRecord[]>([]);
  const [query, setQuery] = useState<BorrowQueryProps>({
    search: "",
    status: "",
    sortBy: "created_at",
    sortOrder: "desc",
    page: 1,
    limit: 20,
  });
  const [page, setPage] = useState<PaginationProps>({
    total: 0,
    page: 1,
    limit: 20,
  });

  const { user } = useUser();
  const isAdmin = user?.role === "admin";

  const debounced = useDebounce(400, query.search);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetchAllInventoryItems({
          search: "",
          status: "in_store",
          storage_place_id: "",
          sortBy: "name",
          sortOrder: "asc",
          page: 1,
          limit: 100,
        });
        if (res.success) {
          setItems(
            res.items.map((i: any) => ({
              value: String(i.id),
              label: `${i.name} (${i.code}) — qty: ${i.quantity}`,
            })),
          );
        }
      } catch {}
    };
    fetchItems();
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchAllBorrowRecords({
        ...query,
        search: debounced ?? "",
      });
      if (res.success) {
        setData(res.records);
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
    debounced,
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleReturnClose = useCallback(
    () => setIsReturnPopupOpen({ id: 0, isOpen: false }),
    [],
  );
  const handlePageChange = useCallback(
    (newPage: number) => setQuery((prev) => ({ ...prev, page: newPage })),
    [],
  );

  const handleReturnClick = useCallback(
    (id: number) => setIsReturnPopupOpen({ id, isOpen: true }),
    [],
  );

  const handleReturnConfirm = useCallback(
    async (id: number) => {
      try {
        setLoading(true);
        const res = await returnBorrowedItem(id);
        if (res.success) {
          toast.success(res.message);
          handleReturnClose();
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
    [fetchData, handleReturnClose],
  );

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
          text="New Borrow"
          type="button"
          isLoading={loading}
          disabled={loading}
          onClick={() => setOpenCreatePopup(true)}
        />
      </header>

      <section className="flex flex-row gap-3">
        <BorrowFilters query={query} setQuery={setQuery} />
      </section>

      <section>
        <table className="tableoutline">
          <thead className="tablehead">
            <tr>
              <th className="tableheadcell">Item</th>
              <th className="tableheadcell">Borrower</th>
              <th className="tableheadcell">Contact</th>
              <th className="tableheadcell">Qty</th>
              <th className="tableheadcell">Borrow Date</th>
              <th className="tableheadcell">Expected Return</th>
              <th className="tableheadcell">Return Date</th>
              <th className="tableheadcell">Status</th>
              {isAdmin && <th className="tableheadcell">Actions</th>}
            </tr>
          </thead>
          <tbody className="tablebody">
            {loading ? (
              [...Array(5)].map((_, index) => (
                <tr key={index}>
                  <td colSpan={9} className="px-4 py-3">
                    <div className="h-5 w-full animate-pulse rounded-md bg-slate-100" />
                  </td>
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-12 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-sm font-medium text-slate-400">
                      No borrow records found
                    </p>
                    <p className="text-xs text-slate-300">
                      Create a borrow record to get started
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.id} className="tablerow">
                  <td className="tabledata font-medium text-slate-700">
                    {item.item?.name ?? "-"}
                    <span className="block text-xs text-slate-400">
                      {item.item?.code}
                    </span>
                  </td>
                  <td className="tabledata text-slate-500">
                    {item.borrower_name ?? "-"}
                  </td>
                  <td className="tabledata text-slate-500">
                    {item.contact ?? "-"}
                  </td>
                  <td className="tabledata text-slate-500">
                    {item.quantity_borrowed ?? 0}
                  </td>
                  <td className="tabledata text-slate-400">
                    {item.borrow_date
                      ? new Date(item.borrow_date).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="tabledata text-slate-400">
                    {item.expected_return_date
                      ? new Date(item.expected_return_date).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="tabledata text-slate-400">
                    {item.return_date
                      ? new Date(item.return_date).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="tabledata">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${statusColors[item.status] ?? "bg-slate-100 text-slate-600"}`}
                    >
                      {item.status}
                    </span>
                  </td>
                  {isAdmin && (
                    <td className="tabledata">
                      {item.status === "borrowed" && (
                        <button
                          className="rounded-md p-1.5 text-slate-400 transition-colors duration-150 hover:bg-green-50 hover:text-green-600"
                          onClick={() => handleReturnClick(item.id)}
                          title="Mark as Returned"
                        >
                          <MdOutlineKeyboardReturn size={16} />
                        </button>
                      )}
                    </td>
                  )}
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

      {isReturnPopupOpen.isOpen && isAdmin && (
        <PopUpModalComponent
          isOpen={isReturnPopupOpen.isOpen}
          title="Return Item"
          onClose={handleReturnClose}
          loading={loading}
          onConfirm={() => handleReturnConfirm(isReturnPopupOpen.id)}
          confirmText={loading ? "Processing..." : "Confirm Return"}
          cancelText="Cancel"
        >
          <span>Are you sure you want to mark this item as returned?</span>
        </PopUpModalComponent>
      )}

      {openCreatePopup && isAdmin && (
        <CreateBorrowModal
          isOpen={openCreatePopup}
          onClose={() => setOpenCreatePopup(false)}
          onSuccess={handleCreateSuccess}
          items={items}
        />
      )}
    </div>
  );
};

export default page;
