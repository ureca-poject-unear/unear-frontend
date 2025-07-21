import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Default from '../default';
import MainPage from '@/pages/MainPage';
import MapPage from '@/pages/MapPage';
import StoryPage from '@/pages/StoryPage';
import JuniorPage from '@/pages/JuniorPage';
import MyPage from '@/pages/MyPage';
import LoginPage from '@/pages/LoginPage';
import SignUpPage from '@/pages/SignUpPage';

const router = createBrowserRouter([
  {
    element: <Default />,
    children: [
      { path: '/', element: <MainPage /> },
      { path: '/map', element: <MapPage /> },
      { path: '/story', element: <StoryPage /> },
      { path: '/junior', element: <JuniorPage /> },
      { path: '/my', element: <MyPage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/signup', element: <SignUpPage /> },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
