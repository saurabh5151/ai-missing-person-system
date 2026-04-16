function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-black">

      {/* 🔥 ANIMATED BACKGROUND */}
      <div className="absolute inset-0 flex justify-center items-center">

        {/* OUTER GLOW */}
        <div className="w-[400px] h-[400px] rounded-full border-4 border-cyan-400 animate-spinSlow opacity-30"></div>

        {/* INNER CORE */}
        <div className="absolute w-[200px] h-[200px] rounded-full bg-cyan-400 blur-3xl animate-pulse"></div>

        {/* CENTER CORE */}
        <div className="absolute w-[120px] h-[120px] rounded-full bg-white opacity-80 animate-ping"></div>

      </div>

      {/* 🌟 CONTENT */}
      <div className="relative z-10 flex justify-center items-center h-screen px-4">

        {/* ✅ changed text color here */}
        <div className="bg-white/10 backdrop-blur-xl p-10 rounded-2xl shadow-2xl max-w-xl text-center text-black">

          <h1 className="text-4xl font-extrabold mb-4 tracking-wide">
            🚨 Missing Finder
          </h1>

          {/* ✅ removed gray text */}
          <div className="max-w-3xl mx-auto text-center text-black space-y-4">

            <h2 className="text-3xl font-bold">
              How Our System Works 🚀
            </h2>

            <p>
              Our AI-powered Missing Person Tracking System helps people quickly 
              report and find missing individuals using face recognition technology 
              and real-time location tracking.
            </p>

            <div className="text-left mt-6 space-y-3">

              <p>🔍 <b>Search Person:</b>  
              Users upload a photo, and our AI scans the database to find matching faces instantly.</p>

              <p>📢 <b>Report Found:</b>  
              If a match is found, users can report the person’s location with GPS, helping authorities track them faster.</p>

              <p>👮 <b>Police Verification:</b>  
              Police officers review reports, verify matches, and confirm the identity of the person.</p>

              <p>📁 <b>Create Case:</b>  
              Police can create new missing person cases with details like name, age, and last seen location.</p>

              <p>✅ <b>Status Update:</b>  
              Once verified, cases are marked as “Found” and updated in the system.</p>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Home;