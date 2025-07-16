import React from 'react';

type CallButtonProps = {
  onClick?: () => void; // 버튼 클릭 시 실행할 함수
};

/**
 * 위치 보기 버튼 컴포넌트
 * 버튼을 클릭하면 위치를 보여주는 동작을 수행할 수 있도록 설정됩니다.
 */
const CallButton: React.FC<CallButtonProps> = ({ onClick }) => {
  return (
    <button
      className="w-[169px] h-[46px] relative flex items-center justify-center" // flex 사용
      onClick={onClick}
    >
      {/* 버튼 외곽 박스 */}
      <div className="w-[169px] h-[46px] absolute left-0 top-0 rounded-lg border border-[#16A34A]" />

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
            d="M16.3956 11.8238C15.7811 11.2926 14.2928 10.5173 13.5706 10.2048C12.6303 9.79844 12.5529 9.76524 11.8137 10.2364C11.3207 10.5508 10.9929 10.8317 10.4159 10.7261C9.83891 10.6205 8.58507 10.0252 7.48718 9.08623C6.3893 8.14725 5.65518 7.04026 5.53173 6.54686C5.40828 6.05346 5.74109 5.77555 6.10409 5.35155C6.61568 4.75389 6.57698 4.65428 6.13969 3.84744C5.79875 3.2199 4.86882 1.95487 4.24732 1.43026C3.58247 0.866799 3.58247 0.966408 3.15407 1.11914C2.8053 1.24502 2.4707 1.39806 2.15448 1.57635C1.5353 1.9293 1.19166 2.22248 0.951339 2.66309C0.711019 3.10369 0.603049 4.13664 1.84412 6.07106C3.08519 8.00547 3.95591 8.99459 5.75812 10.5365C7.56032 12.0785 8.94613 12.9076 10.972 13.8824C13.4781 15.0867 14.4394 14.852 14.9545 14.6461C15.4696 14.4402 15.8128 14.148 16.225 13.6168C16.4333 13.3459 16.6121 13.0592 16.759 12.7602C16.9374 12.3939 17.0535 12.3939 16.3956 11.8238Z"
            fill="#16A34A"
            stroke="#16A34A"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <p className="text-base font-semibold text-[#16A34A]">전화 걸기</p>
      </div>
    </button>
  );
};

export default CallButton;
