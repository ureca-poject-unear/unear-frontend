type ActionProps = {
  text: string; // 버튼에 표시될 텍스트
  onClick: () => void; // 클릭 시 실행할 함수
  isActive?: boolean; // 활성화 여부 (기본값 false)
};

export default function ActionButton({
  text,
  onClick,
  isActive = false, // 기본값 false (비활성)
}: ActionProps) {
  // 활성화 상태에 따른 배경색 클래스 지정
  const backgroundColorClass = isActive ? 'bg-[#e6007e] hover:bg-pink-500' : 'bg-[#acacb5]/80';

  return (
    <button
      className={`relative w-[353px] h-[50px] rounded-xl flex items-center justify-center text-base font-semibold text-white transition-colors duration-200 ${backgroundColorClass}`}
      onClick={() => {
        if (isActive) {
          onClick();
          alert(`${text} 되었습니다!`);
        }
      }}
      disabled={!isActive} // 비활성 시 클릭 불가
    >
      <p className="text-center">{text}</p>
    </button>
  );
}
