import React from "react";
import AdminCategoryContainer from "../components/category/admin/AdminCategoryContainer";

export default function AdminPage({ moduleId }) {
  return (
    <div className="flex h-screen">
      <AdminCategoryContainer moduleId={moduleId} />
      <main className="flex-1 p-4">Admin Content Area</main>
    </div>
  );
}
