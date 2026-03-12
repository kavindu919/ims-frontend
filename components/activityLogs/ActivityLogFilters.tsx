import type React from "react";
import FormInput from "@/components/FormInput";
import FormDropdown from "@/components/FormDropdown";
import { QueryProps } from "@/utils/interfaces/activitylogInterface";

interface FilterProps {
  query: QueryProps;
  setQuery: React.Dispatch<React.SetStateAction<any>>;
}

const ActivityLogFilters = ({ setQuery, query }: FilterProps) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>,
  ) => {
    setQuery((prev: any) => ({
      ...prev,
      [e.target.name]: e.target.value,
      page: 1,
    }));
  };

  return (
    <form className="flex w-full flex-col items-center justify-between gap-4 md:flex-row md:items-end md:gap-3">
      <fieldset className="grid grid-cols-2 gap-3 md:flex md:gap-3">
        <FormDropdown
          label="Action"
          name="action"
          options={[
            { value: "", label: "All Actions" },
            { value: "item_created", label: "Item Created" },
            { value: "item_updated", label: "Item Updated" },
            { value: "status_changed", label: "Status Changed" },
            { value: "quantity_changed", label: "Quantity Changed" },
            { value: "borrowed", label: "Borrowed" },
            { value: "returned", label: "Returned" },
            { value: "user_created", label: "User Created" },
            { value: "user_updated", label: "User Updated" },
          ]}
          value={query.action}
          onChange={handleChange}
        />
        <FormInput
          label="From"
          name="from"
          type="date"
          value={query.from}
          placeholder=""
          onChange={handleChange}
        />
        <FormInput
          label="To"
          name="to"
          type="date"
          value={query.to}
          placeholder=""
          onChange={handleChange}
        />
        <FormDropdown
          label="Sort order"
          name="sortOrder"
          options={[
            { value: "desc", label: "Newest first" },
            { value: "asc", label: "Oldest first" },
          ]}
          value={query.sortOrder}
          onChange={handleChange}
        />
      </fieldset>
    </form>
  );
};

export default ActivityLogFilters;
