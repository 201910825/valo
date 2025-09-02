// 애플리케이션 설정
export const config = {
  // Riot API 설정
  riot: {
    // PRIMARY API KEY (Content API 전용)
    primaryApiKey: process.env.REACT_APP_PRIMARY_API_KEY || null,
    // Production API KEY (Match/Account API 전용) - 아직 없음
    productionApiKey: process.env.REACT_APP_RIOT_API_KEY || null,
    
    regions: {
      account: 'asia',  // 계정 정보용
      valorant: 'ap'    // Valorant 데이터용
    },
    
    // API 엔드포인트
    endpoints: {
      content: 'https://valorant-api.com/v1', // Content API (PRIMARY KEY 사용)
      account: 'https://asia.api.riotgames.com', // Account API (Production KEY 필요)
      valorant: 'https://ap.api.riotgames.com'   // Match API (Production KEY 필요)
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
    useDummyData: false, // PRIMARY API KEY 사용으로 실제 데이터 활용
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

  // PRIMARY API KEY 검증
  if (!config.riot.primaryApiKey && !config.app.useDummyData) {
    warnings.push('PRIMARY API 키가 설정되지 않았습니다. 더미 데이터를 사용합니다.');
    config.app.useDummyData = true;
  }

  if (config.riot.primaryApiKey && config.riot.primaryApiKey === 'YOUR_PRIMARY_API_KEY_HERE') {
    errors.push('기본 PRIMARY API 키를 실제 키로 변경해주세요.');
  }

  // Production API KEY는 선택적
  if (config.riot.productionApiKey && config.riot.productionApiKey === 'YOUR_API_KEY_HERE') {
    warnings.push('Production API 키가 기본값입니다. 실제 키로 변경하면 더 많은 기능을 사용할 수 있습니다.');
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
    console.log(`- PRIMARY API 키 설정됨: ${!!config.riot.primaryApiKey}`);
    console.log(`- Production API 키 설정됨: ${!!config.riot.productionApiKey}`);
    console.log(`- 환경: ${typeof window !== 'undefined' && window.electronAPI ? 'Electron' : 'Web'}`);
    
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
