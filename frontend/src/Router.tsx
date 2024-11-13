import React, { ReactNode } from 'react';
import { useLocation, Navigate, Routes, Route, BrowserRouter } from 'react-router-dom';
import { Home } from './pages/Home';
import { ManageAttendees } from './pages/ManageAttendees';
import { EventSettings } from './pages/EventSettings';
import { ManageAdmin } from './pages/ManageAdmin';
import { Login } from './pages/Login';
import { AttendeePage } from './pages/AttendeePage';

interface PrivateRouteProps {
  element: ReactNode;
}

function PrivateRoute({ element }: PrivateRouteProps) {
  const token = localStorage.getItem('token'); // Retrieve the token from localStorage
  const location = useLocation();

  if (!token) {
    // If no token is found, redirect to login
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} />;
  }

  return <>{element}</>;
}

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='manage-attendees' element={<PrivateRoute element={<ManageAttendees />} />} />
        <Route path='event-settings' element={<PrivateRoute element={<EventSettings />} />} />
        <Route path='manage-admin' element={<PrivateRoute element={<ManageAdmin />} />} />
        <Route path='login' element={<Login />} />
        <Route path='attendee/:id' element={<PrivateRoute element={<AttendeePage />} />} />
      </Routes>
    </BrowserRouter>
  );
}