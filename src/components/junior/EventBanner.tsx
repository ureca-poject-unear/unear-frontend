import React, { useState } from 'react';

import CommonModal from '@/components/common/CommonModal';
import Banner from '../../assets/Junior/banner.png';

const EventBanner = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    // [수정] 고정 너비를 w-full로 변경하여 반응형으로 만듭니다.
    <div className="w-full h-[142px] relative overflow-hidden bg-[linear-gradient(142.88deg,#e6007e_-1.96%,rgba(230,0,126,0.85)_50%,#be185d_101.96%)]">
      {/* [수정] 고정 너비를 w-full로 변경합니다. */}
      <div className="w-full h-[109px] relative">
        <div className="flex flex-col justify-start items-start absolute left-5 top-[30px] max-w-[calc(100%-130px)]">
          <p className="flex-grow-0 flex-shrink-0 text-xl font-bold text-left text-white">
            이번주니어 성수편
          </p>
        </div>
        <div className="flex flex-col justify-start items-start absolute left-5 top-20 opacity-90 max-w-[calc(100%-130px)]">
          <p className="flex-grow-0 flex-shrink-0 text-m text-left text-white">
            성수에서 즐기는 특별한 혜택!
          </p>
        </div>
        <img
          src={Banner}
          alt="이벤트 이미지"
          className="w-[109px] h-[109px] absolute right-[5px] top-[5.5px] object-cover"
        />
      </div>

      <div
        className="absolute bottom-2 right-4 flex items-center space-x-1 cursor-pointer"
        onClick={handleOpenModal}
      >
        <p className="text-s font-semibold text-white">이벤트 바로 알아보기</p>
        <svg
          width={7}
          height={11}
          viewBox="0 0 7 11"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M5.21857 5.5L0 10.0834L1.04357 11L6.78392 5.95828C6.92227 5.83672 7 5.67188 7 5.5C7 5.32812 6.92227 5.16328 6.78392 5.04172L1.04357 0L0 0.916558L5.21857 5.5Z"
            fill="white"
          />
        </svg>
      </div>

      {/* CommonModal은 자체적으로 중앙 정렬 및 반응형 처리가 되어있다고 가정합니다. */}
      <CommonModal isOpen={isModalOpen} onClose={handleCloseModal} title="이번주니어 안내">
        {/* Modal Content... (기존 코드와 동일) */}
      </CommonModal>
    </div>
  );
};

export default EventBanner;
