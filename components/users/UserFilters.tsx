import type React from "react";
import FormInput from "@/components/FormInput";
import FormDropdown from "@/components/FormDropdown";
import { UserQueryProps } from "@/utils/interfaces/userInterface";

interface FilterProps {
  query: UserQueryProps;
  setQuery: React.Dispatch<React.SetStateAction<any>>;
}

const UserFilters = ({ setQuery, query }: FilterProps) => {
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
          placeholder="Search users..."
          onChange={handleChange}
          value={query.search}
        />
      </section>
      <fieldset className="grid grid-cols-2 gap-3 md:flex md:gap-3">
        <FormDropdown
          label="Role"
          name="role"
          options={[
            { value: "", label: "All Roles" },
            { value: "admin", label: "Admin" },
            { value: "staff", label: "Staff" },
          ]}
          value={query.role}
          onChange={handleChange}
        />
        <FormDropdown
          label="Status"
          name="is_active"
          options={[
            { value: "", label: "All Status" },
            { value: "true", label: "Active" },
            { value: "false", label: "Inactive" },
          ]}
          value={query.is_active}
          onChange={handleChange}
        />
        <FormDropdown
          label="Sort by"
          name="sortBy"
          options={[
            { value: "created_at", label: "Created date" },
            { value: "name", label: "Name" },
            { value: "email", label: "Email" },
            { value: "role", label: "Role" },
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

export default UserFilters;
