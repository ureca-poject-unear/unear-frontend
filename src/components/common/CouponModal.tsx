import { X } from 'lucide-react';
import BarcodeDisplay from '@/components/common/BarcodeDisplay';

interface CouponModalProps {
  brand: string;
  title: string;
  discountRate: string;
  expireDate: string;
  barcodeValue: string;
  usageCondition: string;
  usageGuide: string[];
  caution: string[];
  onClose: () => void;
}

const CouponModal = ({
  brand,
  title,
  discountRate,
  expireDate,
  barcodeValue,
  usageCondition,
  usageGuide,
  caution,
  onClose,
}: CouponModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex justify-center">
      {/* 배경: 서비스 영역 내에서만 어둡게 처리 */}
      <div className="w-full max-w-[393px] mx-auto flex flex-col items-center h-screen relative">
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />

        {/* 모달 박스 */}
        <div className="relative z-10 bg-white w-[359px] h-[80vh] rounded-[12px] overflow-y-auto mt-auto mb-[120px]">
          {/* 닫기 버튼 */}
          <button className="absolute top-4 right-4" onClick={onClose}>
            <X className="text-[#333]" />
          </button>

          {/* 상단 회색 배경 영역 */}
          <div className="bg-gray-100 rounded-t-[12px] pt-6 pb-4 text-[#333]">
            <p className="text-sm font-regular px-[27px]">{brand}</p>
            <h2 className="text-lm font-semibold mt-1 px-6">{title}</h2>
            <p className="text-lg font-bold mt-2 text-center">{discountRate}</p>
            <p className="text-lm font-regular text-gray-400 mt-1 text-center">{expireDate}까지</p>
          </div>

          {/* 안내 텍스트 */}
          <div className="text-center mt-4 text-gray-400 text-m font-bold text-base">
            매장에서 아래 바코드를 제시해주세요
          </div>

          {/* 바코드 */}
          <div className="flex justify-center mt-2">
            <BarcodeDisplay
              height={80}
              width={2}
              code={barcodeValue}
              format="CODE128"
              textMargin={6}
            />
          </div>

          {/* 구분선 */}
          <hr className="border-gray-200 my-4" />

          {/* 사용 조건 */}
          <div className="flex items-start gap-2 px-[27px]">
            <span className="w-2 h-2 rounded-full bg-primary mt-[6px]" />
            <div className="ml-[-8px]">
              <p className="text-m font-semibold text-black mb-1 ml-[6px]">사용 조건</p>
              <div className="flex">
                <span className="w-[3px] h-[3px] mt-[6px] bg-black rounded-full shrink-0 mr-[5px]" />
                <p className="text-sm font-regular text-black leading-[19px]">{usageCondition}</p>
              </div>
              {/* ))} */}
            </div>
          </div>

          {/* 사용 방법 */}
          <div className="flex items-start gap-2 px-[27px] mt-3">
            <span className="w-2 h-2 rounded-full bg-blue-400 mt-[6px]" />
            <div className="ml-[-8px]">
              <p className="text-m font-semibold text-black mb-1 ml-[6px]">사용 방법</p>
              <ul className="text-sm font-regular text-black list-decimal list-inside leading-[15px] space-y-[4px]">
                {usageGuide.map((guide, idx) => (
                  <li key={idx}>{guide}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* 주의 사항 */}
          <div className="flex items-start gap-2 px-[27px] mt-3">
            <span className="w-2 h-2 rounded-full bg-red-500 mt-[6px]" />
            <div className="ml-[-8px]">
              <p className="text-m font-semibold text-black mb-1 ml-[6px]">주의 사항</p>
              {caution.map((item, idx) => (
                <div key={idx} className="flex items-start gap-[6px]">
                  <span className="w-[3px] h-[3px] mt-[6px] bg-black rounded-full shrink-0" />
                  <p className="text-sm font-regular text-black leading-[19px]">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CouponModal;
