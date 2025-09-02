const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // 매치 데이터 가져오기
  fetchMatches: (summonerName) => ipcRenderer.invoke('fetch-matches', summonerName),
  
  // 플레이어 통계 가져오기
  fetchPlayerStats: (playerName) => ipcRenderer.invoke('fetch-player-stats', playerName),
  
  // 실시간 데이터 가져오기
  fetchRealtimeData: () => ipcRenderer.invoke('fetch-realtime-data'),
  
  // 실시간 업데이트 리스너
  onRealtimeUpdate: (callback) => {
    ipcRenderer.on('realtime-update', (event, data) => callback(data));
  },
  
  // 리스너 제거
  removeAllListeners: (channel) => {
    ipcRenderer.removeAllListeners(channel);
  },
  
  // 앱 정보
  getAppVersion: () => process.env.npm_package_version || '1.0.0',
  getPlatform: () => process.platform,
  
  // 환경 변수 (Electron에서 React로 전달)
  getEnvVars: () => ({
    PRIMARY_API_KEY: process.env.PRIMARY_API_KEY || null,
    RIOT_API_KEY: process.env.RIOT_API_KEY || null,
    NODE_ENV: process.env.NODE_ENV || 'development'
  })
});
