import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [role, setRole] = useState("public");

  // 👤 Public
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");

  // 👮 Police
  const [stationName, setStationName] = useState("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");

  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  // 📩 SEND OTP (BACKEND → TERMINAL)
  const sendOTP = async () => {
    if (!phone) {
      setMessage("Enter phone number ❌");
      return;
    }

    try {
      await axios.post("http://127.0.0.1:8000/api/send-otp/", {
        phone,
      });

      setOtpSent(true);
      setMessage("OTP sent successfully");

    } catch (err) {
      console.log(err);
      setMessage("Failed to send OTP ❌");
    }
  };

  // ✅ REGISTER
  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      if (role === "public") {
        if (!otpSent) {
          setMessage("Please send OTP first ❌");
          return;
        }

        await axios.post(
          "http://127.0.0.1:8000/api/register/public/",
          {
            username,
            email,
            phone,
            password,
            otp, // 🔥 IMPORTANT
          }
        );

        setMessage("Registered successfully ✅");

        setTimeout(() => navigate("/login"), 1500);
      }

      // 👮 POLICE (NO OTP)
      else {
        const res = await axios.post(
          "http://127.0.0.1:8000/api/register/police/",
          {
            station_name: stationName,
            state,
            district,
            password,
          }
        );

        setMessage("Police Registered ✅ Code: " + res.data.code);
      }

    } catch (err) {
      console.log(err.response?.data);
      setMessage(err.response?.data?.error || "Registration failed ❌");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">

      <form
        onSubmit={handleRegister}
        className="bg-white/20 backdrop-blur-lg p-8 rounded-3xl shadow-2xl w-96 text-white"
      >

        <h2 className="text-3xl font-bold text-center mb-4">
          Create Account
        </h2>

        {/* MESSAGE */}
        {message && (
          <p
            className={`text-center mb-3 font-semibold ${
              message.includes("❌") ? "text-red-400" : "text-green-300"
            }`}
          >
            {message}
          </p>
        )}

        {/* ROLE */}
        <select
          className="w-full p-3 mb-4 rounded-lg bg-white/80 text-black"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="public">Public</option>
          <option value="police">Police</option>
        </select>

        {/* 👤 PUBLIC */}
        {role === "public" && (
          <>
            <input
              placeholder="Username"
              className="w-full p-3 mb-3 rounded-lg bg-white/80 text-black"
              onChange={(e) => setUsername(e.target.value)}
            />

            <input
              placeholder="Email"
              className="w-full p-3 mb-3 rounded-lg bg-white/80 text-black"
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              placeholder="Phone"
              className="w-full p-3 mb-3 rounded-lg bg-white/80 text-black"
              onChange={(e) => setPhone(e.target.value)}
            />

            {/* SEND OTP */}
            <button
              type="button"
              onClick={sendOTP}
              className="w-full bg-yellow-500 p-3 mb-3 rounded-lg hover:bg-yellow-600 transition"
            >
              {otpSent ? "OTP Sent" : "Send OTP"}
            </button>

            {/* OTP INPUT */}
            {otpSent && (
              <input
                placeholder="Enter OTP"
                className="w-full p-3 mb-3 rounded-lg bg-white/80 text-black"
                onChange={(e) => setOtp(e.target.value)}
              />
            )}

            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 mb-3 rounded-lg bg-white/80 text-black"
              onChange={(e) => setPassword(e.target.value)}
            />
          </>
        )}

        {/* 👮 POLICE */}
        {role === "police" && (
          <>
            <input
              placeholder="Police Station Name"
              className="w-full p-3 mb-3 rounded-lg bg-white/80 text-black"
              onChange={(e) => setStationName(e.target.value)}
            />

            <input
              placeholder="State"
              className="w-full p-3 mb-3 rounded-lg bg-white/80 text-black"
              onChange={(e) => setState(e.target.value)}
            />

            <input
              placeholder="District"
              className="w-full p-3 mb-3 rounded-lg bg-white/80 text-black"
              onChange={(e) => setDistrict(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 mb-3 rounded-lg bg-white/80 text-black"
              onChange={(e) => setPassword(e.target.value)}
            />
          </>
        )}

        {/* REGISTER */}
        <button className="w-full bg-blue-600 p-3 rounded-lg hover:bg-blue-700 transition">
          Register
        </button>

        {/* LOGIN */}
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="w-full mt-3 bg-white/30 p-3 rounded-lg hover:bg-white/40 transition"
        >
          Go to Login
        </button>

      </form>
    </div>
  );
}

export default Register;