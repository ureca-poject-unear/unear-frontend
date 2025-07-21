type ToggleButtonProps = {
  text: string;
  isActive: boolean; // 부모가 상태를 넘겨줌
  onClick?: () => void;
};

export default function ToggleButton({ text, isActive, onClick }: ToggleButtonProps) {
  return (
    <div
      className={`cursor-pointer select-none w-[167px] h-[39px] bg-white rounded-xl border flex items-center justify-center ${
        isActive ? 'border-primary text-primary' : 'border-zinc-400 text-zinc-400'
      }`}
      onClick={onClick}
    >
      <p className="text-base text-center">{text}</p>
    </div>
  );
}
