'use client'

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";

export default function AdminMainPage() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false)
  const [userData, setUserData] = useState(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const userParam = searchParams.get("user");
  console.log('userParam:', userParam)
  console.log('userData:', userData)

  useEffect(() => {
    if (userParam) {
      try {
        const decodedUser = JSON.parse(decodeURIComponent(userParam));
        setUserData(decodedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, [userParam]);

  async function handleSearch(e) {
    e.preventDefault();
    setIsLoading(true)
    if (query.trim() === '') return; // Do nothing if query is empty

    console.log('query:', query)

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/search?query=${encodeURIComponent(query)}`);
    const data = await res.json();

    // If results are found, redirect to search results page
    if (data.results && data.results.length > 0) {
      const searchParams = new URLSearchParams({
        query: query,
        results: JSON.stringify(data.results), // Convert array to a string
      });

      setIsLoading(false)
      router.push(`/adminMainPage/adminResultsPage?${searchParams.toString()}`);
    } else {
      alert('No results found');
    }
  };

  // Logout function to clear local storage and reset user data
  const handleLogout = () => {
    localStorage.clear(); // Clears the entire localStorage
    setUserData(null); // Resets userData state to null
    router.push('/'); // Redirect to login page (or home, as per your requirements)
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-500 to-purple-600 p-4">
      <div className="absolute top-1/6 bg-white shadow-xl rounded-lg p-6 w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Search any song...</h1>
        <form onSubmit={handleSearch} className="space-y-4">
          <Input
            type="text"
            placeholder="Enter song name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          />
          <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg">
            {isLoading ? 'Loading..' : 'Search'} 
          </Button>
        </form>

        {/* Logout Button */}
        <Button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg mt-4"
        >
          Logout
        </Button>
      </div>
    </div>
    </Suspense>
  );
}
