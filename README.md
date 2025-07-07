# 🧩 UNEAR 프론트엔드 레포지토리

본 프로젝트는 React + Vite + Tailwind 기반으로 제작되었으며,  
Docker를 활용해 누구나 동일한 환경에서 쉽게 실행하고 확인할 수 있습니다.

---

## 📦 기술 스택

- **Frontend**: React, Vite, Tailwind CSS
- **Node.js**: v22 (Docker 컨테이너 내부 기준)
- **패키지 매니저**: npm
- **스타일링**: Tailwind CSS

---

## 🚀 빠르게 실행하기 (Docker 사용)

### ✅ 1. 레포지토리 클론

```bash
git clone https://github.com/your-org/unear-frontend.git
cd unear-frontend
```

### ✅ 2. Docker 이미지 빌드

```bash
docker build -t docker/unear-fe -f Dockerfile .
```

### ✅ 3. Docker 이미지 실행

```bash
docker run -p 3000:4000 docker/unear-fe
```

➡ 브라우저에서 접속: [http://localhost:3000](http://localhost:3000)

---

## ⚙️ 로컬 개발 환경 실행 (선택)

프론트엔드 개발자는 로컬에서도 실행 가능합니다.

```bash
npm install
npm run dev
```

➡ 브라우저에서 접속: [http://localhost:4000](http://localhost:4000)

※ Vite 개발 서버는 모든 네트워크에서 접근 가능하도록 `--host` 플래그가 설정되어 있습니다.

---
