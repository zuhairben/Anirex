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
        return `https://api.jikan.moe/v4/top/anime?type=tv&filter=bypopularity&page=${page}`;
      case "popular":
        return `https://api.jikan.moe/v4/top/anime?type=tv&filter=favorite&page=${page}`;
      case "upcoming":
        return `https://api.jikan.moe/v4/seasons/upcoming?page=${page}`;
      case "allTime":
        return `https://api.jikan.moe/v4/top/anime?page=${page}`;
      default:
        return "";
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4 capitalize">{category} Anime</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
        {animeList.map((anime) => (
          <Link to={`/anime/${anime.mal_id}`} key={anime.mal_id}>
            <div
              key={anime.mal_id}
              className="bg-white rounded shadow hover:shadow-lg transition"
              style={{ width: "150px", height: "270px" }} // Adjusted size
            >
              <img
                src={anime.images.jpg.image_url}
                alt={anime.title}
                className="w-full h-48 object-cover rounded-t" // Adjusted size
              />
              <div className="p-2">
                <h3 className="text-sm font-semibold truncate">{anime.title}</h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
      {isFetching && <p>Loading more anime...</p>}
    </div>
  );
};

export default CategoryPage;
