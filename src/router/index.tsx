import { createHashRouter, RouterProvider } from 'react-router-dom';
import Default from '../default';
import MainPage from '../pages/MainPage';

const router = createHashRouter([
  {
    element: <Default />,
    children: [
      {
        path: '/',
        element: <MainPage />,
      },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
