// components/content/admin/AdminContentForm.jsx

import React from "react";
import ReactQuill from "react-quill-new";
import { quillModules, quillFormats } from "../../../config/quillConfigWordLike";

export default function AdminContentForm({
  editTitle, setEditTitle,
  editOrder, setEditOrder,
  editActive, setEditActive,
  editHtml, setEditHtml,
  editRef,
  onSaveEdit,
  onCancelEdit
}) {
  return (
    <div>
      <input
        value={editTitle}
        onChange={(e) => setEditTitle(e.target.value)}
        className="border px-2 py-1 text-sm rounded w-full mb-2"
        placeholder="Title"
      />
      <input
        type="number"
        value={editOrder}
        onChange={(e) => setEditOrder(Number(e.target.value))}
        className="border px-2 py-1 text-sm rounded w-full mb-2"
        placeholder="Order index"
      />
      <label className="flex items-center gap-2 text-sm mb-2">
        <input type="checkbox" checked={editActive} onChange={(e) => setEditActive(e.target.checked)} />
        Published
      </label>

      <ReactQuill
        ref={editRef}
        theme="snow"
        value={editHtml}
        onChange={setEditHtml}
        modules={quillModules}
        formats={quillFormats}
      />
      <div className="flex gap-2 mt-2">
        <button onClick={onSaveEdit} className="px-3 py-1 bg-green-500 text-white rounded">Save</button>
        <button onClick={onCancelEdit} className="px-3 py-1 bg-gray-300 rounded">Cancel</button>
      </div>
    </div>
  );
}
