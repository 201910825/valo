// Riot Games Content API 응답 처리기
// 실제 API 스키마에 맞춰 데이터를 변환하고 처리

import { VALORANT_CONTENT } from './riotAPI';

/**
 * Content API 응답을 처리하여 사용 가능한 형태로 변환
 * @param {Object} contentResponse - Riot Content API 응답
 * @returns {Object} 처리된 컨텐츠 데이터
 */
export const processContentResponse = (contentResponse) => {
  if (!contentResponse || !contentResponse.characters) {
    console.warn('Invalid content response, using fallback data');
    return VALORANT_CONTENT;
  }

  return {
    version: contentResponse.version,
    characters: processCharacters(contentResponse.characters),
    maps: processMaps(contentResponse.maps),
    gameModes: processGameModes(contentResponse.gameModes),
    acts: processActs(contentResponse.acts),
    // 추가 컨텐츠들
    chromas: contentResponse.chromas || [],
    skins: contentResponse.skins || [],
    skinLevels: contentResponse.skinLevels || [],
    equips: contentResponse.equips || [],
    sprays: contentResponse.sprays || [],
    sprayLevels: contentResponse.sprayLevels || [],
    charms: contentResponse.charms || [],
    charmLevels: contentResponse.charmLevels || [],
    playerCards: contentResponse.playerCards || [],
    playerTitles: contentResponse.playerTitles || []
  };
};

/**
 * 캐릭터 데이터 처리
 */
const processCharacters = (characters) => {
  return characters.map(char => ({
    id: char.id,
    name: char.name,
    displayName: char.localizedNames?.['ko-KR'] || char.name,
    assetName: char.assetName,
    // 역할 분류 (실제 API에는 없지만 우리가 추가)
    role: getAgentRole(char.name),
    // 인기도 (더미 데이터, 실제로는 사용 통계에서 계산)
    popularity: Math.floor(Math.random() * 100) + 1
  }));
};

/**
 * 맵 데이터 처리
 */
const processMaps = (maps) => {
  return maps.map(map => ({
    id: map.id,
    name: map.name,
    displayName: map.localizedNames?.['ko-KR'] || map.name,
    assetName: map.assetName,
    assetPath: map.assetPath,
    // 맵 타입 (실제 API에는 없지만 유용함)
    type: getMapType(map.name),
    // 활성 상태 (경쟁전에서 사용 가능한지)
    isActive: isActiveMap(map.name)
  }));
};

/**
 * 게임 모드 데이터 처리
 */
const processGameModes = (gameModes) => {
  return gameModes.map(mode => ({
    id: mode.id,
    name: mode.name,
    displayName: mode.localizedNames?.['ko-KR'] || mode.name,
    assetPath: mode.assetPath,
    // 모드 카테고리
    category: getGameModeCategory(mode.name),
    // 랭크 적용 여부
    isRanked: mode.name === 'Competitive'
  }));
};

/**
 * Act (시즌) 데이터 처리
 */
const processActs = (acts) => {
  return acts.map(act => ({
    id: act.id,
    name: act.name,
    displayName: act.localizedNames?.['ko-KR'] || act.name,
    isActive: act.isActive,
    // 시작/종료 날짜 (실제 API에서는 제공되지 않을 수 있음)
    startTime: estimateActStartTime(act.name),
    endTime: estimateActEndTime(act.name)
  }));
};

/**
 * 실제 매치 데이터를 Content API 정보와 결합
 * @param {Object} matchData - 원본 매치 데이터
 * @param {Object} contentData - 처리된 컨텐츠 데이터
 * @returns {Object} 향상된 매치 데이터
 */
export const enhanceMatchData = (matchData, contentData) => {
  if (!matchData || !contentData) return matchData;

  return {
    ...matchData,
    // 에이전트 정보 향상
    agent: enhanceAgentInfo(matchData.agent, contentData.characters),
    agentId: findAgentId(matchData.agent, contentData.characters),
    
    // 맵 정보 향상
    map: enhanceMapInfo(matchData.map, contentData.maps),
    mapId: findMapId(matchData.map, contentData.maps),
    
    // 게임 모드 정보 향상
    gameMode: enhanceGameModeInfo(matchData.gameMode, contentData.gameModes),
    gameModeId: findGameModeId(matchData.gameMode, contentData.gameModes),
    
    // 메타 정보 추가
    contentVersion: contentData.version,
    enhancedAt: new Date().toISOString()
  };
};

