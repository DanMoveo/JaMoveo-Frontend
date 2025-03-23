'use client'

import { useEffect, useState } from "react";

export default function LivePage() {
  const [songDetails, setSongDetails] = useState(null);
  const [isAutoScrollActive, setIsAutoScrollActive] = useState(false);

  useEffect(() => {
    // Retrieve the song details from sessionStorage
    const songData = sessionStorage.getItem("songDetails");
    if (songData) {
      setSongDetails(JSON.parse(songData));
    }
  }, []);

  useEffect(() => {
    if (isAutoScrollActive) {

      
      const interval = setInterval(() => {
        const lyricsSection = document.getElementById("lyrics-section");
        if (lyricsSection) {
          window.scrollBy({ top: 2, behavior: "smooth" }); // Smooth continuous scroll
        }
      }, 50); // Adjust speed

      return () => clearInterval(interval);
    }
  }, [isAutoScrollActive]);

  if (!songDetails) return <div className="text-center p-4">Loading...</div>;

  // Function to map chords to lyrics
  const mapChordsToLyrics = () => {
    let result = [];
    let totalChords = songDetails.chords.length;
    let totalLyrics = songDetails.lyrics.length;
    let chordIndex = 0;
  
    // Define the max chords per line dynamically
    let maxChordsPerLine = totalChords > totalLyrics ? Math.ceil(totalChords / totalLyrics) : 1;
    maxChordsPerLine = Math.min(maxChordsPerLine, 2); // Ensure we don’t assign too many chords per line
  
    songDetails.lyrics.forEach((line) => {
      // If it's a section header (Intro, Chorus, etc.), keep it bold and without chords
      if (["Intro", "intro", "verse", "Chorus:", "Repeat", "Bridge:", "Ending:", "Solo"].some((section) => line.includes(section))) {
        result.push({ lyric: line, chords: [] });
        return;
      }
  
      let assignedChords = [];
  
      // Only attach chords if there are enough left
      if (chordIndex < totalChords) {
        let availableChords = totalChords - chordIndex;
        let chordsForThisLine = Math.min(availableChords, maxChordsPerLine);
  
        assignedChords = songDetails.chords.slice(chordIndex, chordIndex + chordsForThisLine);
        chordIndex += chordsForThisLine;
      }
  
      result.push({
        lyric: line,
        chords: assignedChords
      });
    });
  
    return result;
  };

  const lyricsWithChords = mapChordsToLyrics();

  return (
    <div className="max-w-screen-lg mx-auto p-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">{songDetails.title}</h1>
        <img
          className="w-2/4 h-auto object-cover mb-4 rounded-lg mx-auto"
          src={songDetails.imageUrl}
          alt={songDetails.title}
        />
      </div>

      <div id="lyrics-section" className="mb-6">
        <h2 className="text-lg font-semibold mb-2 text-center">Lyrics</h2>
        <div className="space-y-3">
          {lyricsWithChords.map((line, index) => {
            const isIntroOrVerse = ["Intro", "verse", "Chorus", "Bridge", "Ending"].some((section) => line.lyric.includes(section));
            const isBoldLine = line.lyric.includes("Intro") || line.lyric.includes("verse") || 
            line.lyric.includes("Chorus") || line.lyric.includes("Bridge") || line.lyric.includes("Ending");

            return (
              <div key={index} className="flex flex-col items-center">
                {line.chords.length > 0 && (
                  <div className="text-blue-600 font-bold text-sm flex w-full justify-evenly mb-0.5">
                    {line.chords.map((chord, chordIdx) => (
                      <span key={chordIdx} className="px-1">{chord}</span>
                    ))}
                  </div>
                )}
                <span className={`text-base ${isIntroOrVerse ? 'mb-4' : ''} ${isBoldLine ? 'font-bold' : ''}`}>
                  {line.lyric}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Sticky Button */}
      <button
        onClick={() => setIsAutoScrollActive((prev) => !prev)}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none fixed bottom-5 right-5 shadow-lg"
      >
        {isAutoScrollActive ? "Stop Auto Scroll" : "Start Auto Scroll"}
      </button>
    </div>
  );
}
