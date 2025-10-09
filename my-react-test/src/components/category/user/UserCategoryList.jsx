import React, { useEffect, useState, useMemo } from "react";
import { categoryService } from "../../../services/categoryService";
import { buildCategoryTree, filterCategories } from "../shared/categoryHelper";
import CategorySearchBox from "../shared/CategorySearchBox";
import { categoryColors } from "../shared/categoryStyle";
import UserCategoryItem from "./UserCategoryItem";

export default function UserCategoryList({
  moduleId,
  onSelectCategory,
  titleCategorySelected,
}) {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [openParents, setOpenParents] = useState({});

  // ✅ Fetch category khi moduleId đổi
  useEffect(() => {
    if (moduleId) {
      categoryService.list(moduleId).then((res) => {
        setCategories(res || []);
        setOpenParents({});
        // ❌ KHÔNG reset selectedCategory ở đây nữa
      });
    }
  }, [moduleId]);

  // ✅ Memo hóa tree để tránh re-render thừa
  const tree = useMemo(() => buildCategoryTree(categories), [categories]);
  const filteredTree = useMemo(
    () => filterCategories(search, tree),
    [search, tree]
  );

  // ✅ Tự động mở các parent khi search
  useEffect(() => {
    if (!search) return;
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
  }, [search, filteredTree]);

  // ✅ Xử lý chọn category
  const handleSelect = (id, title) => {
    const numId = Number(id);
    setSelectedCategory(numId);
    onSelectCategory?.(numId);
    titleCategorySelected?.(title);
  };

  const toggleParent = (id) => {
    setOpenParents((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (!moduleId) {
    return <p className="p-4 text-gray-500">Please select a module</p>;
  }

  const renderCategory = (category, level = 0) => (
    <li key={category.id}>
      <UserCategoryItem
        category={category}
        level={level}
        isSelected={Number(selectedCategory) === Number(category.id)}
        isOpen={!!openParents[category.id]}
        hasChildren={category.children?.length > 0}
        onSelect={handleSelect}
        toggleParent={() => toggleParent(category.id)}
        styles={categoryColors}
      />
      {openParents[category.id] && category.children?.length > 0 && (
        <ul className="mt-1 space-y-1">
          {category.children.map((child) => renderCategory(child, level + 1))}
        </ul>
      )}
    </li>
  );

  return (
    <aside className={categoryColors.listStyle}>
      {/* Header + Search */}
      <div className="sticky top-0 bg-white z-10 pb-2 border-b">
        <h2 className="text-lg font-semibold text-gray-700 mb-2 flex items-center">
          📖 Categories
        </h2>
        <CategorySearchBox value={search} onChange={setSearch} />
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto mt-2 pr-1">
        <ul className="space-y-2">{filteredTree.map((cat) => renderCategory(cat))}</ul>
      </div>
    </aside>
  );
}
