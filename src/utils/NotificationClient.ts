/**
 * SSE 알림 클라이언트 (배포 서버 직접 요청)
 * 결제 완료, 스탬프 적립 등의 실시간 알림 처리
 */

// 알림 데이터 타입 정의
export interface PaymentSuccessData {
  type: 'PAYMENT_SUCCESS';
  message: string;
  relatedPlaceId: number;
  relatedPlaceName: string;
  discountAmount: number;
  finalAmount: number;
}

export interface StampAddedData {
  type: 'STAMP_ADDED';
  message: string;
  relatedPlaceId: number;
  relatedPlaceName: string;
  stampOrder: number;
}

export interface StampCompletedData {
  type: 'STAMP_COMPLETED';
  message: string;
  relatedPlaceId: number;
  relatedPlaceName: string;
}

export type NotificationData = PaymentSuccessData | StampAddedData | StampCompletedData;

export type ConnectionStatus =
  | 'connecting'
  | 'connected'
  | 'disconnected'
  | 'reconnecting'
  | 'failed';

export interface NotificationEvents {
  paymentSuccess: PaymentSuccessData;
  connectionStatusChanged: { status: ConnectionStatus };
}

// 이벤트 콜백 타입 정의
type EventCallback<K extends keyof NotificationEvents> = (data: NotificationEvents[K]) => void;

export class NotificationClient {
  private userId: number;
  private eventSource: EventSource | null = null;
  private reconnectDelay = 2000; // 2초 후 재연결
  private maxReconnectAttempts = 5;
  private reconnectAttempts = 0;
  private baseUrl: string;
  private getAccessToken: () => string | null;

  // any 없는 타입 안전한 리스너 객체
  private eventListeners: {
    [K in keyof NotificationEvents]?: Array<EventCallback<K>>;
  } = {};

  constructor(userId: number, baseUrl: string, getAccessToken: () => string | null) {
    this.userId = userId;
    this.baseUrl = baseUrl;
    this.getAccessToken = getAccessToken;
    this.connect();
  }

  /**
   * 이벤트 리스너 등록
   */
  on<K extends keyof NotificationEvents>(event: K, callback: EventCallback<K>): void {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = [];
    }
    this.eventListeners[event]!.push(callback);
  }

  /**
   * 이벤트 리스너 제거
   */
  off<K extends keyof NotificationEvents>(event: K, callback: EventCallback<K>): void {
    const listeners = this.eventListeners[event];
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  /**
   * 이벤트 발생
   */
  private emit<K extends keyof NotificationEvents>(event: K, data: NotificationEvents[K]): void {
    const listeners = this.eventListeners[event];
    if (listeners) {
      listeners.forEach((callback) => callback(data));
    }
  }

  /**
   * SSE 연결 시작 (배포 서버 직접 요청)
   */
  private connect(): void {
    try {
      const accessToken = this.getAccessToken();

      if (!accessToken) {
        console.error('❌ 액세스 토큰이 없어 SSE 연결을 시작할 수 없습니다.');
        this.updateConnectionStatus('failed');
        return;
      }

      const sseUrl = `${this.baseUrl}/notifications/subscribe/${this.userId}?token=${encodeURIComponent(accessToken)}`;

      console.log(`🔄 SSE 연결 시도: ${this.baseUrl}/notifications/subscribe/${this.userId}`);
      console.log(`📡 실제 요청 URL: ${sseUrl}`);

      this.updateConnectionStatus('connecting');

      this.eventSource = new EventSource(sseUrl);
      this.setupEventListeners();
      this.reconnectAttempts = 0; // 성공시 재연결 카운트 리셋
    } catch (error) {
      console.error('❌ SSE 연결 실패:', error);
      this.handleReconnect();
    }
  }

  /**
   * 이벤트 리스너 설정
   */
  private setupEventListeners(): void {
    if (!this.eventSource) return;

    this.eventSource.onopen = () => {
      console.log('🟢 SSE 연결됨');
      console.log('📊 onopen 시점 EventSource 상태:', this.eventSource?.readyState);

      setTimeout(() => {
        console.log('🕰️ 5초 후 EventSource 상태:', this.eventSource?.readyState);
        if (this.eventSource?.readyState === 1) {
          console.log('✅ 연결이 유지되고 있습니다!');
        } else {
          console.log('❌ 연결이 끊어졌습니다.');
        }
      }, 5000);

      this.updateConnectionStatus('connected');
    };

    this.eventSource.onerror = (event) => {
      console.log('🔴 SSE 연결 오류:', event);
      console.log('🔍 EventSource 상태:', this.eventSource?.readyState);
      console.log('🔍 에러 타입:', event.type);
      console.log('🔍 현재 시간:', new Date().toISOString());

      const readyState = this.eventSource?.readyState;
      if (readyState === 0) console.log('📍 상태: CONNECTING');
      else if (readyState === 1) console.log('📍 상태: OPEN');
      else if (readyState === 2) console.log('📍 상태: CLOSED');

      this.updateConnectionStatus('disconnected');
      this.handleReconnect();
    };

    // 연결 확인 이벤트
    this.eventSource.addEventListener('connect', (event: MessageEvent) => {
      try {
        console.log('🔗 초기 연결 이벤트 수신:', event.data);
        console.log('📊 connect 이벤트 시점 상태:', this.eventSource?.readyState);
      } catch (error) {
        console.error('연결 이벤트 파싱 오류:', error);
      }
    });

    // ping 이벤트 리스너 추가
    this.eventSource.addEventListener('ping', (event: MessageEvent) => {
      console.log('🏓 ping 이벤트 수신:', event.data);
    });

    // 기본 메시지 수신 (이름 없는 이벤트)
    this.eventSource.onmessage = (event: MessageEvent) => {
      console.log('📩 기본 메시지 수신:', event.data);
      console.log('📊 메시지 수신 시점 상태:', this.eventSource?.readyState);
    };

    // 결제 완료 알림
    this.eventSource.addEventListener('payment-success', (event: MessageEvent) => {
      try {
        const data: PaymentSuccessData = JSON.parse(event.data);
        console.log('💳 결제 완료 알림:', data);
        this.emit('paymentSuccess', data);
      } catch (error) {
        console.error('결제 완료 알림 파싱 오류:', error);
      }
    });
  }

  /**
   * 재연결 처리
   */
  private handleReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`🟡 재연결 시도 ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
      this.updateConnectionStatus('reconnecting');

      const backoffDelay = Math.min(
        this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1),
        30000
      );
      console.log(`🕰️ ${backoffDelay}ms 후 재연결 시도`);

      setTimeout(() => {
        if (this.eventSource) {
          this.eventSource.close();
        }
        this.connect();
      }, backoffDelay);
    } else {
      console.error('❌ 최대 재연결 시도 횟수 초과');
      this.updateConnectionStatus('failed');
    }
  }

  /**
   * 연결 상태 업데이트
   */
  private updateConnectionStatus(status: ConnectionStatus): void {
    this.emit('connectionStatusChanged', { status });
  }

  /**
   * 연결 해제
   */
  disconnect(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    // 모든 리스너 제거
    Object.keys(this.eventListeners).forEach((key) => {
      delete this.eventListeners[key as keyof NotificationEvents];
    });
    console.log('🔌 SSE 연결 해제');
  }

  /**
   * 현재 연결 상태 확인
   */
  getConnectionState(): number | null {
    return this.eventSource?.readyState ?? null;
  }

  /**
   * 연결 상태가 활성화되었는지 확인
   */
  isConnected(): boolean {
    return this.eventSource?.readyState === EventSource.OPEN;
  }
}
