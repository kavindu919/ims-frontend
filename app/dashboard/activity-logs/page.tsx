"use client";
import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";
import { fetchAllActivityLogs } from "@/services/activityLog.Services";
import { PaginationProps } from "@/utils/interfaces/commanInterface";
import Pagination from "@/components/Pagination";
import ActivityLogFilters from "@/components/activityLogs/ActivityLogFilters";
import {
  ActivityLog,
  ActivityLogQueryProps,
} from "@/utils/interfaces/activitylogInterface";
import { actionColors } from "@/utils/helper/activityActionColor.helper";

const page = () => {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ActivityLog[]>([]);
  const [page, setPage] = useState<PaginationProps>({
    total: 0,
    page: 1,
    limit: 50,
  });
  const [query, setQuery] = useState<ActivityLogQueryProps>({
    action: "",
    user_id: "",
    from: "",
    to: "",
    sortOrder: "desc",
    page: 1,
    limit: 50,
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchAllActivityLogs(query);
      if (res.success) {
        setData(res.logs);
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
    query.sortOrder,
    query.action,
    query.user_id,
    query.from,
    query.to,
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePageChange = useCallback((newPage: number) => {
    setQuery((prev) => ({ ...prev, page: newPage }));
  }, []);

  return (
    <div className="h-full w-full space-y-4 pb-24">
      <header className="flex flex-row items-center justify-between">
        <h5 className="text-xs text-slate-500 uppercase">
          {pathname.substring(1).split("/").join(" / ")}
        </h5>
      </header>

      <section className="flex flex-row gap-3">
        <ActivityLogFilters query={query} setQuery={setQuery} />
      </section>

      <section>
        <table className="tableoutline">
          <thead className="tablehead">
            <tr>
              <th className="tableheadcell">Action</th>
              <th className="tableheadcell">User</th>
              <th className="tableheadcell">Subject</th>
              <th className="tableheadcell">Old Value</th>
              <th className="tableheadcell">New Value</th>
              <th className="tableheadcell">Date</th>
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
                      No activity logs found
                    </p>
                    <p className="text-xs text-slate-300">
                      Actions will appear here
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.id} className="tablerow">
                  <td className="tabledata">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${actionColors[item.action] ?? "bg-slate-100 text-slate-600"}`}
                    >
                      {item.action.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="tabledata text-slate-700">
                    {item.user?.name ?? "-"}
                    <span className="block text-xs text-slate-400">
                      {item.user?.email}
                    </span>
                  </td>
                  <td className="tabledata text-slate-500">
                    {item.subject_type
                      ? `${item.subject_type} #${item.subject_id}`
                      : "-"}
                  </td>
                  <td className="tabledata text-slate-500 max-w-[160px]">
                    {item.old_value && Object.keys(item.old_value).length > 0 ? (
                      <div className="space-y-0.5">
                        {Object.entries(item.old_value).map(([k, v]) => (
                          <div key={k} className="flex gap-1 text-xs">
                            <span className="font-medium text-slate-400">{k}:</span>
                            <span className="text-red-500 truncate">{String(v)}</span>
                          </div>
                        ))}
                      </div>
                    ) : "-"}
                  </td>
                  <td className="tabledata text-slate-500 max-w-[160px]">
                    {item.new_value && Object.keys(item.new_value).length > 0 ? (
                      <div className="space-y-0.5">
                        {Object.entries(item.new_value).map(([k, v]) => (
                          <div key={k} className="flex gap-1 text-xs">
                            <span className="font-medium text-slate-400">{k}:</span>
                            <span className="text-green-600 truncate">{String(v)}</span>
                          </div>
                        ))}
                      </div>
                    ) : "-"}
                  </td>

                  <td className="tabledata text-slate-400">
                    {item.created_at
                      ? new Date(item.created_at).toLocaleDateString()
                      : "-"}
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
    </div>
  );
};

export default page;
