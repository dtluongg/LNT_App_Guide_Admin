// components/content/user/UserContentContainer.jsx

import React, { useEffect, useState } from "react";
import { IMAGE_BASE_URL } from "../../../config/config";
import { contentService } from "../../../services/contentService";
import { imageService } from "../../../services/imageService";

export default function UserContentContainer({ categoryId, titleCategory }) {
  const [contents, setContents] = useState([]);
  const [openItems, setOpenItems] = useState({});     // nhiều cái mở cùng lúc
  const [images, setImages] = useState({});           // map: contentId -> images[]

  const [preview, setPreview] = useState({ open: false, src: "", caption: "" });

  // load contents (user chỉ xem: lọc published)
  useEffect(() => {
    let ignore = false;
    async function load() {
      if (!categoryId) {
        setContents([]);
        setOpenItems({});
        setImages({});
        return;
      }
      // includeUnpublished=false -> chỉ lấy published (tuỳ backend của bạn)
      const res = await contentService.list(categoryId, false);
      const data = Array.isArray(res) ? res.filter(x => x.is_published !== false) : [];
      if (ignore) return;

      setContents(data);
      setOpenItems({});
      setImages({});

      // mở mặc định item đầu tiên
      if (data.length > 0) {
        setOpenItems({ [data[0].id]: true });
        fetchImages(data[0].id);
      }
    }
    load();
    return () => { ignore = true; };
  }, [categoryId]);

  async function fetchImages(contentId) {
    const res = await imageService.listByContent(contentId);
    setImages(prev => ({ ...prev, [contentId]: res || [] }));
  }

  function toggleItem(contentId) {
    setOpenItems(prev => {
      const next = { ...prev, [contentId]: !prev[contentId] };
      if (next[contentId] && !images[contentId]) fetchImages(contentId);
      return next;
    });
  }

  if (!categoryId) {
    return <p className="p-4 text-gray-500">Please select a category</p>;
  }

  return (
    <div className="flex-1 p-6 overflow-y-auto h-full">
      <h2 className="text-xl font-bold mb-6 text-gray-800">{titleCategory}</h2>

      <div className="space-y-4">
        {contents.map((c, idx) => {
          const isOpen = !!openItems[c.id];
          return (
            <div key={c.id} className="bg-white rounded-md shadow-sm p-3">
              {/* Header giống admin (nhưng không có action) */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => toggleItem(c.id)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition
                    ${isOpen ? "bg-blue-200 text-blue-800" : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`}
                >
                  {c.title}
                </button>
              </div>

              {/* Body */}
              {isOpen && (
                <div className="mt-3 text-gray-700">
                  <div
                    className="ql-editor max-w-none mb-4"
                    dangerouslySetInnerHTML={{ __html: c.html_content || "" }}
                  />

                  {/* Attached Images - giống Admin nhưng read-only (không nút) */}
                  {/* Attached Images (read-only) */}
                  <div className="mt-4 border-t pt-3">
                    <h4 className="font-medium text-gray-800 mb-2">Attached Images</h4>

                    <div className="grid [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))] gap-3 mb-4">
                      {(images[c.id] || []).map((img) => (
                        <figure key={img.id} className="rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition">
                          <div className="relative w-full aspect-[3/2] md:aspect-[16/9]">
                            <img
                              src={`${IMAGE_BASE_URL}${img.image_url}`}
                              alt={img.caption || ""}
                              className="absolute inset-0 w-full h-full object-cover cursor-zoom-in"
                              loading="lazy"
                              onClick={() =>
                                setPreview({
                                  open: true,
                                  src: `${IMAGE_BASE_URL}${img.image_url}`,
                                  caption: img.caption || "",
                                })
                              }
                            />
                            {img.caption && (
                              <div className="absolute bottom-0 left-0 right-0 bg-black/45 text-white text-[11px] leading-4 px-2 py-1 truncate">
                                {img.caption}
                              </div>
                            )}
                          </div>
                        </figure>

                      ))}
                      {(!images[c.id] || images[c.id].length === 0) && (
                        <p className="text-sm text-gray-500 italic">No images uploaded yet.</p>
                      )}
                    </div>
                  </div>

                </div>
              )}
            </div>
          );
        })}
        {contents.length === 0 && (
          <div className="text-sm text-gray-500">Chưa có nội dung.</div>
        )}
      </div>
      {preview.open && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setPreview({ open: false, src: "", caption: "" })}
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
              onClick={() => setPreview({ open: false, src: "", caption: "" })}
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
