import { useState } from 'react';

type ToggleButtonProps = {
  text: string;
  onClick?: () => void; // 선택적 onClick prop 추가
};

export default function ToggleButton({ text, onClick }: ToggleButtonProps) {
  const [isActive, setIsActive] = useState(false);

  const handleClick = () => {
    setIsActive(!isActive);
    if (onClick) onClick();
  };

  return (
    <div
      className={`cursor-pointer select-none w-[167px] h-[39px] bg-white rounded-xl border flex items-center justify-center ${
        isActive ? 'border-primary text-primary' : 'border-zinc-400 text-zinc-400'
      }`}
      onClick={handleClick}
    >
      <p className="text-base text-center">{text}</p>
    </div>
  );
}
