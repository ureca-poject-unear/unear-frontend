import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserCouponDetail } from '@/apis/getUserCouponDetail';
import type { UserCoupon, UserCouponDetail } from '@/types/coupon';

interface CouponPageHandlers {
  onBack: () => void;
  onCouponClick: (coupon: UserCoupon) => void;
}

const useCouponHandlers = (): CouponPageHandlers & {
  selectedCoupon: UserCouponDetail | null;
  selectedBrand: string;
  isModalOpen: boolean;
  handleCloseModal: () => void;
} => {
  const navigate = useNavigate();
  const [selectedCoupon, setSelectedCoupon] = useState<UserCouponDetail | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onBack = () => {
    navigate(-1);
  };

  const onCouponClick = async (coupon: UserCoupon) => {
    try {
      setSelectedBrand(coupon.name);
      const detail = await getUserCouponDetail(coupon.userCouponId);
      if (detail) {
        setSelectedCoupon(detail);
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error('쿠폰 상세 정보 불러오기 실패:', error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCoupon(null);
    setSelectedBrand('');
  };

  return {
    onBack,
    onCouponClick,
    selectedCoupon,
    selectedBrand,
    isModalOpen,
    handleCloseModal,
  };
};

export default useCouponHandlers;
