import React, { useEffect, useState, useCallback } from "react";
import { IMAGE_BASE_URL } from "../../../config/config";
import { imageService } from "../../../services/imageService";

export default function AdminImageManager({ contentId }) {
  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState({ open: false, src: "", caption: "" });

  const load = useCallback(async () => {
    if (!contentId) return setImages([]);
    const res = await imageService.listByContent(contentId);
    setImages(res || []);
  }, [contentId]);

  useEffect(() => { load(); }, [load]);

  // ========== Admin actions ==========
  async function onAdd() {
    const input = document.createElement("input");
    input.type = "file"; input.accept = "image/*";
    input.onchange = async (e) => {
      const f = e.target.files?.[0];
      if (f) {
        await imageService.upload(contentId, f, "image_" + Date.now());
        await load();
      }
    };
    input.click();
  }

  async function onEdit(img) {
    const input = document.createElement("input");
    input.type = "file"; input.accept = "image/*";
    input.onchange = async (e) => {
      const f = e.target.files?.[0];
      if (f) {
        await imageService.update(img.id, contentId, f, img.caption || "image");
        await load();
      }
    };
    input.click();
  }

  async function onDelete(id) {
    if (!window.confirm("Xoá ảnh này?")) return;
    await imageService.remove(id);
    await load();
  }

  // ========== Preview ==========
  const openPreview = (img) =>
    setPreview({
      open: true,
      src: `${IMAGE_BASE_URL}${img.image_url}`,
      caption: img.caption || "",
    });
  const closePreview = () => setPreview({ open: false, src: "", caption: "" });

  return (
    <div className="mt-4 border-t pt-3">
      <h4 className="font-medium text-gray-800 mb-2">Attached Images</h4>

      {/* Grid responsive, không cắt ảnh */}
      {/* Grid responsive, mật độ cao */}
      <div className="grid [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))] gap-2 mb-3">
        {images?.map((img) => (
          <figure
            key={img.id}
            className="rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition"
          >
            {/* Khung giữ tỉ lệ, ảnh phủ kín */}
            <div className="relative w-full aspect-[3/2] md:aspect-[16/9]">
              <img
                src={`${IMAGE_BASE_URL}${img.image_url}`}
                alt={img.caption || ""}
                className="absolute inset-0 w-full h-full object-cover cursor-zoom-in"
                loading="lazy"
                onClick={() => openPreview(img)}
              />
              {/* Caption (nếu có) – overlay đáy */}
              {img.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/45 text-white text-[11px] leading-4 px-2 py-1 truncate">
                  {img.caption}
                </div>
              )}
              {/* Nút admin – gọn, chỉ hiện khi hover */}
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 hover:opacity-100 transition">
                <button
                  onClick={() => onEdit(img)}
                  className="px-2 py-1 text-[11px] rounded bg-white/90 hover:bg-white shadow"
                  title="Edit"
                >
                  ✏️
                </button>
                <button
                  onClick={() => onDelete(img.id)}
                  className="px-2 py-1 text-[11px] rounded bg-red-600/90 hover:bg-red-600 text-white shadow"
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            </div>
          </figure>

        ))}
        {!images?.length && (
          <p className="text-sm text-gray-500 italic">No images uploaded yet.</p>
        )}
      </div>


      <div className="flex justify-start">
        <button
          onClick={onAdd}
          className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm shadow-sm"
        >
          ＋ Add Image
        </button>
      </div>

      {/* Modal Preview */}
      {preview.open && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={closePreview}
        >
          <div
            className="max-w-[95vw] max-h-[90vh] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={preview.src}
              alt={preview.caption}
              className="w-auto max-w-[95vw] h-auto max-h-[90vh] object-contain"
            />
            {preview.caption && (
              <div className="absolute -bottom-10 left-0 right-0 text-center text-xs text-white/80">
                {preview.caption}
              </div>
            )}
            <button
              onClick={closePreview}
              className="absolute -top-10 right-0 text-white/90 hover:text-white text-sm px-2 py-1 border border-white/40 rounded"
            >
              Close ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
