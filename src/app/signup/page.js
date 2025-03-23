"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminSignup() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [instrument, setInstrument] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    
    // Validation
    if (!username || !password || !instrument) {
      setError("All fields are required.");
      return;
    }

    // If valid, proceed (you can add API call here)
    const admin = false
    console.log("User Registered:", { username, password, instrument, admin });

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password, instrument, admin }),
        });
        const data = await response.json();
  
        if (response.ok) {
          console.log('respone OK')
          const { newUser } = data;
            localStorage.setItem('userId', newUser.userId);
            console.log('respone OK2', newUser.userId)
          router.push('/playerMainPage');
        } else {
          setError('Registration failed, please try again.');
        }
      } catch (err) {
        setError('Something went wrong, please try again.');
      } finally {
        setError("");
      }
    
  }

  return (
    <div className="relative flex h-screen items-center justify-center bg-gray-900 px-4">
      <div className="absolute top-1/8 w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-white text-center mb-6">
          User Registration
        </h2>
        <p className="text-center text-gray-300 mb-6">
          Welcome! Please register to join the band rehearsal.
        </p>

        {/* Error Message */}
        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Username Input */}
          <div>
            <label className="block text-gray-300 text-sm mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)} 
              placeholder="Enter your username"
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-gray-300 text-sm mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Enter your password"
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Instrument Dropdown */}
          <div>
            <label className="block text-gray-300 text-sm mb-2">Instrument</label>
            <select
              value={instrument}
              onChange={(e) => setInstrument(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>Select your instrument</option>
              <option value="vocals">Vocals</option>
              <option value="guitar">Guitar</option>
              <option value="piano">Piano</option>
              <option value="ukulele">Ukulele</option>
            </select>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-500 transition duration-300"
          >
            Register 
          </button>
        </form>

        {/* Link to Login */}
        <p className="text-gray-400 text-center text-sm mt-4">
          Already a user?{" "}
          <a href="/" className="text-blue-400 hover:underline">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
}


