import { Outlet } from 'react-router-dom';
import BottomNavigator from '@/components/common/BottomNavigator';
import { useLocation } from 'react-router-dom';

const Default = () => {
  const { pathname } = useLocation();

  // Check if it's the map page
  const isMapPage = pathname === '/map';

  // Check if it's the login or signup page
  const isAuthPage = pathname === '/login' || pathname === '/signup';

  return (
    <div
      className={`w-full max-w-[393px] min-h-screen mx-auto flex flex-col relative ${
        isAuthPage ? 'bg-white' : 'bg-background'
      }`}
    >
      <main className={isMapPage ? '' : 'pt-[40px] pb-[65px]'}>
        <Outlet />
      </main>

      {pathname !== '/login' && <BottomNavigator />}
    </div>
  );
};

export default Default;
