import api from "@/lib/axios";
import { ActivityLogQueryProps } from "@/utils/interfaces/activitylogInterface";

export const fetchAllActivityLogs = async (query: ActivityLogQueryProps) => {
  try {
    const params = { ...query };
    if (!params.action) delete (params as any).action;
    if (!params.user_id) delete (params as any).user_id;
    if (!params.from) delete (params as any).from;
    if (!params.to) delete (params as any).to;
    const res = await api.get("/auth/activity-logs", { params });
    return res.data;
  } catch (error: any) {
    throw new Error(error?.message || "Failed to fetch activity logs");
  }
};
