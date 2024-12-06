import { useState, useEffect } from "react";
import axios from "axios";

const AnimeList = () => {
  const [anime, setAnime] = useState([]);

  useEffect(() => {
    axios
      .get("https://api.jikan.moe/v4/top/anime")
      .then((res) => setAnime(res.data.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {anime.map((anime) => (
          <div
            key={anime.mal_id}
            className="bg-white rounded shadow p-4 hover:shadow-lg"
          >
            <img
              src={anime.images.jpg.image_url}
              alt={anime.title}
              className="w-full h-48 object-cover rounded mb-4"
            />
            <h2 className="text-lg font-bold">{anime.title}</h2>
            <p className="text-sm text-gray-600">Score: {anime.score}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnimeList;
