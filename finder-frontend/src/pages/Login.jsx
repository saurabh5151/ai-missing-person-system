import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("public");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/token/",
        {
          username,
          password,
        }
      );

      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      localStorage.setItem("role", role);

      // ✅ Show success message
      setMessage("Login successful ✅");

      // ⏳ Delay + redirect
      setTimeout(() => {
        setMessage("");

        if (role === "police") {
          navigate("/police-dashboard");
        } else {
          navigate("/dashboard");
        }
      }, 1000);

    } catch (err) {
      // ❌ Show error message
      setMessage("Invalid credentials ❌");

      setTimeout(() => {
        setMessage("");
      }, 1500);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">

      {/* 🔥 POP MESSAGE */}
      {message && (
        <div className={`fixed top-10 left-1/2 transform -translate-x-1/2 
          px-6 py-2 rounded-lg shadow-lg text-white
          ${message.includes("❌") ? "bg-red-500" : "bg-green-500"}
          animate-fadeIn`}>
          {message}
        </div>
      )}

      {/* 🔥 CARD */}
      <form
        onSubmit={handleLogin}
        className="bg-white/20 backdrop-blur-lg p-10 rounded-3xl shadow-2xl w-96 text-white
        transform transition duration-500 hover:scale-105 animate-fadeIn"
      >

        {/* 🧠 TITLE */}
        <h2 className="text-3xl font-bold text-center mb-6 tracking-wide">
          Login to your account
        </h2>

        {/* ROLE */}
        <select
          className="w-full p-3 mb-4 rounded-lg bg-white/80 text-black focus:outline-none"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="public">Public</option>
          <option value="police">Police</option>
        </select>

        {/* USERNAME */}
        <input
          type="text"
          placeholder="Username"
          className="w-full p-3 mb-4 rounded-lg bg-white/80 text-black focus:outline-none"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-6 rounded-lg bg-white/80 text-black focus:outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* LOGIN BUTTON */}
        <button
          type="submit"
          className="w-full bg-blue-600 p-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
        >
          Login
        </button>

        {/* CREATE ACCOUNT */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="text-sm text-white underline hover:text-blue-200 transition"
          >
            Create Account
          </button>
        </div>

      </form>
    </div>
  );
}

export default Login;