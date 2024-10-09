import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { ManageAttendees } from './pages/ManageAttendees';
import { EventSettings } from './pages/EventSettings';
import { ManageAdmin } from './pages/ManageAdmin';
import { Login } from './pages/Login';
import { AttendeePage } from './pages/AttendeePage';
import { ReactElement } from 'react';

interface PrivateRouteProps {
  element: ReactElement;
}

function PrivateRoute({ element }: PrivateRouteProps) {
  const userString = sessionStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;
  return user ? element : <Navigate to="/login" />;
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <PrivateRoute element={<Home />} />,
  },
  {
    path: '/manage-attendees',
    element: <PrivateRoute element={<ManageAttendees />} />,
  },
  {
    path: '/event-settings',
    element: <PrivateRoute element={<EventSettings />} />,
  },
  {
    path: '/manage-admin',
    element: <PrivateRoute element={<ManageAdmin />} />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/attendee/:id',
    element: <PrivateRoute element={<AttendeePage />} />,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
