// src/components/category/user/UserCategoryItem.jsx

import React from "react";

export default function UserCategoryItem({
  category,
  level,
  isSelected,
  isOpen,
  hasChildren,
  onSelect,
  toggleParent,
  styles,
  search = "",
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

  // ✅ Hàm tô màu phần trùng với search
  const highlightMatch = (text, query) => {
    if (!query) return text;
    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();

    const parts = [];
    let lastIndex = 0;
    let index;

    while ((index = lowerText.indexOf(lowerQuery, lastIndex)) !== -1) {
      if (index > lastIndex) {
        parts.push(text.slice(lastIndex, index));
      }
      parts.push(
        <mark
          key={index}
          className="bg-yellow-200 text-gray-900 rounded px-0.5"
        >
          {text.slice(index, index + query.length)}
        </mark>
      );
      lastIndex = index + query.length;
    }

    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts;
  };

  return (
    <div
      className={`px-3 py-2 text-sm font-medium rounded-md cursor-pointer transition flex justify-between items-center ${baseStyle}`}
      onClick={() => onSelect(category.id, category.title)}
    >
      <div className="flex items-center gap-2 flex-1">
        {/* ✅ Hiển thị title với highlight */}
        <span className="truncate">
          {highlightMatch(category.title, search)}
        </span>
      </div>

      {hasChildren && (
        <span
          className="ml-1 text-xs text-gray-600 hover:text-gray-800"
          onClick={(e) => {
            e.stopPropagation();
            toggleParent();
          }}
        >
          {isOpen ? "▼" : "▶"}
        </span>
      )}
    </div>
  );
}
