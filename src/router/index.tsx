import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Default from '../default';
import MainPage from '@/pages/MainPage';
import MembershipPage from '@/pages/MembershipPage';
import MembershipDetailPage from '@/pages/MembershipDetailPage';
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
import ChangePasswordPage from '@/pages/ChangePasswordPage';

import KakaoCallback from '@/pages/auth/KakaoCallback';
import CompleteProfilePage from '@/pages/CompleteProfilePage';
import GoogleRedirectHandler from '@/pages/auth/GoogleRedirectHandler';
import NaverAuthHandler from '@/pages/auth/NaverAuthHandler';

import StatisticsDetailPage from '@/pages/StatisticsDetailPage';
import UsageHistoryPage from '@/pages/UsageHistoryPage';
import BookmarkPage from '@/pages/BookmarkPage';
import CouponPage from '@/pages/CouponPage';

import { AuthProvider } from '@/providers/AuthProvider';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import ErrorBoundary from '@/components/error/ErrorBoundary';

const router = createBrowserRouter([
  {
    element: <Default />,
    children: [
      // 보호된 라우트들 (로그인 필요)
      {
        path: '/',
        element: (
          <ProtectedRoute>
            <MainPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/membership',
        element: (
          <ProtectedRoute>
            <MembershipPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/membership/detail/:franchiseId',
        element: (
          <ProtectedRoute>
            <MembershipDetailPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/map',
        element: (
          <ProtectedRoute>
            <MapPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/story',
        element: (
          <ProtectedRoute>
            <StoryPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/story/diagnosis',
        element: (
          <ProtectedRoute>
            <StoryDiagnosisPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/story/detail',
        element: (
          <ProtectedRoute>
            <StoryDetailPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/story/end',
        element: (
          <ProtectedRoute>
            <StoryEndPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/story/recommend',
        element: (
          <ProtectedRoute>
            <StoryRecommendPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/junior',
        element: (
          <ProtectedRoute>
            <JuniorPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/my',
        element: (
          <ProtectedRoute>
            <MyPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/my/statistics',
        element: (
          <ProtectedRoute>
            <StatisticsDetailPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/my/usage-history',
        element: (
          <ProtectedRoute>
            <UsageHistoryPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/my/bookmarks',
        element: (
          <ProtectedRoute>
            <BookmarkPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/my/coupons',
        element: (
          <ProtectedRoute>
            <CouponPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/my/change-password',
        element: (
          <ProtectedRoute>
            <ChangePasswordPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/complete-profile',
        element: (
          <ProtectedRoute>
            <CompleteProfilePage />
          </ProtectedRoute>
        ),
      },

      // 공개 라우트들 (로그인 불필요)
      { path: '/login', element: <LoginPage /> },
      { path: '/signup', element: <SignUpPage /> },

      { path: '/complete-profile', element: <CompleteProfilePage /> },

      { path: '/login/oauth2/code/google', element: <GoogleRedirectHandler /> },

      { path: '/login/oauth2/code/kakao', element: <KakaoCallback /> },

      { path: '/login/oauth2/code/naver', element: <NaverAuthHandler /> },
    ],
  },
]);

export default function Router() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ErrorBoundary>
  );
}
