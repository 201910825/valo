// 애플리케이션 설정
export const config = {
  // Riot API 설정
  riot: {
    apiKey: process.env.REACT_APP_RIOT_API_KEY || null,
    regions: {
      account: 'asia',  // 계정 정보용
      valorant: 'ap'    // Valorant 데이터용
    },
    rateLimit: {
      personal: 100,    // 개인 키 제한 (2분당)
      application: 3000, // 앱 제한 (2분당)
      timeWindow: 120000 // 2분 (밀리초)
    }
  },

  // 앱 설정
  app: {
    name: 'Valorant Analytics',
    version: '1.0.0',
    debugMode: process.env.NODE_ENV === 'development',
    useDummyData: true, // API 키 없이도 완전한 기능 테스트 가능
    showDataSource: true // 데이터 소스 표시 (개발용)
  },

  // UI 설정
  ui: {
    theme: {
      primary: '#00D4AA',
      secondary: '#FF453A',
      background: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
      text: '#ffffff',
      accent: 'rgba(255,255,255,0.1)'
    },
    animations: {
      duration: 300,
      easing: 'ease-in-out'
    }
  },

  // 데이터 설정
  data: {
    maxMatches: 20,        // 최대 매치 수
    cacheTimeout: 300000,  // 5분 캐시
    realtimeUpdateInterval: 5000 // 5초마다 실시간 업데이트
  },

  // 보안 설정
  security: {
    allowedOrigins: ['http://localhost:3000', 'file://'],
    maxRequestsPerMinute: 60
  }
};

// 환경별 설정 오버라이드
if (process.env.NODE_ENV === 'production') {
  config.app.debugMode = false;
  config.security.allowedOrigins = ['file://'];
}

// API 키 유효성 검사
export const validateConfig = () => {
  const warnings = [];
  const errors = [];

  if (!config.riot.apiKey && !config.app.useDummyData) {
    warnings.push('Riot API 키가 설정되지 않았습니다. 더미 데이터를 사용합니다.');
    config.app.useDummyData = true;
  }

  if (config.riot.apiKey && config.riot.apiKey === 'YOUR_API_KEY_HERE') {
    errors.push('기본 API 키를 실제 키로 변경해주세요.');
  }

  return { warnings, errors };
};

// 설정 정보 출력 (디버깅용)
export const printConfig = () => {
  if (config.app.debugMode) {
    console.log('🔧 Valorant Analytics 설정:');
    console.log(`- 앱 버전: ${config.app.version}`);
    console.log(`- 디버그 모드: ${config.app.debugMode}`);
    console.log(`- 더미 데이터 사용: ${config.app.useDummyData}`);
    console.log(`- API 키 설정됨: ${!!config.riot.apiKey}`);
    
    const { warnings, errors } = validateConfig();
    if (warnings.length > 0) {
      console.warn('⚠️ 경고:', warnings);
    }
    if (errors.length > 0) {
      console.error('❌ 오류:', errors);
    }
  }
};

export default config;
