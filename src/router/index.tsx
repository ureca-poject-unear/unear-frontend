import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Default from '../default';
import MainPage from '@/pages/MainPage';
import MapPage from '@/pages/MapPage';
import StoryPage from '@/pages/StoryPage';
import StoryDiagnosisPage from '@/pages/StoryDiagnosisPage';
import StoryDetailPage from '@/pages/StoryDetailPage';
import StoryEndPage from '@/pages/StoryEndPage';
import StoryRecommendPage from '@/pages/StoryRecommendPage';
import JuniorPage from '@/pages/JuniorPage';
import MyPage from '@/pages/MyPage';
import LoginPage from '@/pages/LoginPage';
import SignUpPage from '@/pages/SignUpPage';

import KakaoCallback from '@/pages/auth/KakaoCallback';
import CompleteProfilePage from '@/pages/CompleteProfilePage';
import GoogleRedirectHandler from '@/pages/auth/GoogleRedirectHandler';

import StatisticsDetailPage from '@/pages/StatisticsDetailPage';
import UsageHistoryPage from '@/pages/UsageHistoryPage';
import BookmarkPage from '@/pages/BookmarkPage';
import CouponPage from '@/pages/CouponPage';

const router = createBrowserRouter([
  {
    element: <Default />,
    children: [
      { path: '/', element: <MainPage /> },
      { path: '/map', element: <MapPage /> },
      { path: '/story', element: <StoryPage /> },
      { path: '/story/diagnosis', element: <StoryDiagnosisPage /> },
      { path: '/story/detail', element: <StoryDetailPage /> },
      { path: '/story/end', element: <StoryEndPage /> },
      { path: '/story/recommend', element: <StoryRecommendPage /> },
      { path: '/junior', element: <JuniorPage /> },
      { path: '/my', element: <MyPage /> },
      { path: '/my/statistics', element: <StatisticsDetailPage /> },
      { path: '/my/usage-history', element: <UsageHistoryPage /> },
      { path: '/my/bookmarks', element: <BookmarkPage /> },
      { path: '/my/coupons', element: <CouponPage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/signup', element: <SignUpPage /> },
      { path: '/complete-profile', element: <CompleteProfilePage /> },
      { path: '/login/oauth2/code/google', element: <GoogleRedirectHandler /> },
      { path: '/login/oauth2/code/kakao', element: <KakaoCallback /> },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
