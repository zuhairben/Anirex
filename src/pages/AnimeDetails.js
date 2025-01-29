import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { doc, setDoc, collection, addDoc, getDocs, query, orderBy } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { db } from "../firebase";
import { Bookmark, Star, Heart } from "lucide-react"; // Icons for buttons

const AnimeDetails = () => {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user] = useAuthState(auth);

  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [newRating, setNewRating] = useState("");
  const [averageRating, setAverageRating] = useState(0);
  const [showFullSynopsis, setShowFullSynopsis] = useState(false);

  useEffect(() => {
    const fetchAnimeDetails = async () => {
      try {
        const response = await axios.get(`https://api.jikan.moe/v4/anime/${id}`);
        setAnime(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching anime details:", error);
      }
    };

    const fetchReviews = async () => {
      try {
        const reviewsRef = collection(db, `anime/${id}/reviews`);
        const reviewsQuery = query(reviewsRef, orderBy("date", "desc"));
        const reviewSnapshots = await getDocs(reviewsQuery);
        const reviewsData = reviewSnapshots.docs.map((doc) => doc.data());
        setReviews(reviewsData);
        calculateAverageRating(reviewsData);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchAnimeDetails();
    fetchReviews();
  }, [id]);

  const calculateAverageRating = (reviews) => {
    if (reviews.length === 0) {
      setAverageRating(0);
    } else {
      const totalRating = reviews.reduce((sum, review) => sum + parseFloat(review.rating), 0);
      setAverageRating((totalRating / reviews.length).toFixed(1));
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!newRating || !newReview) {
      alert("Please provide both a rating and a review.");
      return;
    }

    if (!user) {
      alert("You must be logged in to leave a review!");
      return;
    }

    try {
      const reviewsRef = collection(db, `anime/${id}/reviews`);
      const newReviewData = {
        text: newReview,
        rating: parseFloat(newRating),
        date: new Date().toISOString(),
        userId: user.uid,
        userName: user.displayName || "Anonymous",
      };

      await addDoc(reviewsRef, newReviewData);

      setReviews((prev) => [newReviewData, ...prev]);
      setNewReview("");
      setNewRating("");
      calculateAverageRating([...reviews, newReviewData]);
    } catch (error) {
      console.error("Error adding review:", error);
    }
  };

  const handleAddToFavorites = async () => {
    if (!user) {
      alert("You must be logged in to add favorites!");
      return;
    }

    try {
      const userFavoritesRef = doc(db, `users/${user.uid}/favorites/${anime.mal_id}`);
      await setDoc(userFavoritesRef, {
        title: anime.title,
        image: anime.images.jpg.image_url,
        mal_id: anime.mal_id,
        synopsis: anime.synopsis,
      });
      alert("Added to favorites!");
    } catch (error) {
      console.error("Error adding to favorites:", error);
    }
  };

  const handleAddToWatchlist = async () => {
    if (!user) {
      alert("You must be logged in to add to the watchlist!");
      return;
    }

    try {
      const userWatchlistRef = doc(db, `users/${user.uid}/watchlist/${anime.mal_id}`);
      await setDoc(userWatchlistRef, {
        title: anime.title,
        image: anime.images.jpg.image_url,
        mal_id: anime.mal_id,
        synopsis: anime.synopsis,
      });
      alert("Added to watchlist!");
    } catch (error) {
      console.error("Error adding to watchlist:", error);
    }
  };

  const toggleSynopsis = () => {
    setShowFullSynopsis((prev) => !prev);
  };

  if (loading) return <div className="text-center text-white">Loading...</div>;

  const shortSynopsis = anime.synopsis.length > 150 ? anime.synopsis.substring(0, 150) + "..." : anime.synopsis;

  return (
    <div className="bg-gradient-to-br from-gray-800 to-black min-h-screen text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center mb-6">
          <h1 className="text-4xl font-bold text-pink-500">{anime.title}</h1>
          <img
            src={anime.images.jpg.image_url}
            alt={anime.title}
            className="w-64 h-96 object-cover rounded-lg shadow-lg mt-4"
          />
          <div className="flex space-x-4 mt-4">
            <button
              onClick={handleAddToFavorites}
              className="bg-pink-500 hover:bg-pink-600 text-white flex items-center px-4 py-2 rounded-lg shadow-lg"
            >
              <Heart className="w-5 h-5 mr-2" />
              Add to Favorites
            </button>
            <button
              onClick={handleAddToWatchlist}
              className="bg-blue-500 hover:bg-blue-600 text-white flex items-center px-4 py-2 rounded-lg shadow-lg"
            >
              <Bookmark className="w-5 h-5 mr-2" />
              Add to Watchlist
            </button>
          </div>
        </div>

        <p className="text-center text-lg">
          {showFullSynopsis ? anime.synopsis : shortSynopsis}
          <button
            onClick={toggleSynopsis}
            className="text-blue-400 hover:underline ml-2"
          >
            {showFullSynopsis ? "See Less" : "See More"}
          </button>
        </p>

        <div className="mt-6 space-y-2 text-lg">
          <p>
            <strong>Episodes:</strong> {anime.episodes || "N/A"}
          </p>
          <p>
            <strong>Rating:</strong> {anime.score || "N/A"}
          </p>
          <p>
            <strong>Genres:</strong>{" "}
            {anime.genres.map((genre) => genre.name).join(", ")}
          </p>
        </div>

        {/* Reviews Section */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-pink-500">Reviews</h2>
          <p className="text-lg mt-2">Average Rating: {averageRating}/10</p>

          <form onSubmit={handleAddReview} className="mt-6">
            <textarea
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              placeholder="Write your review..."
              className="w-full p-4 rounded-lg border border-gray-700 bg-gray-900 text-white"
              rows="4"
            ></textarea>
            <input
              type="number"
              step="0.1"
              value={newRating}
              onChange={(e) => setNewRating(e.target.value)}
              placeholder="Rating (1-10)"
              className="w-full p-2 mt-4 rounded-lg border border-gray-700 bg-gray-900 text-white"
            />
            <button
              type="submit"
              className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-lg shadow-lg mt-4"
            >
              Submit Review
            </button>
          </form>

          <ul className="mt-6 space-y-4">
            {reviews.map((review, index) => (
              <li key={index} className="bg-gray-900 p-4 rounded-lg shadow-lg">
                <p>
                  <strong>{review.userName}:</strong> {review.text}
                </p>
                <p>
                  <strong>Rating:</strong> {review.rating}/10
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(review.date).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AnimeDetails;
