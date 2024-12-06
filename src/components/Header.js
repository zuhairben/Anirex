import React from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const Header = ({toggleDarkMode, isDarkMode}) => {
  const [user] = useAuthState(auth);

  return (
    <header className="bg-gray-800 text-white p-4">
      <nav className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          <Link to="/">AniRex</Link>
        </h1>
        <div className="space-x-4">
          {user ? (
            <>
              <Link to="/" className="hover:underline">Home</Link>
              <Link to="/profile" className="hover:underline">Profile</Link>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:underline">Login</Link>
              <Link to="/signup" className="hover:underline">Sign Up</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