/**
 * 실제 Riot Match API 스키마 기반으로 매치 데이터 생성
 * Content API + Match API 구조를 결합한 현실적인 데이터
 * @param {Object} contentData - 처리된 컨텐츠 데이터
 * @param {number} count - 생성할 매치 수
 * @param {string} playerName - 플레이어 이름
 * @returns {Array} 실제 API 구조 기반 매치 데이터
 */
export const generateRealisticMatchData = (contentData, count = 5, playerName = 'TestPlayer') => {
  const characters = contentData.characters || VALORANT_CONTENT.characters;
  const maps = contentData.maps?.filter(m => m.isActive) || VALORANT_CONTENT.maps;
  const gameModes = contentData.gameModes || VALORANT_CONTENT.gameModes;
  
  // 인기 에이전트 가중치 적용
  const popularAgents = characters
    .sort((a, b) => (b.popularity || 50) - (a.popularity || 50))
    .slice(0, 12); // 상위 12개 에이전트
  
  // 활성 맵만 사용
  const activeMaps = maps.filter(m => m.isActive !== false);
  
  // 주로 사용되는 게임 모드
  const mainGameModes = gameModes.filter(m => 
    ['Competitive', 'Unrated', 'Spike Rush'].includes(m.name)
  );

  return Array.from({ length: count }, (_, i) => {
    // 에이전트 선택 (인기도 기반 가중치)
    const selectedAgent = selectWeightedAgent(popularAgents);
    const selectedMap = activeMaps[Math.floor(Math.random() * activeMaps.length)];
    const selectedMode = mainGameModes[Math.floor(Math.random() * mainGameModes.length)];
    
    // 성과 시뮬레이션
    const performance = simulatePerformance(selectedAgent, selectedMap, i);
    
    // 실제 Riot Match API 구조를 따른 데이터 생성
    const matchId = `${selectedMode.id.substring(0, 8)}-${Date.now()}-${i}`;
    const gameStartMillis = Date.now() - (Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000);
    const gameLengthMillis = (25 + Math.floor(Math.random() * 40)) * 60 * 1000;
    const puuid = `dummy-puuid-${playerName}-${i}`;
    
    return {
      // Match API 기본 구조
      matchInfo: {
        matchId,
        gameVersion: contentData.version || '8.11.0',
        gameStartMillis,
        gameLengthMillis,
        mapId: selectedMap.id,
        queueId: selectedMode.id,
        roundsPlayed: Math.floor(performance.gameLength / 2), // 대략적인 라운드 수
        isCompleted: true,
        customGameName: "",
        provisioningFlowId: "Matchmaking"
      },
      
      // 플레이어 데이터 (실제 Match API players 배열 구조)
      players: [{
        puuid,
        gameName: playerName,
        tagLine: "KR1",
        teamId: "Blue",
        characterId: selectedAgent.id,
        stats: {
          kills: performance.kills,
          deaths: performance.deaths,
          assists: performance.assists,
          score: performance.score,
          headshots: performance.headshots,
          bodyshots: performance.bodyshots,
          legshots: performance.legshots,
          damageDealt: performance.damageDealt,
          economyRating: performance.economyRating,
          firstBloods: performance.firstBloods,
          clutches: performance.clutches
        },
        competitiveTier: getCompetitiveTier(performance.rank || 'Gold 2'),
        playerCard: generateRandomPlayerCard(),
        playerTitle: generateRandomPlayerTitle()
      }],
      
      // 팀 정보
      teams: [
        {
          teamId: "Blue",
          won: performance.result === '승리',
          roundsWon: performance.result === '승리' ? 13 : Math.floor(Math.random() * 12),
          roundsLost: performance.result === '패배' ? 13 : Math.floor(Math.random() * 12)
        },
        {
          teamId: "Red", 
          won: performance.result === '패배',
          roundsWon: performance.result === '패배' ? 13 : Math.floor(Math.random() * 12),
          roundsLost: performance.result === '승리' ? 13 : Math.floor(Math.random() * 12)
        }
      ],
      
      // Content API 연결 정보 (우리 앱에서 사용)
      enhancedData: {
        agent: selectedAgent.displayName,
        agentRole: selectedAgent.role,
        map: selectedMap.displayName,
        mapType: selectedMap.type,
        gameMode: selectedMode.displayName,
        isRanked: selectedMode.isRanked,
        result: performance.result,
        gameStart: performance.gameStart,
        gameLength: performance.gameLength,
        
        // 기존 호환성을 위한 플랫 구조
        matchId,
        playerName,
        kills: performance.kills,
        deaths: performance.deaths,
        assists: performance.assists,
        score: performance.score,
        rank: performance.rank || 'Gold 2',
        
        // 메타 정보
        contentVersion: contentData.version,
        dataSource: 'riot-api-structure',
        apiCompliant: true,
        generatedAt: new Date().toISOString()
      }
    };
  });
};

