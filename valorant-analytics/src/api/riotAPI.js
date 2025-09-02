// Riot Games API 연동 모듈
// const RIOT_API_BASE_URL = 'https://kr.api.riotgames.com';
const VALORANT_API_BASE_URL = 'https://ap.api.riotgames.com';

// 개발 환경에서는 환경변수에서, 프로덕션에서는 안전한 방식으로 API 키 관리
const API_KEY = process.env.REACT_APP_RIOT_API_KEY || 'YOUR_API_KEY_HERE';

class RiotAPI {
  constructor() {
    this.apiKey = API_KEY;
    this.rateLimiter = new RateLimiter();
  }

  // 계정 정보 가져오기 (Riot ID로)
  async getAccountByRiotId(gameName, tagLine, region = 'asia') {
    const url = `https://${region}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`;
    
    try {
      const response = await this.makeRequest(url);
      return { success: true, data: response };
    } catch (error) {
      console.error('계정 정보 가져오기 실패:', error);
      return { success: false, error: error.message };
    }
  }

  // PUUID로 Valorant 플레이어 정보 가져오기
  async getValorantPlayerByPUUID(puuid) {
    const url = `${VALORANT_API_BASE_URL}/val/match/v1/matchlists/by-puuid/${puuid}`;
    
    try {
      const response = await this.makeRequest(url);
      return { success: true, data: response };
    } catch (error) {
      console.error('Valorant 플레이어 정보 가져오기 실패:', error);
      return { success: false, error: error.message };
    }
  }

  // 매치 상세 정보 가져오기
  async getMatchDetails(matchId) {
    const url = `${VALORANT_API_BASE_URL}/val/match/v1/matches/${matchId}`;
    
    try {
      const response = await this.makeRequest(url);
      return { success: true, data: response };
    } catch (error) {
      console.error('매치 상세 정보 가져오기 실패:', error);
      return { success: false, error: error.message };
    }
  }

  // 경쟁전 정보 가져오기
  async getCompetitiveUpdates(puuid, region = 'ap') {
    const url = `https://${region}.api.riotgames.com/val/ranked/v1/leaderboards/by-act/d929bc38-4ab6-7da4-94f0-ee84f8ac141e`;
    
    try {
      const response = await this.makeRequest(url);
      return { success: true, data: response };
    } catch (error) {
      console.error('경쟁전 정보 가져오기 실패:', error);
      return { success: false, error: error.message };
    }
  }

  // HTTP 요청 헬퍼 메서드
  async makeRequest(url, options = {}) {
    // Rate limiting 체크
    await this.rateLimiter.checkLimit();

    const defaultOptions = {
      method: 'GET',
      headers: {
        'X-Riot-Token': this.apiKey,
        'Content-Type': 'application/json',
        'User-Agent': 'ValorantAnalytics/1.0'
      }
    };

    const finalOptions = { ...defaultOptions, ...options };

    const response = await fetch(url, finalOptions);

    if (!response.ok) {
      throw new Error(`API 요청 실패: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  // API 키 유효성 검사
  async validateApiKey() {
    try {
      // 간단한 API 호출로 키 유효성 검사
      const url = `https://asia.api.riotgames.com/riot/account/v1/accounts/by-riot-id/test/test`;
      await this.makeRequest(url);
      return true;
    } catch (error) {
      if (error.message.includes('403')) {
        return false; // 잘못된 API 키
      }
      return true; // 다른 오류는 키가 유효할 수 있음
    }
  }
}

// 간단한 Rate Limiter 구현
class RateLimiter {
  constructor() {
    this.requests = [];
    this.personalRateLimit = 100; // 개인 API 키 제한 (2분당 100회)
    this.applicationRateLimit = 3000; // 애플리케이션 제한 (2분당 3000회)
    this.timeWindow = 120000; // 2분 (밀리초)
  }

