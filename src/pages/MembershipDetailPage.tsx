import { useParams } from 'react-router-dom';
import { cardList, type CardItem } from '@/pages/MembershipPage';
import Header from '@/components/common/Header';

export default function MembershipDetailPage() {
  const { name } = useParams<{ name: string }>();
  const card: CardItem | undefined = cardList.find((c) => c.name === name);

  if (!card) {
    return (
      <div className="w-full max-w-[393px] mx-auto px-5 pt-10">
        <p className="text-center text-sm text-gray-500">카드를 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[393px] bg-background">
      <Header title="혜택 상세" />

      {/* 이미지 + 브랜드명 */}
      <div className="flex flex-col items-center w-full bg-white py-5 mb-3">
        <div className="h-[80px] rounded-[10px] overflow-hidden mb-1">
          <img src={card.imageUrl} alt={card.name} className="w-full h-full object-cover" />
        </div>
        <h2 className="text-lg font-semibold text-black">{card.name}</h2>
      </div>

      {/* 혜택 안내 */}
      <div className="w-full bg-white px-5 py-5 mb-3">
        <h3 className="text-lm font-bold text-black mb-3">혜택 안내</h3>

        <div className="rounded-[12px] outline outline-1 outline-gray-200 overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200">
                <th className="text-center text-sm font-semibold text-black border-r border-gray-200 w-[60px] rounded-tl-[12px]">
                  등급
                </th>
                <th className="px-4 py-2.5 text-left text-sm font-semibold text-black rounded-tr-[12px]">
                  혜택
                </th>
              </tr>
            </thead>
            <tbody>
              {card.benefits?.map(({ grade, benefit }) => (
                <tr key={grade} className="border-t border-gray-200">
                  <td className="text-sm font-regular text-black border-r border-gray-200 text-center">
                    {grade}
                  </td>

                  <td className="px-4 py-2.5 text-sm font-regular text-black">{benefit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 이용 방법 및 유의 사항 */}
      <div className="w-full bg-white px-5 py-5">
        <h3 className="text-lm font-bold text-black mb-3">이용 방법 및 유의 사항</h3>
        {/* 사용 방법 */}
        <div className="flex items-start gap-2 mt-3">
          <span className="w-2 h-2 rounded-full bg-blue-400 mt-[6px]" />
          <div className="ml-[-8px]">
            <p className="text-m font-semibold text-black mb-1 ml-[6px]">사용 방법</p>
            <ul className="pl-[14px] list-disc list-outside text-sm font-regular text-black leading-[18px] space-y-[4px]">
              {card.usage?.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* 주의 사항 */}
        <div className="flex items-start gap-2 mt-3">
          <span className="w-2 h-2 rounded-full bg-red-500 mt-[6px]" />
          <div className="ml-[-8px]">
            <p className="text-m font-semibold text-black mb-1 ml-[6px]">주의 사항</p>
            <ul className="pl-[14px] list-disc list-outside text-sm font-regular text-black leading-[18px] space-y-[4px]">
              {card.cautions?.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
