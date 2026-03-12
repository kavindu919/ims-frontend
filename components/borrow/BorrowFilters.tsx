import type React from "react";
import FormInput from "@/components/FormInput";
import FormDropdown from "@/components/FormDropdown";
import { BorrowFilterProps } from "@/utils/interfaces/burrowRecordInterface";

interface FilterProps {
  query: BorrowFilterProps;
  setQuery: React.Dispatch<React.SetStateAction<any>>;
}

const BorrowFilters = ({ setQuery, query }: FilterProps) => {
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
          placeholder="Search borrower..."
          onChange={handleChange}
          value={query.search}
        />
      </section>
      <fieldset className="grid grid-cols-2 gap-3 md:flex md:gap-3">
        <FormDropdown
          label="Status"
          name="status"
          options={[
            { value: "", label: "All" },
            { value: "borrowed", label: "Borrowed" },
            { value: "returned", label: "Returned" },
          ]}
          value={query.status}
          onChange={handleChange}
        />
        <FormDropdown
          label="Sort by"
          name="sortBy"
          options={[
            { value: "created_at", label: "Created date" },
            { value: "borrow_date", label: "Borrow date" },
            { value: "expected_return_date", label: "Expected return" },
            { value: "borrower_name", label: "Borrower name" },
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

export default BorrowFilters;
