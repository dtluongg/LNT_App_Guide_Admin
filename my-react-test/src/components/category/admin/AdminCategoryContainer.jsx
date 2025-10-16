//src/components/category/admin/AdminCategoryContainer.jsx

import React, { useEffect, useState } from "react";
import { categoryService } from "../../../services/categoryService";
import { buildCategoryTree, filterCategories } from "../shared/categoryHelper";
import CategorySearchBox from "../shared/CategorySearchBox";
import AdminCategoryList from "./AdminCategoryList";
import AdminCategoryForm from "./AdminCategoryForm";
import { categoryColors } from "../shared/categoryStyle";

export default function AdminCategoryContainer({ moduleId, onSelectCategory, nameModuleSelected, iconModuleSelected }) {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [search, setSearch] = useState("");
  console.log(nameModuleSelected);

  // State edit
  const [editState, setEditState] = useState({
    editingId: null,
    editTitle: "",
    editOrder: 0,
    editActive: true,
  });

  // State add
  const [adding, setAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newParent, setNewParent] = useState(null);
  const [newOrder, setNewOrder] = useState(0);
  const [newActive, setNewActive] = useState(true);

  const [openParents, setOpenParents] = useState({}); // track category mở

  // ✅ Lấy danh sách category theo module
  useEffect(() => {
    if (moduleId) {
      categoryService.list(moduleId).then(setCategories);
    }
  }, [moduleId]);

  // ✅ Cập nhật tree mỗi lần có data mới
  const tree = buildCategoryTree(categories);
  const filteredTree = filterCategories(search, tree);

  const refresh = async () => {
    if (moduleId) setCategories(await categoryService.list(moduleId));
  };

  const handleEditStart = (cat) => {
    setEditState({
      editingId: cat.id,
      editTitle: cat.title,
      editOrder: cat.order_index || 0,
      editActive: cat.is_active,
    });
  };

  const handleEditChange = (field, value) => {
    setEditState((prev) => ({
      ...prev,
      [`edit${field[0].toUpperCase() + field.slice(1)}`]: value,
    }));
  };

  const handleEditSave = async (id) => {
    await categoryService.update(id, {
      title: editState.editTitle,
      order_index: editState.editOrder,
      is_active: editState.editActive,
    });
    await refresh();
    setEditState({ editingId: null, editTitle: "", editOrder: 0, editActive: true });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xoá category này?")) {
      await categoryService.remove(id);
      await refresh();
    }
  };

  const handleAdd = async () => {
    if (!newTitle.trim()) return;
    const parentIdNum = newParent ? Number(newParent) : null;
    // ✅ Lấy cùng cấp
    const sameLevel = categories.filter(
      (c) => (c.parent_id || null) === parentIdNum
    );
    // ✅ Tính order_index max
    const maxOrder =
      sameLevel.length > 0
        ? Math.max(...sameLevel.map((c) => c.order_index || 0))
        : 0;

    await categoryService.create({
      module_id: moduleId,
      parent_id: newParent || null,
      title: newTitle,
      order_index: maxOrder + 1,
      is_active: newActive,
    });

    await refresh();
    setAdding(false);
    setNewTitle("");
    setNewParent(null);
    setNewOrder(0);
    setNewActive(true);
  };

  const handleMove = async (cat, direction) => {
    const sameLevel = categories.filter((c) => (c.parent_id || null) === (cat.parent_id || null));
    const sorted = [...sameLevel].sort((a, b) => a.order_index - b.order_index);
    const index = sorted.findIndex((c) => c.id === cat.id);
    let swapWith = null;
    if (direction === "up" && index > 0) swapWith = sorted[index - 1];
    else if (direction === "down" && index < sorted.length - 1) swapWith = sorted[index + 1];
    if (!swapWith) return;

    await categoryService.update(cat.id, { order_index: swapWith.order_index });
    await categoryService.update(swapWith.id, { order_index: cat.order_index });
    await refresh();
  };

  const toggleParent = (id) => {
    setOpenParents((prev) => ({ ...prev, [id]: !prev[id] }));
  };
  useEffect(() => {
    if (search) {
      const newOpen = {};
      const openAll = (nodes) => {
        nodes.forEach((n) => {
          if (n.children?.length > 0) {
            newOpen[n.id] = true;
            openAll(n.children);
          }
        });
      };
      openAll(filteredTree);
      setOpenParents((prev) => ({ ...prev, ...newOpen }));
    }
  }, [search, filteredTree]);

  return (
    <aside className={categoryColors.listStyle}>
      {/* --- Header + Search cố định --- */}
      <div className="sticky top-0 bg-white z-10 pb-2 border-b">
        <div className="flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium rounded-md transition ">
          <i className={`${iconModuleSelected} text-sm`}></i>
          <h2 className="text-lg font-semibold text-gray-700 mb-2">{nameModuleSelected}</h2>
        </div>

        <CategorySearchBox value={search} onChange={setSearch} />
      </div>

      {/* --- Danh sách category --- */}
      <div className="flex-1 overflow-y-auto mt-2 pr-1">
        <AdminCategoryList
          tree={filteredTree}
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
            setEditState({ editingId: null, editTitle: "", editOrder: 0, editActive: true })
          }
          editState={editState}
          onDelete={handleDelete}
          onMove={handleMove}
          styles={categoryColors}
        />
      </div>

      {/* --- Form thêm category --- */}
      {adding ? (
        <AdminCategoryForm
          categories={categories}
          newTitle={newTitle}
          setNewTitle={setNewTitle}
          newParent={newParent}
          setNewParent={setNewParent}
          // newOrder={newOrder}
          // setNewOrder={setNewOrder}
          // newActive={newActive}
          // setNewActive={setNewActive}
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
