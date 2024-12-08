import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase"; // Firebase for authentication and database
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { Link } from "react-router-dom";

const UserProfile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch user data from Firestore or create default profile if none exists
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!auth.currentUser) {
          setLoading(false);
          return;
        }

        const userDocRef = doc(db, "users", auth.currentUser.uid);
        const userSnapshot = await getDoc(userDocRef);

        if (userSnapshot.exists()) {
          const data = userSnapshot.data();
          setUserData(data);
          setName(data.name || "");
          setBio(data.bio || "");
          setPhone(data.phone || "");
        } else {
          console.log("No profile found, creating a default profile...");
          await setDoc(userDocRef, {
            name: "Default Name",
            email: auth.currentUser.email,
            createdAt: new Date(),
          });
          setUserData({ name: "Default Name", email: auth.currentUser.email });
          setName("Default Name");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        alert("Failed to load profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSave = async () => {
    try {
      if (!auth.currentUser) return;

      const userDocRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userDocRef, { name, bio, phone });

      setUserData((prevData) => ({ ...prevData, name, bio, phone }));
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        alert("Logout successful!");
        navigate("/login");
      })
      .catch((error) => {
        console.error("Logout error:", error);
      });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-gray-600 text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-2xl font-bold mb-4">Profile</h2>

        {/* Display Email */}
        <p className="mb-4">
          <strong>Email:</strong> {auth.currentUser?.email}
        </p>

        {/* Display Name with Edit/Save functionality */}
        <div className="mb-4">
          <strong>Name:</strong>{" "}
          {isEditing ? (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-2 rounded w-full mt-2"
            />
          ) : (
            <span>{userData.name || "No Name Set"}</span>
          )}
        </div>

        {/* Bio Field */}
        <div className="mb-4">
          <strong>Bio:</strong>{" "}
          {isEditing ? (
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="border p-2 rounded w-full mt-2"
              rows="3"
            />
          ) : (
            <span>{userData.bio || "No Bio Set"}</span>
          )}
        </div>

        {isEditing ? (
          <button
            onClick={handleSave}
            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 mb-2"
          >
            Save
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 mb-2"
          >
            Edit Profile
          </button>
        )}

        {/* Navigate to Favorites */}
        <Link to="/favorites">
          <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 my-2">
            Favorites
          </button>
        </Link>

        <Link to="/watchlist">
          <button className="w-full bg-orange-500 text-white py-2 rounded hover:bg-blue-600 my-2">
            WatchList
          </button>
        </Link>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 my-2"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
