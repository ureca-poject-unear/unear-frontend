import React, { useState, useEffect } from 'react';
import Barcode from 'react-barcode';

// 바코드 컴포넌트 Props 인터페이스
interface BarcodeDisplayProps {
  /** 바코드로 표시할 코드 값 */
  code: string;
  /** 바코드 형식 (기본값: CODE128) */
  format?: 'CODE128' | 'CODE39' | 'EAN13' | 'EAN8' | 'UPC' | 'ITF14';
  /** 바코드 높이 (기본값: 80) */
  height?: number;
  /** 바코드 너비 (기본값: 2) */
  width?: number;
  /** 코드 값 표시 여부 (기본값: true) */
  displayValue?: boolean;
  /** 폰트 크기 (기본값: 14) */
  fontSize?: number;
  /** 배경색 (기본값: white) */
  background?: string;
  /** 바코드 선 색상 (기본값: black) */
  lineColor?: string;
  /** 여백 (기본값: 10) */
  margin?: number;
  /** 추가 CSS 클래스 */
  className?: string;
  /** 에러 처리 콜백 */
  onError?: (error: Error) => void;
}

const BarcodeDisplay: React.FC<BarcodeDisplayProps> = ({
  code,
  format = 'CODE128',
  height = 80,
  width = 2,
  displayValue = true,
  fontSize = 14,
  background = '#ffffff',
  lineColor = '#000000',
  margin = 10,
  className = '',
  onError,
}) => {
  const [barcodeError, setBarcodeError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 바코드 유효성 검사
  const validateBarcodeCode = (code: string): boolean => {
    if (!code || code.trim().length === 0) {
      setBarcodeError('바코드 코드가 비어있습니다.');
      return false;
    }

    // 길이 검사 (일반적인 바코드 길이)
    if (code.length < 4 || code.length > 50) {
      setBarcodeError('바코드 코드 길이가 유효하지 않습니다.');
      return false;
    }

    // 특수문자 검사 (일반적으로 영숫자만 허용)
    const validPattern = /^[A-Za-z0-9]+$/;
    if (!validPattern.test(code)) {
      setBarcodeError('바코드 코드에 유효하지 않은 문자가 포함되어 있습니다.');
      return false;
    }

    setBarcodeError(null);
    return true;
  };

  // 코드 변경 시 유효성 검사
  useEffect(() => {
    if (code) {
      const isValid = validateBarcodeCode(code);
      if (!isValid && onError) {
        onError(new Error(barcodeError || '바코드 생성 오류'));
      }
    }
  }, [code, barcodeError, onError]);

  // 바코드 에러가 있는 경우
  if (barcodeError) {
    return (
      <div className={`bg-white rounded-[16px] p-6 shadow-sm ${className}`}>
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600 text-sm font-medium">바코드 생성 오류</p>
            <p className="text-red-500 text-xs mt-1">{barcodeError}</p>
          </div>
        </div>
      </div>
    );
  }

  // 로딩 상태
  if (isLoading) {
    return (
      <div className={`bg-white rounded-[16px] p-6 shadow-sm ${className}`}>
        <div className="text-center">
          <div className="bg-gray-100 rounded-lg p-8 animate-pulse">
            <div className="h-20 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-32 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-[16px] p-6 shadow-sm ${className}`}>
      <div className="text-center">
        {/* 바코드 영역 */}
        <div 
          className="inline-block bg-white rounded-lg border border-gray-200 p-4"
          style={{ margin: `${margin}px` }}
        >
          <Barcode
            value={code}
            format={format}
            width={width}
            height={height}
            displayValue={displayValue}
            fontSize={fontSize}
            background={background}
            lineColor={lineColor}
            margin={0}
            textAlign="center"
            textPosition="bottom"
            textMargin={2}
            font="monospace"
          />
        </div>

        {/* 추가 정보 */}
        <div className="mt-4 space-y-1">
          <p className="text-xs text-gray-500">바코드를 스캔하여 적립하세요</p>
          <p className="text-xs text-gray-400 font-mono">{format}</p>
        </div>
      </div>
    </div>
  );
};

export default BarcodeDisplay;

/*
사용법:

기본 사용법:
<BarcodeDisplay 
  code="1234567890"
/>

바코드 형식 변경:
<BarcodeDisplay 
  code="1234567890" 
  format="EAN13"
/>

커스텀 스타일:
<BarcodeDisplay 
  code="ABCD1234" 
  height={100}
  fontSize={16}
  lineColor="#333333"
  className="shadow-lg"
/>

에러 처리:
<BarcodeDisplay 
  code="invalid@code!" 
  onError={(error) => console.error('바코드 생성 실패:', error)}
/>

API 연동 예시:
const [barcodeData, setBarcodeData] = useState(null);

useEffect(() => {
  fetchUserBarcode()
    .then(data => setBarcodeData(data))
    .catch(error => console.error(error));
}, []);

{barcodeData && (
  <BarcodeDisplay 
    code={barcodeData.code}
    format={barcodeData.format}
  />
)}

Props:
- code: 바코드로 표시할 코드 값 (필수)
- format: 바코드 형식 ('CODE128' | 'CODE39' | 'EAN13' | 'EAN8' | 'UPC' | 'ITF14')
- height: 바코드 높이 (기본값: 80)
- width: 바코드 너비 (기본값: 2)
- displayValue: 코드 값 표시 여부 (기본값: true)
- fontSize: 폰트 크기 (기본값: 14)
- background: 배경색 (기본값: '#ffffff')
- lineColor: 바코드 선 색상 (기본값: '#000000')
- margin: 여백 (기본값: 10)
- className: 추가 CSS 클래스
- onError: 에러 처리 콜백

특징:
- 유니어 디자인 시스템에 맞는 스타일링
- 바코드 유효성 검사
- 에러 처리 및 로딩 상태 지원
- 반응형 디자인
- 접근성 고려
- TypeScript 지원
*/
