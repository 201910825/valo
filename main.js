const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const tracker = require('./native/build/Release/tracker.node');

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    },
    icon: path.join(__dirname, 'assets/icon.png'), // 아이콘 추가 (파일이 있다면)
    titleBarStyle: 'hiddenInset', // macOS에서 더 나은 룩앤필
    show: false // 준비될 때까지 숨김
  });

  win.once('ready-to-show', () => {
    win.show();
  });

  // 개발 환경에서는 localhost, 프로덕션에서는 빌드된 파일
  const isDev = process.env.NODE_ENV !== 'production';
  
  if (isDev) {
    console.log('🚀 개발 모드로 실행 중...');
    win.loadURL('http://localhost:3000');
    win.webContents.openDevTools(); // 개발 도구 자동 열기
  } else {
    console.log('📦 프로덕션 모드로 실행 중...');
    win.loadFile(path.join(__dirname, 'valorant-analytics/build/index.html'));
  }
}

app.whenReady().then(createWindow);

// 모든 창이 닫혔을 때
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC 핸들러들
ipcMain.handle('fetch-matches', async (event, summonerName) => {
  console.log(`매치 검색: ${summonerName}`);
  try {
    const matches = tracker.getMatches();
    return { success: true, data: matches };
  } catch (error) {
    console.error('매치 데이터 가져오기 실패:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('fetch-player-stats', async (event, playerName) => {
  console.log(`플레이어 통계 검색: ${playerName}`);
  try {
    const stats = tracker.getPlayerStats(playerName);
    return { success: true, data: stats };
  } catch (error) {
    console.error('플레이어 통계 가져오기 실패:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('fetch-realtime-data', async (event) => {
  console.log('실시간 데이터 요청');
  try {
    const realtimeData = tracker.getRealtimeData();
    return { success: true, data: realtimeData };
  } catch (error) {
    console.error('실시간 데이터 가져오기 실패:', error);
    return { success: false, error: error.message };
  }
});

// 실시간 데이터 주기적 업데이트 (5초마다)
setInterval(() => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length > 0) {
    try {
      const realtimeData = tracker.getRealtimeData();
      allWindows.forEach(win => {
        win.webContents.send('realtime-update', realtimeData);
      });
    } catch (error) {
      console.error('실시간 데이터 브로드캐스트 실패:', error);
    }
  }
}, 5000);
