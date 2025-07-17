import BackIcon from '@/assets/common/backIcon.svg?react';

interface HeaderProps {
  title: string;
  bgColor?: string;
  textColor?: string;
  iconColor?: string;
  onBack?: () => void;
}

const Header = ({
  title,
  bgColor = 'bg-white',
  textColor = 'text-black',
  iconColor = 'fill-black',
  onBack,
}: HeaderProps) => {
  return (
    <header className={`fixed top-0 left-0 w-full h-[40px] z-50 ${bgColor}`}>
      <div className="w-full max-w-[393px] mx-auto px-3 h-full flex items-center border-b-[0.2px] border-gray500">
        <button
          onClick={onBack}
          className={`mr-2 ${iconColor}`}
          aria-label="뒤로가기"
          type="button"
        >
          <BackIcon />
        </button>
        <h1 className={`${textColor} font-semibold text-lm leading-[40px] mt-1`}>{title}</h1>
      </div>
    </header>
  );
};

export default Header;
