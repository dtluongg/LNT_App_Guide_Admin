// components/content/admin/AdminContentContainer.jsx
import React, { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { quillModules, quillFormats } from "../../../config/quillConfigWordLike";
import { contentService } from "../../../services/contentService";
import AdminContentList from "./AdminContentList";
import { sortByOrder, attachEnterKeepsInlineFormats } from "../shared/contentHelper";

export default function AdminContentContainer({ categoryId, titleCategory }) {
  const [items, setItems] = useState([]);
  const [openMap, setOpenMap] = useState({});
  const [editingId, setEditingId] = useState(null);

  // create
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newActive, setNewActive] = useState(true);
  const [newHtml, setNewHtml] = useState("");
  const createRef = useRef(null);

  // edit
  const [editTitle, setEditTitle] = useState("");
  const [editOrder, setEditOrder] = useState(0);
  const [editActive, setEditActive] = useState(true);
  const [editHtml, setEditHtml] = useState("");
  const editRef = useRef(null);

  async function load() {
    if (!categoryId) return;
    const res = await contentService.list(categoryId, true); // includeUnpublished = true
    setItems(sortByOrder(res || []));
    setOpenMap({});
    setEditingId(null);
  }
  useEffect(() => { load(); }, [categoryId]);

  useEffect(() => {
    const q1 = createRef.current?.getEditor?.();
    const q2 = editRef.current?.getEditor?.();
    attachEnterKeepsInlineFormats(q1);
    attachEnterKeepsInlineFormats(q2);
  }, [showCreate, editingId]);

  const onToggleOpen = (id) =>
    setOpenMap((s) => ({ ...s, [id]: !s[id] }));

  async function onCreate() {
    if (!newTitle.trim() || !newHtml.trim()) return;
    const maxOrder = items.length ? Math.max(...items.map((i) => i.order_index || 0)) : 0;

    await contentService.create({
      category_id: categoryId,
      title: newTitle,
      html_content: newHtml,
      plain_content: newHtml.replace(/<[^>]+>/g, ""),
      is_published: newActive,
      order_index: maxOrder + 1,
    });

    setNewTitle(""); setNewActive(true); setNewHtml("");
    setShowCreate(false);
    await load();
  }

  function onStartEdit(it) {
    setEditingId(it.id);
    setEditTitle(it.title || "");
    setEditOrder(it.order_index || 0);
    setEditActive(it.is_published ?? true);
    setEditHtml(it.html_content || "");
  }

  async function onSaveEdit() {
    if (!editingId) return;
    await contentService.update(editingId, {
      title: editTitle,
      html_content: editHtml,
      plain_content: editHtml.replace(/<[^>]+>/g, ""),
      is_published: editActive,
      order_index: editOrder,
    });
    setEditingId(null);
    setEditHtml("");
    await load();
  }

  async function onDelete(id) {
    if (!window.confirm("Bạn có chắc muốn xoá content này?")) return;
    await contentService.remove(id);
    await load();
  }

  async function onMove(item, dir) {
    const sorted = sortByOrder(items);
    const idx = sorted.findIndex((x) => x.id === item.id);
    let swapWith = null;
    if (dir === "up" && idx > 0) swapWith = sorted[idx - 1];
    if (dir === "down" && idx < sorted.length - 1) swapWith = sorted[idx + 1];
    if (!swapWith) return;

    await contentService.update(item.id, { order_index: swapWith.order_index });
    await contentService.update(swapWith.id, { order_index: item.order_index });
    await load();
  }

  return (
    <div className="flex-1 p-6 overflow-y-auto h-full">
      <h2 className="text-xl font-bold mb-6 text-gray-800">{titleCategory}</h2>

      <AdminContentList
        items={items}
        openMap={openMap}
        editingId={editingId}
        onToggleOpen={onToggleOpen}
        onEdit={onStartEdit}
        onDelete={onDelete}
        onMove={onMove}
        // Edit form bindings
        editBindings={{
          editTitle, setEditTitle,
          editOrder, setEditOrder,
          editActive, setEditActive,
          editHtml, setEditHtml,
          editRef,
          onSaveEdit,
          onCancelEdit: () => { setEditingId(null); setEditHtml(""); }
        }}
      />

      {/* Create New */}
      <div className="p-4 rounded bg-white mt-6">
        {showCreate ? (
          <div>
            <p className="text-gray-600 mb-2 font-medium">Thêm Content mới</p>
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Content title"
              className="w-full border px-2 py-1 text-sm rounded mb-2"
            />
            <label className="flex items-center gap-2 text-sm mb-2">
              <input type="checkbox" checked={newActive} onChange={(e) => setNewActive(e.target.checked)} />
              Published
            </label>
            <ReactQuill
              ref={createRef}
              theme="snow"
              value={newHtml}
              onChange={setNewHtml}
              modules={quillModules}
              formats={quillFormats}
            />
            <div className="flex gap-2 mt-3">
              <button onClick={onCreate} className="px-4 py-2 bg-green-500 text-white rounded">💾 Save</button>
              <button onClick={() => { setShowCreate(false); setNewTitle(""); setNewHtml(""); }} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <button onClick={() => setShowCreate(true)} className="px-4 py-2 bg-blue-500 text-white rounded">＋ Add New Content</button>
          </div>
        )}
      </div>
    </div>
  );
}
