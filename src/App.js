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
import CategoryPage from './pages/CategoryPage';
import StartingPage from './pages/StartingPage'

function App() {
  return (
    <>
    <Header/>
    <Routes>
      <Route path='/' element={<StartingPage/>}/>
      <Route path='/home' element={<ProtectedRoute>
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
        <Route path="/trending" element={<CategoryPage category="trending"/>} />
        <Route path="/popular" element={<CategoryPage category="popular" />} />
        <Route path="/upcoming" element={<CategoryPage category="upcoming" />} />
        <Route path="/alltime" element={<CategoryPage category="allTime" />} />
    </Routes>
    </>
  );
}

export default App;