// 헬퍼 함수들
const getAgentRole = (agentName) => {
  const roles = {
    'Duelist': ['Jett', 'Reyna', 'Phoenix', 'Raze', 'Yoru', 'Neon', 'Iso'],
    'Initiator': ['Sova', 'Breach', 'Skye', 'KAY/O', 'Fade', 'Gekko'],
    'Controller': ['Omen', 'Viper', 'Astra', 'Harbor', 'Clove'],
    'Sentinel': ['Sage', 'Cypher', 'Killjoy', 'Chamber', 'Deadlock']
  };
  
  for (const [role, agents] of Object.entries(roles)) {
    if (agents.includes(agentName)) return role;
  }
  return 'Unknown';
};

const getMapType = (mapName) => {
  const mapTypes = {
    'Bind': 'two-site',
    'Haven': 'three-site', 
    'Split': 'vertical',
    'Ascent': 'standard',
    'Icebox': 'vertical',
    'Breeze': 'long-range',
    'Fracture': 'h-shape',
    'Pearl': 'standard',
    'Lotus': 'three-site',
    'Sunset': 'standard',
    'Abyss': 'no-cover'
  };
  return mapTypes[mapName] || 'standard';
};

const isActiveMap = (mapName) => {
  // 현재 경쟁전에서 활성화된 맵들
  const activeMaps = ['Bind', 'Haven', 'Split', 'Ascent', 'Icebox', 'Lotus', 'Sunset', 'Abyss'];
  return activeMaps.includes(mapName);
};

const getGameModeCategory = (modeName) => {
  const categories = {
    'Competitive': 'ranked',
    'Unrated': 'standard',
    'Spike Rush': 'quick',
    'Deathmatch': 'aim-training',
    'Escalation': 'party',
    'Replication': 'party',
    'Swiftplay': 'quick'
  };
  return categories[modeName] || 'other';
};

const selectWeightedAgent = (agents) => {
  const totalWeight = agents.reduce((sum, agent) => sum + (agent.popularity || 50), 0);
  let random = Math.random() * totalWeight;
  
  for (const agent of agents) {
    random -= (agent.popularity || 50);
    if (random <= 0) return agent;
  }
  
  return agents[0]; // 폴백
};

const simulatePerformance = (agent, map, matchIndex) => {
  // 에이전트 역할에 따른 기본 성과
  const roleMultipliers = {
    'Duelist': { kills: 1.3, deaths: 1.1, assists: 0.8 },
    'Initiator': { kills: 1.0, deaths: 1.0, assists: 1.4 },
    'Controller': { kills: 0.9, deaths: 0.9, assists: 1.2 },
    'Sentinel': { kills: 0.8, deaths: 0.8, assists: 1.1 }
  };
  
  const multiplier = roleMultipliers[agent.role] || { kills: 1.0, deaths: 1.0, assists: 1.0 };
  const skillTrend = Math.sin(matchIndex * 0.3) * 0.3; // 성과 변화
  
  const baseKills = 12 + Math.floor(Math.random() * 8);
  const baseDeaths = 12 + Math.floor(Math.random() * 6);
  const baseAssists = 4 + Math.floor(Math.random() * 8);
  
  const kills = Math.max(0, Math.floor(baseKills * multiplier.kills * (1 + skillTrend)));
  const deaths = Math.max(1, Math.floor(baseDeaths * multiplier.deaths * (1 - skillTrend * 0.5)));
  const assists = Math.max(0, Math.floor(baseAssists * multiplier.assists * (1 + skillTrend * 0.3)));
  
  const kda = (kills + assists) / deaths;
  const isWin = kda > 1.2 ? Math.random() > 0.3 : Math.random() > 0.6;
  
  return {
    kills,
    deaths,
    assists,
    score: Math.floor((kills * 150 + assists * 50) * (1 + skillTrend)),
    result: isWin ? '승리' : '패배',
    
    // 상세 통계
    headshots: Math.floor(kills * (0.15 + Math.random() * 0.25)),
    bodyshots: Math.floor(kills * 0.6),
    legshots: Math.floor(kills * 0.1),
    damageDealt: Math.floor((kills * 140 + assists * 50) * (1 + skillTrend)),
    economyRating: Math.floor(3000 + Math.random() * 2000),
    firstBloods: Math.floor(Math.random() * 3),
    clutches: Math.random() > 0.8 ? Math.floor(Math.random() * 2) : 0,
    
    // 메타 정보
    gameStart: new Date(Date.now() - (Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000)).toLocaleString('ko-KR'),
    gameLength: 25 + Math.floor(Math.random() * 40)
  };
};

