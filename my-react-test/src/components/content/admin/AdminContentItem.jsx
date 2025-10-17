// components/content/admin/AdminContentItem.jsx
import React from "react";
import AdminContentForm from "./AdminContentForm";
import AdminImageManager from "./AdminImageManager";

export default function AdminContentItem({
  item, isOpen, isFirst, isLast, isEditing,
  onToggle, onEdit, onDelete, onMoveUp, onMoveDown,
  editBindings
}) {
  return (
    <div className="bg-white rounded-md shadow-sm p-3">
      <div className="flex justify-between items-center">
        <button
          onClick={onToggle}
          className={`px-3 py-1 rounded-md text-sm font-medium transition ${isOpen ? "bg-blue-200 text-blue-800":"bg-gray-100 hover:bg-gray-200 text-gray-700"}`}
        >
          {item.title}
        </button>
        <div className="flex gap-2">
          <button onClick={onMoveUp} disabled={isFirst} className="text-gray-500 hover:text-black text-sm disabled:opacity-30">⬆️</button>
          <button onClick={onMoveDown} disabled={isLast} className="text-gray-500 hover:text-black text-sm disabled:opacity-30">⬇️</button>
          <button onClick={onEdit} className="text-blue-500 hover:text-blue-700 text-sm">✏️ Edit</button>
          <button onClick={onDelete} className="text-red-500 hover:text-red-700 text-sm">🗑️ Delete</button>
        </div>
      </div>

      {isOpen && (
        <div className="mt-3 text-gray-700">
          {isEditing ? (
            <AdminContentForm {...editBindings} />
          ) : (
            <div className="ql-editor max-w-none mb-4" dangerouslySetInnerHTML={{ __html: item.html_content }} />
          )}

          <AdminImageManager contentId={item.id} />
        </div>
      )}
    </div>
  );
}
