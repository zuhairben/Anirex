import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FiFilter } from "react-icons/fi";

const Home = () => {
  const [animeCategories, setAnimeCategories] = useState({
    trending: [],
    popularSeason: [],
    upcoming: [],
    allTimePopular: [],
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [genre, setGenre] = useState("");
  const [rating, setRating] = useState("");
  const [releaseYear, setReleaseYear] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [filteredAnime, setFilteredAnime] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const trending = await axios.get(
        `https://api.jikan.moe/v4/top/anime?filter=airing&page=1`
      );
      const popularSeason = await axios.get(
        `https://api.jikan.moe/v4/top/anime?type=tv&page=1`
      );
      const upcoming = await axios.get(
        `https://api.jikan.moe/v4/seasons/upcoming?page=1`
      );
      const allTimePopular = await axios.get(
        `https://api.jikan.moe/v4/top/anime?page=1`
      );

      setAnimeCategories({
        trending: trending.data.data.slice(0, 5),
        popularSeason: popularSeason.data.data.slice(0, 5),
        upcoming: upcoming.data.data.slice(0, 5),
        allTimePopular: allTimePopular.data.data.slice(0, 5),
      });
    } catch (error) {
      console.error("Error fetching anime categories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const searchResults = await axios.get(
        `https://api.jikan.moe/v4/anime?q=${searchQuery}&page=1`
      );
      setFilteredAnime(searchResults.data.data);
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilter = async () => {
    setIsLoading(true);
    try {
      let filterUrl = `https://api.jikan.moe/v4/anime?page=1`;
      if (genre) filterUrl += `&genres=${genre}`;
      if (rating) filterUrl += `&score=${rating}`;
      if (releaseYear) filterUrl += `&start_date=${releaseYear}-01-01`;

      const filterResults = await axios.get(filterUrl);
      setFilteredAnime(filterResults.data.data);
    } catch (error) {
      console.error("Error applying filters:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderAnimeList = (title, animeList, viewAllLink) => (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <Link
          to={viewAllLink}
          className="text-pink-500 bg-gray-800 py-1 px-3 rounded-lg hover:bg-pink-600 hover:text-white transition shadow"
        >
          View All
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {animeList.map((anime) => (
          <Link to={`/anime/${anime.mal_id}`} key={anime.mal_id}>
            <div className="bg-gray-900 rounded-lg shadow-lg hover:scale-105 transition transform duration-300">
              <img
                src={anime.images.jpg.image_url}
                alt={anime.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold text-white truncate">
                  {anime.title}
                </h2>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-gray-800 to-black min-h-screen p-6 text-white">
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <h2 className="text-3xl font-extrabold">Loading...</h2>
        </div>
      ) : (
        <>
          {/* Hero Section */}
          <div className="relative bg-gray-900 rounded-lg overflow-hidden shadow-xl mb-8">
            <img
              src="https://i.pinimg.com/originals/48/72/59/487259006ebb768d17f7ec4497969876.gif"
              alt="Anime Mashup"
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
            <div className="absolute bottom-6 left-6">
              <h1 className="text-4xl font-bold text-white">
                Explore Your Next Favorite Anime!
              </h1>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mb-6">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search anime..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border p-3 rounded-lg w-full bg-gray-700 text-white placeholder-gray-400 shadow-lg hover:ring-2 hover:ring-pink-500 transition"
              />
              <div className="absolute right-3 top-3 cursor-pointer">
                <FiFilter
                  onClick={() => setShowFilters(!showFilters)}
                  className="text-white"
                />
              </div>
            </form>
            {showFilters && (
              <div className="mt-4 bg-gray-800 p-4 rounded-lg shadow-lg">
                <select
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="border p-3 rounded w-full bg-gray-700 text-white mb-2"
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
                  className="border p-3 rounded-lg w-full bg-gray-700 text-white mb-2"
                />
                <input
                  type="number"
                  placeholder="Release Year (e.g., 2023)"
                  value={releaseYear}
                  onChange={(e) => setReleaseYear(e.target.value)}
                  className="border p-3 rounded-lg w-full bg-gray-700 text-white mb-2"
                />
                <button
                  type="button"
                  onClick={handleFilter}
                  className="bg-pink-500 text-white py-2 px-4 rounded-lg w-full hover:bg-pink-400 transition"
                >
                  Apply Filters
                </button>
              </div>
            )}
          </div>

          {/* Display Search or Filter Results */}
          {filteredAnime.length > 0 ? (
            renderAnimeList("Search Results", filteredAnime, "/search-results")
          ) : (
            <>
              {renderAnimeList(
                "Trending Now",
                animeCategories.trending,
                "/trending"
              )}
              {renderAnimeList(
                "Popular This Season",
                animeCategories.popularSeason,
                "/popular"
              )}
              {renderAnimeList(
                "Upcoming Anime",
                animeCategories.upcoming,
                "/upcoming"
              )}
              {renderAnimeList(
                "All-Time Popular Anime",
                animeCategories.allTimePopular,
                "/allTime"
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
