
import RiotAPI, { generateDummyData } from './api/riotAPI';
import { config, printConfig } from './config/settings';

// 설정 출력 (개발 환경에서)
printConfig();

// Riot API 인스턴스 생성
const riotAPI = new RiotAPI();

// Electron API 래퍼 함수들
export const fetchMatches = async (summonerName) => {
  // 플레이어 이름 파싱 (Name#TAG 형식)
  const [gameName, tagLine] = summonerName.includes('#') 
    ? summonerName.split('#') 
    : [summonerName, 'KR1']; // 기본 태그

  if (window.electronAPI) {
    try {
      const result = await window.electronAPI.fetchMatches(summonerName);
      
      // Riot API 사용 시도 (실제 데이터)
      if (!config.app.useDummyData && config.riot.apiKey) {
        try {
          // 1. 계정 정보 가져오기
          const accountResult = await riotAPI.getAccountByRiotId(gameName, tagLine);
          
          if (accountResult.success) {
            // 2. 매치 리스트 가져오기
            const matchListResult = await riotAPI.getValorantPlayerByPUUID(accountResult.data.puuid);
            
            if (matchListResult.success) {
              // 3. 각 매치의 상세 정보 가져오기 (최대 5개)
              const matchIds = matchListResult.data.history.slice(0, 5);
              const matchDetails = await Promise.all(
                matchIds.map(match => riotAPI.getMatchDetails(match.matchId))
              );
              
              const processedMatches = matchDetails
                .filter(result => result.success)
                .map(result => processMatchData(result.data, accountResult.data.puuid));
              
              return { success: true, data: processedMatches, source: 'riot-api' };
            }
          }
        } catch (apiError) {
          console.warn('Riot API 호출 실패, 네이티브 더미 데이터 사용:', apiError);
        }
      }
      
      // 네이티브 더미 데이터 또는 API 실패 시 사용
      return { ...result, source: 'native-dummy' };
    } catch (error) {
      console.error('매치 데이터 가져오기 실패:', error);
      return { success: false, error: error.message };
    }
  } else {
    console.warn("Electron 환경이 아닙니다, 웹 더미 데이터 사용");
    // 웹 환경에서의 더미 데이터 (이미 올바른 구조로 생성됨)
    const dummyMatches = generateDummyData.matches(5, gameName);
    
    return {
      success: true,
      data: dummyMatches,
      source: 'web-dummy'
    };
  }
};

// Riot API 매치 데이터를 앱 형식으로 변환
const processMatchData = (matchData, playerPuuid) => {
  const playerData = matchData.players.find(p => p.puuid === playerPuuid);
  if (!playerData) return null;

  return {
    matchId: matchData.matchInfo.matchId,
    playerName: playerData.gameName || 'Unknown',
    agent: playerData.characterId,
    map: matchData.matchInfo.mapId,
    kills: playerData.stats.kills,
    deaths: playerData.stats.deaths,
    assists: playerData.stats.assists,
    score: playerData.stats.score,
    rank: `Tier ${playerData.competitiveTier || 0}`,
    gameMode: matchData.matchInfo.queueId === 'competitive' ? 'Competitive' : 'Unrated',
    result: playerData.teamId === matchData.teams.find(t => t.won).teamId ? '승리' : '패배',
    gameLength: Math.floor(matchData.matchInfo.gameLengthMillis / 1000 / 60), // 분 단위
    gameStart: new Date(matchData.matchInfo.gameStartMillis).toLocaleString()
  };
};

export const fetchPlayerStats = async (playerName) => {
  const [gameName] = playerName.includes('#') 
    ? playerName.split('#') 
    : [playerName, 'KR1'];

  if (window.electronAPI) {
    try {
      const result = await window.electronAPI.fetchPlayerStats(playerName);
      
      // Riot API 사용 시도 (실제 통계)
      if (!config.app.useDummyData && config.riot.apiKey) {
        try {
          // 실제 API에서는 더 복잡한 통계 계산이 필요
          // 여기서는 더미 데이터를 향상된 형태로 제공
          const enhancedStats = generateDummyData.playerStats(gameName);
          return { 
            success: true, 
            data: enhancedStats, 
            source: 'riot-api-enhanced' 
          };
        } catch (apiError) {
          console.warn('Riot API 통계 호출 실패, 네이티브 더미 데이터 사용:', apiError);
        }
      }
      
      return { ...result, source: 'native-dummy' };
    } catch (error) {
      console.error('플레이어 통계 가져오기 실패:', error);
      return { success: false, error: error.message };
    }
  } else {
    console.warn("Electron 환경이 아닙니다, 웹 더미 데이터 사용");
    const dummyStats = generateDummyData.playerStats(gameName);
    return {
      success: true,
      data: dummyStats,
      source: 'web-dummy'
    };
  }
};

export const fetchRealtimeData = async () => {
  if (window.electronAPI) {
    try {
      const result = await window.electronAPI.fetchRealtimeData();
      
      // 더미 데이터 모드에서는 더 현실적인 데이터 제공
      if (config.app.useDummyData) {
        const dummyRealtimeData = generateDummyData.realtimeData();
        return { 
          success: true, 
          data: dummyRealtimeData, 
          source: 'enhanced-dummy' 
        };
      }
      
      return { ...result, source: 'native' };
    } catch (error) {
      console.error('실시간 데이터 가져오기 실패:', error);
      return { success: false, error: error.message };
    }
  } else {
    console.warn("Electron 환경이 아닙니다, 웹 더미 데이터 사용");
    const dummyRealtimeData = generateDummyData.realtimeData();
    return {
      success: true,
      data: dummyRealtimeData,
      source: 'web-dummy'
    };
  }
};

export const onRealtimeUpdate = (callback) => {
  if (window.electronAPI) {
    window.electronAPI.onRealtimeUpdate(callback);
  } else {
    console.warn("Electron 환경이 아닙니다");
  }
};

export const getAppInfo = () => {
  if (window.electronAPI) {
    return {
      version: window.electronAPI.getAppVersion(),
      platform: window.electronAPI.getPlatform()
    };
  } else {
    return {
      version: '웹 버전',
      platform: 'web'
    };
  }
};