export const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-slate-100 bg-white px-3 py-2 shadow-md">
        <p className="text-xs font-semibold text-slate-700">
          {payload[0].name}
        </p>
        <p className="text-xs text-slate-500">{payload[0].value}</p>
      </div>
    );
  }
  return null;
};
