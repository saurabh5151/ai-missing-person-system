import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="w-full bg-black text-white h-16 flex items-center px-6 shadow-md">

      {/* 🔴 LOGO */}
      <h1
        onClick={() => navigate("/")}
        className="text-xl font-bold cursor-pointer"
      >
        🚨 Missing Finder
      </h1>

      {/* 🔥 RIGHT SIDE */}
      <div className="ml-auto flex gap-4 items-center">

        {/* 🏠 NOT LOGGED IN */}
        {!role && (
          <>
            <button
              onClick={() => navigate("/login")}
              className="bg-blue-600 px-4 py-1 rounded"
            >
              Login
            </button>

            <button
              onClick={() => navigate("/register")}
              className="bg-green-600 px-4 py-1 rounded"
            >
              Register
            </button>
          </>
        )}

        {/* 👮 POLICE */}
        {role === "police" && (
          <>
            <button
              onClick={() => navigate("/police-dashboard")}
              className="text-blue-400"
            >
              Police Panel
            </button>

            <button
              onClick={() => navigate("/dashboard")}
              className="hover:text-gray-300"
            >
              Public View
            </button>

            <button
              onClick={() => navigate("/create-missing")}
              className="hover:text-gray-300"
            >
              Create Case
            </button>

            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-1 rounded"
            >
              Logout
            </button>
          </>
        )}

        {/* 👤 PUBLIC */}
        {role === "public" && (
          <>
            <button
              onClick={() => navigate("/dashboard")}
              className="text-blue-400"
            >
              Dashboard
            </button>

            <button
              onClick={() => navigate("/search")}
              className="hover:text-gray-300"
            >
              Search
            </button>

            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-1 rounded"
            >
              Logout
            </button>
          </>
        )}

      </div>
    </nav>
  );
}

export default Navbar;