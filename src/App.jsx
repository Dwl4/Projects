import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LawmatePage from './components/LawmatePage';
import LoginPage from './components/LoginPage';
import EmailLoginPage from './components/EmailLoginPage';
import SignupPage from './components/SignupPage';
import LawyerSignupPage from './components/LawyerSignupPage';
import CommunityPostDetail from './components/CommunityPostDetail';
import LawyerLoginPage from './components/LawyerLoginPage';
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LawmatePage />} />
          <Route path="/case-law" element={<LawmatePage />} />
          <Route path="/community" element={<LawmatePage />} />
          <Route path="/community-post" element={<LawmatePage />} />
          <Route path="/notice" element={<LawmatePage />} />
          <Route path="/dictionary" element={<LawmatePage />} />
          <Route path="/dictionary/:term" element={<LawmatePage />} />
          <Route path="/profile" element={<LawmatePage />} />
          <Route path="/search-results" element={<LawmatePage />} />
          <Route path="/lawyer-list" element={<LawmatePage />} />
          <Route path="/lawyer-profile" element={<LawmatePage />} />
          <Route path="/lawyer-profile/:id" element={<LawmatePage />} />
          <Route path="/lawyer-profile-edit" element={<LawmatePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/email-login" element={<EmailLoginPage />} />
          <Route path="/lawyer-login" element={<LawyerLoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/lawyer-signup" element={<LawyerSignupPage />} />
          <Route path="/community/post/:id" element={<CommunityPostDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
