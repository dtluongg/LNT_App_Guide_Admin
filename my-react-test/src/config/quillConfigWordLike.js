// src/config/quillConfigWordLike.js
import Quill from "quill";

// === KHAI BÁO FONT WHITELIST CHO QUILL ===
const Font = Quill.import("formats/font");
Font.whitelist = [
  "arial",
  "times-new-roman",
  "roboto",
  "montserrat",
  "lora",
  "poppins",
  "open-sans",
  "georgia",
  "verdana",
  "courier-new"
];
Quill.register(Font, true);

// === MODULES ===
export const quillModules = {
  toolbar: [
    [
      { header: [1, 2, 3, 4, 5, 6, false] },   // tiêu đề
      { font: [
        "arial", "times-new-roman", "roboto", "montserrat",
        "lora", "poppins", "open-sans", "georgia", "verdana", "courier-new"
      ] },
      { size: ["10px", "12px", "14px", "16px", "18px", "24px", "32px"] }
    ],
    ["bold", "italic", "underline", "strike"], // định dạng chữ
    [{ color: [] }, { background: [] }],        // màu chữ & highlight
    [{ align: [] }],                            // căn lề
    [{ list: "ordered" }, { list: "bullet" }],  // danh sách
    [{ indent: "-1" }, { indent: "+1" }],       // thụt lề
    ["blockquote", "code-block"],               // blockquote & code
    ["link"],                                   // link (không ảnh)
    ["clean"],                                  // xóa định dạng
  ],
};

// === FORMATS ===
export const quillFormats = [
  "header", "font", "size",
  "bold", "italic", "underline", "strike",
  "color", "background",
  "align", "list", "indent",
  "blockquote", "code-block",
  "link",
];
