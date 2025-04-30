import React, { createContext, useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import './index.css';


import Navbar from "./components/pages/navbar";
import LandingPage from "./components/pages/landingPage";
import HomePage from "./components/pages/homePage";
import Login from "./components/pages/loginPage";
import Signup from "./components/pages/registerPage";
import UserProfile from "./components/pages/userProfilePage";
import ExplorePage from "./components/pages/explorePage";
import NotificationsPage from "./components/pages/notificationsPage";
import MessagesPage from "./components/pages/messagesPage";
import BookmarksPage from "./components/pages/bookmarksPage";
import getUserInfo from "./utilities/decodeJwt";
import PostDetailsPage from "./components/pages/postDetailsPage";



export const UserContext = createContext();

const App = () => {
  const [user, setUser] = useState();

  useEffect(() => {
    setUser(getUserInfo());
  }, []);

  return (
    <>
      <Navbar />
      <UserContext.Provider value={user}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/bookmarks" element={<BookmarksPage />} />
          <Route path="/post/:postID" element={<PostDetailsPage />} />
        </Routes>
      </UserContext.Provider>
    </>
  );
};

export default App;