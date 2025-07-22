import { Outlet } from 'react-router-dom';
import BottomNavigator from '@/components/common/BottomNavigator';
import { useLocation } from 'react-router-dom';

const Default = () => {
  const { pathname } = useLocation();
  const isMapPage = pathname === '/map';

  return (
    <div
      className={`w-full max-w-[393px] min-h-screen mx-auto flex flex-col relative ${pathname === '/login' || pathname === '/signup' ? 'bg-white' : 'bg-background'}`}
    >
      <main className={isMapPage ? '' : 'pt-[40px] pb-[77px]'}>
        <Outlet />
      </main>

      {pathname !== '/login' && <BottomNavigator />}
    </div>
  );
};

export default Default;
