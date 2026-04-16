import React, { useEffect, useState, useRef } from "react";
import api from "../api";

const Slider = () => {
  const [data, setData] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const sliderRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get("missing/list/");
      setData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // 🔄 VERTICAL AUTO SCROLL
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
    <>
      {/* 🔥 SLIDER */}
      <div
        ref={sliderRef}
        className="h-[400px] overflow-y-auto space-y-4 p-2"
      >
        {data.map((item) => (
          <div
            key={item.id}
            className="bg-white/80 backdrop-blur-md rounded-xl shadow-md p-3 flex gap-4 items-center cursor-pointer hover:scale-[1.02] transition"
            onClick={() =>
              setSelectedImage(`http://127.0.0.1:8000${item.photo}`)
            }
          >
            <img
              src={`http://127.0.0.1:8000${item.photo}`}
              alt=""
              className="w-24 h-24 object-cover rounded-lg"
            />

            <div>
              <h3 className="font-bold text-gray-800">{item.name}</h3>
              <p className="text-sm text-gray-600">Age: {item.age}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 🔍 POPUP IMAGE */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt=""
            className="max-w-[90%] max-h-[90%] rounded-xl shadow-2xl"
          />
        </div>
      )}
    </>
  );
};

export default Slider;