import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { UserContextProvider } from "./UserContext";
import HomePage from "./Pages/HomePage";
import LoginPage from "./Pages/LoginPage";
import RegistrationPage from "./Pages/RegistrationPage";
import BlogPage from "./Pages/MyBlogPage";
import CreatePostPage from "./Pages/CreateBlogPage";
import Header from "./Header"; // Import Header
import IndexPage from "./Pages/indexpage"; // Import IndexPage
import BlogDetailPage from "./Pages/BlogDetailPage";
import ViewProfile from "./Pages/ViewProfile";
import SubscriptionPage from "./Pages/SubscriptionPage";

function App() {
  const [posts, setPosts] = useState([]);

  // Fetch posts from the backend when the component mounts
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/posts`)
      .then((response) => response.json())
      .then((data) => setPosts(data))
      .catch((err) => console.error("Error fetching posts:", err));
  }, []);

  return (
    <UserContextProvider>
      <Router>
        <Routes>
          <Route path="/" element={<IndexPage />} />  {/* Entry point */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/blogs" element={<BlogPage />} />
          <Route path="/create-blog" element={<CreatePostPage />} />
          <Route path="/blog/:id" element={<BlogDetailPage />} />
          <Route path="/profile" element={<ViewProfile />} />
          <Route path="/Subscription" element={<SubscriptionPage />} />
          {/* Header is only displayed after login */}
          <Route
            path="/home"
            element={
              <>
              
                <HomePage />
              </>
            }
          />
          <Route
            path="/blogs"
            element={
              <>
                <Header />
                <BlogPage posts={posts} setPosts={setPosts} />
              </>
            }
          />
          <Route
            path="/create-blog"
            element={
              <>
                <Header />
                <CreatePostPage setPosts={setPosts} />
              </>
            }
          />
        </Routes>
      </Router>
    </UserContextProvider>
  );
}

export default App;