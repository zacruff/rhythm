"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

function ViewTopGenres() {
  const [token, setToken] = useState("");
  const [topGenres, setTopGenres] = useState([]);

  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");

    if (!token && hash) {
      token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1];

      window.location.hash = "";
      window.localStorage.setItem("token", token);
    }

    setToken(token);

    // Add token as a dependency here
  }, [token]); // token is now included in the dependency array

  const logout = () => {
    setToken("");
    window.localStorage.removeItem("token");
  };

  const fetchTopGenres = async () => {
    try {
      const { data } = await axios.get("https://api.spotify.com/v1/recommendations/available-genre-seeds", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      // Get the first 5 genres
      const topGenresSlice = data.genres.slice(0, 5);
      setTopGenres(topGenresSlice);
    } catch (error) {
      console.error("Error fetching top genres:", error);
    }
  };

  const renderGenres = () => {
    return (
      <div className="flex flex-wrap justify-center">
        {topGenres.map((genre, index) => (
          <div key={index} className="card card-compact w-96 bg-base-100 shadow-xl mx-4 my-4">
            <div className="card-body">
              <h2 className="card-title">{genre}</h2>
              <div className="card-actions justify-end">
                <a href={`https://open.spotify.com/search/${encodeURIComponent(genre)}`} target="_blank" rel="noopener noreferrer" className="btn btn-primary">View Songs</a>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="navbar bg-mytheme-neutral outline outline-offset-2 outline-1">
          <div className="flex-1">
            <Link href="/" className="btn btn-ghost text-xl">RhythmRank</Link>
            <Link href='/discover' className="btn btn-ghost text-xl">Discover Music</Link>
            <Link href='/viewtopsongs' className="btn btn-ghost text-xl">View Top Songs</Link>
            <Link href='/viewtopartists' className="btn btn-ghost text-xl">View Top Artists</Link>
          </div>
          <div className="flex-none gap-2">
            <p>{!token ?
              <a href={`${process.env.AUTH_ENDPOINT}?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&response_type=${process.env.RESPONSE_TYPE}&scope=user-top-read`}>Login to Spotify</a>
              : <button onClick={logout}>Logout</button>}</p>
          </div>
        </div>
      </header>
      <div className="hero min-h-screen bg-mytheme-neutral">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">View Top Genres</h1>
            <p className="py-6">Discover the top genres based on your listening preferences.</p>
            <button onClick={fetchTopGenres} className="btn btn-primary">Reveal Genres</button>
            {renderGenres()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewTopGenres;
