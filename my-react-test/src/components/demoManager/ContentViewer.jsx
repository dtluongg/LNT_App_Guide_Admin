// v2
// src/components/ContentViewer.jsx
import React, { useEffect, useState, useRef } from "react";
import ReactQuill from "react-quill-new";
import api from "../../api/client";

import {
    getContentsByCategory,
    createContent,
    updateContent,
    deleteContent,
} from "../../api/contents";
import { getImagesByContent, uploadImage, updateImage, deleteImage } from "../../api/images";
import { IMAGE_BASE_URL } from "../../config/config";
import { quillModules, quillFormats } from "../../config/quillConfigWordLike";

/* ====== (ADDED) Cấu hình API convert DOCX -> HTML ====== */
const CONVERT_API = `${IMAGE_BASE_URL}/api/convert`; // đổi nếu backend convert của bạn khác
console.log("CONVERT_API:", CONVERT_API);
// Nếu bạn muốn text-only, loại mọi <img> (giữ nguyên nếu sau này muốn để ảnh)
const stripImages = (html) => html.replace(/<img[^>]*>/gi, "");
// Hàm mở file dialog, gọi convert API và set HTML vào state (newHtml)
async function importDocxTo(setHtml, contentId = "new-content") {
    return new Promise((resolve) => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".docx";
        input.onchange = async (e) => {
            const file = e.target.files?.[0];
            if (!file) return resolve(false);
            const fd = new FormData();
            fd.append("file", file);
            fd.append("contentId", contentId);
            try {
                const res = await fetch(CONVERT_API, { method: "POST", body: fd });
                const data = await res.json();
                if (data?.html) {
                    const html = stripImages(data.html);
                    setHtml(html); // đổ vào ReactQuill
                    resolve(true);
                } else {
                    alert("Convert lỗi hoặc không có HTML");
                    resolve(false);
                }
            } catch (err) {
                console.error(err);
                alert("Không gọi được API convert");
                resolve(false);
            }
        };
        input.click();
    });
}
/* ====== /ADDED ====== */

