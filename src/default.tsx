import { Outlet } from 'react-router-dom';
import BottomNavigator from '@/components/common/BottomNavigator';
import { useLocation } from 'react-router-dom';

const Default = () => {
  const { pathname } = useLocation();
  const isMapPage = pathname === '/map';
  return (
    <div
      className={`w-full max-w-[393px] min-h-screen bg-background mx-auto flex flex-col relative ${
        isMapPage ? '' : 'px-5'
      }`}
    >
      <main className={isMapPage ? '' : 'pt-[40px] pb-[77px]'}>
        <Outlet />
      </main>

      <BottomNavigator />
    </div>
  );
};

export default Default;
