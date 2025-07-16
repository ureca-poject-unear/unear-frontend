// src/components/LocationButton/LocationButton.tsx
import React from 'react';

type LocationButtonProps = {
  onClick?: () => void; // 버튼 클릭 시 실행할 함수
};

/**
 * 위치 보기 버튼 컴포넌트
 * 버튼을 클릭하면 위치를 보여주는 동작을 수행할 수 있도록 설정됩니다.
 */
const LocationButton: React.FC<LocationButtonProps> = ({ onClick }) => {
  return (
    <button
      className="w-[169px] h-[46px] relative flex items-center justify-center" // flex 사용
      onClick={onClick}
    >
      {/* 버튼 외곽 박스 */}
      <div className="w-[169px] h-[46px] absolute left-0 top-0 rounded-lg border border-[#e6007e]" />

      {/* 내부 콘텐츠: SVG 아이콘과 텍스트 */}
      <div className="flex items-center justify-center space-x-2">
        <svg
          width={18}
          height={16}
          viewBox="0 0 18 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4"
          preserveAspectRatio="none"
        >
          <path
            d="M9.91267 15L16.1516 1L0.999887 6.76471L6.58374 8.97588C7.00423 9.14247 7.33929 9.45207 7.51958 9.84059L9.91267 15Z"
            fill="#E6007E"
            stroke="#E6007E"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <p className="text-base font-semibold text-[#e6007e]">위치 보기</p>
      </div>
    </button>
  );
};

export default LocationButton;
