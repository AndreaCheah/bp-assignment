import React from "react";

const SearchField = ({ label, placeholder, description, name, id }) => {
  return (
    <div className="mb-4">
      <label  htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative rounded-md shadow-sm">
        <input
          type="text"
          name={name}
          id={id}
          className="block w-full pl-2 pr-2 sm:text-sm border-gray-300 rounded-md mb-1"
          placeholder={placeholder}
        />
        {/* input styling */}
      </div>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
    </div>
  );
};

export default SearchField;
