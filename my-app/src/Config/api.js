import axios from "axios";

const Api = axios.create({
    baseURL: process.env.REACT_APP_BACK_URL || "http://localhost:5000",
    withCredentials: true
});

//Auth
export const registerUser = (data) => { return Api.post('/api/register' , data); };
export const loginUser = (data) => { return Api.post("/api/login" , data); };
export const logoutUser = () => { return Api.post("/api/logout"); };
export const getAuthStatus = () => { return Api.get("/api/auth"); };
export const getProfile = () => { return Api.get("/api/profile"); };

//User Management
export const updateUser = (id, data) => { return Api.put(`/api/update/${id}`, data); };
export const deleteUser = (id) => { return Api.delete(`/api/delete/${id}`); };

//Chat
export const sendChat = (messages) => { return Api.post("/chat", { messages }); };

//Chat with Image Upload
export const sendChatWithImage = (messages, imageFile) => {
    const formData = new FormData();
    formData.append('messages', JSON.stringify(messages));
    if (imageFile) {
        formData.append('image', imageFile);
    }
    return Api.post("/chat", formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    });
};

//GoogleAuth
export const getGoogleAuthUrl = () => {
  const base = Api.defaults.baseURL?.replace(/\/$/, "");
  return `${base}/api/auth/google`;
};
