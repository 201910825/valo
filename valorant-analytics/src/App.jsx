import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import './responsive.css';
import SearchBar from './components/search/SearchBar';
import MatchCard from './components/match/MatchCard';
import GrowthChart from './components/charts/GrowthChart';
import TeamAnalysis from './components/charts/TeamAnalysis';
import TeamOptimizer from './components/analysis/TeamOptimizer';
import AdvancedStats from './components/analysis/AdvancedStats';
import RealtimePredictor from './components/analysis/RealtimePredictor';
import Modal from './components/layout/Modal';
import Button from './components/common/Button';
import { fetchMatches, fetchPlayerStats, fetchRealtimeData, onRealtimeUpdate, getAppInfo } from './ipc';

// 새로운 경쟁력 있는 페이지들
import ProMetaAnalysis from './pages/ProMetaAnalysis';
import MapMastery from './pages/MapMastery';
import RankPredictor from './pages/RankPredictor';
import AgentSynergy from './pages/AgentSynergy';
import CompetitiveIntel from './pages/CompetitiveIntel';

function App() {
  const location = useLocation();
  const [matches, setMatches] = useState([]);
  const [playerStats, setPlayerStats] = useState(null);
  const [realtimeData, setRealtimeData] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState('');
  const [appInfo] = useState(getAppInfo());
  const [activeTab, setActiveTab] = useState('matches'); // 새로운 탭 상태

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

        {/* 네비게이션 바 */}
        <nav style={navStyle} className="nav-container">
          <Link 
            to="/" 
            className="nav-link"
            style={{...navLinkStyle, ...(location.pathname === '/' ? activeNavStyle : {})}}
          >
            <span>🏠</span>
            <span className="nav-text">홈</span>
          </Link>
          <Link 
            to="/pro-meta" 
            className="nav-link"
            style={{...navLinkStyle, ...(location.pathname === '/pro-meta' ? activeNavStyle : {})}}
          >
            <span>🏆</span>
            <span className="nav-text">프로 메타</span>
          </Link>
          <Link 
            to="/map-mastery" 
            className="nav-link"
            style={{...navLinkStyle, ...(location.pathname === '/map-mastery' ? activeNavStyle : {})}}
          >
            <span>🗺️</span>
            <span className="nav-text">맵 마스터리</span>
          </Link>
          <Link 
            to="/rank-predictor" 
            className="nav-link"
            style={{...navLinkStyle, ...(location.pathname === '/rank-predictor' ? activeNavStyle : {})}}
          >
            <span>🎯</span>
            <span className="nav-text">랭크 예측</span>
          </Link>
          <Link 
            to="/agent-synergy" 
            className="nav-link"
            style={{...navLinkStyle, ...(location.pathname === '/agent-synergy' ? activeNavStyle : {})}}
          >
            <span>⚡</span>
            <span className="nav-text">에이전트 시너지</span>
          </Link>
          <Link 
            to="/competitive-intel" 
            className="nav-link"
            style={{...navLinkStyle, ...(location.pathname === '/competitive-intel' ? activeNavStyle : {})}}
          >
            <span>📊</span>
            <span className="nav-text">경쟁 인텔리전스</span>
          </Link>
        </nav>

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

        {/* 라우팅 시스템 */}
        <Routes>
          <Route path="/" element={
            <>
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
            </>
          } />
          <Route path="/pro-meta" element={<ProMetaAnalysis />} />
          <Route path="/map-mastery" element={<MapMastery />} />
          <Route path="/rank-predictor" element={<RankPredictor />} />
          <Route path="/agent-synergy" element={<AgentSynergy />} />
          <Route path="/competitive-intel" element={<CompetitiveIntel />} />
        </Routes>

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
              {/* 탭 네비게이션 */}
              <div style={tabContainerStyle}>
                <button 
                  style={{...tabStyle, ...(activeTab === 'matches' ? activeTabStyle : {})}}
                  onClick={() => setActiveTab('matches')}
                >
                  🎯 매치 분석
                </button>
                <button 
                  style={{...tabStyle, ...(activeTab === 'growth' ? activeTabStyle : {})}}
                  onClick={() => setActiveTab('growth')}
                >
                  📈 성장 차트
                </button>
                <button 
                  style={{...tabStyle, ...(activeTab === 'team' ? activeTabStyle : {})}}
                  onClick={() => setActiveTab('team')}
                >
                  👥 팀 분석
                </button>
                <button 
                  style={{...tabStyle, ...(activeTab === 'optimizer' ? activeTabStyle : {})}}
                  onClick={() => setActiveTab('optimizer')}
                >
                  🎯 팀 최적화
                </button>
                <button 
                  style={{...tabStyle, ...(activeTab === 'advanced' ? activeTabStyle : {})}}
                  onClick={() => setActiveTab('advanced')}
                >
                  📊 고급 통계
                </button>
                <button 
                  style={{...tabStyle, ...(activeTab === 'prediction' ? activeTabStyle : {})}}
                  onClick={() => setActiveTab('prediction')}
                >
                  🔮 실시간 예측
                </button>
              </div>

              {/* 탭 내용 */}
              <div style={tabContentStyle}>
                {activeTab === 'matches' && (
                  <div style={matchListStyle}>
                    {matches.map((match) => <MatchCard key={match.matchId} match={match} />)}
                  </div>
                )}
                
                {activeTab === 'growth' && <GrowthChart matches={matches} />}
                
                {activeTab === 'team' && <TeamAnalysis matches={matches} />}
                
                {activeTab === 'optimizer' && (
                  <TeamOptimizer matches={matches} currentTeam={[]} />
                )}
                
                {activeTab === 'advanced' && (
                  <AdvancedStats matches={matches} playerStats={playerStats} />
                )}
                
                {activeTab === 'prediction' && (
                  <RealtimePredictor 
                    matches={matches} 
                    realtimeData={realtimeData ? [realtimeData] : []} 
                    playerStats={playerStats} 
                  />
                )}
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
  minHeight: '100vh',
  backgroundColor: 'black',
  backgroundImage: 'url(https://wallpapers.com/images/high/iphone-xs-valorant-background-wvshktusv3oxscai.webp)',
  backgroundSize: 'contain',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
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

const tabContainerStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
  marginBottom: '20px',
  borderBottom: '2px solid rgba(255,255,255,0.1)',
  paddingBottom: '12px'
};

