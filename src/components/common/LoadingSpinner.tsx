interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'white' | 'gray';
  className?: string;
}

const LoadingSpinner = ({
  size = 'md',
  color = 'primary',
  className = '',
}: LoadingSpinnerProps) => {
  // 크기별 클래스 매핑
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-4',
  };

  // 색상별 클래스 매핑
  const colorClasses = {
    primary: 'border-primary border-t-transparent',
    white: 'border-white border-t-transparent',
    gray: 'border-gray-500 border-t-transparent',
  };

  return (
    <div
      className={`
        animate-spin 
        rounded-full 
        ${sizeClasses[size]} 
        ${colorClasses[color]}
        ${className}
      `}
      aria-label="로딩 중"
      role="status"
    >
      <span className="sr-only">로딩 중...</span>
    </div>
  );
};

export default LoadingSpinner;

/*
사용법:

1. 기본 사용:
<LoadingSpinner />

2. 크기 지정:
<LoadingSpinner size="lg" />

3. 색상 지정:
<LoadingSpinner color="white" />

4. 커스텀 스타일:
<LoadingSpinner className="mx-auto" />

5. 조합 사용:
<LoadingSpinner size="lg" color="primary" className="my-4" />
*/
