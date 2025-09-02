import React, { useState, useEffect } from 'react';
import SearchBar from './components/search/SearchBar';
import MatchCard from './components/match/MatchCard';
import GrowthChart from './components/charts/GrowthChart';
import TeamAnalysis from './components/charts/TeamAnalysis';
import Modal from './components/layout/Modal';
import Button from './components/common/Button';
import { fetchMatches, fetchPlayerStats, fetchRealtimeData, onRealtimeUpdate, getAppInfo } from './ipc';

function App() {
  const [matches, setMatches] = useState([]);
  const [playerStats, setPlayerStats] = useState(null);
  const [realtimeData, setRealtimeData] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState('');
  const [appInfo] = useState(getAppInfo());

  const handleSearch = async (summonerName) => {
    setLoading(true);
    setError(null);
    setCurrentPlayer(summonerName);
    
    try {
      // 매치 데이터와 플레이어 통계를 동시에 가져오기
      const [matchResult, statsResult] = await Promise.all([
        fetchMatches(summonerName),
        fetchPlayerStats(summonerName)
      ]);

      if (matchResult.success) {
        setMatches(matchResult.data);
      } else {
        setError(`매치 데이터 로드 실패: ${matchResult.error}`);
      }

      if (statsResult.success) {
        setPlayerStats(statsResult.data);
      } else {
        setError(`플레이어 통계 로드 실패: ${statsResult.error}`);
      }

      setModalOpen(true);
    } catch (err) {
      setError(`검색 중 오류 발생: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const loadRealtimeData = async () => {
    try {
      const result = await fetchRealtimeData();
      if (result.success) {
        setRealtimeData(result.data[0]);
      }
    } catch (err) {
      console.error('실시간 데이터 로드 실패:', err);
    }
  };

  useEffect(() => {
    // 앱 시작 시 실시간 데이터 로드
    loadRealtimeData();
    
    // 실시간 업데이트 리스너 설정
    onRealtimeUpdate((data) => {
      if (data && data.length > 0) {
        setRealtimeData(data[0]);
      }
    });

    // 컴포넌트 언마운트 시 정리는 여기서는 생략 (실제로는 cleanup 필요)
  }, []);

  return (
    <div style={backgroundStyle}>
      <div style={overlayStyle}>
        <div style={headerStyle}>
          <h1 style={{color:'#fff', textShadow:'2px 2px 8px rgba(0,0,0,0.7)', margin: 0}}>
            Valorant Analytics
          </h1>
          <div style={versionStyle}>
            v{appInfo.version} | {appInfo.platform}
          </div>
        </div>

        {/* 실시간 게임 상태 표시 */}
        {realtimeData && (
          <div style={realtimeStatusStyle}>
            <h3>🎮 실시간 상태</h3>
            {realtimeData.isInGame ? (
              <div>
                <p><strong>{realtimeData.gameMode}</strong> - {realtimeData.map}</p>
                <p>라운드: {realtimeData.round} | 스코어: {realtimeData.score}</p>
                <p>{realtimeData.playerAgent} | K/D/A: {realtimeData.kills}/{realtimeData.deaths}/{realtimeData.assists}</p>
              </div>
            ) : (
              <p>현재 게임에 참여하지 않음</p>
            )}
          </div>
        )}

        <SearchBar onSearch={handleSearch} disabled={loading} />

        {loading && (
          <div style={loadingStyle}>
            <p>검색 중...</p>
          </div>
        )}

        {error && (
          <div style={errorStyle}>
            <p>⚠️ {error}</p>
          </div>
        )}

        <Modal isOpen={modalOpen} title={`${currentPlayer} 분석`} onClose={() => setModalOpen(false)}>
          {/* 데이터 소스 표시 (개발용) */}
          {appInfo.platform === 'web' && (
            <div style={dataSourceStyle}>
              💡 데모 모드: 실제 Riot API 연동 전 더미 데이터로 모든 기능을 체험할 수 있습니다.
            </div>
          )}
          
          {playerStats && (
            <div style={statsContainerStyle}>
              <h2>📊 플레이어 통계</h2>
              {playerStats.recentForm && (
                <div style={formIndicatorStyle}>
                  <span>🎯 최근 폼: </span>
                  <span style={{
                    color: playerStats.recentForm === '상승세' ? '#00D4AA' : 
                          playerStats.recentForm === '하락세' ? '#FF453A' : '#FFD60A'
                  }}>
                    {playerStats.recentForm}
                  </span>
                </div>
              )}
              <div style={statsGridStyle}>
                <div style={statItemStyle}>
                  <span>총 경기 수</span>
                  <strong>{playerStats.totalMatches}</strong>
                </div>
                <div style={statItemStyle}>
                  <span>승률</span>
                  <strong>{playerStats.winRate}%</strong>
                </div>
                <div style={statItemStyle}>
                  <span>평균 킬</span>
                  <strong>{playerStats.avgKills}</strong>
                </div>
                <div style={statItemStyle}>
                  <span>평균 데스</span>
                  <strong>{playerStats.avgDeaths}</strong>
                </div>
                <div style={statItemStyle}>
                  <span>평균 어시스트</span>
                  <strong>{playerStats.avgAssists}</strong>
                </div>
                <div style={statItemStyle}>
                  <span>헤드샷 비율</span>
                  <strong>{playerStats.headShotRate}%</strong>
                </div>
                <div style={statItemStyle}>
                  <span>현재 랭크</span>
                  <strong>{playerStats.currentRank}</strong>
                </div>
                <div style={statItemStyle}>
                  <span>최고 랭크</span>
                  <strong>{playerStats.peakRank}</strong>
                </div>
              </div>
            </div>
          )}

          {matches.length > 0 ? (
            <>
              <h2>📈 성장 그래프</h2>
              <GrowthChart matches={matches} />

              <h2>🔍 팀/상대 분석</h2>
              <TeamAnalysis matches={matches} />

              <h2>🎯 개별 매치</h2>
              <div style={matchListStyle}>
                {matches.map((match) => <MatchCard key={match.matchId} match={match} />)}
              </div>
            </>
          ) : (
            <p>매치 데이터를 불러오는 중...</p>
          )}
          
          <div style={modalButtonsStyle}>
            <Button onClick={loadRealtimeData} style={{marginRight:'10px', backgroundColor:'#00D4AA'}}>
              실시간 데이터 새로고침
            </Button>
            <Button onClick={() => setModalOpen(false)}>닫기</Button>
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default App;

const backgroundStyle = {
  width: '100vw',
  height: '100vh',
  background: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontFamily: 'Arial, sans-serif',
  overflow: 'auto'
};

const overlayStyle = {
  width: '90%',
  maxWidth: '1400px',
  backgroundColor: 'rgba(0,0,0,0.7)',
  borderRadius: '16px',
  padding: '24px',
  boxShadow: '0 15px 35px rgba(0,0,0,0.6)',
  color: '#fff',
  minHeight: '80vh',
  position: 'relative'
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '20px',
  borderBottom: '2px solid rgba(255,255,255,0.1)',
  paddingBottom: '15px'
};

const versionStyle = {
  fontSize: '12px',
  color: 'rgba(255,255,255,0.6)',
  fontFamily: 'monospace'
};

const realtimeStatusStyle = {
  backgroundColor: 'rgba(0, 212, 170, 0.1)',
  border: '1px solid rgba(0, 212, 170, 0.3)',
  borderRadius: '8px',
  padding: '15px',
  marginBottom: '20px',
  fontSize: '14px'
};

const loadingStyle = {
  textAlign: 'center',
  padding: '20px',
  color: '#00D4AA',
  fontSize: '16px'
};

const errorStyle = {
  backgroundColor: 'rgba(255, 69, 58, 0.1)',
  border: '1px solid rgba(255, 69, 58, 0.3)',
  borderRadius: '8px',
  padding: '15px',
  marginBottom: '20px',
  color: '#FF453A'
};

const statsContainerStyle = {
  marginBottom: '30px'
};

const statsGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
  gap: '15px',
  marginTop: '15px'
};

const statItemStyle = {
  backgroundColor: 'rgba(255,255,255,0.05)',
  padding: '12px',
  borderRadius: '8px',
  textAlign: 'center',
  border: '1px solid rgba(255,255,255,0.1)'
};

const matchListStyle = {
  maxHeight: '400px',
  overflowY: 'auto',
  marginTop: '15px'
};

const modalButtonsStyle = {
  marginTop: '20px',
  paddingTop: '15px',
  borderTop: '1px solid rgba(255,255,255,0.1)',
  display: 'flex',
  justifyContent: 'flex-end'
};

const dataSourceStyle = {
  backgroundColor: 'rgba(0, 212, 170, 0.1)',
  border: '1px solid rgba(0, 212, 170, 0.3)',
  borderRadius: '8px',
  padding: '12px',
  marginBottom: '20px',
  fontSize: '14px',
  color: '#00D4AA',
  textAlign: 'center'
};

const formIndicatorStyle = {
  backgroundColor: 'rgba(255,255,255,0.05)',
  padding: '8px 12px',
  borderRadius: '6px',
  marginBottom: '15px',
  fontSize: '14px',
  textAlign: 'center'
};
