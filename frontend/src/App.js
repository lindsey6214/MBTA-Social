import React, { createContext, useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import './css/card.css';
import './index.css';


import Navbar from "./components/pages/navbar";
import LandingPage from "./components/pages/landingPage";
import HomePage from "./components/pages/homePage";
import Login from "./components/pages/loginPage";
import Signup from "./components/pages/registerPage";
import PrivateUserProfile from "./components/pages/privateUserProfilePage";
import ExplorePage from "./components/pages/explorePage";
import NotificationsPage from "./components/pages/notificationsPage";
import MessagesPage from "./components/pages/messagesPage";
import BookmarksPage from "./components/pages/bookmarksPage";
import getUserInfo from "./utilities/decodeJwt";



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
          <Route path="/privateUserProfile" element={<PrivateUserProfile />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/bookmarks" element={<BookmarksPage />} />
        </Routes>
      </UserContext.Provider>
    </>
  );
};

export default App;
