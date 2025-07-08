// App.jsx
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login.jsx';
import Profile from './components/Profile.jsx';
import ErrorPage from './components/ErrorPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

function App() {
  return (
     <HashRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </HashRouter>
  );
}
export default App;
