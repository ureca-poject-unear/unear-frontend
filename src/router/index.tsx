import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Default from '../default';
import MainPage from '@/pages/MainPage';
import MapPage from '@/pages/MapPage';
import StoryPage from '@/pages/StoryPage';
import JuniorPage from '@/pages/JuniorPage';
import MyPage from '@/pages/MyPage';

const router = createBrowserRouter([
  {
    element: <Default />,
    children: [
      { path: '/', element: <MainPage /> },
      { path: '/map', element: <MapPage /> },
      { path: '/story', element: <StoryPage /> },
      { path: '/junior', element: <JuniorPage /> },
      { path: '/my', element: <MyPage /> },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
