import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { CouponItem, CouponPageHandlers } from '@/types/coupon';

const useCouponHandlers = (): CouponPageHandlers & {
  selectedCoupon: CouponItem | null;
  isModalOpen: boolean;
  handleCloseModal: () => void;
} => {
  const navigate = useNavigate();
  const [selectedCoupon, setSelectedCoupon] = useState<CouponItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onBack = () => {
    navigate(-1);
  };

  const onCouponClick = (coupon: CouponItem) => {
    setSelectedCoupon(coupon);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCoupon(null);
  };

  return {
    onBack,
    onCouponClick,
    selectedCoupon,
    isModalOpen,
    handleCloseModal,
  };
};

export default useCouponHandlers;
