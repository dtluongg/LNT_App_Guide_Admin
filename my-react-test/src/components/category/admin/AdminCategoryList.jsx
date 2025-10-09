// components/category/admin/AdminCategoryList.jsx

import React from "react";
import AdminCategoryItem from "./AdminCategoryItem";

export default function AdminCategoryList({
  tree,
  selectedCategory,
  openParents,
  toggleParent,
  onSelectCategory,
  onEditStart,
  onEditChange,
  onEditSave,
  onEditCancel,
  editState,
  onDelete,
  onMove,
  styles,
}) {
  // ✅ Hàm render đệ quy
  const renderCategory = (category, level = 0) => (
    <li key={category.id}>
      <AdminCategoryItem
        category={category}
        isSelected={selectedCategory === category.id}
        onSelect={onSelectCategory}
        onEditStart={onEditStart}
        onEditChange={onEditChange}
        onEditSave={onEditSave}
        onEditCancel={onEditCancel}
        editState={editState}
        onDelete={onDelete}
        onMove={onMove}
        hasChildren={category.children?.length > 0}
        isOpen={!!openParents[category.id]}
        toggleParent={() => toggleParent(category.id)}
        isChild={level > 0}
        styles={styles}
        level={level}
      />

      {/* Đệ quy render các con */}
      {openParents[category.id] && category.children?.length > 0 && (
        <ul className={`mt-1 space-y-1`}>
          {category.children.map((child) => renderCategory(child, level + 1))}
        </ul>
      )}
    </li>
  );

  return <ul className="space-y-2">{tree.map((cat) => renderCategory(cat))}</ul>;
}
