import React, { useEffect, useState } from "react";
import api from "../api";
import MapView from "../components/MapView";

const PoliceDashboard = () => {
  const [data, setData] = useState([]);
  const [nextPage, setNextPage] = useState(null);

  // ✅ FETCH DATA
  const fetchData = async () => {
    try {
      const res = await api.get("/dashboard/police/"); // ✅ FIXED

      console.log("POLICE DATA:", res.data); // ✅ DEBUG

      setData(res.data.results || []);
      setNextPage(res.data.next);
    } catch (err) {
      console.log("ERROR:", err.response?.data || err);
    }
  };

  // ✅ AUTO REFRESH (VERY IMPORTANT)
  useEffect(() => {
    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, 5000); // every 5 sec

    return () => clearInterval(interval);
  }, []);

  // ✅ LOAD MORE
  const loadMore = async () => {
    if (!nextPage) return;

    try {
      const res = await api.get(nextPage);
      setData(prev => [...prev, ...res.data.results]);
      setNextPage(res.data.next);
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ MARK FOUND
  const updateStatus = async (reportId) => {
    try {
      await api.post("/case/update/", { report_id: reportId }); // ✅ FIXED
      alert("Marked as FOUND ✅");
      fetchData();
    } catch (err) {
      alert("Error updating ❌");
    }
  };

  // ✅ DELETE
  const deleteReport = async (reportId) => {
    try {
      await api.post("/report/delete/", { report_id: reportId }); // ✅ FIXED
      setData(prev => prev.filter(item => item.id !== reportId));
      alert("Deleted ✅");
    } catch (err) {
      alert("Delete failed ❌");
    }
  };

  return (
    <div className="pt-20 px-6 bg-gray-100 min-h-screen">

      <h1 className="text-3xl font-bold text-center mb-8 text-black">
        Police Dashboard
      </h1>

      {data.length === 0 ? (
        <p className="text-center text-gray-500">No reports found</p>
      ) : (
        <div className="flex flex-wrap gap-6 justify-center">

          {data.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-lg p-4 w-full max-w-sm"
            >

              {/* 📸 IMAGE */}
              {item.photo && (
                <img
                  src={`http://127.0.0.1:8000${item.photo}`}
                  alt="found"
                  className="w-full h-48 object-cover rounded mb-3"
                />
              )}

              {/* 📍 LOCATION */}
              <p><b>Latitude:</b> {item.latitude || "Not available"}</p>
              <p><b>Longitude:</b> {item.longitude || "Not available"}</p>

              {/* ✅ MAP FIX */}
              {item.latitude && item.longitude ? (
                <MapView lat={item.latitude} lng={item.longitude} />
              ) : (
                <p className="text-red-500">Location not available</p>
              )}

              <p><b>Police Station:</b> {item.police_station || "Not Assigned"}</p>

              <p>
                <b>Status:</b>{" "}
                {item.match_found ? "✅ Match Found" : "❌ No Match"}
              </p>

              {/* ✅ MATCH */}
              {item.missing_person ? (
                <>
                  <h4 className="mt-3 font-bold">Matched Person</h4>

                  <p><b>Name:</b> {item.missing_person.name}</p>

                  <img
                    src={`http://127.0.0.1:8000${item.missing_person.photo}`}
                    alt="missing"
                    className="w-full h-40 object-cover rounded mt-2"
                  />

                  <button
                    onClick={() => updateStatus(item.id)}
                    className="mt-3 w-full bg-green-600 text-white py-2 rounded"
                  >
                    Mark as Found
                  </button>
                </>
              ) : (
                <>
                  <p className="text-gray-500 mt-2">No match found</p>

                  <button
                    onClick={() => deleteReport(item.id)}
                    className="mt-3 w-full bg-red-600 text-white py-2 rounded"
                  >
                    Delete Report
                  </button>
                </>
              )}

            </div>
          ))}

        </div>
      )}

      {/* 🔥 LOAD MORE */}
      {nextPage && (
        <div className="text-center mt-8">
          <button
            onClick={loadMore}
            className="bg-black text-white px-6 py-2 rounded"
          >
            Load More
          </button>
        </div>
      )}

    </div>
  );
};

export default PoliceDashboard;