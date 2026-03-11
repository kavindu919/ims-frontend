"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiActivity, FiBarChart2, FiClock, FiTrendingUp } from "react-icons/fi";
import { fetchDashboardStats } from "@/services/dashboard.Services";
import { useUser } from "@/hook/useUser";
import {
  Cell,
  Pie,
  PieChart,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import { RecentLog, Stats } from "@/utils/interfaces/dashboardInterface";
import { CustomTooltip } from "@/utils/helper/CustomTooltip";
import { StatCard } from "@/components/StatCard";
import { actionColors } from "@/utils/helper/activityActionColor.helper";
import { STATUS_COLORS } from "@/utils/helper/dashboardactionColors";

const page = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentLogs, setRecentLogs] = useState<RecentLog[]>([]);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const res = await fetchDashboardStats();
        if (res.success) {
          setStats(res.stats);
          setRecentLogs(res.recent_logs);
        } else {
          toast.error(res.message);
        }
      } catch (error: any) {
        toast.error(error.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  const inventoryPieData = [
    { name: "In Store", value: stats?.inventory.in_store ?? 0 },
    { name: "Borrowed", value: stats?.inventory.borrowed ?? 0 },
    { name: "Damaged", value: stats?.inventory.damaged ?? 0 },
    { name: "Missing", value: stats?.inventory.missing ?? 0 },
  ];

  const storageBarData = [
    {
      name: "Cupboards",
      value: stats?.storage.cupboards ?? 0,
      fill: "#6366f1",
    },
    {
      name: "Storage Places",
      value: stats?.storage.places ?? 0,
      fill: "#8b5cf6",
    },
  ];

  const totalItems = stats?.inventory.total ?? 0;
  const inStoreRate =
    totalItems > 0
      ? Math.round(((stats?.inventory.in_store ?? 0) / totalItems) * 100)
      : 0;
  const borrowRate =
    totalItems > 0
      ? Math.round(((stats?.inventory.borrowed ?? 0) / totalItems) * 100)
      : 0;

  const inStoreRadial = [
    { name: "In Store Rate", value: inStoreRate, fill: "#22c55e" },
  ];
  const borrowRadial = [
    { name: "Borrow Rate", value: borrowRate, fill: "#3b82f6" },
  ];

  if (loading) {
    return (
      <div className="h-full w-full space-y-4 pb-24">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="h-20 animate-pulse rounded-xl bg-slate-100"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full space-y-6 pb-24">
      <header>
        <h4 className="text-lg font-semibold text-slate-800">
          Welcome back, {user?.name} 👋
        </h4>
        <p className="text-sm text-slate-500">
          Here's what's happening in your inventory.
        </p>
      </header>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-5">
        <StatCard
          label="Total Items"
          value={stats?.inventory.total ?? 0}
          color="text-slate-800"
        />
        <StatCard
          label="In Store"
          value={stats?.inventory.in_store ?? 0}
          color="text-green-600"
        />
        <StatCard
          label="Borrowed"
          value={stats?.inventory.borrowed ?? 0}
          color="text-blue-600"
        />
        <StatCard
          label="Damaged"
          value={stats?.inventory.damaged ?? 0}
          color="text-red-600"
        />
        <StatCard
          label="Missing"
          value={stats?.inventory.missing ?? 0}
          color="text-yellow-600"
        />
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <figure className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="mb-2 flex items-center gap-2">
            <FiBarChart2 className="h-4 w-4 text-slate-400" />
            <h3 className="text-sm font-semibold text-slate-700">
              Inventory Distribution
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={inventoryPieData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={3}
                dataKey="value"
              >
                {inventoryPieData.map((_, i) => (
                  <Cell key={i} fill={STATUS_COLORS[i]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={(v) => (
                  <span className="text-xs text-slate-600">{v}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </figure>

        <figure className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="mb-2 flex items-center gap-2">
            <FiTrendingUp className="h-4 w-4 text-slate-400" />
            <h3 className="text-sm font-semibold text-slate-700">
              In Store Rate
            </h3>
          </div>
          <div className="relative flex flex-col items-center">
            <ResponsiveContainer width={200} height={180}>
              <RadialBarChart
                cx="50%"
                cy="55%"
                innerRadius={55}
                outerRadius={80}
                barSize={14}
                data={inStoreRadial}
                startAngle={90}
                endAngle={-270}
              >
                <RadialBar
                  background={{ fill: "#f1f5f9" }}
                  dataKey="value"
                  cornerRadius={8}
                />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-green-600">
                {inStoreRate}%
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              {stats?.inventory.in_store} of {totalItems} items in store
            </p>
          </div>
        </figure>

        <figure className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="mb-2 flex items-center gap-2">
            <FiTrendingUp className="h-4 w-4 text-slate-400" />
            <h3 className="text-sm font-semibold text-slate-700">
              Borrow Rate
            </h3>
          </div>
          <div className="relative flex flex-col items-center">
            <ResponsiveContainer width={200} height={180}>
              <RadialBarChart
                cx="50%"
                cy="55%"
                innerRadius={55}
                outerRadius={80}
                barSize={14}
                data={borrowRadial}
                startAngle={90}
                endAngle={-270}
              >
                <RadialBar
                  background={{ fill: "#f1f5f9" }}
                  dataKey="value"
                  cornerRadius={8}
                />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-blue-600">
                {borrowRate}%
              </span>
            </div>
            <div className="mt-1 flex gap-2 text-xs">
              <span className="rounded-full bg-blue-50 px-2 py-0.5 font-medium text-blue-600">
                {stats?.borrows.active} active
              </span>
              <span className="rounded-full bg-red-50 px-2 py-0.5 font-medium text-red-600">
                {stats?.borrows.overdue} overdue
              </span>
            </div>
          </div>
        </figure>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <figure className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <FiActivity className="h-4 w-4 text-slate-400" />
            <h3 className="text-sm font-semibold text-slate-700">
              Storage Overview
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart
              data={storageBarData}
              layout="vertical"
              margin={{ top: 0, right: 16, left: 8, bottom: 0 }}
              barSize={14}
            >
              <CartesianGrid horizontal={false} stroke="#f1f5f9" />
              <XAxis
                type="number"
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 11, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
                width={90}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "#f8fafc" }}
              />
              <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                {storageBarData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </figure>

        <div className="flex flex-col gap-3">
          <section className="flex items-center justify-between rounded-xl border border-red-50 bg-red-50 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-red-500 p-2.5">
                <FiClock className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-xs text-red-500">Overdue Borrows</p>
                <p className="text-sm font-semibold text-red-800">
                  Past due, not returned
                </p>
              </div>
            </div>
            <span className="text-2xl font-bold text-red-600">
              {loading ? "—" : stats?.borrows.overdue}
            </span>
          </section>

          <section className="flex items-center justify-between rounded-xl border border-blue-50 bg-blue-50 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-500 p-2.5">
                <FiActivity className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-xs text-blue-500">Active Borrows</p>
                <p className="text-sm font-semibold text-blue-800">
                  Currently borrowed
                </p>
              </div>
            </div>
            <span className="text-2xl font-bold text-blue-600">
              {loading ? "—" : stats?.borrows.active}
            </span>
          </section>

          <section className="flex items-center justify-between rounded-xl border border-green-50 bg-green-50 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-500 p-2.5">
                <FiActivity className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-xs text-green-500">Active Users</p>
                <p className="text-sm font-semibold text-green-800">
                  System users
                </p>
              </div>
            </div>
            <span className="text-2xl font-bold text-green-600">
              {loading ? "—" : stats?.users.active}
            </span>
          </section>
        </div>

        <figure className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <FiActivity className="h-4 w-4 text-slate-400" />
            <h3 className="text-sm font-semibold text-slate-700">
              Recent Activity
            </h3>
          </div>
          <ul className="divide-y divide-slate-50">
            {recentLogs.length === 0 ? (
              <p className="text-center text-sm text-slate-400">
                No recent activity
              </p>
            ) : (
              recentLogs.map((log) => (
                <li
                  key={log.id}
                  className="flex items-center justify-between py-2 first:pt-0 last:pb-0"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-slate-700 to-slate-500 text-xs font-bold text-white">
                      {log.user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${actionColors[log.action] ?? "bg-slate-100 text-slate-600"}`}
                    >
                      {log.action.replace(/_/g, " ")}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {new Date(log.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </li>
              ))
            )}
          </ul>
        </figure>
      </section>
    </div>
  );
};

export default page;
