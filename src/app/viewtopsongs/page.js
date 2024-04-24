"use client"
import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';

function ViewTopSongs() {
  const [token, setToken] = useState("");
  const [topTracks, setTopTracks] = useState([]);

  useEffect(() => {
    // Effect to fetch token and set it
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");

    if (!token && hash) {
      token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1];

      window.location.hash = "";
      window.localStorage.setItem("token", token);
    }

    setToken(token);
  }, []); // Dependency array is empty because this effect runs only once on mount

  useEffect(() => {
    // Effect to fetch top tracks when token changes
    const fetchTopTracks = async () => {
      if (token) {
        try {
          const { data } = await axios.get("https://api.spotify.com/v1/me/top/tracks", {
            headers: {
              Authorization: `Bearer ${token}`
            },
            params: {
              time_range: "short_term",
              limit: 50,
              offset: 0
            }
          });

          setTopTracks(data.items);
        } catch (error) {
          console.error("Error fetching top tracks:", error);
        }
      }
    };

    fetchTopTracks();
  }, [token]); // Dependency array includes token because this effect depends on token

  const logout = () => {
    setToken("");
    window.localStorage.removeItem("token");
  };

  const fetchTopTracks = async () => {
    const { data } = await axios.get("https://api.spotify.com/v1/me/top/tracks", {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        time_range: "short_term",
        limit: 50,
        offset: 0
      }
    });

    setTopTracks(data.items);
  };

  const renderTracks = () => {
    return (
      <div className="flex flex-wrap justify-center">
        {topTracks.map(track => (
          <div key={track.id} className="card card-compact w-96 bg-base-100 shadow-xl mx-4 my-4">
            <figure>
              <img src={track.album.images.length ? track.album.images[0].url : "https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg"} alt={track.name} />
            </figure>
            <div className="card-body">
              <h2 className="card-title">{track.name}</h2>
              <p>{track.artists.map(artist => artist.name).join(", ")}</p>
              <div className="card-actions justify-end">
                <a href={track.external_urls.spotify} target="_blank" rel="noopener noreferrer" className="btn btn-primary">Listen on Spotify</a>
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
            <Link href='/viewtopartists' className="btn btn-ghost text-xl">View Top Artists</Link>
            <Link href='/viewtopgenres' className="btn btn-ghost text-xl">View Top Genres</Link>

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
    <div className="max-w-7x1">
      <h1 className="text-5xl font-bold pb-10">Your Top Songs</h1>
      <button onClick={fetchTopTracks} className="btn btn-primary w-full mb-8">Reveal Top Tracks</button>
      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-3"> 
          {renderTracks()} 
        </div>
      </div>
    </div>
  </div>
</div>

      <div>
      </div>
    </div>
  );
}

export default ViewTopSongs;
