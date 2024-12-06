import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";


const Watchlist = () => {
  const [user] = useAuthState(auth);
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);

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

      setWatchlist(watchlist.filter((item) => item.id !== id));
      alert("Removed from Watchlist!");
    } catch (error) {
      console.error("Error removing from watchlist:", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!watchlist.length) return <div>No watchlist items added yet!</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">My Watchlist</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {watchlist.map((anime) => (
          <div
            key={anime.id}
            className="border rounded-lg p-4 flex flex-col items-center"
          >
            {anime.image ? (
              <img
                src={anime.image}
                alt={anime.title}
                className="w-32 h-48 object-cover mb-2"
              />
            ) : (
              <div className="w-32 h-48 bg-gray-300 flex items-center justify-center">
                No Image
              </div>
            )}
            <h2 className="text-lg font-semibold text-center">{anime.title}</h2>
            <p className="text-sm text-gray-600 mt-2">{anime.synopsis}</p>
            <button
              onClick={() => handleRemoveFromWatchlist(anime.id)}
              className="bg-blue-500 text-white py-1 px-4 rounded mt-2"
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