const tabStyle = {
  background: 'rgba(255,255,255,0.1)',
  border: 'none',
  color: 'rgba(255,255,255,0.7)',
  padding: '10px 16px',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '500',
  transition: 'all 0.3s ease'
};

const activeTabStyle = {
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: '#fff',
  transform: 'translateY(-2px)',
  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
};

const tabContentStyle = {
  minHeight: '400px'
};

// 반응형 네비게이션 스타일
const navStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: 'clamp(10px, 3vw, 20px)',
  margin: 'clamp(15px, 4vw, 25px) 0',
  padding: 'clamp(10px, 3vw, 15px)',
  backgroundColor: 'rgba(0,0,0,0.3)',
  borderRadius: 'clamp(8px, 2vw, 12px)',
  flexWrap: 'wrap',
  overflowX: 'auto',
  scrollbarWidth: 'none', // Firefox
  msOverflowStyle: 'none' // IE/Edge
};

const navLinkStyle = {
  color: '#fff',
  textDecoration: 'none',
  padding: 'clamp(8px, 2vw, 12px) clamp(12px, 3vw, 16px)',
  borderRadius: 'clamp(6px, 1.5vw, 8px)',
  background: 'rgba(255,255,255,0.1)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255,255,255,0.2)',
  transition: 'all 0.3s ease',
  fontSize: 'clamp(12px, 3vw, 14px)',
  fontWeight: '500',
  display: 'flex',
  alignItems: 'center',
  gap: 'clamp(4px, 1vw, 8px)',
  whiteSpace: 'nowrap',
  minHeight: '44px', // 터치 최적화
  minWidth: 'fit-content'
};

const activeNavStyle = {
  background: 'linear-gradient(135deg, #00D4AA, #00B894)',
  color: '#fff',
  transform: 'translateY(-2px)',
  boxShadow: '0 4px 15px rgba(0, 212, 170, 0.4)',
  border: '1px solid rgba(0, 212, 170, 0.3)'
};
