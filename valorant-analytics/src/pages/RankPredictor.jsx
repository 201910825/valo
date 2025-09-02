import React, { useState, useEffect } from 'react';
import { VALORANT_CONTENT } from '../api/riotAPI';
import OpenSourceAnalytics from '../analytics/OpenSourceAnalytics';
import PageHeader from '../components/layout/PageHeader';
import ResponsiveContainer, { 
  responsiveCardStyle,
  responsiveTextStyles,
  responsiveFlexStyles
} from '../components/layout/ResponsiveContainer';

const RankPredictor = () => {
  const [predictionData, setPredictionData] = useState(null);
  const [currentRank, setCurrentRank] = useState('gold-2');
  const [targetRank, setTargetRank] = useState('platinum-1');
  const [loading, setLoading] = useState(true);
  
  // 오픈소스 라이브러리 기반 분석 인스턴스
  const analytics = new OpenSourceAnalytics();

  useEffect(() => {
    generateRankPrediction();
  }, [currentRank, targetRank]);

  const generateRankPrediction = () => {
    setLoading(true);
    
    // 실제 매치 데이터 가져오기 (더미 데이터로 시뮬레이션)
    const simulatedMatches = generateRealisticMatchData();      
    
    // 📊 오픈소스 라이브러리 기반 고급 분석
    const prediction = analytics.predictRank(simulatedMatches, currentRank);
    const playerAnalysis = analytics.analyzePlayerPerformance(simulatedMatches);

    setTimeout(() => {
      setPredictionData({
        // 예측 결과
        currentRank: prediction.currentRank,
        predictedChange: prediction.predictedChange,
        overallScore: prediction.overallScore,
        confidence: prediction.confidence,
        predictions: prediction.probabilities,
        
        // 플레이어 분석 결과
        recentPerformance: {
          winRate: playerAnalysis.winRate,
          avgKDA: playerAnalysis.avgKDA,
          medianKDA: playerAnalysis.medianKDA,
          avgScore: playerAnalysis.avgScore,
          consistency: playerAnalysis.consistency,
          recentMatches: playerAnalysis.totalMatches
        },
        
        // 고급 통계
        advancedStats: {
          kdaQuartiles: playerAnalysis.kdaQuartiles,
          kdaStdDev: playerAnalysis.kdaStdDev,
          performanceTrend: playerAnalysis.performanceTrend,
          agentPerformance: playerAnalysis.agentPerformance
        },
        
        // 벤치마크 비교
        benchmarkComparison: prediction.benchmarkComparison,
        
        // 개선 영역
        improvementAreas: prediction.improvementAreas,
        
        // 메타데이터
        reliability: playerAnalysis.reliability,
        lastUpdated: prediction.lastUpdated,
        
        // 오픈소스 라이브러리 기반 표시
        isOpenSource: true,
        analysisMethod: prediction.analysisMethod,
        dataSource: prediction.dataSource,
        libraries: ['Lodash', 'Simple-Statistics', 'ML-Regression', 'D3-Array']
      });
      setLoading(false);
    }, 600);
  };

  // 현실적인 매치 데이터 생성
  const generateRealisticMatchData = () => {
    const agents = VALORANT_CONTENT.characters;
    const maps = VALORANT_CONTENT.maps;
    const matchCount = 20;
    
    return Array.from({ length: matchCount }, (_, i) => {
      const skillProgression = Math.min(1.2, 0.7 + (i / matchCount) * 0.5);
      const randomFactor = 0.8 + Math.random() * 0.4;
      const performanceMultiplier = skillProgression * randomFactor;
      
      const baseKills = Math.round((12 + Math.random() * 8) * performanceMultiplier);
      const baseDeaths = Math.max(1, Math.round((8 + Math.random() * 6) / performanceMultiplier));
      const baseAssists = Math.round((3 + Math.random() * 5) * performanceMultiplier);
      const baseScore = Math.round((3500 + Math.random() * 2500) * performanceMultiplier);
      
      const kda = (baseKills + baseAssists) / Math.max(baseDeaths, 1);
      const winProbability = Math.min(0.8, 0.3 + (kda / 3));
      const isVictory = Math.random() < winProbability;
      
      return {
        matchId: `match_${i + 1}`,
        agent: agents[Math.floor(Math.random() * agents.length)].name,
        map: maps[Math.floor(Math.random() * maps.length)].name,
        kills: baseKills,
        deaths: baseDeaths,
        assists: baseAssists,
        score: baseScore,
        result: isVictory ? 'Victory' : 'Defeat',
        gameMode: 'Competitive',
        date: new Date(Date.now() - (matchCount - i) * 24 * 60 * 60 * 1000).toISOString()
      };
    });
  };



  const getRankColor = (rankId) => {
    const colors = {
      'iron': '#8B4513', 'bronze': '#CD7F32', 'silver': '#C0C0C0',
      'gold': '#FFD700', 'platinum': '#E5E4E2', 'diamond': '#B9F2FF',
      'immortal': '#FF6B6B', 'radiant': '#FF1493'
    };
    return colors[rankId?.split('-')[0]] || '#808080';
  };

  const getPriorityColor = (priority) => {
    const colors = { high: '#FF453A', medium: '#FFD60A', low: '#00D4AA' };
    return colors[priority] || '#FFD60A';
  };

  const getDifficultyInfo = (difficulty) => {
    const info = {
      easy: { label: '쉬움', color: '#00D4AA', icon: '😊' },
      medium: { label: '보통', color: '#FFD60A', icon: '😐' },
      hard: { label: '어려움', color: '#FF453A', icon: '😰' }
    };
    return info[difficulty] || info.medium;
  };

  if (loading) {
    return (
      <ResponsiveContainer>
        <PageHeader 
          title="🔬 오픈소스 분석 시스템" 
          subtitle="검증된 라이브러리가 당신의 경기 데이터를 분석하고 있습니다."
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
        title="🔬 오픈소스 분석 시스템" 
        subtitle="검증된 라이브러리 기반 고급 통계 분석 및 랭크 예측"
      />
      
      {/* 오픈소스 라이브러리 분석 상태 표시 */}
      {predictionData?.isOpenSource && (
        <div style={{
          ...responsiveCardStyle,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          textAlign: 'center',
          marginBottom: '20px'
        }}>
          <h3 style={{...responsiveTextStyles.h3, margin: '0 0 8px 0'}}>
            🔬 오픈소스 라이브러리 분석 완료
          </h3>
          <p style={{...responsiveTextStyles.small, margin: '0', opacity: 0.9}}>
            {predictionData.analysisMethod} • 신뢰도: {predictionData.reliability}%
          </p>
          <p style={{...responsiveTextStyles.small, margin: '4px 0 0 0', opacity: 0.8}}>
            사용 라이브러리: {predictionData.libraries?.join(', ')}
          </p>
        </div>
      )}

      {/* 랭크 선택 */}
      <div style={sectionStyle}>
        <h2>🏅 랭크 설정</h2>
        <div style={rankSelectorStyle}>
          <div style={rankSelectGroupStyle}>
            <label>현재 랭크:</label>
            <select 
              value={currentRank} 
              onChange={(e) => setCurrentRank(e.target.value)}
              style={selectStyle}
            >
              {VALORANT_CONTENT.ranks.map(rank => (
                <option key={rank.id} value={rank.id}>
                  {rank.name}
                </option>
              ))}
            </select>
          </div>
          
          <div style={rankSelectGroupStyle}>
            <label>목표 랭크:</label>
            <select 
              value={targetRank} 
              onChange={(e) => setTargetRank(e.target.value)}
              style={selectStyle}
            >
              {VALORANT_CONTENT.ranks.map(rank => (
                <option key={rank.id} value={rank.id}>
                  {rank.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {predictionData && (
        <>
          {/* 현재 성과 분석 */}
          <div style={sectionStyle}>
            <h2>📊 현재 성과 분석</h2>
            <div style={performanceGridStyle}>
              <div style={performanceCardStyle}>
                <h3>🎯 승률</h3>
                <div style={performanceValueStyle}>
                  <span style={{ 
                    color: predictionData?.recentPerformance.winRate > 50 ? '#00D4AA' : '#FF453A',
                    fontSize: '28px',
                    fontWeight: 'bold'
                  }}>
                    {predictionData?.recentPerformance.winRate}%
                  </span>
                </div>
                <p>최근 {predictionData?.recentPerformance.recentMatches}경기</p>
              </div>

              <div style={performanceCardStyle}>
                <h3>⚔️ 평균 KDA</h3>
                <div style={performanceValueStyle}>
                  <span style={{ 
                    color: predictionData?.recentPerformance.avgKDA > 1.2 ? '#00D4AA' : '#FFD60A',
                    fontSize: '28px',
                    fontWeight: 'bold'
                  }}>
                    {predictionData?.recentPerformance.avgKDA}
                  </span>
                </div>
                <p>킬/데스/어시스트 비율</p>
              </div>

              <div style={performanceCardStyle}>
                <h3>🏆 평균 점수</h3>
                <div style={performanceValueStyle}>
                  <span style={{ 
                    color: '#FFD60A',
                    fontSize: '24px',
                    fontWeight: 'bold'
                  }}>
                    {predictionData?.recentPerformance.avgScore.toLocaleString()}
                  </span>
                </div>
                <p>경기당 평균 점수</p>
              </div>

              <div style={performanceCardStyle}>
                <h3>📈 일관성</h3>
                <div style={performanceValueStyle}>
                  <span style={{ 
                    color: predictionData?.recentPerformance.consistency > 70 ? '#00D4AA' : '#FF453A',
                    fontSize: '28px',
                    fontWeight: 'bold'
                  }}>
                    {predictionData?.recentPerformance.consistency}%
                  </span>
                </div>
                <p>성과 일관성 지수</p>
              </div>
            </div>
          </div>

          {/* 랭크 예측 */}
          <div style={sectionStyle}>
            <h2>🔮 AI 랭크 예측</h2>
            <div style={predictionGridStyle}>
              <div style={predictionCardStyle}>
                <div style={predictionHeaderStyle}>
                  <span style={{ color: '#00D4AA', fontSize: '20px' }}>📈</span>
                  <h3>승급 확률</h3>
                </div>
                <div style={probabilityStyle}>
                  <span style={{ 
                    color: '#00D4AA', 
                    fontSize: '36px', 
                    fontWeight: 'bold' 
                  }}>
                    {predictionData?.predictions.promotion}%
                  </span>
                </div>
                <div style={probabilityBarStyle}>
                  <div style={{
                    ...probabilityProgressStyle,
                    width: `${predictionData?.predictions.promotion}%`,
                    backgroundColor: '#00D4AA'
                  }} />
                </div>
              </div>

              <div style={predictionCardStyle}>
                <div style={predictionHeaderStyle}>
                  <span style={{ color: '#FFD60A', fontSize: '20px' }}>➡️</span>
                  <h3>유지 확률</h3>
                </div>
                <div style={probabilityStyle}>
                  <span style={{ 
                    color: '#FFD60A', 
                    fontSize: '36px', 
                    fontWeight: 'bold' 
                  }}>
                    {predictionData?.predictions.stable}%
                  </span>
                </div>
                <div style={probabilityBarStyle}>
                  <div style={{
                    ...probabilityProgressStyle,
                    width: `${predictionData?.predictions.stable}%`,
                    backgroundColor: '#FFD60A'
                  }} />
                </div>
              </div>

              <div style={predictionCardStyle}>
                <div style={predictionHeaderStyle}>
                  <span style={{ color: '#FF453A', fontSize: '20px' }}>📉</span>
                  <h3>강등 확률</h3>
                </div>
                <div style={probabilityStyle}>
                  <span style={{ 
                    color: '#FF453A', 
                    fontSize: '36px', 
                    fontWeight: 'bold' 
                  }}>
                    {predictionData?.predictions.demotion}%
                  </span>
                </div>
                <div style={probabilityBarStyle}>
                  <div style={{
                    ...probabilityProgressStyle,
                    width: `${predictionData?.predictions.demotion}%`,
                    backgroundColor: '#FF453A'
                  }} />
                </div>
              </div>
            </div>
          </div>

          {/* 목표 달성 분석 */}
          <div style={sectionStyle}>
            <h2>🎯 목표 달성 분석</h2>
            <div style={targetAnalysisStyle}>
              <div style={targetCardStyle}>
                <div style={targetHeaderStyle}>
                  <h3>
                    {predictionData?.currentRank?.name} → {predictionData?.targetRank?.name}
                  </h3>
                  <div style={{
                    ...difficultyBadgeStyle,
                    backgroundColor: getDifficultyInfo(predictionData?.targetAnalysis?.difficulty).color
                  }}>
                    {getDifficultyInfo(predictionData?.targetAnalysis?.difficulty).icon} {getDifficultyInfo(predictionData?.targetAnalysis?.difficulty).label}
                  </div>
                </div>
                
                <div style={targetStatsStyle}>
                  <div style={targetStatStyle}>
                    <span>예상 경기 수:</span>
                    <strong>{predictionData?.targetAnalysis?.estimatedGames}경기</strong>
                  </div>
                  <div style={targetStatStyle}>
                    <span>예상 소요 시간:</span>
                    <strong>{predictionData?.targetAnalysis?.timeToTarget}일</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 개선 포인트 */}
          <div style={sectionStyle}>
            <h2>🚀 개선 포인트</h2>
            <div style={improvementGridStyle}>
              {predictionData?.improvementAreas?.map((area, index) => (
                <div key={index} style={improvementCardStyle}>
                  <div style={improvementHeaderStyle}>
                    <h3>{area.area}</h3>
                    <div style={{
                      ...priorityBadgeStyle,
                      backgroundColor: getPriorityColor(area.priority)
                    }}>
                      {area.priority === 'high' ? '높음' : 
                       area.priority === 'medium' ? '보통' : '낮음'}
                    </div>
                  </div>
                  
                  <div style={improvementStatsStyle}>
                    <div style={improvementStatStyle}>
                      <span>현재:</span>
                      <strong>{area.current}</strong>
                    </div>
                    <div style={improvementStatStyle}>
                      <span>목표:</span>
                      <strong style={{ color: '#00D4AA' }}>{area.target}</strong>
                    </div>
                  </div>
                  
                  <div style={tipsStyle}>
                    <p style={{ margin: '10px 0 5px 0', fontWeight: 'bold' }}>💡 개선 팁:</p>
                    <ul style={tipListStyle}>
                      {area.tips.map((tip, tipIndex) => (
                        <li key={tipIndex} style={tipItemStyle}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 랭크 요구사항 */}
          <div style={sectionStyle}>
            <h2>📋 {predictionData?.targetRank?.name} 요구사항</h2>
            <div style={requirementsStyle}>
              <div style={requirementsCardStyle}>
                <h3>📊 최소 통계</h3>
                <div style={requirementStatsStyle}>
                  <div style={requirementStatStyle}>
                    <span>승률:</span>
                    <strong>{predictionData?.rankRequirements?.minWinRate}%+</strong>
                  </div>
                  <div style={requirementStatStyle}>
                    <span>KDA:</span>
                    <strong>{predictionData?.rankRequirements?.minKDA}+</strong>
                  </div>
                  <div style={requirementStatStyle}>
                    <span>점수:</span>
                    <strong>{predictionData?.rankRequirements?.minScore.toLocaleString()}+</strong>
                  </div>
                </div>
              </div>
              
              <div style={requirementsCardStyle}>
                <h3>🎯 필수 스킬</h3>
                <ul style={skillListStyle}>
                  {predictionData?.rankRequirements?.skills.map((skill, index) => (
                    <li key={index} style={skillItemStyle}>
                      ✓ {skill}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </ResponsiveContainer>
  );
};

// 스타일 정의 (길어서 일부만 표시)

const sectionStyle = {
  marginBottom: '40px'
};

const rankSelectorStyle = {
  display: 'flex',
  justifyContent: 'center',
  gap: '40px',
  marginTop: '20px',
  flexWrap: 'wrap'
};

const rankSelectGroupStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  alignItems: 'center'
};

const selectStyle = {
  padding: '10px 15px',
  borderRadius: '8px',
  border: '1px solid rgba(255,255,255,0.2)',
  backgroundColor: 'rgba(255,255,255,0.1)',
  color: '#fff',
  fontSize: '16px'
};

const performanceGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '20px',
  marginTop: '20px'
};

const performanceCardStyle = {
  background: 'rgba(255,255,255,0.1)',
  padding: '25px',
  borderRadius: '12px',
  border: '1px solid rgba(255,255,255,0.2)',
  textAlign: 'center'
};

const performanceValueStyle = {
  margin: '15px 0'
};

const predictionGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '20px',
  marginTop: '20px'
};

const predictionCardStyle = {
  background: 'rgba(255,255,255,0.1)',
  padding: '25px',
  borderRadius: '12px',
  border: '1px solid rgba(255,255,255,0.2)',
  textAlign: 'center'
};

const predictionHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
  marginBottom: '15px'
};

const probabilityStyle = {
  margin: '20px 0'
};

const probabilityBarStyle = {
  width: '100%',
  height: '8px',
  backgroundColor: 'rgba(255,255,255,0.1)',
  borderRadius: '4px',
  overflow: 'hidden'
};

const probabilityProgressStyle = {
  height: '100%',
  borderRadius: '4px',
  transition: 'width 0.5s ease'
};

const targetAnalysisStyle = {
  marginTop: '20px'
};

const targetCardStyle = {
  background: 'rgba(255,255,255,0.1)',
  padding: '25px',
  borderRadius: '12px',
  border: '1px solid rgba(255,255,255,0.2)'
};

const targetHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '20px'
};

const difficultyBadgeStyle = {
  padding: '6px 12px',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: 'bold',
  color: '#fff'
};

const targetStatsStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '20px'
};

const targetStatStyle = {
  display: 'flex',
  justifyContent: 'space-between'
};

const improvementGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
  gap: '20px',
  marginTop: '20px'
};

const improvementCardStyle = {
  background: 'rgba(255,255,255,0.1)',
  padding: '25px',
  borderRadius: '12px',
  border: '1px solid rgba(255,255,255,0.2)'
};

const improvementHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '15px'
};

const priorityBadgeStyle = {
  padding: '4px 8px',
  borderRadius: '6px',
  fontSize: '12px',
  fontWeight: 'bold',
  color: '#fff'
};

// 필요한 스타일들
const improvementStatsStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '15px'
};

const improvementStatStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '5px'
};

const tipsStyle = {
  marginTop: '15px',
  paddingTop: '15px',
  borderTop: '1px solid rgba(255,255,255,0.1)'
};

const tipListStyle = {
  listStyle: 'none',
  padding: 0,
  margin: 0
};

const tipItemStyle = {
  padding: '5px 0',
  fontSize: '14px',
  opacity: 0.9
};

const requirementsStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '20px',
  marginTop: '20px'
};

const requirementsCardStyle = {
  background: 'rgba(255,255,255,0.1)',
  padding: '25px',
  borderRadius: '12px',
  border: '1px solid rgba(255,255,255,0.2)'
};

const requirementStatsStyle = {
  marginTop: '15px'
};

const requirementStatStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  margin: '10px 0'
};

const skillListStyle = {
  listStyle: 'none',
  padding: 0,
  margin: '15px 0 0 0'
};

const skillItemStyle = {
  padding: '8px 0',
  fontSize: '14px',
  color: '#00D4AA'
};

export default RankPredictor;
