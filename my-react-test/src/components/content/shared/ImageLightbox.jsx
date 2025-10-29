// src/components/content/shared/ImageLightbox.jsx
import React, { useEffect } from "react";

/**
 * Simple reusable Lightbox
 * Props:
 *  - src: string
 *  - caption?: string
 *  - onClose: () => void
 *  - onPrev?: () => void
 *  - onNext?: () => void
 *  - showArrows?: boolean (default: false)
 */
export default function ImageLightbox({
    src,
    caption = "",
    onClose,
    onPrev,
    onNext,
    showArrows = false,
}) {
    // ESC to close
    useEffect(() => {
        const h = (e) => {
            if (e.key === "Escape") onClose?.();
        };
        window.addEventListener("keydown", h);
        return () => window.removeEventListener("keydown", h);
    }, [onClose]);
    useEffect(() => {
        const h = (e) => {
            if (e.key === "Escape") onClose?.();
            if (e.key === "ArrowLeft") onPrev?.();
            if (e.key === "ArrowRight") onNext?.();
        };
        window.addEventListener("keydown", h);
        return () => window.removeEventListener("keydown", h);
    }, [onClose, onPrev, onNext]);

    return (
        <div
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
        >
            <div
                className="relative max-w-[95vw] max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                <img
                    src={src}
                    alt={caption}
                    className="w-auto max-w-[95vw] h-auto max-h-[90vh] object-contain select-none"
                    draggable={false}
                />

                {caption && (
                    <div className="absolute -bottom-10 left-0 right-0 text-center text-xs text-white/80">
                        {caption}
                    </div>
                )}

                <button
                    onClick={onClose}
                    className="absolute -top-10 right-0 text-white/90 hover:text-white text-sm px-2 py-1 border border-white/40 rounded"
                >
                    Close ✕
                </button>

                {showArrows && onPrev && (
                    <button
                        onClick={onPrev}
                        className="absolute left-0 top-1/2 -translate-y-1/2 px-3 py-2 text-white/90 hover:text-white"
                        aria-label="Previous"
                    >
                        ‹
                    </button>
                )}
                {showArrows && onNext && (
                    <button
                        onClick={onNext}
                        className="absolute right-0 top-1/2 -translate-y-1/2 px-3 py-2 text-white/90 hover:text-white"
                        aria-label="Next"
                    >
                        ›
                    </button>
                )}
            </div>
        </div>
    );
}
