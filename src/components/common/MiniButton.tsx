import React from 'react';

// 버튼의 props 타입을 정의합니다.
type MiniButtonProps = {
  text: string; // 버튼 안에 표시될 텍스트
  onClick: () => void; // 버튼 클릭 시 실행할 함수
  isActive?: boolean; // 버튼의 활성/비활성 상태를 나타내는 불리언 값 (선택적, 기본값은 false)
};

// MiniButton 컴포넌트를 정의합니다.
export default function MiniButton({
  text,
  onClick,
  isActive = false, // 기본값을 false로 설정
}: MiniButtonProps) {
  // isActive 상태에 따라 배경색을 결정하는 클래스
  const backgroundColorClass = isActive ? 'bg-primary' : 'bg-gray-200/80';

  return (
    <div
      className={`flex justify-center items-center w-[136px] h-[39px] overflow-hidden px-8 pt-[17px] pb-[19px] rounded-xl ${backgroundColorClass}`}
      style={{ boxShadow: '0px 4px 16px 0 black/20' }}
    >
      <button
        className="flex justify-center items-start flex-grow-0 flex-shrink-0 relative text-base font-bold text-center text-white"
        onClick={() => {
          if (isActive) {
            onClick();
            console.log(`${text}버튼이 클릭 되었습니다!`);
          }
        }}
        disabled={!isActive} // isActive가 false일 때 버튼을 비활성화합니다.
      >
        {text}
      </button>
    </div>
  );
}
