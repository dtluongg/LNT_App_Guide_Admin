// src/components/category/admin/AdminCategoryForm.jsx

import React from "react";

export default function AdminCategoryForm({
  categories,
  newTitle,
  setNewTitle,
  newParent,
  setNewParent,
  newOrder,
  setNewOrder,
  newActive,
  setNewActive,
  onSave,
  onCancel,
}) {
  return (
    <div className="mt-4 space-y-2 border p-3 rounded-md bg-white shadow-sm">
      <input
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
        placeholder="New category title"
        className="w-full border px-2 py-1 text-sm rounded"
      />
      <select
        value={newParent || ""}
        onChange={(e) => setNewParent(e.target.value || null)}
        className="w-full border px-2 py-1 text-sm rounded"
      >
        <option value="">-- No parent (Level 1) --</option>
        {categories
          .filter((c) => !c.parent_id)
          .map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
      </select>
      <input
        type="number"
        value={newOrder}
        onChange={(e) => setNewOrder(Number(e.target.value))}
        placeholder="Order index"
        className="w-full border px-2 py-1 text-sm rounded"
      />
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={newActive}
          onChange={(e) => setNewActive(e.target.checked)}
        />
        Active
      </label>
      <div className="flex gap-2">
        <button
          onClick={onSave}
          className="flex-1 px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-sm rounded-md"
        >
          Save
        </button>
        <button
          onClick={onCancel}
          className="flex-1 px-3 py-1 bg-gray-300 hover:bg-gray-400 text-sm rounded-md"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
