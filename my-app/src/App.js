import Chat from "./Components/Chat";
import Home from "./Components/Home";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState, useEffect } from "react";
import { getProfile } from "./Config/api";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated on app load
    const checkAuth = async () => {
      try {
        const response = await getProfile();
        if (response.data.user) {
          setUser(response.data.user);
        }
      } catch (error) {
        console.log("User not authenticated");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleUserUpdate = (updatedUser) => {
    setUser(updatedUser);
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home onLogin={handleLogin} />} />
          <Route path="/chat" element={<Chat user={user} onLogout={handleLogout} onUserUpdate={handleUserUpdate} />} />
        </Routes>
      </Router>
      <ToastContainer autoClose={1000} />
    </>
  );
}

export default App;
