import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import StoryLayout from '@/components/story/StoryLayout';
import StoryButton from '@/components/common/StoryButton';
import { useAuthStore } from '@/store/auth';
import type { StoryDiagnosisParams } from '@/apis/getStoryDiagnosis';
import { getStoryDiagnosis } from '@/apis/getStoryDiagnosis';

interface DiagnosisData {
  category: string;
  emoji: string;
  label: string;
  description: string[];
}

const StoryDiagnosisPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const diagnosisMap = location.state?.diagnosisMap as Record<string, DiagnosisData>;
  const user = useAuthStore((state) => state.userInfo);

  const [diagnosis, setDiagnosis] = useState<DiagnosisData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !diagnosisMap) return;

    const fetchDiagnosis = async () => {
      setLoading(true);
      try {
        const params: StoryDiagnosisParams = {
          userId: user.userId,
          username: user.username,
          email: user.email,
          tel: user.tel ?? '',
          birthdate: user.birthdate ?? '',
          gender: user.gender ?? '',
          membershipCode: user.membershipCode,
          provider: user.provider ?? '',
          providerId: user.provider ?? '',
        };

        console.log(':메모: [진단 요청 params]', params);

        const response = await getStoryDiagnosis(params);

        console.log(':메모: [진단 응답]', response);

        const matched = Object.values(diagnosisMap).find((item) => item.label === response.type);

        console.log(':메모: [매칭된 진단]', matched);

        if (matched) {
          setDiagnosis(matched);
        } else {
          console.warn(':경고: 응답 타입이 diagnosisMap에 존재하지 않습니다:', response.type);
          setDiagnosis(null);
        }
      } catch (error) {
        console.error(':에러: 진단 결과 불러오기 실패:', error);
        setDiagnosis(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDiagnosis();
  }, [user, diagnosisMap]);

  return (
    <StoryLayout headerTitle="진단" bgColorClass="bg-storybackground3">
      <div className="flex flex-col items-center justify-between w-full h-full px-5 py-10">
        {loading ? (
          <p className="text-white text-m font-regular">진단 결과를 불러오는 중입니다...</p>
        ) : diagnosis ? (
          <>
            <div className="flex flex-col items-center text-center">
              <p className="text-9xl mb-4">{diagnosis.emoji}</p>
              <p className="text-white text-lm font-semibold mb-1">나의 결제 타입은</p>
              <p className="text-white text-xl font-semibold mb-4">[{diagnosis.label}]</p>
              {diagnosis.description.map((line, index) => (
                <p key={index} className="text-white text-m font-regular mb-1">
                  {line}
                </p>
              ))}
            </div>

            <div className="flex flex-col gap-3 mt-10">
              <StoryButton text="소비 스토리 보기" onClick={() => navigate('/story/detail')} />
              <StoryButton
                text="추천 매장"
                onClick={() => navigate('/story/recommend', { state: { diagnosis } })}
              />
            </div>
          </>
        ) : (
          <p className="text-white text-m font-regular">진단 결과가 없습니다.</p>
        )}
      </div>
    </StoryLayout>
  );
};

export default StoryDiagnosisPage;