// 기타 헬퍼 함수들
const enhanceAgentInfo = (agentName, characters) => {
  const agent = characters.find(c => c.name === agentName || c.displayName === agentName);
  return agent ? agent.displayName : agentName;
};

const findAgentId = (agentName, characters) => {
  const agent = characters.find(c => c.name === agentName || c.displayName === agentName);
  return agent ? agent.id : null;
};

const enhanceMapInfo = (mapName, maps) => {
  const map = maps.find(m => m.name === mapName || m.displayName === mapName);
  return map ? map.displayName : mapName;
};

const findMapId = (mapName, maps) => {
  const map = maps.find(m => m.name === mapName || m.displayName === mapName);
  return map ? map.id : null;
};

const enhanceGameModeInfo = (modeName, gameModes) => {
  const mode = gameModes.find(m => m.name === modeName || m.displayName === modeName);
  return mode ? mode.displayName : modeName;
};

const findGameModeId = (modeName, gameModes) => {
  const mode = gameModes.find(m => m.name === modeName || m.displayName === modeName);
  return mode ? mode.id : null;
};

const estimateActStartTime = (actName) => {
  // Act 이름 기반으로 대략적인 시작 시간 추정
  const now = new Date();
  return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString();
};

const estimateActEndTime = (actName) => {
  // Act 이름 기반으로 대략적인 종료 시간 추정
  const now = new Date();
  return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
};

// 실제 Riot API 헬퍼 함수들
const getCompetitiveTier = (rankName) => {
  const tierMap = {
    'Iron 1': 3, 'Iron 2': 4, 'Iron 3': 5,
    'Bronze 1': 6, 'Bronze 2': 7, 'Bronze 3': 8,
    'Silver 1': 9, 'Silver 2': 10, 'Silver 3': 11,
    'Gold 1': 12, 'Gold 2': 13, 'Gold 3': 14,
    'Platinum 1': 15, 'Platinum 2': 16, 'Platinum 3': 17,
    'Diamond 1': 18, 'Diamond 2': 19, 'Diamond 3': 20,
    'Ascendant 1': 21, 'Ascendant 2': 22, 'Ascendant 3': 23,
    'Immortal 1': 24, 'Immortal 2': 25, 'Immortal 3': 26,
    'Radiant': 27
  };
  return tierMap[rankName] || 13; // 기본값 Gold 2
};

const generateRandomPlayerCard = () => {
  // 실제 Valorant 플레이어 카드 ID들 (예시)
  const playerCards = [
    '9fb348bc-41a0-91ad-8a3e-818035c4e561',
    '4f296f4c-4c5d-d1f1-4c5d-4f296f4c4c5d',
    '5a629f4e-4c5d-d1f1-4c5d-5a629f4e4c5d'
  ];
  return playerCards[Math.floor(Math.random() * playerCards.length)];
};

const generateRandomPlayerTitle = () => {
  // 실제 Valorant 플레이어 타이틀 ID들 (예시)
  const playerTitles = [
    'd13e579c-435e-4c5d-d1f1-d13e579c435e',
    'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    '6ba7b810-9dad-11d1-80b4-00c04fd430c8'
  ];
  return playerTitles[Math.floor(Math.random() * playerTitles.length)];
};

export default {
  processContentResponse,
  enhanceMatchData,
  generateRealisticMatchData
};
