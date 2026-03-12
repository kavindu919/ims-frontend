import type React from "react";
import FormInput from "@/components/FormInput";
import FormDropdown from "@/components/FormDropdown";
import { StoragePlaceQueryProps } from "@/utils/interfaces/sotrageplaceInterface";

interface FilterProps {
  query: StoragePlaceQueryProps;
  setQuery: React.Dispatch<React.SetStateAction<any>>;
  cupboards: { value: string; label: string }[];
}

const StoragePlaceFilters = ({ setQuery, query, cupboards }: FilterProps) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>,
  ) => {
    setQuery({ ...query, [e.target.name]: e.target.value });
  };

  return (
    <form className="flex w-full flex-col items-center justify-between gap-4 md:flex-row md:items-end md:gap-3">
      <section>
        <FormInput
          name="search"
          type="text"
          label=""
          placeholder="Search storage places..."
          onChange={handleChange}
          value={query.search}
        />
      </section>
      <fieldset className="grid grid-cols-2 gap-3 md:flex md:gap-3">
        <FormDropdown
          label="Cupboard"
          name="cupboard_id"
          options={[{ value: "", label: "All Cupboards" }, ...cupboards]}
          value={String(query.cupboard_id)}
          onChange={handleChange}
        />
        <FormDropdown
          label="Sort by"
          name="sortBy"
          options={[
            { value: "name", label: "Name" },
            { value: "created_at", label: "Created date" },
          ]}
          value={query.sortBy}
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

export default StoragePlaceFilters;
