import { Outlet } from 'react-router-dom';
import BottomNavigator from '@/components/common/BottomNavigator';

const Default = () => {
  return (
    <div className="w-full max-w-[393px] min-h-screen bg-background mx-auto flex flex-col relative px-5">
      <main className="pt-[40px] pb-[65px]">
        <Outlet />
      </main>

      <BottomNavigator />
    </div>
  );
};

export default Default;
