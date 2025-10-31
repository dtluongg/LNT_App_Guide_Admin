// components/category/shared/categoryStyle.js
export const categoryColors = {
  listStyle:
    "w-[25%] bg-white border border-gray-200 shadow-sm rounded-xl p-4 m-2 flex flex-col h-[calc(100%-1rem)]",

  // mục đang chọn: rõ ràng, tương phản cao
  isSelected: "bg-blue-500 text-white border-blue-700",

  // 4 màu nhạt (pastel) cân bằng độ sáng để không chói
  parentColor:
    "bg-gradient-to-r from-blue-100 to-blue-200 text-slate-900 hover:from-blue-200 hover:to-blue-300",
  childColor:
    "bg-gradient-to-r from-teal-100 to-teal-200 text-slate-900 hover:from-teal-200 hover:to-teal-300",
  level3Color:
    "bg-gradient-to-r from-amber-100 to-amber-200 text-slate-900 hover:from-amber-200 hover:to-amber-300",
  level4Color:
    "bg-gradient-to-r from-violet-100 to-violet-200 text-slate-900 hover:from-violet-200 hover:to-violet-300",
};
