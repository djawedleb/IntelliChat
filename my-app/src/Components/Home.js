import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser, getGoogleAuthUrl } from "../Config/api";
import "../css/Home.css";
import { FaEye, FaEyeSlash, FaGoogle, FaRobot, FaUser, FaEnvelope, FaLock, FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";

export default function Home({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const resetFields = () => {
    setName("");
    setEmail("");
    setPassword("");
    setError("");
    setSuccess("");
    setShowPassword(false);
  };
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      if (isLogin) {
        const response = await loginUser({ email, password });
       if (onLogin) {
          onLogin(response.data.user);
        }
        toast.success("Login successful!");
        navigate("/chat");
      } else {
        const response = await registerUser({ name, email, password });
        toast.success("Registration successful! You can now log in.");
        setIsLogin(true);
        setName("");
        setPassword("");
      }
    } catch (err) {
      if (err.response) {
        switch (err.response.status) {
          case 400:
            toast.error("Invalid request. Please check your input.");
            break;
          case 401:
            toast.error("Incorrect email or password.");
            break;
          case 404:
            toast.error("User not found.");
            break;
          case 409:
            toast.error("User already exists.");
            break;
          default:
            toast.error(err.response.data.message || "An error occurred. Please try again.");
        }
      } else if (err.request) {
        toast.error("Network error. Please check your connection.");
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = getGoogleAuthUrl();
  };

  return (
    <div className="home-container">
      {/* Left side background */}
      <div className="left-panel">
        <div className="left-content">
          <FaRobot className="robot-icon" />
          <h1 className="left-title">
            Welcome to <span className="brand-highlight">IntelliChat</span>
          </h1>
          <p className="left-subtitle">
            Your intelligent AI assistant for seamless conversations and productivity
          </p>
        </div>
        {/* Decorative elements */}
        <div className="decorative-circle circle-1"></div>
        <div className="decorative-circle circle-2"></div>
        <div className="decorative-circle circle-3"></div>
      </div>
      {/* Right side form */}
      <div className="right-panel">
        <div className="form-container">
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-header">
              <h2 className="form-title">
                {isLogin ? "Welcome Back" : "Create Account"}
              </h2>
              <p className="form-subtitle">
                {isLogin
                  ? "Sign in to continue to IntelliChat"
                  : "Join IntelliChat and start chatting with AI"}
              </p>
            </div>

            {/* Test User Section - moved here */}
            {isLogin && (
              <div className="test-user-section">
                <h4 className="test-user-title">Test User</h4>
                <div className="test-user-info">
                  <p><strong>Email:</strong> Test@gmail.com</p>
                  <p><strong>Password:</strong> TestTest</p>
                </div>
                <p className="test-user-note">Use these credentials to test the application</p>
              </div>
            )}

            {!isLogin && (
              <div className="form-group">
                <label className="form-label">
                  <FaUser className="input-icon" />
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">
                <FaEnvelope className="input-icon" />
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <FaLock className="input-icon" />
                Password
              </label>
              <div className="password-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input password-input"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="primary-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <FaSpinner className="loading-spinner" />
                  {isLogin ? "Signing In..." : "Creating Account..."}
                </>
              ) : (
                isLogin ? "Sign In" : "Create Account"
              )}
            </button>

            <div className="divider">
              <div className="divider-line"></div>
              <span className="divider-text">or</span>
              <div className="divider-line"></div>
            </div>

            <button
              type="button"
              className="google-button"
              onClick={handleGoogleLogin}
            >
              <FaGoogle className="google-icon" />
              Continue with Google
            </button>

            <div className="form-footer">
              <p className="form-footer-text">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                  type="button"
                  className="form-footer-link"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    resetFields();
                  }}
                >
                  {isLogin ? "Sign Up" : "Sign In"}
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