const ContentViewer = ({ categoryId, titleCategory }) => {
    const [contents, setContents] = useState([]);
    const [openItems, setOpenItems] = useState({});
    const [images, setImages] = useState({});
    const [editing, setEditing] = useState(null);

    // state cho editor
    const [editHtml, setEditHtml] = useState("");
    const [newHtml, setNewHtml] = useState("");

    // state cho edit content
    const [editTitle, setEditTitle] = useState("");
    const [editOrder, setEditOrder] = useState(0);
    const [editActive, setEditActive] = useState(true);

    // state cho create content
    const [newTitle, setNewTitle] = useState("");
    const [newActive, setNewActive] = useState(true);

    // state cho upload/update ảnh
    const [pendingImage, setPendingImage] = useState({});

    // state cho on/off new content editor:
    const [showNewContentForm, setShowNewContentForm] = useState(false);

    // config for editor:
    const editQuillRef = useRef(null);
    const createQuillRef = useRef(null);

    // Giữ inline formats (font/size/bold/...) khi xuống dòng
    const attachEnterKeepsInlineFormats = (quill) => {
        if (!quill) return;
        if (quill.__enterKeepInlineBound) return;
        quill.__enterKeepInlineBound = true;

        quill.keyboard.addBinding({ key: 13 }, function (range) {
            const prevFormats = quill.getFormat(Math.max(0, range.index - 1), 1) || {};
            this.quill.insertText(range.index, "\n", "user");
            const newIndex = range.index + 1;

            const keep = [
                "font",
                "size",
                "bold",
                "italic",
                "underline",
                "strike",
                "color",
                "background",
                "code",
            ];
            keep.forEach((k) => {
                if (prevFormats[k]) {
                    quill.formatText(newIndex, 0, k, prevFormats[k], "user");
                    quill.format(k, prevFormats[k], "user");
                }
            });

            quill.setSelection(newIndex, 0, "silent");
            return false;
        });
    };
    useEffect(() => {
        const q1 = editQuillRef.current?.getEditor?.();
        const q2 = createQuillRef.current?.getEditor?.();
        attachEnterKeepsInlineFormats(q1);
        attachEnterKeepsInlineFormats(q2);
    }, [editing, showNewContentForm]);

    useEffect(() => {
        if (categoryId) {
            loadContents();
        }
    }, [categoryId]);

    const loadContents = async () => {
        const res = await getContentsByCategory(categoryId);
        const data = res.data.data || [];
        setContents(data);
        setOpenItems({});
        setEditing(null);
    };

    const fetchImages = async (contentId) => {
        const res = await getImagesByContent(contentId);
        setImages((prev) => ({
            ...prev,
            [contentId]: res.data.data || [],
        }));
    };

    const toggleItem = (contentId) => {
        setOpenItems((prev) => {
            const newState = { ...prev, [contentId]: !prev[contentId] };
            if (newState[contentId] && !images[contentId]) {
                fetchImages(contentId);
            }
            return newState;
        });
    };

    // Tạo content mới
    const handleCreate = async () => {
        if (!newTitle.trim() || !newHtml.trim()) return;

        const maxOrder =
            contents.length > 0 ? Math.max(...contents.map((c) => c.order_index || 0)) : 0;

        await createContent({
            category_id: categoryId,
            title: newTitle,
            html_content: newHtml,
            plain_content: newHtml.replace(/<[^>]+>/g, ""),
            is_published: newActive,
            order_index: maxOrder + 1,
        });

        setNewHtml("");
        setNewTitle("");
        setNewActive(true);
        await loadContents();
    };

    // Cập nhật content
    const handleUpdate = async (id) => {
        await updateContent(id, {
            title: editTitle,
            html_content: editHtml,
            plain_content: editHtml.replace(/<[^>]+>/g, ""),
            is_published: editActive,
            order_index: editOrder,
        });
        setEditing(null);
        setEditHtml("");
        await loadContents();
    };

    // Xoá content
    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc muốn xoá content này?")) {
            await deleteContent(id);
            await loadContents();
        }
    };

    // Upload ảnh mới
    const handleUpload = async (contentId, file, caption) => {
        if (!file) {
            alert("Vui lòng chọn file trước khi upload!");
            return;
        }
        await uploadImage(contentId, file, caption || "image");
        await fetchImages(contentId);
        setPendingImage((prev) => ({ ...prev, [contentId]: null }));
    };

    // Update ảnh
    const handleUpdateImage = async (imageId, file, caption, contentId) => {
        if (!file && !caption) {
            alert("Vui lòng chọn file hoặc nhập caption để cập nhật!");
            return;
        }
        await updateImage(imageId, contentId, file, caption || "image");
        await fetchImages(contentId);
        setPendingImage((prev) => ({ ...prev, [contentId]: null }));
    };

    // Move up/down content
    const handleMove = async (content, direction) => {
        const sorted = [...contents].sort((a, b) => a.order_index - b.order_index);
        const index = sorted.findIndex((c) => c.id === content.id);
        let swapWith = null;

        if (direction === "up" && index > 0) swapWith = sorted[index - 1];
        if (direction === "down" && index < sorted.length - 1) swapWith = sorted[index + 1];

        if (!swapWith) return;

        await updateContent(content.id, { order_index: swapWith.order_index });
        await updateContent(swapWith.id, { order_index: content.order_index });
        await loadContents();
    };

    if (!categoryId) {
        return <p className="p-4 text-gray-500">Please select a category</p>;
    }

    return (
        <div className="flex-1 p-6 overflow-y-auto h-full">
            <div className="bg-fuchsia-200 text-center rounded-md p-[5px] ">
                <h2 className="text-xl font-bold text-gray-800">{titleCategory}</h2>
            </div>

            {/* Danh sách content */}
            <div className="space-y-4">
                {contents.map((c) => {
                    const isOpen = openItems[c.id];
                    const isEditing = editing === c.id;

                    return (
                        <div key={c.id} className="bg-white rounded-md shadow-sm p-3">
                            {/* Header */}
                            <div className="flex justify-between items-center">
                                <button
                                    onClick={() => toggleItem(c.id)}
                                    className={`px-3 py-1 rounded-md text-sm font-medium transition
                    ${
                        isOpen
                            ? "bg-blue-200 text-blue-800"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    }`}
                                >
                                    {c.title}
                                </button>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleMove(c, "up")}
                                        disabled={
                                            contents.sort(
                                                (a, b) => a.order_index - b.order_index
                                            )[0]?.id === c.id
                                        }
                                        className="text-gray-500 hover:text-black text-sm disabled:opacity-30"
                                    >
                                        ⬆️
                                    </button>
                                    <button
                                        onClick={() => handleMove(c, "down")}
                                        disabled={
                                            contents
                                                .sort((a, b) => a.order_index - b.order_index)
                                                .at(-1)?.id === c.id
                                        }
                                        className="text-gray-500 hover:text-black text-sm disabled:opacity-30"
                                    >
                                        ⬇️
                                    </button>
                                    <button
                                        onClick={() => {
                                            setEditing(c.id);
                                            setEditTitle(c.title);
                                            setEditOrder(c.order_index || 0);
                                            setEditActive(c.is_published);
                                            setEditHtml(c.html_content);
                                        }}
                                        className="text-blue-500 hover:text-blue-700 text-sm"
                                    >
                                        ✏️ Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(c.id)}
                                        className="text-red-500 hover:text-red-700 text-sm"
                                    >
                                        🗑️ Delete
                                    </button>
                                </div>
                            </div>

                            {/* Nội dung */}
                            {isOpen && (
                                <div className="mt-3 text-gray-700">
                                    {isEditing ? (
                                        <div>
                                            <input
                                                value={editTitle}
                                                onChange={(e) => setEditTitle(e.target.value)}
                                                className="border px-2 py-1 text-sm rounded w-full mb-2"
                                            />
                                            <input
                                                type="number"
                                                value={editOrder}
                                                onChange={(e) =>
                                                    setEditOrder(Number(e.target.value))
                                                }
                                                className="border px-2 py-1 text-sm rounded w-full mb-2"
                                                placeholder="Order index"
                                            />
                                            <label className="flex items-center gap-2 text-sm mb-2">
                                                <input
                                                    type="checkbox"
                                                    checked={editActive}
                                                    onChange={(e) =>
                                                        setEditActive(e.target.checked)
                                                    }
                                                />
                                                Published
                                            </label>

                                            <ReactQuill
                                                ref={editQuillRef}
                                                theme="snow"
                                                value={editHtml}
                                                onChange={setEditHtml}
                                                modules={quillModules}
                                                formats={quillFormats}
                                            />
                                            <div className="flex gap-2 mt-2">
                                                <button
                                                    onClick={() => handleUpdate(c.id)}
                                                    className="px-3 py-1 bg-green-500 text-white rounded"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setEditing(null);
                                                        setEditHtml("");
                                                    }}
                                                    className="px-3 py-1 bg-gray-300 rounded"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div
                                            className="ql-editor max-w-none mb-4"
                                            dangerouslySetInnerHTML={{ __html: c.html_content }}
                                        />
                                    )}

                                    {/* Quản lý hình ảnh */}
                                    <div className="mt-4 border-t pt-3">
                                        <h4 className="font-medium text-gray-800 mb-2">
                                            Attached Images
                                        </h4>

                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                                            {images[c.id]?.map((img) => (
                                                <div
                                                    key={img.id}
                                                    className="relative border rounded-lg overflow-hidden group"
                                                >
                                                    <img
                                                        src={`${IMAGE_BASE_URL}${img.image_url}`}
                                                        alt={img.caption || ""}
                                                        className="w-full h-40 object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
                                                        <button
                                                            onClick={() => {
                                                                const fileInput =
                                                                    document.createElement("input");
                                                                fileInput.type = "file";
                                                                fileInput.onchange = async (e) => {
                                                                    const file = e.target.files[0];
                                                                    if (file) {
                                                                        await updateImage(
                                                                            img.id,
                                                                            c.id,
                                                                            file,
                                                                            img.caption
                                                                        );
                                                                        await fetchImages(c.id);
                                                                    }
                                                                };
                                                                fileInput.click();
                                                            }}
                                                            className="bg-white/90 hover:bg-white text-gray-800 text-xs px-3 py-1 rounded shadow"
                                                        >
                                                            ✏️ Edit
                                                        </button>
                                                        <button
                                                            onClick={async () => {
                                                                if (
                                                                    window.confirm("Xoá ảnh này?")
                                                                ) {
                                                                    await deleteImage(img.id);
                                                                    await fetchImages(c.id);
                                                                }
                                                            }}
                                                            className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded shadow"
                                                        >
                                                            🗑️ Delete
                                                        </button>
                                                    </div>
                                                    <p className="text-xs text-gray-600 text-center py-1 bg-gray-50 border-t truncate">
                                                        {img.caption || "No caption"}
                                                    </p>
                                                </div>
                                            ))}

                                            {(!images[c.id] || images[c.id].length === 0) && (
                                                <p className="text-sm text-gray-500 italic">
                                                    No images uploaded yet.
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex justify-start">
                                            <button
                                                onClick={() => {
                                                    const fileInput =
                                                        document.createElement("input");
                                                    fileInput.type = "file";
                                                    fileInput.accept = "image/*";
                                                    fileInput.onchange = async (e) => {
                                                        const file = e.target.files[0];
                                                        if (file) {
                                                            const autoCaption =
                                                                "image_" + Date.now();
                                                            await uploadImage(
                                                                c.id,
                                                                file,
                                                                autoCaption
                                                            );
                                                            await fetchImages(c.id);
                                                        }
                                                    };
                                                    fileInput.click();
                                                }}
                                                className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm shadow-sm"
                                            >
                                                <span>＋ Add Image</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Form thêm content mới */}
            <div className="p-4 rounded bg-white mt-6">
                {showNewContentForm ? (
                    <div>
                        <p className="text-gray-600 mb-2 font-medium">Thêm Content mới</p>
                        <input
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            placeholder="Content title"
                            className="w-full border px-2 py-1 text-sm rounded mb-2"
                        />
                        <label className="flex items-center gap-2 text-sm mb-2">
                            <input
                                type="checkbox"
                                checked={newActive}
                                onChange={(e) => setNewActive(e.target.checked)}
                            />
                            Published
                        </label>

                        {/* ====== (ADDED) Nút Import Word ====== */}
                        <div className="mb-2">
                            <button
                                onClick={() => importDocxTo(setNewHtml, "new-content")}
                                className="px-3 py-1 rounded bg-indigo-600 text-white"
                                title="Chọn file .docx → convert → đổ vào editor"
                            >
                                📄 Import Word
                            </button>
                        </div>
                        {/* ====== /ADDED ====== */}

                        <ReactQuill
                            ref={createQuillRef}
                            theme="snow"
                            value={newHtml}
                            onChange={setNewHtml}
                            modules={quillModules}
                            formats={quillFormats}
                        />
                        <div className="flex gap-2 mt-3">
                            <button
                                onClick={handleCreate}
                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                            >
                                💾 Save
                            </button>
                            <button
                                onClick={() => {
                                    setShowNewContentForm(false);
                                    setNewHtml("");
                                    setNewTitle("");
                                }}
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex justify-center">
                        <button
                            onClick={() => setShowNewContentForm(true)}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 shadow-sm"
                        >
                            ＋ Add New Content
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ContentViewer;
