// src/pages/LoginPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage({ setUser }) {
  const [role, setRole] = useState("user");
  const navigate = useNavigate();

  const handleLogin = () => {
    const user = { name: "Demo " + role, role };
    setUser(user);
    if (role === "admin") navigate("/admin");
    else navigate("/user");
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow w-[300px]">
        <h2 className="text-lg font-bold mb-4">Login</h2>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full border mb-4 p-2 rounded"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
        >
          Login as {role}
        </button>
      </div>
    </div>
  );
}
