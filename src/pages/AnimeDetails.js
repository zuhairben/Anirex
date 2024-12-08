import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { doc, setDoc, collection, addDoc, getDocs, query, orderBy } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { db } from "../firebase";

const AnimeDetails = () => {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user] = useAuthState(auth);

  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [newRating, setNewRating] = useState("");
  const [averageRating, setAverageRating] = useState(0);
  const [showFullSynopsis, setShowFullSynopsis] = useState(false); // state to toggle synopsis

  // Fetch Anime Details
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

    fetchAnimeDetails();

    // Fetch existing reviews from Firestore
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

    fetchReviews();
  }, [id]);

  // Calculate the average rating
  const calculateAverageRating = (reviews) => {
    if (reviews.length === 0) {
      setAverageRating(0);
    } else {
      const totalRating = reviews.reduce((sum, review) => sum + parseFloat(review.rating), 0);
      setAverageRating((totalRating / reviews.length).toFixed(1));
    }
  };

  // Add a new review
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

      // Update UI after adding review
      setReviews((prev) => [newReviewData, ...prev]);
      setNewReview("");
      setNewRating("");
      calculateAverageRating([...reviews, newReviewData]);
    } catch (error) {
      console.error("Error adding review:", error);
    }
  };

  // Add to Favorites
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

  // Add to Watchlist
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

  // Handle "See More" / "See Less" toggle
  const toggleSynopsis = () => {
    setShowFullSynopsis((prev) => !prev);
  };

  if (loading) return <div>Loading...</div>;

  const shortSynopsis = anime.synopsis.length > 150 ? anime.synopsis.substring(0, 150) + "..." : anime.synopsis;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">{anime.title}</h1>
      <button
        onClick={handleAddToFavorites}
        className="bg-blue-500 text-white py-2 px-4 rounded mt-4 my-4"
      >
        Add to Favorites
      </button>

      <button
        onClick={handleAddToWatchlist}
        className="bg-blue-500 text-white py-2 px-4 rounded mt-4 my-4 mx-2"
      >
        Add to Watchlist
      </button>

      <img
        src={anime.images.jpg.image_url}
        alt={anime.title}
        className="w-full max-w-lg mx-auto rounded mb-4"
      />
      <p>
        {showFullSynopsis ? anime.synopsis : shortSynopsis}
        <button
          onClick={toggleSynopsis}
          className="text-blue-500 ml-2"
        >
          {showFullSynopsis ? "See Less" : "See More"}
        </button>
      </p>

      <div className="mt-4">
        <strong>Episodes:</strong> {anime.episodes || "N/A"}
      </div>
      <div className="mt-2">
        <strong>Rating:</strong> {anime.score || "N/A"}
      </div>
      <div className="mt-2">
        <strong>Genres:</strong>{" "}
        {anime.genres.map((genre) => genre.name).join(", ")}
      </div>

      {/* Reviews Section */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold">Reviews</h2>
        <p className="text-lg">Average Rating: {averageRating}/10</p>

        <form onSubmit={handleAddReview} className="mt-4">
          <textarea
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
            placeholder="Write your review..."
            className="border p-2 rounded w-full mt-2"
            rows="3"
          ></textarea>
          <input
            type="number"
            step="0.1" // Allows decimals
            value={newRating}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              if (value >= 1 && value <= 10) {
                setNewRating(e.target.value); // Update state only if within range
              } else if (!e.target.value) {
                setNewRating(""); // Allow clearing the input
              }
            }}
            placeholder="Rating (1-10, e.g., 8.5)"
            className="border p-2 rounded w-full mt-2"
          />

          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded mt-2"
          >
            Submit Review
          </button>
        </form>

        <ul className="mt-4">
          {reviews.map((review, index) => (
            <li key={index} className="border-b py-2">
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
  );
};

export default AnimeDetails;
