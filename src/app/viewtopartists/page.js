"use client"
import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';

function ViewTopArtists() {
  const [token, setToken] = useState("");
  const [searchKey, setSearchKey] = useState("")
  const [artists, setArtists] = useState([])

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

  const searchArtists = async (e) => {
    e.preventDefault()
    const { data } = await axios.get("https://api.spotify.com/v1/search", {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        q: searchKey,
        type: "artist"
      }
    })

    setArtists(data.artists.items)
  }

  const renderArtists = () => {
    return (
      <div className="flex flex-wrap justify-center">
        {artists.map(artist => (
          <div key={artist.id} className="card card-compact w-96 bg-base-100 shadow-xl mx-4 my-4">
            <figure>
              <img src={artist.images.length ? artist.images[0].url : "https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg"} alt={artist.name} />
            </figure>
            <div className="card-body">
              <h2 className="card-title">{artist.name}</h2>
              <div className="card-actions justify-end">
                <a href={artist.external_urls.spotify} target="_blank" rel="noopener noreferrer" className="btn btn-primary">View Artist</a>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const fetchTopArtists = async () => {
    try {
      const { data } = await axios.get("https://api.spotify.com/v1/me/top/artists", {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          time_range: "short_term",
          limit: 20,
          offset: 0
        }
      });
      console.log("Top artists data:", data);
      setArtists(data.items);
    } catch (error) {
      console.error("Error fetching top artists:", error);
    }
  };
  
  return (
      <div className="App">
        <header className="App-header">
          <div className="navbar bg-mytheme-neutral outline outline-offset-2 outline-1">
            <div className="flex-1">
              <Link href="/" className="btn btn-ghost text-xl">RhythmRank</Link>
              <Link href='/discover' className="btn btn-ghost text-xl">Discover Music</Link>
              <Link href='/viewtopsongs' className="btn btn-ghost text-xl">View Top Songs</Link>
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
      <h1 className="text-5xl font-bold pb-10">Your Top Artists</h1>
      <button onClick={fetchTopArtists} className="btn btn-primary w-full mb-8">Reveal Top Artists</button>
      <div className="flex flex-wrap justify-center">
        {artists.map(artist => (
          <div key={artist.id} className="card card-compact w-96 bg-base-100 shadow-xl mx-4 my-4">
            <figure>
              <img src={artist.images.length ? artist.images[0].url : "https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg"} alt={artist.name} />
            </figure>
            <div className="card-body">
              <h2 className="card-title">{artist.name}</h2>
              <div className="card-actions justify-end">
                <a href={artist.external_urls.spotify} target="_blank" rel="noopener noreferrer" className="btn btn-primary">View Artist</a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
</div>

  
        <div>
        </div>
      </div>
    );
}

export default ViewTopArtists;
