import React, { useState } from "react";
import api from "../api";

const FaceMatch = () => {
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [result, setResult] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("IMG1:", image1);
    console.log("IMG2:", image2);

    if (!image1 || !image2) {
      setResult("Both images required ❌");
      return;
    }

    const formData = new FormData();
    formData.append("image1", image1);
    formData.append("image2", image2);

    try {
      const res = await api.post("face-match/", formData);
      console.log(res.data);

      setResult(
        `Match: ${res.data.match} | Score: ${res.data.similarity_score}`
      );
    } catch (err) {
      console.log(err.response?.data);
      setResult("Error ❌");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Face Match</h2>

      {/* IMAGE 1 */}
      <input
        type="file"
        onChange={(e) => setImage1(e.target.files[0])}
      />

      <br /><br />

      {/* IMAGE 2 */}
      <input
        type="file"
        onChange={(e) => setImage2(e.target.files[0])}
      />

      <br /><br />

      <button onClick={handleSubmit}>Check Match</button>

      <br /><br />

      <p>{result}</p>
    </div>
  );
};

export default FaceMatch;