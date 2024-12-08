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
        <h2 className="text-2xl font-semibold">{title}</h2>
        <Link to={viewAllLink} className="text-blue-500 hover:underline">
          View All
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
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
    </div>
  );

  return (
    <div className="p-6">
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <h2 className="text-2xl font-bold">Loading...</h2>
        </div>
      ) : (
        <>
          {/* Search and Filters */}
          <div className="mb-6">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search anime..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border p-2 rounded w-full"
              />
              <div className="absolute right-3 top-3 cursor-pointer">
                <FiFilter onClick={() => setShowFilters(!showFilters)} />
              </div>
            </form>
            {showFilters && (
              <div className="mt-4 bg-gray-100 p-4 rounded shadow">
                <select
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="border p-2 rounded w-full mb-2"
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
                  className="border p-2 rounded w-full mb-2"
                />
                <input
                  type="number"
                  placeholder="Release Year (e.g., 2023)"
                  value={releaseYear}
                  onChange={(e) => setReleaseYear(e.target.value)}
                  className="border p-2 rounded w-full mb-2"
                />
                <button
                  type="button"
                  onClick={handleFilter}
                  className="bg-blue-500 text-white py-2 px-4 rounded w-full"
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
