import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Home = () => {
  const [animeList, setAnimeList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [genre, setGenre] = useState("");
  const [rating, setRating] = useState("");
  const [releaseYear, setReleaseYear] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchAnime();
  }, [page]);

  const fetchAnime = async () => {
    setLoading(true);
    try {
      let url = `https://api.jikan.moe/v4/anime?`;

      if (searchQuery) url += `q=${searchQuery}&`;
      if (genre) url += `genres=${genre}&`;
      if (rating) url += `min_score=${rating}&`;
      if (releaseYear)
        url += `start_date=${releaseYear}-01-01&end_date=${releaseYear}-12-31&`;

      url += `page=${page}`;

      const response = await axios.get(url);

      if (response.data.data.length === 0) {
        setHasMore(false);
      } else {
        setAnimeList((prevAnimeList) =>
          page === 1 ? response.data.data : [...prevAnimeList, ...response.data.data]
        );
      }
    } catch (error) {
      console.error("Error fetching anime:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setAnimeList([]);
    setPage(1);
    setHasMore(true);
    fetchAnime();
  };

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 50 &&
      !loading &&
      hasMore
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore]);

  return (
    <div className="p-6">
      <form onSubmit={handleSearch} className="mb-4">
        <input
          type="text"
          placeholder="Search anime..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="border p-2 rounded w-full mt-2"
        >
          <option value="">Select Genre</option>
          <option value="1">Action</option>
          <option value="2">Adventure</option>
          <option value="4">Comedy</option>
          <option value="8">Drama</option>
          <option value="10">Fantasy</option>
          <option value="14">Horror</option>
          <option value="22">Romance</option>
          <option value="24">Sci-Fi</option>
        </select>
        <input
          type="number"
          placeholder="Minimum Rating (1-10)"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="border p-2 rounded w-full mt-2"
        />
        <input
          type="number"
          placeholder="Release Year (e.g., 2023)"
          value={releaseYear}
          onChange={(e) => setReleaseYear(e.target.value)}
          className="border p-2 rounded w-full mt-2"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded mt-2"
        >
          Search
        </button>
      </form>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {animeList.map((anime) => (
          <Link to={`/anime/${anime.mal_id}`} key={anime.mal_id}>
            <div className="bg-white p-4 shadow rounded hover:shadow-lg transition">
              <img
                src={anime.images.jpg.image_url}
                alt={anime.title}
                className="w-full h-48 object-cover rounded mb-2"
              />
              <h2 className="text-lg font-semibold">{anime.title}</h2>
            </div>
          </Link>
        ))}
      </div>

      {loading && <div>Loading more...</div>}
      {!hasMore && <div>No more anime to show.</div>}
    </div>
  );
};

export default Home;
