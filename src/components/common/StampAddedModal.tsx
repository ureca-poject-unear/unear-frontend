import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface StampAddedModalProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}

const StampAddedModal = ({ isOpen, message, onClose }: StampAddedModalProps) => {
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
    // 배경 클릭으로는 모달이 닫히지 않도록 함
    e.stopPropagation();
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
            {/* 타이틀과 메시지 */}
            <div className="text-center mb-6">
              <h2 className="text-lg font-bold text-black mb-4">스탬프 적립 완료!</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{message}</p>
            </div>

            {/* 확인 버튼 */}
            <motion.div
              className="flex justify-center"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <button
                type="button"
                onClick={handleClose}
                className="w-[120px] h-[40px] bg-primary hover:bg-pink-500 rounded-lg flex items-center justify-center transition-colors duration-200"
              >
                <span className="text-sm font-semibold text-white pt-1">확인</span>
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StampAddedModal;
