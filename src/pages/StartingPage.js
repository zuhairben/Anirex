import React from "react";
import '../styles/StartingPage.css'

const Home = () => {
  return (
    <div className="home-container">
      <div className="overlay"></div>
      <div className="content">
        <h1 className="title">Jump into the Anime World</h1>
        <p className="subtitle">Explore, track, and rate your favorite anime</p>
      </div>
    </div>
  );
};

export default Home;
