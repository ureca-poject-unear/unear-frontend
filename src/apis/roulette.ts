// src/apis/roulette.ts

// [신규] 룰렛 결과를 서버에 전송하는 함수
// ProbabilityRoulette 컴포넌트에 있던 fetch 로직을 가져와 재사용 가능한 함수로 만듭니다.
export const sendRouletteResult = async (eventId: number, prizeName: string) => {
  const token = sessionStorage.getItem('temp_access_token');
  if (!token) {
    // 실제 프로덕션에서는 로그인 페이지로 리디렉션하거나
    // 전역 상태 관리를 통해 토큰을 갱신하는 로직이 필요할 수 있습니다.
    throw new Error('로그인 정보가 없습니다. 다시 로그인해주세요.');
  }

  // API 요청 본문을 정의합니다.
  const body = {
    // 요구사항에 맞춰 prizeName에서 개행문자를 공백으로 치환합니다.
    reward: prizeName.replace('\n', ' '),
    participated: 1, // 필요 시 이 값도 파라미터로 받을 수 있습니다.
  };

  const response = await fetch(`https://dev.unear.site/api/app/roulette/spin/${eventId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const responseData = await response.json();

  if (!response.ok) {
    // 서버에서 보내주는 에러 메시지를 사용하거나, 없을 경우 기본 메시지를 사용합니다.
    throw new Error(responseData.message || '룰렛 결과 저장에 실패했습니다.');
  }

  // 성공 시 서버로부터 받은 데이터를 반환합니다.
  return responseData;
};
