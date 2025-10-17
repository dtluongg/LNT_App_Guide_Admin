// components/content/admin/AdminContentList.jsx
import React from "react";
import AdminContentItem from "./AdminContentItem";

export default function AdminContentList({
  items, openMap, editingId,
  onToggleOpen, onEdit, onDelete, onMove,
  editBindings
}) {
  if (!items?.length) return <div className="text-sm text-gray-500">Chưa có nội dung.</div>;
  return (
    <div className="space-y-4">
      {items.map((c, idx) => (
        <AdminContentItem
          key={c.id}
          item={c}
          isOpen={!!openMap[c.id]}
          isFirst={idx === 0}
          isLast={idx === items.length - 1}
          isEditing={editingId === c.id}
          onToggle={() => onToggleOpen(c.id)}
          onEdit={() => onEdit(c)}
          onDelete={() => onDelete(c.id)}
          onMoveUp={() => onMove(c, "up")}
          onMoveDown={() => onMove(c, "down")}
          editBindings={editBindings}
        />
      ))}
    </div>
  );
}
