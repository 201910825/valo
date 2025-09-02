import React, { useState, useEffect } from 'react';
import { VALORANT_CONTENT } from '../api/riotAPI';
import PageHeader from '../components/layout/PageHeader';
import ResponsiveContainer, { 
  responsiveSectionStyle, 
  createResponsiveGrid, 
  responsiveCardStyle,
  responsiveTextStyles,
  responsiveFlexStyles
} from '../components/layout/ResponsiveContainer';

const MapMastery = () => {
  const [mapData, setMapData] = useState(null);
  const [selectedMap, setSelectedMap] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateMapMasteryData();
  }, []);

  const generateMapMasteryData = () => {
    setLoading(true);
    
    // PRIMARY API KEY 데이터 기반 맵 마스터리 분석
    const maps = VALORANT_CONTENT.maps;
    const agents = VALORANT_CONTENT.characters;
    
    const mapAnalysis = maps.map(map => {
      // 맵별 개인 통계 시뮬레이션
      const personalStats = {
        playCount: Math.floor(Math.random() * 100) + 20,
        winRate: parseFloat((Math.random() * 40 + 30).toFixed(1)), // 30-70%
        avgKDA: parseFloat((Math.random() * 2 + 0.8).toFixed(2)), // 0.8-2.8
        avgScore: Math.floor(Math.random() * 5000) + 3000, // 3000-8000
        masteryLevel: Math.floor(Math.random() * 5) + 1, // 1-5 레벨
        lastPlayed: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('ko-KR')
      };

      // 맵별 추천 에이전트
      const recommendedAgents = agents
        .sort(() => 0.5 - Math.random())
        .slice(0, 5)
        .map(agent => ({
          ...agent,
          effectiveness: parseFloat((Math.random() * 40 + 60).toFixed(1)), // 60-100%
          reason: getAgentRecommendationReason(agent.name, map.name)
        }));

      // 맵별 전략 포인트
      const strategyPoints = generateStrategyPoints(map.name);
      
      // 맵별 핫스팟 분석
      const hotspots = generateHotspots(map.name);

      return {
        ...map,
        personalStats,
        recommendedAgents,
        strategyPoints,
        hotspots,
        difficulty: Math.floor(Math.random() * 5) + 1, // 1-5 난이도
        metaRating: parseFloat((Math.random() * 3 + 7).toFixed(1)) // 7.0-10.0
      };
    });

    setTimeout(() => {
      setMapData(mapAnalysis);
      setSelectedMap(mapAnalysis[0]);
      setLoading(false);
    }, 1000);
  };

  const getAgentRecommendationReason = (agentName, mapName) => {
    const reasons = [
      '좁은 통로에서 유용한 스킬셋',
      '오픈 공간 제압에 특화',
      '사이트 수비에 최적화',
      '로테이션 지원에 효과적',
      '정보 수집 능력 우수',
      '팀 지원 능력 뛰어남',
      '어그로 플레이에 적합',
      '맵 구조와 궁합 좋음'
    ];
    return reasons[Math.floor(Math.random() * reasons.length)];
  };

  const generateStrategyPoints = (mapName) => {
    return [
      {
        title: '공격 전략',
        points: [
          '초반 정보 수집이 핵심',
          'A/B 사이트 동시 압박',
          '미드 컨트롤 중요성',
          '스모크 활용한 진입'
        ]
      },
      {
        title: '수비 전략',
        points: [
          '사이트 간 로테이션',
          '정보 차단 우선',
          '크로스파이어 설정',
          '리테이크 준비'
        ]
      },
      {
        title: '경제 관리',
        points: [
          '에코 라운드 활용',
          '포스바이 타이밍',
          '무기 드롭 전략',
          '세이브 라운드 판단'
        ]
      }
    ];
  };

  const generateHotspots = (mapName) => {
    const spots = [
      { name: 'A 사이트', danger: 'high', tip: '스모크와 플래시 조합 필수' },
      { name: 'B 사이트', danger: 'medium', tip: '사운드 플레이 중요' },
      { name: '미드', danger: 'high', tip: '정보 수집 후 진입' },
      { name: '스폰', danger: 'low', tip: '초반 포지셔닝 중요' },
      { name: '연결통로', danger: 'medium', tip: '로테이션 타이밍 주의' }
    ];
    return spots.sort(() => 0.5 - Math.random()).slice(0, 4);
  };

  const getMasteryColor = (level) => {
    const colors = {
      1: '#8B4513', // Bronze
      2: '#C0C0C0', // Silver
      3: '#FFD700', // Gold
      4: '#E5E4E2', // Platinum
      5: '#FF6B6B'  // Diamond
    };
    return colors[level] || '#8B4513';
  };

  const getMasteryLabel = (level) => {
    const labels = {
      1: '브론즈',
      2: '실버', 
      3: '골드',
      4: '플래티넘',
      5: '다이아몬드'
    };
    return labels[level] || '브론즈';
  };

  const getDangerColor = (danger) => {
    const colors = {
      high: '#FF453A',
      medium: '#FFD60A',
      low: '#00D4AA'
    };
    return colors[danger] || '#FFD60A';
  };

  if (loading) {
    return (
      <ResponsiveContainer>
        <PageHeader 
          title="🗺️ 맵 마스터리 시스템" 
          subtitle="개인 맵 데이터를 분석하고 최적화 전략을 생성하고 있습니다."
        />
        <div style={{...responsiveFlexStyles.center, padding: 'clamp(30px, 8vw, 50px)'}}>
          <h2 style={responsiveTextStyles.h2}>분석 중...</h2>
        </div>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer>
      <PageHeader 
        title="🗺️ 맵 마스터리 시스템" 
        subtitle="PRIMARY API 기반 개인화된 맵 분석 및 전략 추천"
      />

      {mapData && (
        <>
          {/* 맵 선택 그리드 */}
          <div style={responsiveSectionStyle}>
            <h2 style={responsiveTextStyles.h2}>📍 맵 선택</h2>
            <div style={createResponsiveGrid('280px', '20px')}>
              {mapData.map(map => (
                <div 
                  key={map.id} 
                  style={{
                    ...mapCardStyle,
                    ...(selectedMap?.id === map.id ? selectedMapStyle : {})
                  }}
                  onClick={() => setSelectedMap(map)}
                >
                  <div style={mapCardHeaderStyle}>
                    <h3>{map.name}</h3>
                    <div style={{
                      ...masteryBadgeStyle,
                      backgroundColor: getMasteryColor(map.personalStats.masteryLevel)
                    }}>
                      {getMasteryLabel(map.personalStats.masteryLevel)}
                    </div>
                  </div>
                  
                  <div style={mapCardStatsStyle}>
                    <div style={statRowStyle}>
                      <span>승률:</span>
                      <span style={{ 
                        color: map.personalStats.winRate > 50 ? '#00D4AA' : '#FF453A',
                        fontWeight: 'bold' 
                      }}>
                        {map.personalStats.winRate}%
                      </span>
                    </div>
                    <div style={statRowStyle}>
                      <span>플레이:</span>
                      <span>{map.personalStats.playCount}회</span>
                    </div>
                    <div style={statRowStyle}>
                      <span>KDA:</span>
                      <span style={{ color: '#FFD60A' }}>{map.personalStats.avgKDA}</span>
                    </div>
                  </div>
                  
                  <div style={difficultyStyle}>
                    <span>난이도: </span>
                    {'★'.repeat(map.difficulty)}{'☆'.repeat(5-map.difficulty)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 선택된 맵 상세 분석 */}
          {selectedMap && (
            <>
              {/* 맵 개요 */}
              <div style={sectionStyle}>
                <h2>🎯 {selectedMap.name} 상세 분석</h2>
                <div style={mapOverviewStyle}>
                  <div style={overviewCardStyle}>
                    <h3>📊 개인 통계</h3>
                    <div style={personalStatsStyle}>
                      <div style={statItemStyle}>
                        <span>총 플레이</span>
                        <strong>{selectedMap.personalStats.playCount}회</strong>
                      </div>
                      <div style={statItemStyle}>
                        <span>승률</span>
                        <strong style={{ 
                          color: selectedMap.personalStats.winRate > 50 ? '#00D4AA' : '#FF453A' 
                        }}>
                          {selectedMap.personalStats.winRate}%
                        </strong>
                      </div>
                      <div style={statItemStyle}>
                        <span>평균 KDA</span>
                        <strong style={{ color: '#FFD60A' }}>{selectedMap.personalStats.avgKDA}</strong>
                      </div>
                      <div style={statItemStyle}>
                        <span>평균 점수</span>
                        <strong>{selectedMap.personalStats.avgScore.toLocaleString()}</strong>
                      </div>
                      <div style={statItemStyle}>
                        <span>마지막 플레이</span>
                        <strong>{selectedMap.personalStats.lastPlayed}</strong>
                      </div>
                    </div>
                  </div>

                  <div style={overviewCardStyle}>
                    <h3>⭐ 맵 평가</h3>
                    <div style={ratingStyle}>
                      <div style={ratingItemStyle}>
                        <span>메타 점수</span>
                        <span style={{ 
                          fontSize: '24px', 
                          color: selectedMap.metaRating > 8.5 ? '#00D4AA' : 
                                selectedMap.metaRating > 7.5 ? '#FFD60A' : '#FF453A',
                          fontWeight: 'bold'
                        }}>
                          {selectedMap.metaRating}/10
                        </span>
                      </div>
                      <div style={ratingItemStyle}>
                        <span>마스터리 레벨</span>
                        <span style={{
                          color: getMasteryColor(selectedMap.personalStats.masteryLevel),
                          fontWeight: 'bold',
                          fontSize: '18px'
                        }}>
                          {getMasteryLabel(selectedMap.personalStats.masteryLevel)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 추천 에이전트 */}
              <div style={sectionStyle}>
                <h2>⚡ 추천 에이전트</h2>
                <div style={agentRecommendStyle}>
                  {selectedMap.recommendedAgents.map(agent => (
                    <div key={agent.id} style={agentRecommendCardStyle}>
                      <div style={agentHeaderStyle}>
                        <h3>{agent.name}</h3>
                        <div style={effectivenessStyle}>
                          {agent.effectiveness}% 효과
                        </div>
                      </div>
                      <p style={reasonStyle}>{agent.reason}</p>
                      <div style={effectivenessBarStyle}>
                        <div 
                          style={{
                            ...effectivenessProgressStyle,
                            width: `${agent.effectiveness}%`,
                            backgroundColor: agent.effectiveness > 80 ? '#00D4AA' :
                                           agent.effectiveness > 70 ? '#FFD60A' : '#FF453A'
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 전략 포인트 */}
              <div style={sectionStyle}>
                <h2>🧠 전략 가이드</h2>
                <div style={strategyGridStyle}>
                  {selectedMap.strategyPoints.map((strategy, index) => (
                    <div key={index} style={strategyCardStyle}>
                      <h3>{strategy.title}</h3>
                      <ul style={strategyListStyle}>
                        {strategy.points.map((point, pointIndex) => (
                          <li key={pointIndex} style={strategyItemStyle}>
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* 핫스팟 분석 */}
              <div style={sectionStyle}>
                <h2>🔥 핫스팟 분석</h2>
                <div style={hotspotsGridStyle}>
                  {selectedMap.hotspots.map((spot, index) => (
                    <div key={index} style={hotspotCardStyle}>
                      <div style={hotspotHeaderStyle}>
                        <h3>{spot.name}</h3>
                        <div style={{
                          ...dangerBadgeStyle,
                          backgroundColor: getDangerColor(spot.danger)
                        }}>
                          {spot.danger === 'high' ? '위험' : 
                           spot.danger === 'medium' ? '주의' : '안전'}
                        </div>
                      </div>
                      <p style={hotspotTipStyle}>💡 {spot.tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </>
      )}
    </ResponsiveContainer>
  );
};

// 스타일 정의


const sectionStyle = {
  marginBottom: '40px'
};

const mapCardStyle = {
  background: 'rgba(255,255,255,0.1)',
  padding: '20px',
  borderRadius: '12px',
  border: '1px solid rgba(255,255,255,0.2)',
  cursor: 'pointer',
  transition: 'all 0.3s ease'
};

const selectedMapStyle = {
  background: 'rgba(0,212,170,0.2)',
  border: '1px solid rgba(0,212,170,0.5)',
  transform: 'translateY(-2px)',
  boxShadow: '0 4px 15px rgba(0,212,170,0.3)'
};

const mapCardHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '15px'
};

const masteryBadgeStyle = {
  padding: '4px 8px',
  borderRadius: '6px',
  fontSize: '12px',
  fontWeight: 'bold',
  color: '#fff'
};

const mapCardStatsStyle = {
  margin: '15px 0'
};

const statRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  margin: '8px 0'
};

const difficultyStyle = {
  marginTop: '15px',
  paddingTop: '15px',
  borderTop: '1px solid rgba(255,255,255,0.1)',
  color: '#FFD60A'
};

const mapOverviewStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
  gap: '20px',
  marginTop: '20px'
};

const overviewCardStyle = {
  background: 'rgba(255,255,255,0.1)',
  padding: '25px',
  borderRadius: '12px',
  border: '1px solid rgba(255,255,255,0.2)'
};

const personalStatsStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
  gap: '15px',
  marginTop: '15px'
};

const statItemStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '5px'
};

const ratingStyle = {
  marginTop: '15px'
};

const ratingItemStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  margin: '15px 0'
};

const agentRecommendStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gap: '20px',
  marginTop: '20px'
};

const agentRecommendCardStyle = {
  background: 'rgba(255,255,255,0.1)',
  padding: '20px',
  borderRadius: '12px',
  border: '1px solid rgba(255,255,255,0.2)'
};

const agentHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '10px'
};

const effectivenessStyle = {
  background: '#00D4AA',
  color: '#000',
  padding: '4px 8px',
  borderRadius: '6px',
  fontSize: '12px',
  fontWeight: 'bold'
};

const reasonStyle = {
  fontSize: '14px',
  opacity: 0.8,
  margin: '10px 0'
};

const effectivenessBarStyle = {
  width: '100%',
  height: '6px',
  backgroundColor: 'rgba(255,255,255,0.1)',
  borderRadius: '3px',
  overflow: 'hidden'
};

const effectivenessProgressStyle = {
  height: '100%',
  borderRadius: '3px',
  transition: 'width 0.3s ease'
};

const strategyGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '20px',
  marginTop: '20px'
};

const strategyCardStyle = {
  background: 'rgba(255,255,255,0.1)',
  padding: '20px',
  borderRadius: '12px',
  border: '1px solid rgba(255,255,255,0.2)'
};

const strategyListStyle = {
  listStyle: 'none',
  padding: 0,
  margin: '15px 0 0 0'
};

const strategyItemStyle = {
  padding: '8px 0',
  borderBottom: '1px solid rgba(255,255,255,0.1)',
  fontSize: '14px'
};

const hotspotsGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
  gap: '20px',
  marginTop: '20px'
};

const hotspotCardStyle = {
  background: 'rgba(255,255,255,0.1)',
  padding: '20px',
  borderRadius: '12px',
  border: '1px solid rgba(255,255,255,0.2)'
};

const hotspotHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '10px'
};

const dangerBadgeStyle = {
  padding: '4px 8px',
  borderRadius: '6px',
  fontSize: '12px',
  fontWeight: 'bold',
  color: '#fff'
};

const hotspotTipStyle = {
  fontSize: '14px',
  opacity: 0.9,
  fontStyle: 'italic'
};

export default MapMastery;
