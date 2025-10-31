// src/components/category/admin/AdminCategoryItem.jsx

import React from "react";

export default function AdminCategoryItem({
    category,
    isSelected,
    onSelect,
    onEditStart,
    onEditChange,
    onEditSave,
    onEditCancel,
    editState,
    onDelete,
    onMove,
    isFirst,
    isLast,
    // thêm props mới
    hasChildren = false,
    isOpen = false,
    toggleParent = () => { },
    isChild = false,
    styles,
    level,
}) {
    let baseStyle;

    if (isSelected) {
        baseStyle = styles.isSelected;
    } else {
        if (level === 0) baseStyle = styles.parentColor; // Level 1
        else if (level === 1) baseStyle = styles.childColor; // Level 2
        else if (level === 2) baseStyle = styles.level3Color; // Level 3
        else if (level === 3) baseStyle = styles.level4Color; // Level 4
    }
    return (
        <div
            onClick={() => onSelect(category.id)}
            className={`px-3 py-2 text-sm font-medium rounded-md cursor-pointer transition flex justify-between items-center
        ${baseStyle}`}
        >
            {/* Left: title + expand icon nếu có children */}
            <div
                className="flex items-center gap-2 flex-1"
                onClick={() => {
                    if (hasChildren) toggleParent();
                }}
            >
                {editState.editingId === category.id ? (
                    <div className="flex flex-col gap-2 w-full">
                        <input
                            value={editState.editTitle}
                            onChange={(e) => onEditChange("title", e.target.value)}
                            className="border px-2 py-1 text-sm rounded"
                            placeholder="Title"
                        />
                        {/* <input
                            type="number"
                            value={editState.editOrder}
                            onChange={(e) => onEditChange("order_index", Number(e.target.value))}
                            className="border px-2 py-1 text-sm rounded"
                            placeholder="Order index"
                        /> */}
                        {/* <select
                            value={category.parent_id || ""}
                            onChange={(e) => onEditChange("parent_id", e.target.value || null)}
                            className="border px-2 py-1 text-sm rounded"
                        >
                            <option value="">-- No parent (Level 1) --</option>
                            {category.allCategories
                                ?.filter(
                                    (c) =>
                                        c.id !== category.id && // Không chọn chính nó
                                        (!c.parent_id || // Level 1
                                            category.allCategories.some(
                                                (p) => p.id === c.parent_id && !p.parent_id // Level 2
                                            ))
                                )
                                .map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.parent_id ? `↳ ${c.title}` : c.title}
                                    </option>
                                ))}
                        </select> */}
                        {/* <label className="flex items-center gap-2 text-sm">
                            <input
                                type="checkbox"
                                checked={editState.editActive}
                                onChange={(e) => onEditChange("is_active", e.target.checked)}
                            />
                            Active
                        </label> */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => onEditSave(category.id)}
                                className="flex-1 px-3 py-1 bg-green-500 text-white text-sm rounded-md"
                            >
                                Save
                            </button>
                            <button
                                onClick={onEditCancel}
                                className="flex-1 px-3 py-1 bg-gray-300 hover:bg-gray-400 text-sm rounded-md"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <span className="truncate">{category.title}</span>
                        {hasChildren && (
                            <span className="ml-1 text-xs text-gray-600">{isOpen ? "▼" : "▶"}</span>
                        )}
                    </>
                )}
            </div>

            {/* Right: action buttons */}
            {editState.editingId !== category.id && (
                <div className="flex gap-1 ml-2 shrink-0">
                    <button
                        onClick={(e) => {
                            onMove(category, "up");
                        }}
                        disabled={isFirst}
                        className="p-1 rounded hover:bg-gray-100 text-gray-500 text-xs disabled:opacity-30"
                        title="Move up"
                    >
                        ⬆️
                    </button>
                    <button
                        onClick={(e) => {
                            onMove(category, "down");
                        }}
                        disabled={isLast}
                        className="p-1 rounded hover:bg-gray-100 text-gray-500 text-xs disabled:opacity-30"
                        title="Move down"
                    >
                        ⬇️
                    </button>
                    <button
                        onClick={(e) => {
                            onEditStart(category);
                        }}
                        className="p-1 rounded hover:bg-blue-100 text-blue-500 text-xs"
                        title="Edit"
                    >
                        ✏️
                    </button>
                    <button
                        onClick={(e) => {
                            onDelete(category.id);
                        }}
                        className="p-1 rounded hover:bg-red-100 text-red-500 text-xs"
                        title="Delete"
                    >
                        🗑️
                    </button>
                </div>
            )}
        </div>
    );
}


