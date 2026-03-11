export const allowedTransitions: Record<
  string,
  { value: string; label: string }[]
> = {
  in_store: [
    { value: "borrowed", label: "Borrowed" },
    { value: "damaged", label: "Damaged" },
    { value: "missing", label: "Missing" },
  ],
  borrowed: [
    { value: "in_store", label: "In Store" },
    { value: "damaged", label: "Damaged" },
    { value: "missing", label: "Missing" },
  ],
  damaged: [
    { value: "in_store", label: "In Store" },
    { value: "missing", label: "Missing" },
  ],
  missing: [{ value: "in_store", label: "In Store" }],
};

export const statusColors: Record<string, string> = {
  in_store: "bg-green-100 text-green-700",
  borrowed: "bg-blue-100 text-blue-700",
  damaged: "bg-red-100 text-red-700",
  missing: "bg-yellow-100 text-yellow-700",
};

export const statusLableChange = (status: string) => {
  switch (status) {
    case "in_store":
      return "In Store";
      break;
    case "borrowed":
      return "Borrowed";
      break;
    case "damaged":
      return "Damaged";
      break;
    case "missing":
      return "Missing";
      break;
    default:
      return "-";
      break;
  }
};
