// Riot Games API 연동 모듈
// const RIOT_API_BASE_URL = 'https://kr.api.riotgames.com';
const VALORANT_API_BASE_URL = 'https://ap.api.riotgames.com';

// 개발 환경에서는 환경변수에서, 프로덕션에서는 안전한 방식으로 API 키 관리
const API_KEY = process.env.REACT_APP_RIOT_API_KEY ;

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

  // Content API로 게임 데이터 가져오기
  async getValorantContent(locale = 'ko-KR') {
    const url = `${VALORANT_API_BASE_URL}/val/content/v1/contents?locale=${locale}`;
    
    try {
      const response = await this.makeRequest(url);
      return { success: true, data: response };
    } catch (error) {
      console.error('Content API 호출 실패:', error);
      return { success: false, error: error.message, fallback: VALORANT_CONTENT };
    }
  }

  // 매치 데이터를 실제 Content API 구조로 변환
  processMatchData(matchData, contentData = VALORANT_CONTENT) {
    if (!matchData || !matchData.players) return null;

    return matchData.players.map(player => {
      const agent = contentData.characters.find(c => c.id === player.characterId);
      const map = contentData.maps.find(m => m.id === matchData.matchInfo.mapId);
      
      return {
        matchId: matchData.matchInfo.matchId,
        playerName: player.gameName,
        agent: agent?.name || 'Unknown',
        agentId: player.characterId,
        map: map?.name || 'Unknown',
        mapId: matchData.matchInfo.mapId,
        kills: player.stats.kills,
        deaths: player.stats.deaths,
        assists: player.stats.assists,
        score: player.stats.score,
        gameMode: matchData.matchInfo.queueId,
        result: player.teamId === matchData.teams.find(t => t.won)?.teamId ? '승리' : '패배',
        gameLength: Math.floor(matchData.matchInfo.gameLengthMillis / 1000 / 60),
        gameStart: new Date(matchData.matchInfo.gameStartMillis).toLocaleString('ko-KR'),
        // 세부 통계
        headshots: player.stats.headshots,
        bodyshots: player.stats.bodyshots,
        legshots: player.stats.legshots,
        damageDealt: player.stats.totalDamage,
        economyRating: player.stats.economyRating,
        firstBloods: player.stats.firstBloods || 0,
        roundsPlayed: matchData.matchInfo.roundsPlayed
      };
    });
  }

  // API 키 유효성 검사
  async validateApiKey() {
    try {
      // Content API로 키 유효성 검사 (더 안전함)
      const result = await this.getValorantContent();
      return result.success;
    } catch (error) {
      console.error('API 키 검증 실패:', error);
      return false;
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

// Riot Games Content API 스키마 기반 데이터
export const VALORANT_CONTENT = {
  // 실제 Riot API Content 구조
  characters: [
    { name: 'Jett', id: 'add6443a-41bd-e414-f6ad-e58d267f4e95', assetName: 'Jett_PrimaryAsset' },
    { name: 'Reyna', id: 'a3bfb853-43b2-7238-a4f1-ad90e9e46bcc', assetName: 'Vampire_PrimaryAsset' },
    { name: 'Phoenix', id: 'eb93336a-449b-9c1b-0a54-a891f7921d69', assetName: 'Phoenix_PrimaryAsset' },
    { name: 'Sage', id: '569fdd95-4d10-43ab-ca70-79becc718b46', assetName: 'Sage_PrimaryAsset' },
    { name: 'Sova', id: '320b2a48-4d9b-a075-30f1-1f93a9b638fa', assetName: 'Sova_PrimaryAsset' },
    { name: 'Breach', id: '5f8d3a7f-467b-97f3-062c-13acf203c006', assetName: 'Breach_PrimaryAsset' },
    { name: 'Omen', id: '8e253930-4c05-31dd-1b6c-968525494517', assetName: 'Wraith_PrimaryAsset' },
    { name: 'Viper', id: '707eab51-4836-f488-046a-cda6bf494859', assetName: 'Pandemic_PrimaryAsset' },
    { name: 'Cypher', id: '117ed9e3-49f3-6512-3ccf-0cada7e3823b', assetName: 'Cypher_PrimaryAsset' },
    { name: 'Raze', id: 'f94c3b30-42be-e959-889c-5aa313dba261', assetName: 'Clay_PrimaryAsset' },
    { name: 'Killjoy', id: '1e58de9c-4950-5125-93e9-a0aee9f98746', assetName: 'Killjoy_PrimaryAsset' },
    { name: 'Skye', id: '6f2a04ca-43e0-be17-7f36-b3908627744d', assetName: 'Guide_PrimaryAsset' },
    { name: 'Yoru', id: '7f94d92c-4234-0a36-9646-3a87eb8b5c89', assetName: 'Stealth_PrimaryAsset' },
    { name: 'Astra', id: '41fb69c1-4189-7b37-f117-bcaf1e96f1bf', assetName: 'Rift_PrimaryAsset' },
    { name: 'KAY/O', id: '601dbbe7-43ce-be57-2a40-4abd24953621', assetName: 'Grenadier_PrimaryAsset' },
    { name: 'Chamber', id: '22697a3d-45bf-8dd7-4fec-84a9e28c69d7', assetName: 'Deadeye_PrimaryAsset' },
    { name: 'Neon', id: 'bb2a4828-46eb-8cd1-e765-15848195d751', assetName: 'Sprinter_PrimaryAsset' },
    { name: 'Fade', id: 'a5f49c6e-4960-5cc9-6f7f-5c9b3dc23aa4', assetName: 'BountyHunter_PrimaryAsset' },
    { name: 'Harbor', id: '95b78ed7-4637-86d9-7e41-71ba8c293152', assetName: 'Mage_PrimaryAsset' },
    { name: 'Gekko', id: 'e370fa57-4757-3604-3648-499e1f642d3f', assetName: 'Aggrobot_PrimaryAsset' },
    { name: 'Deadlock', id: 'cc8b64c8-4b25-4ff9-6e7f-37b4da43d235', assetName: 'Lockdown_PrimaryAsset' },
    { name: 'Iso', id: '0e38b510-41a8-5780-5e8f-568b2a4f2d6c', assetName: 'Iso_PrimaryAsset' },
    { name: 'Clove', id: '1dbf2edd-4729-0984-3115-daa5eed44993', assetName: 'Clove_PrimaryAsset' }
  ],
  
  maps: [
    { name: 'Bind', id: '2c9d57ec-4431-9c5e-2939-8f9ef6dd5caa', assetPath: '/Game/Maps/Bonsai/Bonsai' },
    { name: 'Haven', id: '2bee0dc9-4ffe-519b-1cbd-7fbe763a6047', assetPath: '/Game/Maps/Triad/Triad' },
    { name: 'Split', id: 'd960549e-485c-e861-8d71-aa9d1aed12a2', assetPath: '/Game/Maps/Duality/Duality' },
    { name: 'Ascent', id: '7eaecc1b-4337-bbf6-6ab9-04b8f06b3319', assetPath: '/Game/Maps/Ascent/Ascent' },
    { name: 'Icebox', id: 'e2ad5c54-4114-a870-9641-8ea21279579a', assetPath: '/Game/Maps/Port/Port' },
    { name: 'Breeze', id: '2fb9a4fd-47b8-4e7d-a969-74b4046ebd53', assetPath: '/Game/Maps/Foxtrot/Foxtrot' },
    { name: 'Fracture', id: 'b529448b-4d60-346e-e89e-00a4c527a405', assetPath: '/Game/Maps/Canyon/Canyon' },
    { name: 'Pearl', id: 'fd267378-4d1d-484f-ff52-77821ed10dc2', assetPath: '/Game/Maps/Pitt/Pitt' },
    { name: 'Lotus', id: '2fe4ed3a-450a-948b-6d6b-e89a78e680a9', assetPath: '/Game/Maps/Jam/Jam' },
    { name: 'Sunset', id: '92584fbe-486a-b1b2-9faa-39b0f486b498', assetPath: '/Game/Maps/Juliett/Juliett' },
    { name: 'Abyss', id: '224b9a95-a7b3-43a4-8b52-0691a0cad7c7', assetPath: '/Game/Maps/Infinity/Infinity' }
  ],

  gameModes: [
    { name: 'Competitive', id: '96bd3920-4f36-d026-2b28-c683eb0bcac5', assetPath: '/Game/GameModes/Bomb/BombGameMode' },
    { name: 'Unrated', id: 'e2dc3878-4fe5-d132-28f8-3d8c259efcc6', assetPath: '/Game/GameModes/Bomb/BombGameMode' },
    { name: 'Spike Rush', id: 'e921d1e6-416b-c31f-1291-74930c330b7b', assetPath: '/Game/GameModes/QuickBomb/QuickBombGameMode' },
    { name: 'Deathmatch', id: 'a8790ec5-4237-f2f0-e93b-08a8e89865b2', assetPath: '/Game/GameModes/Deathmatch/DeathmatchGameMode' },
    { name: 'Escalation', id: '57038d6d-49bb-65e0-ac2e-6fb39d41afa6', assetPath: '/Game/GameModes/GunGame/GunGameGameMode' },
    { name: 'Replication', id: '4744698a-4513-dc96-9c22-83c399c4e4fd', assetPath: '/Game/GameModes/OneForAll/OneForAllGameMode' },
    { name: 'Swiftplay', id: '33b776b8-4582-8aa2-0eb9-c9931c5e26dd', assetPath: '/Game/GameModes/SwiftPlay/SwiftPlayGameMode' }
  ],

  ranks: [
    { name: 'Iron 1', tier: 3, id: 'iron-1' }, { name: 'Iron 2', tier: 4, id: 'iron-2' }, { name: 'Iron 3', tier: 5, id: 'iron-3' },
    { name: 'Bronze 1', tier: 6, id: 'bronze-1' }, { name: 'Bronze 2', tier: 7, id: 'bronze-2' }, { name: 'Bronze 3', tier: 8, id: 'bronze-3' },
    { name: 'Silver 1', tier: 9, id: 'silver-1' }, { name: 'Silver 2', tier: 10, id: 'silver-2' }, { name: 'Silver 3', tier: 11, id: 'silver-3' },
    { name: 'Gold 1', tier: 12, id: 'gold-1' }, { name: 'Gold 2', tier: 13, id: 'gold-2' }, { name: 'Gold 3', tier: 14, id: 'gold-3' },
    { name: 'Platinum 1', tier: 15, id: 'plat-1' }, { name: 'Platinum 2', tier: 16, id: 'plat-2' }, { name: 'Platinum 3', tier: 17, id: 'plat-3' },
    { name: 'Diamond 1', tier: 18, id: 'diamond-1' }, { name: 'Diamond 2', tier: 19, id: 'diamond-2' }, { name: 'Diamond 3', tier: 20, id: 'diamond-3' },
    { name: 'Ascendant 1', tier: 21, id: 'asc-1' }, { name: 'Ascendant 2', tier: 22, id: 'asc-2' }, { name: 'Ascendant 3', tier: 23, id: 'asc-3' },
    { name: 'Immortal 1', tier: 24, id: 'imm-1' }, { name: 'Immortal 2', tier: 25, id: 'imm-2' }, { name: 'Immortal 3', tier: 26, id: 'imm-3' },
    { name: 'Radiant', tier: 27, id: 'radiant' }
  ]
};

// Content API 호출 함수
export const getValorantContent = async (apiKey) => {
  try {
    const response = await fetch('https://ap.api.riotgames.com/val/content/v1/contents?locale=ko-KR', {
      headers: {
        'X-Riot-Token': apiKey,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Content API 호출 실패: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.warn('Content API 호출 실패, 로컬 데이터 사용:', error.message);
    return VALORANT_CONTENT;
  }
};

// 더미 데이터 생성기 (API 키가 없을 때 사용)
export const generateDummyData = {
  account: (gameName, tagLine) => ({
    puuid: `dummy-puuid-${gameName}`,
    gameName,
    tagLine
  }),

  // 현실적인 매치 데이터 생성 (Content API 기반)
  matches: (count = 5, playerName = 'TestPlayer') => {
    const agents = VALORANT_CONTENT.characters.map(c => c.name);
    const maps = VALORANT_CONTENT.maps.map(m => m.name);
    const ranks = VALORANT_CONTENT.ranks.map(r => r.name);
    const gameModes = VALORANT_CONTENT.gameModes.map(g => g.name);

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
        gameMode: gameModes[Math.random() > 0.2 ? 0 : Math.floor(Math.random() * 2)], // 주로 Competitive/Unrated
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

  // 실시간 게임 데이터 (Content API 기반)
  realtimeData: () => {
    const agents = VALORANT_CONTENT.characters.slice(0, 10).map(c => c.name); // 인기 에이전트 10개
    const maps = VALORANT_CONTENT.maps.slice(0, 7).map(m => m.name); // 활성 맵들
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
