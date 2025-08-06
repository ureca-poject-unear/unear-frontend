import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ConfirmButton from '@/components/common/ConfirmButton';

interface StampNotificationModalProps {
  isOpen: boolean;
  storeName: string;
  stampMessage: string;
  onClose: () => void;
}

const StampNotificationModal = ({
  isOpen,
  storeName,
  stampMessage,
  onClose,
}: StampNotificationModalProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300); // 애니메이션 완료 후 닫기
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={handleBackdropClick}
        >
          {/* 배경 오버레이 */}
          <div className="absolute inset-0 bg-black bg-opacity-50" />

          {/* 모달 컨테이너 */}
          <motion.div
            className="relative bg-white rounded-2xl p-6 w-full max-w-sm mx-auto shadow-xl"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* 축하 텍스트 */}
            <div className="text-center mb-6">
              <motion.div
                className="text-2xl mb-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', damping: 15, stiffness: 300 }}
              >
                🎉
              </motion.div>
              <h2 className="text-lg font-bold text-black mb-2">스탬프 적립 완료!</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{stampMessage}</p>
            </div>

            {/* 스탬프 이미지 영역 */}
            <motion.div
              className="flex justify-center mb-6"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.1, type: 'spring', damping: 20, stiffness: 200 }}
            >
              <div className="w-24 h-24 bg-gradient-to-br from-primary to-pink-400 rounded-full flex items-center justify-center shadow-lg">
                <motion.div
                  className="text-white text-3xl font-bold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  🏷️
                </motion.div>
              </div>
            </motion.div>

            {/* 매장 이름 */}
            <div className="text-center mb-6">
              <p className="text-sm text-gray-500">적립 매장</p>
              <p className="text-base font-semibold text-black">{storeName}</p>
            </div>

            {/* 확인 버튼 */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <ConfirmButton text="확인" onClick={handleClose} />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StampNotificationModal;
