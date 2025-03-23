"use client";  // ✅ Ensure the entire page is a Client Component

import { useSearchParams, useRouter } from "next/navigation";
import { socket } from "@/app/socket";
import { Suspense } from "react";

function SearchResultsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const query = searchParams.get("query");
  const results = searchParams.get("results") || "[]";

  console.log("query:", query, "results:", results);

  let parsedResults = [];
  try {
    parsedResults = JSON.parse(results);
  } catch (error) {
    console.error("Failed to parse results:", error);
  }

  socket.emit("joinRoom", { roomId: "BandSession" });

  async function handleSelectSong(songUrl, index) {
    console.log("Selected song URL:", songUrl);
    const res = await fetch(
      `${
        process.env.NEXT_PUBLIC_BASE_URL
      }/api/search/playSong?query=${encodeURIComponent(songUrl)}`
    );
    const data = await res.json();

    if (data.imageUrl && !data.imageUrl.startsWith("https://")) {
      data.imageUrl = "https://www.tab4u.com" + data.imageUrl;
    }
    console.log("Fetched song data:", data);

    socket.emit("songPicked", { roomId: "BandSession", song: data });

    sessionStorage.setItem("songDetails", JSON.stringify(data));

    router.push("/live");
  }

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-500 to-purple-600 p-4">
      <button
        onClick={() => router.push("/adminMainPage")}
        className="absolute top-6 left-6 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg shadow-md transition-all"
      >
        ← Back to Search
      </button>
      <div className="absolute top-20 bg-white shadow-xl rounded-lg p-6 w-full max-w-4xl mx-auto h-screen md:max-h-[80vh] overflow-y-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">
          Search Results for "{query}"
        </h1>
        <ul className="p-2 space-y-4">
          {parsedResults.map((song, index) => (
            <li
              key={index}
              className="border p-4 rounded-lg shadow-md cursor-pointer hover:bg-gray-100 transition-all"
              onClick={() => handleSelectSong(song.url, index)}
            >
              <h2 className="font-semibold text-lg">{song.title}</h2>
              <p className="text-sm text-gray-600">Artist: {song.artist}</p>
              {song.image && (
                <img
                  src={song.image}
                  alt={song.title}
                  className="w-40 h-40 object-cover mt-2 rounded-lg"
                />
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchResultsPage />
    </Suspense>
  );
}
