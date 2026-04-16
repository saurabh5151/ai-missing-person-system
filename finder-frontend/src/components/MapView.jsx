import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // 🔥 Active link style
  const isActive = (path) => location.pathname === path;

  const linkClass = (path) =>
    `relative px-2 py-1 transition duration-300 ${
      isActive(path)
        ? "text-blue-400"
        : "text-white hover:text-blue-400"
    }`;

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-black/50 backdrop-blur-lg text-white fixed top-0 left-0 z-50 shadow-lg"
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">

        {/* 🔥 LOGO */}
        <motion.h1
          whileHover={{ scale: 1.1 }}
          className="text-2xl font-extrabold tracking-wide cursor-pointer"
          onClick={() => navigate("/")}
        >
          🚨 Missing Finder
        </motion.h1>

        {/* 🔗 LINKS */}
        <div className="flex gap-6 text-lg items-center">

          {/* 👤 PUBLIC USER */}
          {role === "public" && (
            <>
              <Link to="/dashboard" className={linkClass("/dashboard")}>
                Dashboard
              </Link>

              <Link to="/search" className={linkClass("/search")}>
                Search
              </Link>

              <Link to="/report" className={linkClass("/report")}>
                Report
              </Link>
            </>
          )}

          {/* 👮 POLICE USER */}
          {role === "police" && (
            <>
              <Link
                to="/police-dashboard"
                className={linkClass("/police-dashboard")}
              >
                Police Panel
              </Link>

              <Link to="/dashboard" className={linkClass("/dashboard")}>
                Public View
              </Link>

              <Link
                to="/create-missing"
                className={linkClass("/create-missing")}
              >
                Create Case
              </Link>
            </>
          )}

          {/* 🔓 NOT LOGGED IN */}
          {!role && (
            <Link to="/" className={linkClass("/")}>
              Login
            </Link>
          )}

          {/* 🚪 LOGOUT */}
          {role && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleLogout}
              className="bg-gradient-to-r from-red-500 to-red-600 px-4 py-1 rounded-lg shadow-md hover:shadow-red-500/40 transition"
            >
              Logout
            </motion.button>
          )}
        </div>
      </div>
    </motion.nav>
  );
}

export default Navbar;