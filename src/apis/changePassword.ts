import axios from 'axios';
import { useAuthStore } from '@/store/auth';

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export const changePassword = async (data: ChangePasswordRequest): Promise<void> => {
  const token = useAuthStore.getState().getStoredAccessToken();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  try {
    const response = await axios.put(`${API_BASE_URL}/auth/password`, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
      validateStatus: function (status) {
        return status >= 200 && status < 300;
      },
    });

    // 추가 검증: 응답 데이터에서 resultCode 확인
    if (response.data && response.data.resultCode && response.data.resultCode !== 200) {
      const error = new Error(response.data.message || 'Server error') as Error & {
        response: { data: typeof response.data };
      };
      error.response = { data: response.data };
      throw error;
    }
  } catch (error) {
    throw error;
  }
};
