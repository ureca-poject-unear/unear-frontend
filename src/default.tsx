import { Outlet } from 'react-router-dom';
import BottomNavigator from '@/components/common/BottomNavigator';
import StampNotificationModal from '@/components/common/StampNotificationModal';
import { useLocation } from 'react-router-dom';
import useScrollToTop from './hooks/useScrollToTop';
import { useNotifications } from './hooks/useNotifications';

const Default = () => {
  const { pathname } = useLocation();

  // Check if it's the map page
  const isMapPage = pathname === '/map';

  // Check if it's the login or signup page
  const isAuthPage =
    pathname === '/login' || pathname === '/signup' || pathname === '/complete-profile';

  const isLoginPage = pathname === '/login';

  useScrollToTop();

  // 전역 알림 시스템 초기화 (로그인된 사용자에게만)
  const { connectionStatus, showStampModal, stampModalData, closeStampModal } = useNotifications();

  return (
    <div
      className={`w-full max-w-[600px] min-h-screen mx-auto flex flex-col relative ${
        isAuthPage ? 'bg-white' : 'bg-background'
      }`}
    >
      <main className={isMapPage || isLoginPage ? '' : 'pt-[40px] pb-[65px]'}>
        <Outlet />
      </main>

      {!isAuthPage && <BottomNavigator />}

      {/* 개발 환경에서 연결 상태 표시 (옵션) */}
      {import.meta.env.DEV && !isAuthPage && (
        <div className="fixed top-1 right-1 z-50 text-xs px-2 py-1 rounded bg-black bg-opacity-50 text-white">
          SSE: {connectionStatus}
        </div>
      )}

      {/* 스탬프 완료 모달 */}
      <StampNotificationModal
        isOpen={showStampModal}
        storeName={stampModalData?.storeName || ''}
        stampMessage={stampModalData?.message || ''}
        onClose={closeStampModal}
      />
    </div>
  );
};

export default Default;
