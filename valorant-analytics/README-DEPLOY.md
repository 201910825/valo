# 🚀 Valorant Analytics - Vercel 배포 가이드

## 📋 배포 준비 상태

✅ **React 앱 빌드 완료**
✅ **더미 데이터 모드 활성화** (API 키 불필요)
✅ **Vercel 설정 파일 준비**
✅ **모든 기능 웹 환경에서 테스트 완료**

## 🎯 배포 특징

### 완전한 기능 제공
- 🔍 **플레이어 검색**: 실제와 동일한 검색 경험
- 📊 **상세 분석**: KDA, 승률, 성장 차트 등
- 🎮 **실시간 시뮬레이션**: 게임 상태 모니터링
- 📈 **트렌드 분석**: 상승세/하락세 판단
- 🎯 **개인화 인사이트**: AI 기반 조언 시스템

### 현실적인 더미 데이터
- 25개 최신 에이전트 (Clove, Iso 포함)
- 10개 최신 맵 (Sunset 포함)
- 시간에 따른 실력 변화 시뮬레이션
- 실제 게임과 유사한 통계 분포

## 🚀 Vercel 배포 방법

### 방법 1: Vercel CLI 사용

```bash
# Vercel CLI 설치 (처음 한 번만)
npm i -g vercel

# 프로젝트 디렉토리에서 배포
cd valorant-analytics
vercel

# 프로덕션 배포
vercel --prod
```

### 방법 2: GitHub 연동 (권장)

1. **GitHub 저장소에 푸시**
```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

2. **Vercel 대시보드에서 연결**
- [vercel.com](https://vercel.com) 접속
- "New Project" 클릭
- GitHub 저장소 연결
- `valorant-analytics` 폴더 선택
- 자동 배포 시작

### 방법 3: 드래그 앤 드롭

1. **빌드 폴더 준비**
```bash
npm run build
```

2. **Vercel에서 배포**
- [vercel.com](https://vercel.com) 접속
- `build` 폴더를 드래그 앤 드롭

## ⚙️ 환경 변수 설정

Vercel 대시보드에서 다음 환경 변수를 설정하세요:

```
REACT_APP_ENV=production
REACT_APP_USE_DUMMY_DATA=true
```

## 🔧 도메인 설정 (선택사항)

Vercel에서 커스텀 도메인을 설정할 수 있습니다:
- 예: `valorant-analytics.vercel.app`
- 또는 본인 도메인 연결 가능

## 📱 배포 후 테스트

배포 완료 후 다음 기능들을 테스트해보세요:

1. **플레이어 검색**
   - 아무 이름이나 입력 (예: "TestPlayer")
   - 태그 포함 검색 (예: "Player#KR1")

2. **분석 기능**
   - 매치 히스토리 확인
   - 성장 차트 확인
   - 팀 분석 확인

3. **실시간 데이터**
   - 상단의 실시간 상태 확인
   - 새로고침 버튼 테스트

## 🎨 커스터마이징

### 브랜딩 변경
- `public/index.html`: 타이틀, 메타 태그
- `public/favicon.ico`: 파비콘
- `src/config/settings.js`: 앱 이름, 테마 색상

### 기능 확장
- `src/api/riotAPI.js`: 더미 데이터 로직
- `src/components/`: UI 컴포넌트
- `src/config/settings.js`: 앱 설정

## 🚨 주의사항

### API 키 관련
- 현재는 더미 데이터 모드로 배포
- 실제 Riot API 키는 나중에 추가
- 환경 변수로 안전하게 관리

### 성능 최적화
- 이미지 최적화 권장
- 불필요한 의존성 제거
- 코드 스플리팅 고려

## 📊 배포 후 모니터링

Vercel에서 제공하는 분석 도구:
- 방문자 통계
- 성능 메트릭
- 오류 로그
- 배포 히스토리

## 🔄 업데이트 배포

코드 변경 후 자동 배포:
```bash
git add .
git commit -m "Update: 새로운 기능 추가"
git push origin main
# Vercel이 자동으로 새 버전 배포
```

## 💡 팁

1. **빠른 테스트**: 로컬에서 `npm run serve`로 프로덕션 빌드 테스트
2. **미리보기**: Vercel은 PR마다 미리보기 URL 생성
3. **롤백**: 문제 시 Vercel 대시보드에서 이전 버전으로 쉽게 롤백

---

🎉 **준비 완료!** 이제 Vercel에 배포하여 전 세계에 Valorant Analytics를 공개할 수 있습니다!
