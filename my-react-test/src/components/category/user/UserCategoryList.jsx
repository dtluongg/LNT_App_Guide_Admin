// components/category/admin/AdminCategoryContainer.jsx

import React, { useEffect, useState } from "react";
import { categoryService } from "../../../services/categoryService";
import { buildCategoryTree, filterCategories } from "../shared/categoryHelper";
import CategorySearchBox from "../shared/CategorySearchBox";
import { categoryColors } from "../shared/categoryStyle";

export default function UserCategoryList({ moduleId, onSelectCategory, titleCategorySelected }) {
    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [openParents, setOpenParents] = useState({}); // track cha nào đang mở

    const handleSelect = (id, title) => {
        setSelectedCategory(id);
        onSelectCategory(id);
        titleCategorySelected(title);
    };

    const toggleParent = (parentTitle) => {
        setOpenParents((prev) => ({
            ...prev,
            [parentTitle]: !prev[parentTitle], // mở/đóng cha
        }));
    };

    useEffect(() => {
        if (moduleId) {
            categoryService.list(moduleId).then((res) => {
                setCategories(res || []);
                setSelectedCategory(null);
                setOpenParents({}); // reset khi đổi module
            });
        }
    }, [moduleId]);

    if (!moduleId) {
        return <p className="p-4 text-gray-500">Please select a module</p>;
    }

    const { topLevel, childrenMap } = buildCategoryTree(categories);
    const { topLevel: filteredParents, childrenMap: filteredChildren } = filterCategories(
        search,
        topLevel,
        childrenMap
    );

    return (
        <aside className={categoryColors.listStyle}>
            {/* --- Header cố định --- */}
            <div className="sticky top-0 bg-white z-10 pb-2 border-b">
                <h2 className="text-lg font-semibold text-gray-700 mb-2">📂 Category Management</h2>
                <CategorySearchBox value={search} onChange={setSearch} />
            </div>

            {/* --- Danh sách có thể cuộn --- */}
            <div className="flex-1 overflow-y-auto mt-2 pr-1">
                <AdminCategoryList
                    parents={filteredParents}
                    childrenMap={filteredChildren}
                    selectedCategory={selectedCategory}
                    openParents={openParents}
                    toggleParent={toggleParent}
                    onSelectCategory={(id) => {
                        setSelectedCategory(id);
                        onSelectCategory?.(id);
                    }}
                    onEditStart={handleEditStart}
                    onEditChange={handleEditChange}
                    onEditSave={handleEditSave}
                    onEditCancel={() =>
                        setEditState({
                            editingId: null,
                            editTitle: "",
                            editOrder: 0,
                            editActive: true,
                        })
                    }
                    editState={editState}
                    onDelete={handleDelete}
                    onMove={handleMove}
                    styles={categoryColors}
                />
            </div>

            {/* --- Nút thêm ở cuối --- */}
            {adding ? (
                <AdminCategoryForm
                    categories={categories}
                    newTitle={newTitle}
                    setNewTitle={setNewTitle}
                    newParent={newParent}
                    setNewParent={setNewParent}
                    newOrder={newOrder}
                    setNewOrder={setNewOrder}
                    newActive={newActive}
                    setNewActive={setNewActive}
                    onSave={handleAdd}
                    onCancel={() => setAdding(false)}
                />
            ) : (
                <button
                    onClick={() => setAdding(true)}
                    className="mt-4 w-full px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-md transition"
                >
                    + Add Category
                </button>
            )}
        </aside>
    );
}
