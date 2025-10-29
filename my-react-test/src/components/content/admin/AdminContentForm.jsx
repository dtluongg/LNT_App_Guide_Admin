// components/content/admin/AdminContentForm.jsx

import React from "react";
import ReactQuill from "react-quill-new";
import { quillModules, quillFormats } from "../../../config/quillConfigWordLike";
import { convertService } from "../../../services/convertService";

export default function AdminContentForm({
    editTitle,
    setEditTitle,
    editOrder,
    setEditOrder,
    editActive,
    setEditActive,
    editHtml,
    setEditHtml,
    editRef,
    onSaveEdit,
    onCancelEdit,
}) {
    async function onImportDocx() {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".docx";
        input.onchange = async (e) => {
            const f = e.target.files?.[0];
            if (!f) return;
            try {
                const { html } = await convertService.docxToHtml(f /*, { contentId: 'edit' }*/);
                // Có thể sanitize tại đây nếu bạn muốn.
                setEditHtml(html || "");
                // focus lại editor (tuỳ thích)
                setTimeout(() => {
                    const quill = editRef?.current?.getEditor?.();
                    quill?.focus();
                }, 0);
            } catch (err) {
                console.error(err);
                alert("Convert DOCX thất bại");
            }
        };
        input.click();
    }
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
                <input
                    type="checkbox"
                    checked={editActive}
                    onChange={(e) => setEditActive(e.target.checked)}
                />
                Published
            </label>
            <div className="mb-2">
                <button
                    type="button"
                    onClick={onImportDocx}
                    className="px-3 py-1 bg-indigo-600 text-white rounded text-sm"
                >
                    📄 Import DOCX
                </button>
            </div>

            <ReactQuill
                ref={editRef}
                theme="snow"
                value={editHtml}
                onChange={setEditHtml}
                modules={quillModules}
                formats={quillFormats}
            />
            <div className="flex gap-2 mt-2">
                <button onClick={onSaveEdit} className="px-3 py-1 bg-green-500 text-white rounded">
                    Save
                </button>
                <button onClick={onCancelEdit} className="px-3 py-1 bg-gray-300 rounded">
                    Cancel
                </button>
            </div>
        </div>
    );
}
