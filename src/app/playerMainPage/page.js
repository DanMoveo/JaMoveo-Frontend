"use client";

import { socket } from "../socket";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export const roomId ='BandSession'

export default function UserMainPage() {
  const [songSelected, setSongSelected] = useState(false);
  const router = useRouter();

  useEffect(() => {

    const userId = localStorage.getItem('userId');
    // Listen for messages from the WebSocket server
    console.log('working..')
    socket.emit("joinRoom", { roomId });
    console.log('working2..')
    
      socket.on("songSelected", (songSelected) => {
        console.log('isSongSelected?', songSelected)
        setSongSelected(songSelected)
      })
  

  
    
    // Clean up the WebSocket connection when the component is unmounted
    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    if (songSelected) {
      router.push("/live");
    }
  }, [songSelected, router]);

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-900">
      <div className="absolute top-1/6 p-6 w-96 text-center shadow-lg border border-gray-700 bg-gray-800 text-white flex flex-col items-center justify-center">
        <h1 className="text-2xl font-semibold mb-4">Waiting for next song</h1>
        <Loader2 className="animate-spin text-blue-400" size={36} />
      </div>
    </div>
  );
}
