import type React from "react";
import FormInput from "@/components/FormInput";
import FormDropdown from "@/components/FormDropdown";
import { InventoryQueryFilterProps } from "@/utils/interfaces/inventoryInterface";

interface FilterProps {
  query: InventoryQueryFilterProps;
  setQuery: React.Dispatch<React.SetStateAction<any>>;
  storagePlaces: { value: string; label: string }[];
}

const InventoryFilters = ({ setQuery, query, storagePlaces }: FilterProps) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>,
  ) => {
    setQuery({ ...query, [e.target.name]: e.target.value, page: 1 });
  };

  return (
    <form className="flex w-full flex-col items-center justify-between gap-4 md:flex-row md:items-end md:gap-3">
      <section>
        <FormInput
          name="search"
          type="text"
          label=""
          placeholder="Search items..."
          onChange={handleChange}
          value={query.search}
        />
      </section>
      <fieldset className="grid grid-cols-2 gap-3 md:flex md:gap-3">
        <FormDropdown
          label="Status"
          name="status"
          options={[
            { value: "", label: "All Status" },
            { value: "in_store", label: "In Store" },
            { value: "borrowed", label: "Borrowed" },
            { value: "damaged", label: "Damaged" },
            { value: "missing", label: "Missing" },
          ]}
          value={query.status}
          onChange={handleChange}
        />
        <FormDropdown
          label="Storage Place"
          name="storage_place_id"
          options={[{ value: "", label: "All Places" }, ...storagePlaces]}
          value={String(query.storage_place_id)}
          onChange={handleChange}
        />
        <FormDropdown
          label="Sort by"
          name="sortBy"
          options={[
            { value: "name", label: "Name" },
            { value: "code", label: "Code" },
            { value: "quantity", label: "Quantity" },
            { value: "created_at", label: "Created date" },
          ]}
          value={query.sortBy}
          onChange={handleChange}
        />
        <FormDropdown
          label="Sort order"
          name="sortOrder"
          options={[
            { value: "asc", label: "Ascending" },
            { value: "desc", label: "Descending" },
          ]}
          value={query.sortOrder}
          onChange={handleChange}
        />
      </fieldset>
    </form>
  );
};

export default InventoryFilters;