  async checkLimit() {
    const now = Date.now();
    
    // 오래된 요청 기록 제거
    this.requests = this.requests.filter(time => now - time < this.timeWindow);
    
    // 제한 확인
    if (this.requests.length >= this.personalRateLimit) {
      const waitTime = this.timeWindow - (now - this.requests[0]);
      console.warn(`Rate limit 도달, ${waitTime}ms 대기`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    // 요청 기록 추가
    this.requests.push(now);
  }
}

// 더미 데이터 생성기 (API 키가 없을 때 사용)
export const generateDummyData = {
  account: (gameName, tagLine) => ({
    puuid: `dummy-puuid-${gameName}`,
    gameName,
    tagLine
  }),

  // 현실적인 매치 데이터 생성
  matches: (count = 5, playerName = 'TestPlayer') => {
    const agents = [
      'Jett', 'Reyna', 'Phoenix', 'Sage', 'Sova', 'Breach', 
      'Omen', 'Viper', 'Cypher', 'Raze', 'Killjoy', 'Skye',
      'Yoru', 'Astra', 'KAY/O', 'Chamber', 'Neon', 'Fade',
      'Harbor', 'Gekko', 'Deadlock', 'Iso', 'Clove'
    ];
    const maps = [
      'Bind', 'Haven', 'Split', 'Ascent', 'Icebox', 
      'Breeze', 'Fracture', 'Pearl', 'Lotus', 'Sunset'
    ];
    const ranks = [
      'Iron 1', 'Iron 2', 'Iron 3',
      'Bronze 1', 'Bronze 2', 'Bronze 3',
      'Silver 1', 'Silver 2', 'Silver 3',
      'Gold 1', 'Gold 2', 'Gold 3',
      'Platinum 1', 'Platinum 2', 'Platinum 3',
      'Diamond 1', 'Diamond 2', 'Diamond 3',
      'Ascendant 1', 'Ascendant 2', 'Ascendant 3',
      'Immortal 1', 'Immortal 2', 'Immortal 3',
      'Radiant'
    ];

    // 시간에 따른 성과 변화 시뮬레이션
    let skillTrend = Math.random() * 0.4 - 0.2; // -0.2 ~ 0.2 (하락세 ~ 상승세)
    
    return Array.from({ length: count }, (_, i) => {
      // 시간이 지날수록 실력 변화 반영
      const matchSkill = 0.5 + (skillTrend * i * 0.1);
      const performanceMultiplier = Math.max(0.3, Math.min(1.7, matchSkill + (Math.random() * 0.6 - 0.3)));
      
      const baseKills = 12 + Math.floor(performanceMultiplier * 8);
      const baseDeaths = 15 - Math.floor(performanceMultiplier * 5);
      const baseAssists = 3 + Math.floor(performanceMultiplier * 7);
      
      const kills = Math.max(0, baseKills + Math.floor(Math.random() * 10 - 5));
      const deaths = Math.max(1, baseDeaths + Math.floor(Math.random() * 8 - 4));
      const assists = Math.max(0, baseAssists + Math.floor(Math.random() * 6 - 3));
      const score = Math.floor((kills * 1.5 + assists * 0.5) * performanceMultiplier) + Math.floor(Math.random() * 5);
      
      const isWin = performanceMultiplier > 0.8 ? Math.random() > 0.3 : Math.random() > 0.6;
      const gameLength = 25 + Math.floor(Math.random() * 40); // 25-65분
      const daysAgo = Math.floor(Math.random() * 30); // 최근 30일 내
      
      return {
        matchId: `match_${Date.now()}_${i}`,
        playerName: playerName,
        agent: agents[Math.floor(Math.random() * agents.length)],
        map: maps[Math.floor(Math.random() * maps.length)],
        kills,
        deaths,
        assists,
        score,
        rank: ranks[Math.floor(Math.random() * ranks.length)],
        gameMode: Math.random() > 0.8 ? 'Unrated' : 'Competitive',
        result: isWin ? '승리' : '패배',
        gameLength,
        gameStart: new Date(Date.now() - (daysAgo * 24 * 60 * 60 * 1000)).toLocaleString('ko-KR'),
        // 추가 세부 정보
        headshots: Math.floor(kills * (0.15 + Math.random() * 0.25)), // 15-40% 헤드샷률
        bodyshots: Math.floor(kills * 0.6),
        legshots: Math.floor(kills * 0.1),
        damageDealt: Math.floor((kills * 140 + assists * 50) * performanceMultiplier),
        economyRating: Math.floor(3000 + Math.random() * 2000),
        firstBloods: Math.floor(Math.random() * 3),
        clutches: Math.random() > 0.8 ? Math.floor(Math.random() * 2) : 0
      };
    });
  },

  // 향상된 플레이어 통계
  playerStats: (playerName) => {
    const matches = generateDummyData.matches(20, playerName);
    
    // 실제 매치 데이터를 기반으로 통계 계산
    const totalMatches = matches.length;
    const wins = matches.filter(m => m.result === '승리').length;
    const winRate = Math.floor((wins / totalMatches) * 100);
    
    const avgKills = (matches.reduce((sum, m) => sum + m.kills, 0) / totalMatches).toFixed(1);
    const avgDeaths = (matches.reduce((sum, m) => sum + m.deaths, 0) / totalMatches).toFixed(1);
    const avgAssists = (matches.reduce((sum, m) => sum + m.assists, 0) / totalMatches).toFixed(1);
    
    const totalKills = matches.reduce((sum, m) => sum + m.kills, 0);
    const totalHeadshots = matches.reduce((sum, m) => sum + (m.headshots || 0), 0);
    const headShotRate = totalKills > 0 ? Math.floor((totalHeadshots / totalKills) * 100) : 0;
    
    const avgScore = (matches.reduce((sum, m) => sum + m.score, 0) / totalMatches).toFixed(1);
    const avgKDA = (matches.reduce((sum, m) => sum + ((m.kills + m.assists) / Math.max(1, m.deaths)), 0) / totalMatches).toFixed(2);
    
    // 최근 폼 분석
    const recentMatches = matches.slice(-5);
    const recentWinRate = Math.floor((recentMatches.filter(m => m.result === '승리').length / recentMatches.length) * 100);
    
    return {
      playerName,
      totalMatches: totalMatches + Math.floor(Math.random() * 50), // 추가 과거 매치
      winRate,
      avgKills: parseFloat(avgKills),
      avgDeaths: parseFloat(avgDeaths),
      avgAssists: parseFloat(avgAssists),
      avgScore: parseFloat(avgScore),
      avgKDA: parseFloat(avgKDA),
      headShotRate,
      currentRank: matches[matches.length - 1]?.rank || 'Gold 2',
      peakRank: 'Diamond 1',
      recentForm: recentWinRate >= 60 ? '상승세' : recentWinRate <= 40 ? '하락세' : '안정',
      favoriteAgent: getMostPlayedAgent(matches),
      favoriteMap: getMostPlayedMap(matches),
      // 추가 통계
      totalDamage: matches.reduce((sum, m) => sum + (m.damageDealt || 0), 0),
      avgDamagePerRound: Math.floor(matches.reduce((sum, m) => sum + (m.damageDealt || 0), 0) / (totalMatches * 13)),
      clutchSuccess: Math.floor(Math.random() * 30 + 10), // 10-40%
      firstBloodRate: Math.floor(Math.random() * 20 + 10), // 10-30%
      economyRating: Math.floor(3500 + Math.random() * 1500),
      playtime: `${Math.floor(Math.random() * 200 + 50)}시간`,
      lastPlayed: matches[matches.length - 1]?.gameStart || '오늘'
    };
  },

  // 실시간 게임 데이터 (더 현실적)
  realtimeData: () => {
    const agents = ['Jett', 'Reyna', 'Phoenix', 'Sage', 'Sova', 'Omen'];
    const maps = ['Bind', 'Haven', 'Split', 'Ascent', 'Icebox'];
    const isInGame = Math.random() > 0.7; // 30% 확률로 게임 중
    
    if (!isInGame) {
      return [{
        isInGame: false,
        gameMode: '대기중',
        map: '',
        round: 0,
        score: '0-0',
        playerAgent: '',
        kills: 0,
        deaths: 0,
        assists: 0,
        status: '로비에서 대기 중'
      }];
    }
    
    const currentRound = Math.floor(Math.random() * 24) + 1;
    const teamScore = Math.floor(Math.random() * 13);
    const enemyScore = Math.min(12, currentRound - teamScore);
    
    return [{
      isInGame: true,
      gameMode: Math.random() > 0.2 ? 'Competitive' : 'Unrated',
      map: maps[Math.floor(Math.random() * maps.length)],
      round: currentRound,
      score: `${teamScore}-${enemyScore}`,
      playerAgent: agents[Math.floor(Math.random() * agents.length)],
      kills: Math.floor(Math.random() * Math.min(20, currentRound)),
      deaths: Math.floor(Math.random() * Math.min(15, currentRound)),
      assists: Math.floor(Math.random() * Math.min(12, currentRound)),
      status: currentRound <= 12 ? '전반전' : currentRound <= 24 ? '후반전' : '연장전',
      timeRemaining: Math.floor(Math.random() * 100) + 20 // 20-120초
    }];
  }
};

// 헬퍼 함수들
function getMostPlayedAgent(matches) {
  const agentCount = {};
  matches.forEach(match => {
    const agent = match.agent;
    agentCount[agent] = (agentCount[agent] || 0) + 1;
  });
  return Object.keys(agentCount).reduce((a, b) => agentCount[a] > agentCount[b] ? a : b, 'Jett');
}

function getMostPlayedMap(matches) {
  const mapCount = {};
  matches.forEach(match => {
    const map = match.map;
    mapCount[map] = (mapCount[map] || 0) + 1;
  });
  return Object.keys(mapCount).reduce((a, b) => mapCount[a] > mapCount[b] ? a : b, 'Bind');
}

export default RiotAPI;
