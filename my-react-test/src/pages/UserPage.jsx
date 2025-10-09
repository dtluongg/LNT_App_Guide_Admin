import React from "react";
import UserCategoryList from "../components/category/user/UserCategoryList";

export default function UserPage({ moduleId }) {
  return (
    <div className="flex h-screen">
      <UserCategoryList
        moduleId={moduleId}
        onSelectCategory={() => {}}
        titleCategorySelected={() => {}}
      />
      <main className="flex-1 p-4">User Content Area</main>
    </div>
  );
}
