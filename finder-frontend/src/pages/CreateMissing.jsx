import React, { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

const CreateMissing = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [location, setLocation] = useState("");
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const navigate = useNavigate();

  const handleFile = (file) => {
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !age || !location || !photo) {
      setMessage("All fields required ❌");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("age", age);
    formData.append("last_seen_location", location);
    formData.append("photo", photo);

    try {
      await api.post("create-missing/", formData);

      setMessage("Missing person created successfully ✅");

      setTimeout(() => {
        navigate("/police-dashboard");
      }, 1500);

      setName("");
      setAge("");
      setLocation("");
      setPhoto(null);
      setPreview(null);

    } catch (err) {
      setMessage(err.response?.data?.error || "Error ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center animate-bg px-4">

      {/* CARD */}
      <div className="bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/40 w-full max-w-md animate-fadeIn">

        <h2 className="text-2xl font-bold text-center mb-6">
          Create Missing Person
        </h2>

        {/* MESSAGE */}
        {message && (
          <p
            className={`text-center mb-4 font-semibold ${
              message.includes("❌") ? "text-red-500" : "text-green-600"
            }`}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="number"
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="text"
            placeholder="Last Seen Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-400"
          />

          {/* DRAG & DROP */}
          <div
            onDragOver={handleDrag}
            onDragLeave={handleLeave}
            onDrop={handleDrop}
            className={`w-full p-6 border-2 border-dashed rounded-lg text-center transition ${
              dragActive ? "border-blue-500 bg-blue-100" : "border-gray-300"
            }`}
          >
            <p className="text-gray-600">
              Drag & Drop Image OR Click Below
            </p>

            <input
              type="file"
              onChange={(e) => handleFile(e.target.files[0])}
              className="mt-2"
            />
          </div>

          {/* PREVIEW */}
          {preview && (
            <img
              src={preview}
              alt="preview"
              className="w-full h-40 object-cover rounded-lg"
            />
          )}

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full p-3 rounded-lg font-semibold transition
              ${loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
          >
            {loading ? "Uploading..." : "Submit"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default CreateMissing;