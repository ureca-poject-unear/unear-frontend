import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Default from '../default';
import MainPage from '@/pages/MainPage';
import MapPage from '@/pages/MapPage';
import StoryPage from '@/pages/StoryPage';
import StoryDiagnosisPage from '@/pages/StoryDiagnosisPage';
import StoryRecommendPage from '@/pages/StoryRecommendPage';
import JuniorPage from '@/pages/JuniorPage';
import MyPage from '@/pages/MyPage';
import LoginPage from '@/pages/LoginPage';
import SignUpPage from '@/pages/SignUpPage';
import KakaoRedirectHandler from '@/pages/auth/KakaoRedirectHandler';
import CompleteProfilePage from '@/pages/CompleteProfilePage';
import GoogleRedirectHandler from '@/pages/auth/GoogleRedirectHandler';

const router = createBrowserRouter([
  {
    element: <Default />,
    children: [
      { path: '/', element: <MainPage /> },
      { path: '/map', element: <MapPage /> },
      { path: '/story', element: <StoryPage /> },
      { path: '/story/diagnosis', element: <StoryDiagnosisPage /> },
      { path: '/story/recommend', element: <StoryRecommendPage /> },
      { path: '/junior', element: <JuniorPage /> },
      { path: '/my', element: <MyPage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/signup', element: <SignUpPage /> },
      { path: '/login/oauth2/code/kakao', element: <KakaoRedirectHandler /> },
      { path: '/complete-profile', element: <CompleteProfilePage /> },
      { path: '/login/oauth2/code/google', element: <GoogleRedirectHandler /> },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
