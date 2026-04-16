import React, { useEffect, useState, useRef } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [persons, setPersons] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const sliderRef = useRef(null);
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  // 🔥 FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("missing/list/");
        setPersons(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  // 🔥 VERTICAL AUTO SCROLL
  useEffect(() => {
    const slider = sliderRef.current;

    const interval = setInterval(() => {
      if (slider) {
        slider.scrollTop += 1;

        if (slider.scrollTop >= slider.scrollHeight - slider.clientHeight) {
          slider.scrollTop = 0;
        }
      }
    }, 20);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">

      {/* 🌈 ANIMATED BACKGROUND */}
      <div className="absolute inset-0 bg-gradient-to-r from-sky-200 via-indigo-200 to-purple-200 animate-gradient"></div>

      {/* 🌟 CONTENT */}
      <div className="relative z-10 pt-24 px-6">

        {/* 🔥 TOP BUTTONS */}
        <div className="flex justify-center gap-4 mb-6 flex-wrap">

          <button
            onClick={() => navigate("/search")}
            className="bg-blue-500 text-white px-6 py-2 rounded-xl hover:bg-blue-600 shadow"
          >
            🔍 Search
          </button>

          {role === "police" && (
            <button
              onClick={() => navigate("/police-dashboard")}
              className="bg-purple-500 text-white px-6 py-2 rounded-xl hover:bg-purple-600 shadow"
            >
              👮 Police Panel
            </button>
          )}
        </div>

        {/* 🧠 TITLE */}
        <h2 className="text-4xl font-extrabold text-center mb-8 text-gray-800">
          Missing Persons
        </h2>

        {/* 🔥 VERTICAL AUTO SLIDER */}
        <div
          ref={sliderRef}
          className="max-w-md mx-auto h-[500px] overflow-y-auto space-y-6 pr-2"
        >
          {persons.map((p, index) => (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden 
              hover:scale-105 transition duration-300 border border-gray-200 cursor-pointer"
              onClick={() =>
                setSelectedImage(`http://127.0.0.1:8000${p.photo}`)
              }
            >
              {/* IMAGE */}
              <img
                src={`http://127.0.0.1:8000${p.photo}`}
                alt={p.name}
                className="w-full h-64 object-cover"
              />

              {/* INFO */}
              <div className="p-4">
                <h3 className="font-bold text-lg">{p.name}</h3>
                <p className="text-sm text-gray-600">
                  Age: {p.age || "N/A"}
                </p>
                <p className="text-sm text-gray-600">
                  Location: {p.last_seen_location || "Unknown"}
                </p>
                <p className="text-red-500 font-semibold mt-1">
                  {p.status}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* 🔥 IMAGE POPUP MODAL */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
        >
          <img
            src={selectedImage}
            alt="Full View"
            className="max-h-[90%] max-w-[90%] rounded-xl shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};

export default Dashboard;