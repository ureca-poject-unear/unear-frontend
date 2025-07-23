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
import StatisticsDetailPage from '@/pages/StatisticsDetailPage';
import UsageHistoryPage from '@/pages/UsageHistoryPage';

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
      { path: '/my/statistics', element: <StatisticsDetailPage /> },
      { path: '/my/usage-history', element: <UsageHistoryPage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/signup', element: <SignUpPage /> },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
