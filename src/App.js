import { Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import UserProfile from './pages/UserProfile';
import Signup from './components/Signup';
import AnimeDetails from './pages/AnimeDetails';
import Favorites from './pages/Favorites';
import Watchlist from './pages/WatchList';

function App() {
  return (
    <>
    <Header/>
    <Routes>
      <Route path='/' element={<ProtectedRoute>
      <Home />
    </ProtectedRoute>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path="/signup" element={<Signup />} />
      <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route path="/anime/:id" element={<AnimeDetails />} />
        <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
        <Route path="/watchlist" element={<ProtectedRoute><Watchlist /></ProtectedRoute>} />
    </Routes>
    </>
  );
}

export default App;
