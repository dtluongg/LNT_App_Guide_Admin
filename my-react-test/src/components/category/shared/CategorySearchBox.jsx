import React from "react";

export default function CategorySearchBox({ value, onChange }) {
  return (
    <input
      type="text"
      placeholder="Search category..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full mb-3 px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:bg-white outline-none"
    />
  );
}
