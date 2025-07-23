import emptyImage from '@/assets/common/emptynubi.png';

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center space-y-4">
      <img
        src={emptyImage}
        alt="empty-state"
        className="object-cover"
        style={{ width: 222, height: 222 }}
      />
      <p className="text-lg font-semibold text-black text-center">현재 표시할 내용이 없어요</p>
    </div>
  );
}
