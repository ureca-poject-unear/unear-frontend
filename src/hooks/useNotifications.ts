import { useEffect, useRef, useState, useCallback } from 'react';
import { useAuthStore } from '@/store/auth';
import { showSuccessToast } from '@/utils/toast';
import {
  NotificationClient,
  type PaymentSuccessData,
  type StampAddedData,
  type StampCompletedData,
  type ConnectionStatus,
} from '@/utils/NotificationClient';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface UseNotificationsReturn {
  connectionStatus: ConnectionStatus;
  showStampModal: boolean;
  stampModalData: {
    storeName: string;
    message: string;
  } | null;
  closeStampModal: () => void;
}

export const useNotifications = (): UseNotificationsReturn => {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [showStampModal, setShowStampModal] = useState(false);
  const [stampModalData, setStampModalData] = useState<{
    storeName: string;
    message: string;
  } | null>(null);

  const notificationClientRef = useRef<NotificationClient | null>(null);
  const { userInfo } = useAuthStore();

  // 결제 완료 알림 처리 (토스트)
  const handlePaymentSuccess = useCallback((data: PaymentSuccessData) => {
    const message = `${data.relatedPlaceName}에서 결제가 완료되었습니다!`;
    showSuccessToast(message);

    // 결제 완료 이벤트 발생 (다른 컴포넌트에서 처리 가능)
    window.dispatchEvent(
      new CustomEvent('paymentCompleted', {
        detail: data,
      })
    );
  }, []);

  // 스탬프 추가 알림 처리 (토스트)
  const handleStampAdded = useCallback((data: StampAddedData) => {
    showSuccessToast(data.message);

    // 스탬프 추가 이벤트 발생
    window.dispatchEvent(
      new CustomEvent('stampAdded', {
        detail: data,
      })
    );
  }, []);

  // 스탬프 완료 알림 처리 (모달)
  const handleStampCompleted = useCallback((data: StampCompletedData) => {
    setStampModalData({
      storeName: data.relatedPlaceName,
      message: data.message,
    });
    setShowStampModal(true);

    // 스탬프 완료 이벤트 발생
    window.dispatchEvent(
      new CustomEvent('stampCompleted', {
        detail: data,
      })
    );
  }, []);

  // 연결 상태 변경 처리
  const handleConnectionStatusChanged = useCallback((data: { status: ConnectionStatus }) => {
    setConnectionStatus(data.status);
  }, []);

  // 스탬프 모달 닫기
  const closeStampModal = useCallback(() => {
    setShowStampModal(false);
    setStampModalData(null);
  }, []);

  useEffect(() => {
    // 사용자가 로그인되어 있고 userId가 있을 때만 연결
    if (!userInfo?.userId) {
      return;
    }

    console.log('🚀 알림 시스템 초기화 시작:', userInfo.userId);

    // NotificationClient 인스턴스 생성
    notificationClientRef.current = new NotificationClient(userInfo.userId, API_BASE_URL);

    // 이벤트 리스너 등록
    notificationClientRef.current.on('paymentSuccess', handlePaymentSuccess);
    notificationClientRef.current.on('stampAdded', handleStampAdded);
    notificationClientRef.current.on('stampCompleted', handleStampCompleted);
    notificationClientRef.current.on('connectionStatusChanged', handleConnectionStatusChanged);

    // 정리 함수
    return () => {
      if (notificationClientRef.current) {
        console.log('🧹 알림 시스템 정리');
        notificationClientRef.current.disconnect();
        notificationClientRef.current = null;
      }
    };
  }, [
    userInfo?.userId,
    handlePaymentSuccess,
    handleStampAdded,
    handleStampCompleted,
    handleConnectionStatusChanged,
  ]);

  return {
    connectionStatus,
    showStampModal,
    stampModalData,
    closeStampModal,
  };
};
