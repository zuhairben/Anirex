import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";

const Watchlist = () => {
  const [user] = useAuthState(auth);
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({}); // Track expanded state for each anime

  useEffect(() => {
    const fetchWatchlist = async () => {
      if (!user) return;

      try {
        const userWatchlistRef = collection(db, `users/${user.uid}/watchlist`);
        const snapshot = await getDocs(userWatchlistRef);

        const watchlistItems = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setWatchlist(watchlistItems);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching watchlist:", error);
      }
    };

    fetchWatchlist();
  }, [user]);

  const handleRemoveFromWatchlist = async (id) => {
    if (!user) return;

    try {
      const watchlistDocRef = doc(db, "users", user.uid, "watchlist", id);
      await deleteDoc(watchlistDocRef);
      setWatchlist(watchlist.filter((anime) => anime.id !== id));
      alert("Removed from watchlist!");
    } catch (error) {
      console.error("Error removing from watchlist:", error);
    }
  };

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (loading) {
    return <div className="text-center text-white">Loading...</div>;
  }

  if (!watchlist.length) {
    return <div className="text-center text-white">No anime added to watchlist yet!</div>;
  }

  return (
    <div className="bg-gradient-to-br from-gray-800 to-black min-h-screen text-white p-6">
      <h1 className="text-3xl font-bold text-center text-orange-400 mb-6">My Watchlist</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {watchlist.map((anime) => (
          <div key={anime.id} className="bg-gray-900 p-4 rounded-lg shadow-lg flex flex-col items-center text-center">
            {anime.image ? (
              <img src={anime.image} alt={anime.title} className="w-40 h-60 object-cover mb-3 rounded-lg shadow-md" />
            ) : (
              <div className="w-40 h-60 bg-gray-700 flex items-center justify-center rounded-lg">
                No Image
              </div>
            )}
            <h2 className="text-lg font-semibold text-orange-300">{anime.title}</h2>

            {/* Anime Synopsis with "See More / See Less" */}
            <p className="text-sm text-gray-400 mt-2">
              {expanded[anime.id] ? anime.synopsis : `${anime.synopsis.substring(0, 100)}...`}
              {anime.synopsis.length > 100 && (
                <button
                  onClick={() => toggleExpand(anime.id)}
                  className="text-blue-400 ml-1 underline hover:text-blue-500"
                >
                  {expanded[anime.id] ? "See Less" : "See More"}
                </button>
              )}
            </p>

            <button
              onClick={() => handleRemoveFromWatchlist(anime.id)}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 mt-3 rounded-lg shadow-md"
            >
              Remove from Watchlist
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Watchlist;
