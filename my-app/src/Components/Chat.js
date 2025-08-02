import React, { useState, useEffect, useRef } from "react";
import { sendChat, sendChatWithImage, updateUser, deleteUser, logoutUser } from "../Config/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { 
    FiPlus, 
    FiSettings, 
    FiLogOut, 
    FiTrash2, 
    FiSave, 
    FiX, 
    FiChevronDown,
    FiClock,
    FiSend,
    FiImage,
    FiMenu
} from "react-icons/fi";
import { FaRobot } from "react-icons/fa";
import "../css/Chat.css";

export default function Chat({ user, onLogout, onUserUpdate }) {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [input, setInput] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || ''
    });
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    // Redirect if user is not authenticated
    useEffect(() => {
        if (!user) {
            navigate('/');
        }
    }, [user, navigate]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Close profile dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            const profileSection = document.querySelector('.user-profile-section');
            if (profileSection && !profileSection.contains(event.target)) {
                setShowProfileMenu(false);
            }
        };

        if (showProfileMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showProfileMenu]);

    // Close sidebar when clicking outside on mobile
    useEffect(() => {
        const handleClickOutside = (event) => {
            const sidebar = document.querySelector('.chat-sidebar');
            const menuBtn = document.querySelector('.menu-toggle-btn');
            
            if (sidebarOpen && sidebar && !sidebar.contains(event.target) && !menuBtn?.contains(event.target)) {
                setSidebarOpen(false);
            }
        };

        if (sidebarOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [sidebarOpen]);

    // Update profile data when user changes
    useEffect(() => {
        setProfileData({
            name: user?.name || '',
            email: user?.email || ''
        });
    }, [user]);

    const validateImage = (file) => {
        const maxSize = 10 * 1024 * 1024; // 10MB
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        
        if (!allowedTypes.includes(file.type)) {
            toast.error("Please select a valid image file (JPEG, PNG, GIF, WebP)");
            return false;
        }
        
        if (file.size > maxSize) {
            toast.error("File too large. Maximum size is 10MB.");
            return false;
        }
        
        return true;
    };

    const handleImageSelect = (event) => {
        const file = event.target.files[0];
        if (file && validateImage(file)) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onload = (e) => setImagePreview(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const clearImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim() && !selectedImage) return;
        
        const newMessages = [...messages, { role: "user", content: input }];
        setIsLoading(true);
        
        try {
            let response;
            if (selectedImage) {
                response = await sendChatWithImage(newMessages, selectedImage);
                // Add image URL to the user message for display
                const updatedMessages = [...newMessages];
                updatedMessages[updatedMessages.length - 1] = {
                    ...updatedMessages[updatedMessages.length - 1],
                    imageUrl: response.data.imageUrl
                };
                setMessages([...updatedMessages, { role: "assistant", content: response.data.reply }]);
            } else {
                response = await sendChat(newMessages);
                setMessages([...newMessages, { role: "assistant", content: response.data.reply }]);
            }
            
            setInput('');
            clearImage();
        } catch (error) {
            console.error("Error:", error);
            toast.error("Failed to send message. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await logoutUser();
            if (onLogout) {
                onLogout();
            }
            navigate('/');
            toast.success("Logged out successfully!");
        } catch (error) {
            console.error("Logout error:", error);
            toast.error("Logout failed. Please try again.");
        }
    };

    const handleUpdateProfile = async () => {
        try {
            const response = await updateUser(user._id, profileData);
            if (response && response.data) {
                toast.success("Profile updated successfully!");
                setIsEditingProfile(false);
                // Update the user data in parent component
                if (onUserUpdate) {
                    onUserUpdate({
                        ...user,
                        name: profileData.name,
                        email: profileData.email
                    });
                }
            }
        } catch (error) {
            console.error("Update error:", error);
            toast.error("Failed to update profile. Please try again.");
        }
    };

    const handleDeleteAccount = async () => {
        if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
            try {
                await deleteUser(user._id);
                toast.success("Account deleted successfully!");
                if (onLogout) {
                    onLogout();
                }
                navigate('/');
            } catch (error) {
                console.error("Delete error:", error);
                toast.error("Failed to delete account. Please try again.");
            }
        }
    };

    const startNewChat = () => {
        setMessages([]);
        setInput('');
        clearImage();
        toast.success("New chat started!");
    };

    return (
        <div className="chat-container">
            {/* Sidebar */}
            <div className={`chat-sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <h2 className="sidebar-title">IntelliChat</h2>
                    <button className="new-chat-btn" onClick={startNewChat}>
                        New Chat
                    </button>
                </div>
                
                {/* History Section */}
                <div className="history-section">
                    <h3 className="history-title">History</h3>
                    <div className="coming-soon-container">
                        <FiClock className="coming-soon-icon" />
                        <div className="coming-soon-text">Coming Soon</div>
                        <div className="coming-soon-description">Chat history will be available soon</div>
                    </div>
                </div>
                
                {/* User Profile Section */}
                <div className="user-profile-section">
                    <div className={`user-info ${showProfileMenu ? 'active' : ''}`} onClick={() => {
                        console.log('Profile clicked, current state:', showProfileMenu);
                        setShowProfileMenu(!showProfileMenu);
                    }}>
                        <div className="user-avatar">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="user-details">
                            <span className="user-name">{user?.name}</span>
                            <span className="user-email">{user?.email}</span>
                        </div>
                        <FiChevronDown className={`dropdown-arrow ${showProfileMenu ? 'rotated' : ''}`} />
                    </div>
                    
                    {/* Profile Dropdown Menu */}
                    {showProfileMenu && (
                        <div className="profile-dropdown">
                            <div className="profile-header">
                                <div className="profile-avatar">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </div>
                                <div className="profile-details">
                                    <h4>{user?.name }</h4>
                                    <p>{user?.email}</p>
                                </div>
                            </div>
                            
                            <div className="profile-actions">
                                <button 
                                    className="profile-action-btn"
                                    onClick={() => setIsEditingProfile(true)}
                                >
                                    <FiSettings className="action-icon" />
                                    Edit Profile
                                </button>
                                <button 
                                    className="profile-action-btn"
                                    onClick={handleLogout}
                                >
                                    <FiLogOut className="action-icon" />
                                    Logout
                                </button>
                                <button 
                                    className="profile-action-btn delete"
                                    onClick={handleDeleteAccount}
                                >
                                    <FiTrash2 className="action-icon" />
                                    Delete Account
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="chat-main">
                {/* Header */}
                <div className="chat-header">
                    <div className="header-left">
                        <button 
                            className="menu-toggle-btn"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                        >
                            <FiMenu />
                        </button>
                        <h1 className="chat-title">IntelliChat</h1>
                        <p className="chat-subtitle">AI Assistant</p>
                    </div>
                </div>
                
                {/* Profile Edit Modal */}
                {isEditingProfile && (
                    <div className="profile-modal-overlay" onClick={() => setIsEditingProfile(false)}>
                        <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
                            <h3>Edit Profile</h3>
                            <div className="form-group">
                                <label>Name:</label>
                                <input
                                    type="text"
                                    value={profileData.name}
                                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                                    className="profile-input"
                                />
                            </div>
                            <div className="form-group">
                                <label>Email:</label>
                                <input
                                    type="email"
                                    value={profileData.email}
                                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                                    className="profile-input"
                                />
                            </div>
                            <div className="modal-actions">
                                <button 
                                    className="btn-secondary"
                                    onClick={() => setIsEditingProfile(false)}
                                >
                                    Cancel
                                </button>
                                <button 
                                    className="btn-primary"
                                    onClick={handleUpdateProfile}
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Messages Container */}
                <div className="messages-container">
                    {messages.length === 0 && (
                        <div className="welcome-message">
                            <FaRobot className="welcome-icon" />
                            <h3 className="welcome-title">Welcome to IntelliChat!</h3>
                            <p className="welcome-text">Start a conversation with your AI assistant.</p>
                        </div>
                    )}
                    
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`message ${msg.role}`}
                        >
                            <div className={`message-bubble ${msg.role}`}>
                                <div 
                                    className="message-content"
                                    style={{ 
                                        whiteSpace: 'pre-wrap',
                                        wordWrap: 'break-word'
                                    }}
                                >
                                    {msg.content}
                                </div>
                                {msg.imageUrl && (
                                    <img 
                                        src={msg.imageUrl} 
                                        alt="Chat image" 
                                        className="message-image"
                                    />
                                )}
                            </div>
                        </div>
                    ))}
                    
                    {isLoading && (
                        <div className="typing-indicator">
                            <div className="typing-bubble">
                                <div className="typing-content">
                                    <div className="typing-dots">
                                        <div className="typing-dot"></div>
                                        <div className="typing-dot"></div>
                                        <div className="typing-dot"></div>
                                    </div>
                                    <span className="typing-text">Assistant is typing...</span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Image Preview */}
                {imagePreview && (
                    <div className="image-preview-container">
                        <div className="image-preview">
                            <img src={imagePreview} alt="Preview" />
                            <button 
                                className="remove-image-btn"
                                onClick={clearImage}
                            >
                                <FiX />
                            </button>
                        </div>
                    </div>
                )}
                
                {/* Input Form */}
                <form className="chat-form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        disabled={isLoading}
                        autoFocus
                        className="chat-input"
                    />
                    
                    {/* Image Upload Button */}
                    <label className="image-upload-btn" title="Upload Image">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageSelect}
                            style={{ display: 'none' }}
                        />
                        <FiImage />
                    </label>
                    
                    <button
                        type="submit"
                        disabled={isLoading || (!input.trim() && !selectedImage)}
                        className="send-button"
                        style={{ minWidth: '80px', flexShrink: 0 }}
                    >
                        {isLoading ? (
                            <>
                                <span className="send-spinner"></span>
                                Sending...
                            </>
                        ) : (
                            <>
                                <FiSend className="btn-icon" />
                                Send
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}