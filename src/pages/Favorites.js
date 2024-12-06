import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";


const Favorites = () => {
  const [user] = useAuthState(auth);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) return;

      try {
        const userFavoritesRef = collection(db, `users/${user.uid}/favorites`);
        const snapshot = await getDocs(userFavoritesRef);

        // Merge Firestore document ID with the document data
        const favs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setFavorites(favs);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    fetchFavorites();
  }, [user]);

  const handleRemoveFromFavorites = async (id) => {
    if (!user) return;

    try {
      const favoriteDocRef = doc(db, "users", user.uid, "favorites", id);
      await deleteDoc(favoriteDocRef);

      // Update state to remove the deleted anime
      setFavorites(favorites.filter((fav) => fav.id !== id));
      alert("Removed from favorites!");
    } catch (error) {
      console.error("Error removing from favorites:", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!favorites.length) return <div>No favorites added yet!</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">My Favorites</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {favorites.map((anime) => (
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
              onClick={() => handleRemoveFromFavorites(anime.id)}
              className="bg-red-500 text-white py-1 px-4 rounded mt-2"
            >
              Remove from Favorites
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favorites;
