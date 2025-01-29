import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { Link } from "react-router-dom";
import { Edit, LogOut, Star, Bookmark } from "lucide-react";

const UserProfile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);

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
    return <div className="text-center text-white">Loading...</div>;
  }

  return (
    <div className="bg-gradient-to-br from-gray-800 to-black min-h-screen text-white flex flex-col items-center p-6">
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md text-center">
        <h2 className="text-3xl font-bold text-pink-500 mb-4">Profile</h2>
        <p className="text-lg mb-4"><strong>Email:</strong> {auth.currentUser?.email}</p>

        <div className="mb-4">
          <strong>Name:</strong> {isEditing ? (
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
              className="w-full p-2 mt-2 bg-gray-800 text-white rounded border border-gray-700" />
          ) : (<span>{userData.name || "No Name Set"}</span>)}
        </div>

        <div className="mb-4">
          <strong>Bio:</strong> {isEditing ? (
            <textarea value={bio} onChange={(e) => setBio(e.target.value)}
              className="w-full p-2 mt-2 bg-gray-800 text-white rounded border border-gray-700" rows="3"></textarea>
          ) : (<span>{userData.bio || "No Bio Set"}</span>)}
        </div>

        {isEditing ? (
          <button onClick={handleSave}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg shadow-lg flex justify-center items-center">
            Save
          </button>
        ) : (
          <button onClick={() => setIsEditing(true)}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg shadow-lg flex justify-center items-center">
            <Edit className="w-5 h-5 mr-2" /> Edit Profile
          </button>
        )}

        <Link to="/favorites">
          <button className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-lg shadow-lg flex justify-center items-center mt-4">
            <Star className="w-5 h-5 mr-2" /> Favorites
          </button>
        </Link>

        <Link to="/watchlist">
          <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg shadow-lg flex justify-center items-center mt-4">
            <Bookmark className="w-5 h-5 mr-2" /> Watchlist
          </button>
        </Link>

        <button onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg shadow-lg flex justify-center items-center mt-4">
          <LogOut className="w-5 h-5 mr-2" /> Logout
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
