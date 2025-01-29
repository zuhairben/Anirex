import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const CategoryPage = ({ category }) => {
  const [animeList, setAnimeList] = useState([]);
  const [page, setPage] = useState(1); // For pagination
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    fetchCategoryData(); // Initial fetch
  }, [category]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100 &&
        !isFetching
      ) {
        fetchMoreAnime();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [animeList, isFetching]);

  const fetchCategoryData = async () => {
    try {
      setIsFetching(true);
      const response = await axios.get(getCategoryUrl(category, page));
      setAnimeList((prev) => [...prev, ...response.data.data]);
      setPage((prev) => prev + 1); // Increment page for the next fetch
      setIsFetching(false);
    } catch (error) {
      console.error("Error fetching category data:", error);
      setIsFetching(false);
    }
  };

  const fetchMoreAnime = async () => {
    fetchCategoryData();
  };

  const getCategoryUrl = (category, page) => {
    switch (category) {
      case "trending":
        return `https://api.jikan.moe/v4/top/anime?type=tv&filter=airing&page=${page}`;
      case "popular":
        return `https://api.jikan.moe/v4/top/anime?type=tv&page=${page}`;
      case "upcoming":
        return `https://api.jikan.moe/v4/seasons/upcoming?page=${page}`;
      case "allTime":
        return `https://api.jikan.moe/v4/top/anime?page=${page}`;
      default:
        return "";
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 to-black min-h-screen p-6 text-white">
      <h1 className="text-3xl font-bold mb-6 capitalize text-pink-500">
        {category} Anime
      </h1>
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
                <h3 className="text-lg font-semibold text-white truncate">
                  {anime.title}
                </h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
      {isFetching && (
        <div className="flex justify-center mt-6">
          <p className="text-pink-500 font-semibold">Loading more anime...</p>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
