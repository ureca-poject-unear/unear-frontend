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

// 이벤트 타입 정의
export interface NotificationEvents {
  paymentSuccess: PaymentSuccessData;
  stampAdded: StampAddedData;
  stampCompleted: StampCompletedData;
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
  private eventListeners: Map<keyof NotificationEvents, Array<EventCallback<any>>> = new Map();
  private getAccessToken: () => string | null;

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
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)?.push(callback as EventCallback<any>);
  }

  /**
   * 이벤트 리스너 제거
   */
  off<K extends keyof NotificationEvents>(event: K, callback: EventCallback<K>): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback as EventCallback<any>);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  /**
   * 이벤트 발생
   */
  private emit<K extends keyof NotificationEvents>(event: K, data: NotificationEvents[K]): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach((callback: EventCallback<any>) => callback(data));
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

      // 배포된 백엔드 서버로 직접 요청
      const sseUrl = `${this.baseUrl}/notifications/subscribe/${this.userId}?token=${encodeURIComponent(accessToken)}`;

      console.log(`🔄 SSE 연결 시도: ${this.baseUrl}/notifications/subscribe/${this.userId}`);
      console.log(`📡 실제 요청 URL: ${sseUrl}`);

      this.updateConnectionStatus('connecting');

      // 일반 EventSource 사용 (쿼리 파라미터 방식)
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

      // 연결 성공 후 5초 대기해서 상태 다시 확인
      setTimeout(() => {
        console.log('🕰️ 5초 후 EventSource 상태:', this.eventSource?.readyState);
        if (this.eventSource?.readyState === 1) {
          console.log('✅ 연결이 유지되고 있습니다!');
        } else {
          console.log('❌ 연결이 끄어졌습니다.');
        }
      }, 5000);

      this.updateConnectionStatus('connected');
    };

    this.eventSource.onerror = (event) => {
      console.log('🔴 SSE 연결 오류:', event);
      console.log('🔍 EventSource 상태:', this.eventSource?.readyState);
      console.log('🔍 에러 타입:', event.type);
      console.log('🔍 현재 시간:', new Date().toISOString());

      // EventSource 상태 코드 해석
      const readyState = this.eventSource?.readyState;
      if (readyState === 0) console.log('📍 상태: CONNECTING');
      else if (readyState === 1) console.log('📍 상태: OPEN');
      else if (readyState === 2) console.log('📍 상태: CLOSED');

      this.updateConnectionStatus('disconnected');
      this.handleReconnect();
    };

    // 연결 확인 이벤트
    this.eventSource.addEventListener('connect', (event) => {
      try {
        console.log('🔗 초기 연결 이벤트 수신:', event.data);
        console.log('📊 connect 이벤트 시점 상태:', this.eventSource?.readyState);
      } catch (error) {
        console.error('연결 이벤트 파싱 오류:', error);
      }
    });

    // ping 이벤트 리스너 추가
    this.eventSource.addEventListener('ping', (event) => {
      console.log('🏓 ping 이벤트 수신:', event.data);
    });

    // 기본 메시지 수신 (이름 없는 이벤트)
    this.eventSource.onmessage = (event) => {
      console.log('📩 기본 메시지 수신:', event.data);
      console.log('📊 메시지 수신 시점 상태:', this.eventSource?.readyState);
    };

    // 결제 완료 알림
    this.eventSource.addEventListener('payment-success', (event) => {
      try {
        const data: PaymentSuccessData = JSON.parse(event.data);
        console.log('💳 결제 완료 알림:', data);
        this.emit('paymentSuccess', data);
      } catch (error) {
        console.error('결제 완료 알림 파싱 오류:', error);
      }
    });

    // 스탬프 추가 알림
    this.eventSource.addEventListener('stamp-added', (event) => {
      try {
        const data: StampAddedData = JSON.parse(event.data);
        console.log('🏷️ 스탬프 추가 알림:', data);
        this.emit('stampAdded', data);
      } catch (error) {
        console.error('스탬프 추가 알림 파싱 오류:', error);
      }
    });

    // 스탬프 완료 알림
    this.eventSource.addEventListener('stamp-completed', (event) => {
      try {
        const data: StampCompletedData = JSON.parse(event.data);
        console.log('🎉 스탬프 완료 알림:', data);
        this.emit('stampCompleted', data);
      } catch (error) {
        console.error('스탬프 완료 알림 파싱 오류:', error);
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

      // 지수 백오프: 2수, 4초, 8초, 16초, 32초
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
    this.eventListeners.clear();
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
