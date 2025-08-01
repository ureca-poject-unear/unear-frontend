export function getImageUrl(imagePath: string) {
  if (!imagePath) return '/assets/common/default.png';

  // 로컬 이미지 경로인 경우
  if (imagePath.startsWith('/assets/')) return imagePath;

  // S3 이미지 경로로 변환
  return `https://unear-uploads.s3.ap-southeast-2.amazonaws.com/${imagePath}`;
}
