import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import ContentViewer from "./components/demoManager/ContentViewer";
import AdminContentContainer from "./components/content/admin/AdminContentContainer";
import UserContentContainer from "./components/content/user/UserContentContainer";

// import login + 2 loại CategoryList
import Login from "./components/auth/Login";
import AdminCategoryContainer from "./components/category/admin/AdminCategoryContainer";
import UserCategoryList from "./components/category/user/UserCategoryList";

const App = () => {
  const [user, setUser] = useState(null); // lưu thông tin user sau login
  const [activeModule, setActiveModule] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [titleCategory, setTitleCategory] = useState("");
  // useEffect(() => {
  //   // Khi reload, nếu có token → gọi API /api/auth/me để lấy user
  //   const token = localStorage.getItem("accessToken");
  //   if (token) {
  //     fetch("http://localhost:4000/api/auth/me", {
  //       headers: { Authorization: `Bearer ${token}` },
  //     })
  //       .then((res) => res.json())
  //       .then((data) => {
  //         if (data.success) setUser(data.user);
  //         else localStorage.removeItem("accessToken");
  //       })
  //       .catch(() => localStorage.removeItem("accessToken"));
  //   }
  // }, []);
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
        {user.role === "admin" || user.role === "manager" ? (
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
            iconModuleSelected={activeModule?.icon}
          />
        )}

        {/* Main content area */}
        {/* <ContentViewer
          categoryId={activeCategory}
          titleCategory={titleCategory}
        /> */}
        {/* Main content area */}
        {user.role === "admin" || user.role === "manager" ? (
          <AdminContentContainer
            categoryId={activeCategory}
            titleCategory={titleCategory}
          />
        ) : (
          <UserContentContainer
            categoryId={activeCategory}
            titleCategory={titleCategory}
          />
        )}
      </div>
    </div>
  );
};

export default App;
