const CurrentLocationMarker = () => {
  return (
    <div className="relative w-[30px] h-[30px]">
      {/* 바깥 흐린 붉은 원 (배경) */}
      <div className="absolute w-[30px] h-[30px] bg-red-500/20 rounded-full top-0 left-0" />

      {/* 가운데 흰색 반투명 원 */}
      <div className="absolute w-[16.02px] h-[16.02px] bg-white/80 rounded-full left-[11px] top-[11px]" />

      {/* 중심 빨간 원 */}
      <div className="absolute w-[12.65px] h-[12.65px] bg-red-500 rounded-full left-[13px] top-[13px]" />
    </div>
  );
};

export default CurrentLocationMarker;
