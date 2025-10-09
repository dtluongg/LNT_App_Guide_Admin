import React, { useState } from "react";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import ContentViewer from "./components/ContentViewer";

// import login + 2 loại CategoryList
import Login from "./components/auth/Login";
import AdminCategoryContainer from "./components/category/admin/AdminCategoryContainer";
import UserCategoryList from "./components/category/user/UserCategoryList";

const App = () => {
  const [user, setUser] = useState(null); // lưu thông tin user sau login
  const [activeModule, setActiveModule] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [titleCategory, setTitleCategory] = useState("");

  // Nếu chưa login → hiển thị form login
  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <div className="h-screen flex flex-col">
      <Header user={user} />
      <Navbar onSelectModule={setActiveModule} />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar category: chọn theo role */}
        {user.role === "admin" ? (
          <AdminCategoryContainer
            moduleId={activeModule?.id}
            onSelectCategory={setActiveCategory}
            nameModuleSelected={activeModule?.name}
            iconModuleSelected={activeModule?.icon}
          />
        ) : (
          <UserCategoryList
            moduleId={activeModule?.id}
            onSelectCategory={setActiveCategory}
            titleCategorySelected={setTitleCategory}
            nameModuleSelected={activeModule?.name}
          />
        )}

        {/* Main content area */}
        <ContentViewer
          categoryId={activeCategory}
          titleCategory={titleCategory}
        />
      </div>
    </div>
  );
};

export default App;
