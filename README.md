# 🎮 Valorant Analytics

현대적인 Electron + React + C++ 기반의 Valorant 게임 분석 도구입니다.

## ✨ 주요 기능

- **🔍 플레이어 검색**: Riot ID 기반 플레이어 정보 조회
- **📊 매치 분석**: 상세한 게임 기록 및 통계 분석  
- **📈 성장 추적**: 시각적 성과 차트 및 트렌드 분석
- **⚡ 실시간 모니터링**: 현재 게임 상태 추적
- **🎨 모던 UI**: 게이밍에 최적화된 다크 테마 인터페이스

## 🏗️ 기술 스택

### Frontend
- **React 18**: 선언형 UI 컴포넌트
- **Modern JavaScript**: ES6+ 문법 활용
- **CSS-in-JS**: 동적 스타일링

### Backend  
- **Electron**: 크로스플랫폼 데스크톱 앱
- **C++ Native Modules**: 고성능 데이터 처리
- **Node.js**: API 통신 및 데이터 가공

### Data Sources
- **Riot Games API**: 공식 게임 데이터 (선택적)
- **Native Data Processing**: 로컬 데이터 분석
- **Smart Fallback**: 개발용 더미 데이터

## 🚀 빠른 시작

### 1. 의존성 설치
```bash
# 루트 프로젝트 의존성
npm install

# React 앱 의존성  
cd valorant-analytics && npm install && cd ..

# 네이티브 모듈 의존성
cd native && npm install && cd ..
```

### 2. 네이티브 모듈 빌드
```bash
npm run rebuild-native
```

### 3. 개발 환경 실행

**방법 1: 스크립트 사용 (권장)**
```bash
./start-dev.sh
```

**방법 2: npm 명령어**
```bash
npm run dev
```

**방법 3: 수동 실행**
```bash
# 터미널 1: React 개발 서버
cd valorant-analytics && npm start

# 터미널 2: Electron 앱 (React 서버 시작 후)
npm run electron
```

## 🔧 설정

### 🎯 더미 데이터 모드 (현재 기본 설정)
현재 **더미 데이터 모드**로 설정되어 있어 API 키 없이도 모든 기능을 완벽하게 테스트할 수 있습니다:

- ✅ **현실적인 매치 데이터**: 실제 게임과 유사한 KDA, 에이전트, 맵 정보
- ✅ **성장 트렌드 시뮬레이션**: 시간에 따른 실력 변화 반영
- ✅ **실시간 게임 상태**: 30% 확률로 게임 중 상태 시뮬레이션
- ✅ **완전한 통계 분석**: 승률, 선호 에이전트/맵, 최근 폼 등
- ✅ **25개 에이전트 지원**: 최신 Valorant 에이전트 포함
- ✅ **10개 맵 지원**: Sunset까지 최신 맵 포함

### Riot API 연동 (나중에 설정)
실제 서비스 배포 시 다음과 같이 설정하세요:

1. [Riot Developer Portal](https://developer.riotgames.com/)에서 API 키 발급
2. `valorant-analytics/src/config/settings.js` 파일에서 설정 변경:
```javascript
app: {
  useDummyData: false, // 실제 API 사용
  showDataSource: false // 프로덕션에서는 숨김
},
riot: {
  apiKey: 'YOUR_RIOT_API_KEY_HERE'
}
```

**참고**: 개발 단계에서는 더미 데이터로도 충분히 모든 기능을 검증할 수 있습니다.

### 개발 모드 설정
- **자동 리로드**: 코드 변경 시 자동 새로고침
- **개발자 도구**: Electron 앱에서 자동 열림
- **더미 데이터**: API 키 없이도 모든 기능 테스트 가능

## 📱 사용법

### 플레이어 검색
1. 앱 상단의 검색창에 플레이어 정보 입력
2. 형식: `PlayerName#TAG` (예: `Hide on bush#KR1`)
3. 태그 생략 시 기본값 `KR1` 사용

### 분석 결과 확인
- **플레이어 통계**: 승률, 평균 KDA, 헤드샷 비율 등
- **매치 히스토리**: 최근 게임 기록 및 상세 정보
- **성장 차트**: 시각적 성과 트렌드
- **실시간 상태**: 현재 게임 진행 상황 (5초마다 업데이트)

## 🛠️ 개발 가이드

### 프로젝트 구조
```
valo/
├── main.js              # Electron 메인 프로세스
├── preload.js           # Electron 프리로드 스크립트
├── native/              # C++ 네이티브 모듈
│   ├── binding.gyp      # 빌드 설정
│   ├── tracker.cpp      # 네이티브 코드
│   └── package.json     # 네이티브 의존성
├── valorant-analytics/  # React 앱
│   ├── src/
│   │   ├── api/         # API 클라이언트
│   │   ├── components/  # React 컴포넌트
│   │   ├── config/      # 앱 설정
│   │   └── ipc.js       # IPC 통신 래퍼
│   └── package.json     # React 의존성
└── package.json         # 루트 의존성
```

### 주요 명령어
```bash
npm run dev              # 개발 모드 실행
npm run build           # 프로덕션 빌드
npm run rebuild-native  # 네이티브 모듈 재빌드
npm run test           # 테스트 실행
```

### 디버깅
- **React DevTools**: 브라우저 확장 프로그램 사용
- **Electron DevTools**: 앱에서 자동으로 열림 (개발 모드)
- **Console Logs**: 터미널과 DevTools에서 로그 확인

## 🔍 문제 해결

### 자주 발생하는 오류

**1. `net::ERR_FILE_NOT_FOUND` 오류**
- 원인: React 개발 서버가 실행되지 않음
- 해결: `cd valorant-analytics && npm start` 실행 후 Electron 시작

**2. 네이티브 모듈 빌드 실패**
- 원인: C++ 컴파일러 또는 node-gyp 문제
- 해결: `npm run rebuild-native` 실행

**3. API 호출 실패**
- 원인: Riot API 키 문제 또는 네트워크 오류
- 해결: 더미 데이터 모드로 테스트 (`useDummyData: true`)

### 로그 확인
```bash
# Electron 메인 프로세스 로그
npm run electron

# React 개발 서버 로그  
cd valorant-analytics && npm start
```

## 📋 로드맵

### Phase 1: 기능 완성 ✅
- [x] Electron + React 통합
- [x] C++ 네이티브 모듈
- [x] IPC 통신 시스템
- [x] UI/UX 개선
- [x] Riot API 연동 준비

### Phase 2: 고급 기능
- [ ] 실제 Riot API 데이터 연동
- [ ] 로컬 데이터베이스 (SQLite)
- [ ] 사용자 설정 저장
- [ ] 고급 분석 알고리즘

### Phase 3: 상용화
- [ ] 자동 업데이트 시스템
- [ ] 오류 리포팅
- [ ] 사용자 인증
- [ ] 앱 스토어 배포

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## ⚠️ 면책 조항

이 프로젝트는 Riot Games와 공식적으로 연관되지 않습니다. Valorant는 Riot Games, Inc.의 상표입니다.

---

💡 **문의사항이나 버그 리포트는 Issues 탭을 이용해주세요!**
