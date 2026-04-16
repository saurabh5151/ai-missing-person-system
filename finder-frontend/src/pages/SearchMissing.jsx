import React, { useState, useEffect } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

const SearchMissing = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [scanImage, setScanImage] = useState(null);

  const navigate = useNavigate();

  const dummyImages = [
    "/scan1.jpg",
    "/scan2.jpg",
    "/scan3.jpg",
    "/scan4.jpg",
  ];

  useEffect(() => {
    let interval;

    if (loading) {
      interval = setInterval(() => {
        const random =
          dummyImages[Math.floor(Math.random() * dummyImages.length)];
        setScanImage(random);
      }, 300);
    }

    return () => clearInterval(interval);
  }, [loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setResult({ error: "Please select image ❌" });
      return;
    }

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("photo", file);

    try {
      const res = await api.post("search-missing/", formData);

      setTimeout(() => {
        setLoading(false);
        setResult(res.data);
      }, 1500);
    } catch (err) {
      setLoading(false);
      setResult({ error: "Error ❌" });
    }
  };

  const handleReport = () => {
    navigate("/report", { state: { file } });
  };

  return (
    <div className="relative min-h-screen overflow-hidden">

      {/* 🌈 ANIMATED BG */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 animate-gradient"></div>

      {/* 🔵 TOP BUTTON */}
      <div className="relative z-10 pt-24 flex justify-center">
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-blue-500 text-white px-6 py-2 rounded-full shadow-lg hover:bg-blue-600"
        >
          Dashboard
        </button>
      </div>

      {/* 💎 MAIN CARD */}
      <div className="relative z-10 px-6 mt-6">

        <div className="bg-white/60 backdrop-blur-2xl p-8 rounded-3xl shadow-2xl max-w-5xl mx-auto border border-white/40">

          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
            🤖 AI Face Search
          </h2>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="text-center mb-6">

            <input
              type="file"
              onChange={(e) => {
                setFile(e.target.files[0]);
                setPreview(URL.createObjectURL(e.target.files[0]));
              }}
              className="mb-4"
            />

            <br />

            <button className="bg-blue-600 text-white px-8 py-2 rounded-full hover:bg-blue-700 shadow-lg">
              Search
            </button>

          </form>

          {/* IMAGE SECTION */}
          {(preview || loading || result) && (
            <div className="grid md:grid-cols-2 gap-8">

              {/* LEFT */}
              <div className="relative">
                <h3 className="text-center mb-2 font-semibold">Uploaded</h3>

                {preview && (
                  <div className="relative overflow-hidden rounded-2xl shadow-xl">

                    <img
                      src={preview}
                      alt=""
                      className="w-full h-[320px] object-cover"
                    />

                    {/* 🔥 AI GRID */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.1)_1px,transparent_1px)] bg-[size:30px_30px]"></div>

                    {/* 🔍 FACE BOX */}
                    <div className="absolute border-2 border-blue-500 w-32 h-32 top-20 left-20 animate-pulse"></div>

                  </div>
                )}
              </div>

              {/* RIGHT */}
              <div className="relative">
                <h3 className="text-center mb-2 font-semibold">
                  {loading ? "Scanning..." : "Result"}
                </h3>

                {/* LOADING */}
                {loading && (
                  <div className="relative overflow-hidden rounded-2xl shadow-xl">

                    {scanImage && (
                      <img
                        src={scanImage}
                        alt=""
                        className="w-full h-[320px] object-cover"
                      />
                    )}

                    {/* SCAN LINE */}
                    <div className="absolute left-0 w-full h-1 bg-blue-500 animate-scan"></div>

                    {/* GRID */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,255,0.1)_1px,transparent_1px)] bg-[size:25px_25px]"></div>

                  </div>
                )}

                {/* MATCH */}
                {!loading && result?.match_found && result.person && (
                  <img
                    src={`http://127.0.0.1:8000${result.person.photo}`}
                    alt=""
                    className="w-full h-[320px] object-cover rounded-2xl shadow-xl"
                  />
                )}

                {/* NO MATCH */}
                {!loading && result?.match_found === false && (
                  <div className="h-[320px] flex items-center justify-center bg-red-50 rounded-2xl">
                    <p className="text-red-500 font-bold text-lg">
                      ❌ No Match Found
                    </p>
                  </div>
                )}

              </div>

            </div>
          )}

          {/* DETAILS */}
          {!loading && result?.match_found && result.person && (
            <div className="mt-6 text-center bg-white/70 p-4 rounded-xl">

              <p><b>Name:</b> {result.person.name}</p>
              <p><b>Age:</b> {result.person.age}</p>
              <p><b>Last Seen:</b> {result.person.last_seen_location}</p>

              <button
                onClick={handleReport}
                className="mt-4 bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700"
              >
                Report This Person
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default SearchMissing;