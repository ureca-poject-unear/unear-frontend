interface PaymentInfoBoxProps {
  date: string;
  title: string;
  price: string;
  imageSrc: string;
}

const PaymentCard = ({ date, title, price, imageSrc }: PaymentInfoBoxProps) => {
  return (
    <div className="w-full h-[74px] bg-blue-50 rounded-xl p-2.5 flex items-center">
      <img src={imageSrc} alt="결제 이미지" className="w-[54px] h-[54px] rounded-lg object-cover" />
      <div className="ml-[10px] flex flex-col justify-center">
        <span className="text-xs font-semibold text-gray-600 mb-0.5">{date}</span>
        <span className="text-sm font-semibold text-black">{title}</span>
        <span className="text-sm font-semibold text-black">{price}</span>
      </div>
    </div>
  );
};

export default PaymentCard;
