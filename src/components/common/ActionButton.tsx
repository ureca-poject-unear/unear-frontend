type ActionProps = {
  text: string;
  onClick: () => void;
  isActive?: boolean;
};

export default function ActionButton({ text, onClick, isActive = false }: ActionProps) {
  const backgroundColorClass = isActive ? 'bg-primary hover:bg-pink-500' : 'bg-gray-200';

  return (
    <button
      className={`w-[353px] h-[50px] rounded-xl flex items-center justify-center text-base font-semibold text-white transition-colors duration-200 ${backgroundColorClass}`}
      onClick={() => {
        if (isActive) {
          onClick();
        }
      }}
      disabled={!isActive}
    >
      {text}
    </button>
  );
}
