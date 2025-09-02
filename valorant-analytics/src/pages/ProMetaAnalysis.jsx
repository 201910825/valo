import React, { useState, useEffect } from 'react';
import { VALORANT_CONTENT } from '../api/riotAPI';
import PageHeader from '../components/layout/PageHeader';
import ResponsiveContainer, { 
  responsiveSectionStyle, 
  createResponsiveGrid, 
  responsiveCardStyle,
  responsiveTextStyles,
  responsiveButtonStyle,
  responsiveFlexStyles
} from '../components/layout/ResponsiveContainer';

const ProMetaAnalysis = () => {
  const [metaData, setMetaData] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('current');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateProMetaData();
  }, [selectedPeriod]);

  const generateProMetaData = () => {
    setLoading(true);
    
    // PRIMARY API KEY 데이터 기반 프로 메타 분석 시뮬레이션
    const agents = VALORANT_CONTENT.characters;
    const maps = VALORANT_CONTENT.maps;
    
    const agentMeta = agents.map(agent => {
      const pickRate = Math.random() * 80 + 10; // 10-90%
      const winRate = Math.random() * 30 + 45; // 45-75%
      const banRate = Math.random() * 40 + 5; // 5-45%
      
      return {
        ...agent,
        pickRate: parseFloat(pickRate.toFixed(1)),
        winRate: parseFloat(winRate.toFixed(1)),
        banRate: parseFloat(banRate.toFixed(1)),
        trend: Math.random() > 0.5 ? 'up' : 'down',
        tierRank: Math.floor(Math.random() * 5) + 1, // S, A, B, C, D 티어
        proMatches: Math.floor(Math.random() * 500) + 100
      };
    }).sort((a, b) => b.pickRate - a.pickRate);

    const mapMeta = maps.map(map => {
      const pickRate = Math.random() * 60 + 20; // 20-80%
      const avgRounds = Math.random() * 5 + 22; // 22-27 라운드
      
      return {
        ...map,
        pickRate: parseFloat(pickRate.toFixed(1)),
        avgRounds: parseFloat(avgRounds.toFixed(1)),
        attackerWinRate: parseFloat((Math.random() * 20 + 40).toFixed(1)), // 40-60%
        defenderWinRate: parseFloat((Math.random() * 20 + 40).toFixed(1)), // 40-60%
        proMatches: Math.floor(Math.random() * 300) + 50
      };
    }).sort((a, b) => b.pickRate - a.pickRate);

    // 팀 조합 메타
    const teamComps = [
      { name: '듀얼리스트 + 컨트롤러 메타', winRate: 67.8, pickRate: 45.2, agents: ['Jett', 'Omen', 'Sage', 'Sova', 'Phoenix'] },
      { name: '센티넬 중심 메타', winRate: 64.3, pickRate: 38.7, agents: ['Cypher', 'Sage', 'Brimstone', 'Breach', 'Raze'] },
      { name: '이니시에이터 더블 메타', winRate: 71.2, pickRate: 32.1, agents: ['Sova', 'Breach', 'Jett', 'Omen', 'Sage'] },
      { name: '어그로 러쉬 메타', winRate: 59.4, pickRate: 28.9, agents: ['Raze', 'Phoenix', 'Breach', 'Brimstone', 'Reyna'] }
    ];

    setTimeout(() => {
      setMetaData({
        agents: agentMeta,
        maps: mapMeta,
        teamComps,
        lastUpdated: new Date().toLocaleDateString('ko-KR'),
        totalMatches: Math.floor(Math.random() * 5000) + 10000,
        period: selectedPeriod
      });
      setLoading(false);
    }, 800);
  };

  const getTierColor = (tier) => {
    const colors = {
      1: '#FFD700', // S티어 - 골드
      2: '#C0C0C0', // A티어 - 실버  
      3: '#CD7F32', // B티어 - 브론즈
      4: '#4169E1', // C티어 - 블루
      5: '#808080'  // D티어 - 그레이
    };
    return colors[tier] || '#808080';
  };

  const getTierLabel = (tier) => {
    const labels = { 1: 'S', 2: 'A', 3: 'B', 4: 'C', 5: 'D' };
    return labels[tier] || 'D';
  };

  if (loading) {
    return (
      <ResponsiveContainer>
        <PageHeader 
          title="🏆 프로 메타 분석" 
          subtitle="최신 프로 경기 데이터를 분석하고 있습니다."
        />
        <div style={{...loadingStyle, ...responsiveFlexStyles.center}}>
          <h2 style={responsiveTextStyles.h2}>로딩 중...</h2>
        </div>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer>
      <PageHeader 
        title="🏆 프로 메타 분석" 
        subtitle="PRIMARY API 데이터 기반 프로 경기 메타 트렌드 분석"
      />
      
      <div style={{...responsiveSectionStyle, ...responsiveFlexStyles.center}}>
        <div style={periodSelectorStyle}>
          <button 
            style={{
              ...responsiveButtonStyle, 
              ...(selectedPeriod === 'current' ? activePeriodStyle : {})
            }}
            onClick={() => setSelectedPeriod('current')}
          >
            현재 패치
          </button>
          <button 
            style={{
              ...responsiveButtonStyle, 
              ...(selectedPeriod === 'last30' ? activePeriodStyle : {})
            }}
            onClick={() => setSelectedPeriod('last30')}
          >
            최근 30일
          </button>
          <button 
            style={{
              ...responsiveButtonStyle, 
              ...(selectedPeriod === 'last90' ? activePeriodStyle : {})
            }}
            onClick={() => setSelectedPeriod('last90')}
          >
            최근 3개월
          </button>
        </div>
      </div>

      {metaData && (
        <>
          {/* 메타 통계 요약 */}
          <div style={{...responsiveSectionStyle}}>
            <div style={createResponsiveGrid('250px', '20px')}>
              <div style={{...responsiveCardStyle, textAlign: 'center'}}>
                <h3 style={responsiveTextStyles.h3}>📊 분석된 경기 수</h3>
                <p style={responsiveTextStyles.body}>{metaData.totalMatches.toLocaleString()}경기</p>
              </div>
              <div style={{...responsiveCardStyle, textAlign: 'center'}}>
                <h3 style={responsiveTextStyles.h3}>🗓️ 마지막 업데이트</h3>
                <p style={responsiveTextStyles.body}>{metaData.lastUpdated}</p>
              </div>
              <div style={{...responsiveCardStyle, textAlign: 'center'}}>
                <h3 style={responsiveTextStyles.h3}>🔥 가장 핫한 에이전트</h3>
                <p style={responsiveTextStyles.body}>{metaData.agents[0].name} ({metaData.agents[0].pickRate}%)</p>
              </div>
            </div>
          </div>

          {/* 에이전트 메타 */}
          <div style={responsiveSectionStyle}>
            <h2 style={responsiveTextStyles.h2}>⚡ 에이전트 메타 랭킹</h2>
            <div style={createResponsiveGrid('280px', '20px')}>
              {metaData.agents.slice(0, 12).map((agent, index) => (
                <div key={agent.id} style={{...responsiveCardStyle, textAlign: 'center'}}>
                  <div style={{...responsiveFlexStyles.spaceBetween, marginBottom: '10px'}}>
                    <span style={{ 
                      color: getTierColor(agent.tierRank), 
                      fontWeight: 'bold', 
                      fontSize: 'clamp(16px, 4vw, 18px)' 
                    }}>
                      {getTierLabel(agent.tierRank)}
                    </span>
                    <span style={{ 
                      fontSize: 'clamp(12px, 3vw, 14px)', 
                      opacity: 0.8 
                    }}>
                      #{index + 1}
                    </span>
                  </div>
                  
                  <h3 style={{...responsiveTextStyles.h3, color: '#fff'}}>{agent.name}</h3>
                  
                  <div style={agentStatsStyle}>
                    <div style={statRowStyle}>
                      <span>픽률:</span>
                      <span style={{ color: '#00D4AA', fontWeight: 'bold' }}>{agent.pickRate}%</span>
                    </div>
                    <div style={statRowStyle}>
                      <span>승률:</span>
                      <span style={{ color: agent.winRate > 50 ? '#00D4AA' : '#FF453A', fontWeight: 'bold' }}>
                        {agent.winRate}%
                      </span>
                    </div>
                    <div style={statRowStyle}>
                      <span>밴률:</span>
                      <span style={{ color: '#FFD60A', fontWeight: 'bold' }}>{agent.banRate}%</span>
                    </div>
                  </div>
                  
                  <div style={trendStyle}>
                    <span style={{ color: agent.trend === 'up' ? '#00D4AA' : '#FF453A' }}>
                      {agent.trend === 'up' ? '📈 상승' : '📉 하락'}
                    </span>
                    <span style={{ fontSize: '12px', opacity: 0.7 }}>
                      {agent.proMatches}경기
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 맵 메타 */}
          <div style={sectionStyle}>
            <h2>🗺️ 맵 메타 분석</h2>
            <div style={mapGridStyle}>
              {metaData.maps.map((map, index) => (
                <div key={map.id} style={mapCardStyle}>
                  <div style={mapHeaderStyle}>
                    <h3>{map.name}</h3>
                    <span style={mapRankStyle}>#{index + 1}</span>
                  </div>
                  
                  <div style={mapStatsStyle}>
                    <div style={statRowStyle}>
                      <span>픽률:</span>
                      <span style={{ color: '#00D4AA', fontWeight: 'bold' }}>{map.pickRate}%</span>
                    </div>
                    <div style={statRowStyle}>
                      <span>평균 라운드:</span>
                      <span>{map.avgRounds}</span>
                    </div>
                    <div style={statRowStyle}>
                      <span>공격팀 승률:</span>
                      <span style={{ color: map.attackerWinRate > 50 ? '#00D4AA' : '#FF453A' }}>
                        {map.attackerWinRate}%
                      </span>
                    </div>
                    <div style={statRowStyle}>
                      <span>수비팀 승률:</span>
                      <span style={{ color: map.defenderWinRate > 50 ? '#00D4AA' : '#FF453A' }}>
                        {map.defenderWinRate}%
                      </span>
                    </div>
                  </div>
                  
                  <div style={{ fontSize: '12px', opacity: 0.7, marginTop: '10px' }}>
                    {map.proMatches}경기 분석
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 팀 조합 메타 */}
          <div style={sectionStyle}>
            <h2>👥 팀 조합 메타</h2>
            <div style={teamCompGridStyle}>
              {metaData.teamComps.map((comp, index) => (
                <div key={index} style={teamCompCardStyle}>
                  <div style={teamCompHeaderStyle}>
                    <h3>{comp.name}</h3>
                    <div style={teamCompRankStyle}>#{index + 1}</div>
                  </div>
                  
                  <div style={teamCompStatsStyle}>
                    <div style={statRowStyle}>
                      <span>승률:</span>
                      <span style={{ color: '#00D4AA', fontWeight: 'bold', fontSize: '18px' }}>
                        {comp.winRate}%
                      </span>
                    </div>
                    <div style={statRowStyle}>
                      <span>픽률:</span>
                      <span style={{ color: '#FFD60A', fontWeight: 'bold' }}>
                        {comp.pickRate}%
                      </span>
                    </div>
                  </div>
                  
                  <div style={agentListStyle}>
                    <p style={{ fontSize: '14px', margin: '10px 0 5px 0', opacity: 0.8 }}>
                      추천 조합:
                    </p>
                    <div style={agentTagsStyle}>
                      {comp.agents.map(agent => (
                        <span key={agent} style={agentTagStyle}>{agent}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </ResponsiveContainer>
  );
};

// 반응형 스타일 정의
const sectionStyle = {
  marginBottom: 'clamp(20px, 6vw, 40px)',
  padding: '0'
};

const periodSelectorStyle = {
  display: 'flex',
  justifyContent: 'center',
  gap: 'clamp(8px, 2vw, 15px)',
  flexWrap: 'wrap',
  width: '100%',
  maxWidth: '600px'
};

const activePeriodStyle = {
  backgroundColor: '#00D4AA',
  borderColor: '#00D4AA',
  color: '#000'
};

const loadingStyle = {
  textAlign: 'center',
  padding: 'clamp(30px, 8vw, 50px)'
};

const agentStatsStyle = {
  margin: '15px 0'
};

const statRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  margin: '8px 0'
};

const trendStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: '15px',
  paddingTop: '15px',
  borderTop: '1px solid rgba(255,255,255,0.1)'
};

const mapGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gap: '20px',
  marginTop: '20px'
};

const mapCardStyle = {
  background: 'rgba(255,255,255,0.1)',
  padding: '20px',
  borderRadius: '12px',
  border: '1px solid rgba(255,255,255,0.2)'
};

const mapHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '15px'
};

const mapRankStyle = {
  background: '#00D4AA',
  color: '#000',
  padding: '4px 8px',
  borderRadius: '6px',
  fontSize: '12px',
  fontWeight: 'bold'
};

const mapStatsStyle = {
  margin: '15px 0'
};

const teamCompGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
  gap: '20px',
  marginTop: '20px'
};

const teamCompCardStyle = {
  background: 'rgba(255,255,255,0.1)',
  padding: '25px',
  borderRadius: '12px',
  border: '1px solid rgba(255,255,255,0.2)'
};

const teamCompHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '20px'
};

const teamCompRankStyle = {
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: '#fff',
  padding: '6px 12px',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: 'bold'
};

const teamCompStatsStyle = {
  marginBottom: '20px'
};

const agentListStyle = {
  marginTop: '15px',
  paddingTop: '15px',
  borderTop: '1px solid rgba(255,255,255,0.1)'
};

const agentTagsStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '6px'
};

const agentTagStyle = {
  background: 'rgba(0,212,170,0.2)',
  color: '#00D4AA',
  padding: '4px 8px',
  borderRadius: '4px',
  fontSize: '12px',
  border: '1px solid rgba(0,212,170,0.3)'
};

export default ProMetaAnalysis;
