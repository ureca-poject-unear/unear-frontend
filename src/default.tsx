import React from 'react';
import { Outlet } from 'react-router-dom';

const Default = () => {
  return (
    //min-h-[852px]
    <div className="w-full max-w-[393px] min-h-screen bg-background mx-auto flex flex-col px-5">
      {/* <Header /> */}

      <main>
        <Outlet />
      </main>

      {/* <Nav /> */}
    </div>
  );
};

export default Default;
