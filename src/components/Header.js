import React from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { motion } from "framer-motion";

const Header = () => {
  const [user] = useAuthState(auth);

  return (
    <header className="bg-gray-900 text-white p-4 shadow-md">
      <nav className="flex justify-between items-center max-w-5xl mx-auto">
        {/* Animated Logo with Custom Anime Font */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold tracking-wide text-pink-500"
          style={{ fontFamily: '"Press Start 2P", cursive' }} // Retro anime-style font
        >
          <Link to="/">AniRex</Link>
        </motion.h1>

        <div className="space-x-4 flex">
          {user ? (
            <>
              <AnimatedLink to="/">Home</AnimatedLink>
              <AnimatedLink to="/profile">Profile</AnimatedLink>
            </>
          ) : (
            <>
              <AnimatedLink to="/login">Login</AnimatedLink>
              <AnimatedLink to="/signup">Sign Up</AnimatedLink>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

// Animated Button Component
const AnimatedLink = ({ to, children }) => (
  <motion.div
    whileHover={{ scale: 1.1, y: -2 }}
    whileTap={{ scale: 0.9 }}
    className="relative"
  >
    <Link
      to={to}
      className="text-white text-lg font-semibold px-4 py-1 rounded transition duration-300 hover:text-pink-400"
    >
      {children}
    </Link>
    <motion.div
      className="absolute bottom-0 left-0 w-full h-0.5 bg-pink-400 scale-x-0 origin-left transition-transform duration-300"
      whileHover={{ scaleX: 1 }}
    />
  </motion.div>
);

export default Header;
