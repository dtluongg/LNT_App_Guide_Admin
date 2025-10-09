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
}) {
  let baseStyle;

  if (isSelected) {
    baseStyle = styles.isSelected;
  } else {
    if (level === 0) baseStyle = styles.parentColor;
    else if (level === 1) baseStyle = styles.childColor;
    else baseStyle = styles.level3Color;
  }

  return (
    <div
      className={`px-3 py-2 text-sm font-medium rounded-md cursor-pointer transition flex justify-between items-center ${baseStyle}`}
      onClick={() => onSelect(category.id, category.title)}
    >
      {/* Left: title */}
      <div className="flex items-center gap-2 flex-1">
        <span className="truncate">{category.title}</span>
      </div>

      {/* Right: toggle icon */}
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
