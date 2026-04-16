import React, { useState, useEffect } from "react";
import api from "../api";
import { useLocation, useNavigate } from "react-router-dom";

const ReportFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const fileFromSearch = location.state?.file;

  const [file] = useState(fileFromSearch || null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [message, setMessage] = useState("");

  // 📍 GET LOCATION
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      },
      () => {
        setMessage("Please allow location access 📍");
      }
    );
  }, []);

  // 🚀 SUBMIT
  const handleSubmit = async () => {
    if (!file) {
      setMessage("No image received ❌");
      return;
    }

    if (!latitude || !longitude) {
      setMessage("Location not available ❌");
      return;
    }

    console.log("SENDING:", latitude, longitude); // ✅ DEBUG

    const formData = new FormData();
    formData.append("photo", file);
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);

    try {
      await api.post("/report-found/", formData); // ✅ FIXED URL
      setMessage("Reported Successfully ✅");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      setMessage(err.response?.data?.error || "Something went wrong ❌");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20 bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">

        <h2 className="text-2xl font-bold text-center mb-4 text-black">
          Report Found Person
        </h2>

        {message && (
          <p className="text-center mb-4 text-red-500">{message}</p>
        )}

        {file && (
          <img
            src={URL.createObjectURL(file)}
            alt=""
            className="w-full h-44 object-cover mb-4 rounded"
          />
        )}

        <div className="text-sm mb-4 text-black">
          <p><b>Latitude:</b> {latitude || "Fetching..."}</p>
          <p><b>Longitude:</b> {longitude || "Fetching..."}</p>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-black text-white p-3 rounded"
        >
          Submit Report
        </button>

      </div>
    </div>
  );
};

export default ReportFound;