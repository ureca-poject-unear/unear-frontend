import React, { useState } from 'react';

type PhoneButtonProps = {
  onClick?: () => void;
};

const PhoneButton: React.FC<PhoneButtonProps> = ({ onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      className="w-[58px] h-[31.6px] p-0 m-0 bg-transparent border-none flex items-center justify-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Phone Button"
    >
      <svg
        width={58}
        height={32}
        viewBox="0 0 58 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-[58px] h-[31.6px]"
        preserveAspectRatio="none"
      >
        <rect
          x="0.5"
          y="0.5"
          width={57}
          height="30.5962"
          rx="3.5"
          fill={isHovered ? '#F4F4F5' : 'white'}
          stroke="#71717A"
        />
        <rect
          width="21.7845"
          height="21.7845"
          transform="translate(18.9128 4.90588)"
          fill="white"
        />
        <path
          d="M38.1019 20.8188C37.4262 20.138 35.7898 19.1445 34.9959 18.7441C33.962 18.2234 33.8769 18.1808 33.0642 18.7846C32.5221 19.1875 32.1618 19.5475 31.5274 19.4121C30.893 19.2768 29.5144 18.514 28.3074 17.3107C27.1003 16.1075 26.2931 14.6889 26.1574 14.0566C26.0217 13.4244 26.3876 13.0683 26.7867 12.5249C27.3492 11.7591 27.3066 11.6314 26.8258 10.5975C26.451 9.79335 25.4286 8.17227 24.7452 7.50002C24.0143 6.77798 24.0143 6.90562 23.5433 7.10134C23.1598 7.26265 22.7919 7.45876 22.4443 7.68723C21.7635 8.13951 21.3857 8.51521 21.1214 9.07982C20.8572 9.64443 20.7385 10.9681 22.103 13.4469C23.4675 15.9258 24.4249 17.1933 26.4063 19.1692C28.3878 21.1451 29.9114 22.2075 32.1388 23.4568C34.8942 25 35.9511 24.6992 36.5174 24.4354C37.0837 24.1716 37.4611 23.7971 37.9142 23.1164C38.1433 22.7693 38.3398 22.4018 38.5014 22.0186C38.6975 21.5493 38.8252 21.5493 38.1019 20.8188Z"
          fill="#71717A"
          stroke="#71717A"
          strokeWidth="1.5"
          strokeMiterlimit={10}
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
};

export default PhoneButton;
