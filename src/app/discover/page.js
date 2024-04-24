"use client"
import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';

function Discover() {
  const [token, setToken] = useState("");
  const [topTracks, setTopTracks] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
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
  
    if (token) {
      fetchTopTracks();
      fetchTopArtists();
      fetchTopGenres();
    }
  }, []); 

  const logout = () => {
    setToken("");
    window.localStorage.removeItem("token");
  };

  const fetchTopTracks = async () => {
    try {
      const { data } = await axios.get("https://api.spotify.com/v1/browse/new-releases", {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          country: "CA"
        }
      });

      setTopTracks(data.albums.items);
    } catch (error) {
      console.error("Error fetching top tracks:", error);
    }
  };

  const fetchTopArtists = async () => {
    try {
      const { data } = await axios.get("https://api.spotify.com/v1/me/top/artists", {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          time_range: "short_term",
          limit: 5,
          offset: 0,
          country: "CA" // Add country parameter to fetch top artists in Canada
        }
      });

      setTopArtists(data.items);
    } catch (error) {
      console.error("Error fetching top artists:", error);
    }
  };

  const fetchTopGenres = async () => {
    try {
      const { data } = await axios.get("https://api.spotify.com/v1/recommendations/available-genre-seeds", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const topGenresSlice = data.genres.slice(0, 5);
      setTopGenres(topGenresSlice);
    } catch (error) {
      console.error("Error fetching top genres:", error);
    }
  };

  const renderTracks = () => {
    return (
      <div className="flex flex-wrap justify-center">
        {topTracks.map((track, index) => (
          <div key={index} className="card card-compact w-96 bg-base-100 shadow-xl mx-4 my-4">
            <figure>
              <img src={track.images.length ? track.images[0].url : "https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg"} alt={track.name} />
            </figure>
            <div className="card-body">
              <h2 className="card-title">{track.name}</h2>
              <div className="card-actions justify-end">
                <a href={track.external_urls.spotify} target="_blank" rel="noopener noreferrer" className="btn btn-primary">Listen on Spotify</a>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderArtists = () => {
    return (
      <div className="flex flex-wrap justify-center">
        {topArtists.map((artist, index) => (
          <div key={index} className="card card-compact w-96 bg-base-100 shadow-xl mx-4 my-4">
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
            <Link href='/viewtopsongs'className="btn btn-ghost text-xl">View Top Songs</Link>
            <Link href='/viewtopartists'className="btn btn-ghost text-xl">View Top Artists</Link>
            <Link href='/viewtopartists'className="btn btn-ghost text-xl">View Top Genres</Link>
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
            <h1 className="text-5xl font-bold pb-10">Discover Music</h1>
            <div className="grid grid-cols-3 gap-8">
              <div className="col-span-1">
                <button onClick={fetchTopTracks} className="btn btn-primary w-full">Recommended  Tracks</button>
                {renderTracks()}
              </div>
              <div className="col-span-1">
                <button onClick={fetchTopArtists} className="btn btn-primary w-full">Reveal Top Artists</button>
                {renderArtists()}
              </div>
              <div className="col-span-1">
                <button onClick={fetchTopGenres} className="btn btn-primary w-full">Reveal Top Genres</button>
                {renderGenres()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Discover;
