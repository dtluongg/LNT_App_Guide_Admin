// src/config/quillConfig.js

export const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, false] }],          // Tiêu đề H1-H5
    [{ font: [] }],                               // Font chữ
    [{ size: [] }],                               // Kích thước chữ
    ["bold", "italic", "underline", "strike"],    // Định dạng cơ bản
    [{ color: [] }, { background: [] }],          // Màu chữ và nền chữ
    [{ script: "sub" }, { script: "super" }],     // Chỉ số trên / dưới
    [{ list: "ordered" }, { list: "bullet" }],    // Danh sách
    [{ align: [] }],                              // Căn lề
    ["blockquote", "code-block"],                 // Blockquote / code
    ["link"],                                     // Chèn link (không ảnh!)
    ["clean"],                                    // Xóa định dạng
  ],
};

export const quillFormats = [
  "header", "font", "size",
  "bold", "italic", "underline", "strike",
  "color", "background",
  "script", "list", "align",
  "blockquote", "code-block",
  "link",
];
