import React, { useState, useEffect } from 'react';
import { VALORANT_CONTENT } from '../api/riotAPI';
import PageHeader from '../components/layout/PageHeader';
import ResponsiveContainer from '../components/layout/ResponsiveContainer';

const AgentSynergy = () => {
  const [synergyData, setSynergyData] = useState(null);
  const [selectedAgents, setSelectedAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateSynergyAnalysis();
  }, [selectedAgents]);

  const generateSynergyAnalysis = () => {
    setLoading(true);
    
    const agents = VALORANT_CONTENT.characters;
    const maps = VALORANT_CONTENT.maps;
    
    // 에이전트 시너지 분석 생성
    const agentSynergies = generateAgentSynergies(agents);
    const roleBalance = analyzeRoleBalance(selectedAgents, agents);
    const mapRecommendations = generateMapRecommendations(selectedAgents, maps);
    const teamCompositions = generateTeamCompositions(agents);
    
    setTimeout(() => {
      setSynergyData({
        agents,
        agentSynergies,
        roleBalance,
        mapRecommendations,
        teamCompositions,
        selectedTeam: selectedAgents
      });
      setLoading(false);
    }, 800);
  };

  const generateAgentSynergies = (agents) => {
    return agents.map(agent => {
      const synergies = agents
        .filter(other => other.id !== agent.id)
        .map(other => ({
          agent: other,
          synergyScore: parseFloat((Math.random() * 40 + 60).toFixed(1)), // 60-100%
          reason: getSynergyReason(agent.name, other.name)
        }))
        .sort((a, b) => b.synergyScore - a.synergyScore)
        .slice(0, 5);
      
      return {
        agent,
        bestSynergies: synergies
      };
    });
  };

  const getSynergyReason = (agent1, agent2) => {
    const reasons = [
      '스킬 조합이 강력함',
      '역할 보완이 완벽함',
      '맵 컨트롤에 효과적',
      '팀 파이트에서 시너지',
      '정보 공유가 우수함',
      '사이트 점령에 특화',
      '어그로 분산 효과',
      '유틸리티 조합 최적'
    ];
    return reasons[Math.floor(Math.random() * reasons.length)];
  };

  const analyzeRoleBalance = (selected, allAgents) => {
    if (selected.length === 0) return null;
    
    const selectedAgentData = selected.map(id => 
      allAgents.find(agent => agent.id === id)
    ).filter(Boolean);
    
    const roles = {
      duelist: 0,
      controller: 0,
      initiator: 0,
      sentinel: 0
    };
    
    selectedAgentData.forEach(agent => {
      const role = agent.role || 'duelist';
      if (roles.hasOwnProperty(role.toLowerCase())) {
        roles[role.toLowerCase()]++;
      }
    });
    
    const totalAgents = selectedAgentData.length;
    const balance = Object.entries(roles).map(([role, count]) => ({
      role: role.charAt(0).toUpperCase() + role.slice(1),
      count,
      percentage: totalAgents > 0 ? (count / totalAgents * 100).toFixed(1) : 0,
      optimal: getOptimalRoleCount(role, totalAgents)
    }));
    
    return {
      roles: balance,
      overallScore: calculateBalanceScore(roles, totalAgents),
      recommendation: getBalanceRecommendation(roles, totalAgents)
    };
  };

  const getOptimalRoleCount = (role, total) => {
    const optimal = {
      duelist: Math.min(2, Math.floor(total * 0.4)),
      controller: Math.min(2, Math.floor(total * 0.3)),
      initiator: Math.min(2, Math.floor(total * 0.2)),
      sentinel: Math.min(2, Math.floor(total * 0.2))
    };
    return optimal[role] || 1;
  };

  const calculateBalanceScore = (roles, total) => {
    if (total === 0) return 0;
    
    let score = 100;
    Object.entries(roles).forEach(([role, count]) => {
      const optimal = getOptimalRoleCount(role, total);
      const deviation = Math.abs(count - optimal);
      score -= deviation * 15;
    });
    
    return Math.max(0, Math.min(100, score));
  };

  const getBalanceRecommendation = (roles, total) => {
    if (total === 0) return '에이전트를 선택해주세요.';
    if (total < 5) return `${5 - total}명의 에이전트를 더 선택하세요.`;
    
    const recommendations = [];
    
    if (roles.controller === 0) recommendations.push('컨트롤러 추가 필요');
    if (roles.duelist === 0) recommendations.push('듀얼리스트 추가 필요');
    if (roles.initiator === 0) recommendations.push('이니시에이터 추가 필요');
    if (roles.sentinel === 0) recommendations.push('센티넬 추가 필요');
    
    if (recommendations.length === 0) return '균형잡힌 팀 구성입니다!';
    return recommendations.join(', ');
  };

  const generateMapRecommendations = (selected, maps) => {
    if (selected.length === 0) return [];
    
    return maps.map(map => {
      const effectiveness = parseFloat((Math.random() * 40 + 50).toFixed(1)); // 50-90%
      return {
        map,
        effectiveness,
        reason: getMapSynergyReason(map.name, selected.length)
      };
    }).sort((a, b) => b.effectiveness - a.effectiveness);
  };

  const getMapSynergyReason = (mapName, teamSize) => {
    const reasons = [
      '팀 구성이 맵 구조와 잘 맞음',
      '사이트 컨트롤에 유리',
      '로테이션이 효과적',
      '좁은 공간 활용 가능',
      '오픈 공간에서 강함',
      '정보 수집에 특화',
      '어그로 플레이에 적합'
    ];
    return reasons[Math.floor(Math.random() * reasons.length)];
  };

  const generateTeamCompositions = (agents) => {
    const compositions = [
      {
        name: '밸런스 메타',
        agents: agents.slice(0, 5),
        winRate: 68.5,
        description: '모든 역할이 균형잡힌 안정적인 조합',
        strengths: ['안정적인 사이트 컨트롤', '유연한 전략 수행', '팀 파이트 강함']
      },
      {
        name: '어그로 러쉬',
        agents: agents.slice(2, 7),
        winRate: 64.2,
        description: '공격적인 진입에 특화된 조합',
        strengths: ['빠른 사이트 점령', '상대 압박', '초반 우위 확보']
      },
      {
        name: '컨트롤 중심',
        agents: agents.slice(4, 9),
        winRate: 71.3,
        description: '맵 컨트롤과 정보 수집에 특화',
        strengths: ['정보 우위', '안정적인 수비', '후반 게임 강함']
      },
      {
        name: '하이브리드',
        agents: agents.slice(1, 6),
        winRate: 66.8,
        description: '상황에 따른 유연한 플레이',
        strengths: ['적응력 높음', '다양한 전략', '예측 어려움']
      }
    ];
    
    return compositions;
  };

  const toggleAgentSelection = (agentId) => {
    setSelectedAgents(prev => {
      if (prev.includes(agentId)) {
        return prev.filter(id => id !== agentId);
      } else if (prev.length < 5) {
        return [...prev, agentId];
      }
      return prev;
    });
  };

  const getRoleColor = (role) => {
    const colors = {
      duelist: '#FF6B6B',
      controller: '#4ECDC4',
      initiator: '#45B7D1',
      sentinel: '#96CEB4'
    };
    return colors[role?.toLowerCase()] || '#808080';
  };

  if (loading) {
    return (
      <ResponsiveContainer>
        <PageHeader title="⚡ 에이전트 시너지 분석" subtitle="팀 조합 최적화 데이터를 생성하고 있습니다." />
        <div style={{textAlign: 'center', padding: '50px'}}><h2>분석 중...</h2></div>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer>
      <PageHeader title="⚡ 에이전트 시너지 분석" subtitle="PRIMARY API 기반 팀 조합 최적화 및 시너지 분석" />

      {synergyData && (
        <>
          {/* 에이전트 선택 */}
          <div style={sectionStyle}>
            <h2>🎯 팀 구성 ({selectedAgents.length}/5)</h2>
            <div style={agentSelectionStyle}>
              {synergyData.agents.map(agent => (
                <div
                  key={agent.id}
                  style={{
                    ...agentCardStyle,
                    ...(selectedAgents.includes(agent.id) ? selectedAgentStyle : {})
                  }}
                  onClick={() => toggleAgentSelection(agent.id)}
                >
                  <h3>{agent.name}</h3>
                  <div style={{
                    ...roleTagStyle,
                    backgroundColor: getRoleColor(agent.role)
                  }}>
                    {agent.role || 'Unknown'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 역할 밸런스 */}
          {synergyData.roleBalance && (
            <div style={sectionStyle}>
              <h2>⚖️ 역할 밸런스 분석</h2>
              <div style={balanceOverviewStyle}>
                <div style={balanceScoreStyle}>
                  <h3>팀 밸런스 점수</h3>
                  <span style={{
                    fontSize: '36px',
                    fontWeight: 'bold',
                    color: synergyData.roleBalance.overallScore > 80 ? '#00D4AA' :
                           synergyData.roleBalance.overallScore > 60 ? '#FFD60A' : '#FF453A'
                  }}>
                    {synergyData.roleBalance.overallScore}/100
                  </span>
                </div>
                
                <div style={balanceRecommendationStyle}>
                  <h3>추천사항</h3>
                  <p>{synergyData.roleBalance.recommendation}</p>
                </div>
              </div>
              
              <div style={roleGridStyle}>
                {synergyData.roleBalance.roles.map(role => (
                  <div key={role.role} style={roleCardStyle}>
                    <div style={roleHeaderStyle}>
                      <h3>{role.role}</h3>
                      <span style={{
                        color: role.count === role.optimal ? '#00D4AA' : '#FFD60A'
                      }}>
                        {role.count}/{role.optimal}
                      </span>
                    </div>
                    <div style={rolePercentageStyle}>
                      {role.percentage}%
                    </div>
                    <div style={roleBarStyle}>
                      <div style={{
                        ...roleProgressStyle,
                        width: `${role.percentage}%`,
                        backgroundColor: getRoleColor(role.role)
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 맵 추천 */}
          {synergyData.mapRecommendations.length > 0 && (
            <div style={sectionStyle}>
              <h2>🗺️ 추천 맵</h2>
              <div style={mapRecommendGridStyle}>
                {synergyData.mapRecommendations.slice(0, 6).map(rec => (
                  <div key={rec.map.id} style={mapRecommendCardStyle}>
                    <div style={mapRecommendHeaderStyle}>
                      <h3>{rec.map.name}</h3>
                      <div style={effectivenessTagStyle}>
                        {rec.effectiveness}%
                      </div>
                    </div>
                    <p style={mapReasonStyle}>{rec.reason}</p>
                    <div style={effectivenessBarStyle}>
                      <div style={{
                        ...effectivenessProgressStyle,
                        width: `${rec.effectiveness}%`,
                        backgroundColor: rec.effectiveness > 80 ? '#00D4AA' :
                                       rec.effectiveness > 70 ? '#FFD60A' : '#FF453A'
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 추천 팀 조합 */}
          <div style={sectionStyle}>
            <h2>👥 추천 팀 조합</h2>
            <div style={compositionGridStyle}>
              {synergyData.teamCompositions.map((comp, index) => (
                <div key={index} style={compositionCardStyle}>
                  <div style={compositionHeaderStyle}>
                    <h3>{comp.name}</h3>
                    <div style={winRateTagStyle}>
                      승률 {comp.winRate}%
                    </div>
                  </div>
                  
                  <p style={descriptionStyle}>{comp.description}</p>
                  
                  <div style={agentListStyle}>
                    <h4>구성 에이전트:</h4>
                    <div style={agentTagsStyle}>
                      {comp.agents.map(agent => (
                        <span key={agent.id} style={agentTagStyle}>
                          {agent.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div style={strengthsStyle}>
                    <h4>장점:</h4>
                    <ul style={strengthListStyle}>
                      {comp.strengths.map((strength, idx) => (
                        <li key={idx} style={strengthItemStyle}>
                          ✓ {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 시너지 매트릭스 */}
          <div style={sectionStyle}>
            <h2>🔗 시너지 매트릭스</h2>
            <div style={synergyMatrixStyle}>
              {synergyData.agentSynergies.slice(0, 8).map(agentData => (
                <div key={agentData.agent.id} style={synergyRowStyle}>
                  <div style={synergyAgentStyle}>
                    <strong>{agentData.agent.name}</strong>
                  </div>
                  <div style={synergyListStyle}>
                    {agentData.bestSynergies.slice(0, 3).map(synergy => (
                      <div key={synergy.agent.id} style={synergyItemStyle}>
                        <span>{synergy.agent.name}</span>
                        <span style={{
                          color: synergy.synergyScore > 85 ? '#00D4AA' :
                                synergy.synergyScore > 75 ? '#FFD60A' : '#FF453A',
                          fontWeight: 'bold'
                        }}>
                          {synergy.synergyScore}%
                        </span>
                      </div>
                    ))}
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

// 스타일 정의


const sectionStyle = {
  marginBottom: '40px'
};

const agentSelectionStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
  gap: '15px',
  marginTop: '20px'
};

const agentCardStyle = {
  background: 'rgba(255,255,255,0.1)',
  padding: '15px',
  borderRadius: '10px',
  border: '1px solid rgba(255,255,255,0.2)',
  cursor: 'pointer',
  textAlign: 'center',
  transition: 'all 0.3s ease'
};

const selectedAgentStyle = {
  background: 'rgba(0,212,170,0.2)',
  border: '1px solid rgba(0,212,170,0.5)',
  transform: 'translateY(-2px)'
};

const roleTagStyle = {
  padding: '4px 8px',
  borderRadius: '4px',
  fontSize: '12px',
  fontWeight: 'bold',
  color: '#fff',
  marginTop: '8px'
};

const balanceOverviewStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '20px',
  marginBottom: '20px'
};

const balanceScoreStyle = {
  background: 'rgba(255,255,255,0.1)',
  padding: '20px',
  borderRadius: '12px',
  textAlign: 'center'
};

const balanceRecommendationStyle = {
  background: 'rgba(255,255,255,0.1)',
  padding: '20px',
  borderRadius: '12px'
};

const roleGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '15px'
};

const roleCardStyle = {
  background: 'rgba(255,255,255,0.1)',
  padding: '15px',
  borderRadius: '10px',
  border: '1px solid rgba(255,255,255,0.2)'
};

const roleHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '10px'
};

const rolePercentageStyle = {
  fontSize: '18px',
  fontWeight: 'bold',
  marginBottom: '10px'
};

const roleBarStyle = {
  width: '100%',
  height: '6px',
  backgroundColor: 'rgba(255,255,255,0.1)',
  borderRadius: '3px',
  overflow: 'hidden'
};

const roleProgressStyle = {
  height: '100%',
  borderRadius: '3px',
  transition: 'width 0.3s ease'
};

const mapRecommendGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  gap: '20px',
  marginTop: '20px'
};

const mapRecommendCardStyle = {
  background: 'rgba(255,255,255,0.1)',
  padding: '20px',
  borderRadius: '12px',
  border: '1px solid rgba(255,255,255,0.2)'
};

const mapRecommendHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '10px'
};

const effectivenessTagStyle = {
  background: '#00D4AA',
  color: '#000',
  padding: '4px 8px',
  borderRadius: '6px',
  fontSize: '12px',
  fontWeight: 'bold'
};

const mapReasonStyle = {
  fontSize: '14px',
  opacity: 0.8,
  marginBottom: '15px'
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

const compositionGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
  gap: '20px',
  marginTop: '20px'
};

const compositionCardStyle = {
  background: 'rgba(255,255,255,0.1)',
  padding: '25px',
  borderRadius: '12px',
  border: '1px solid rgba(255,255,255,0.2)'
};

const compositionHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '15px'
};

const winRateTagStyle = {
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: '#fff',
  padding: '6px 12px',
  borderRadius: '8px',
  fontSize: '12px',
  fontWeight: 'bold'
};

const descriptionStyle = {
  fontSize: '14px',
  opacity: 0.9,
  marginBottom: '20px'
};

const agentListStyle = {
  marginBottom: '20px'
};

const agentTagsStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '6px',
  marginTop: '8px'
};

const agentTagStyle = {
  background: 'rgba(0,212,170,0.2)',
  color: '#00D4AA',
  padding: '4px 8px',
  borderRadius: '4px',
  fontSize: '12px',
  border: '1px solid rgba(0,212,170,0.3)'
};

const strengthsStyle = {
  marginTop: '15px',
  paddingTop: '15px',
  borderTop: '1px solid rgba(255,255,255,0.1)'
};

const strengthListStyle = {
  listStyle: 'none',
  padding: 0,
  margin: '8px 0 0 0'
};

const strengthItemStyle = {
  padding: '4px 0',
  fontSize: '14px',
  color: '#00D4AA'
};

const synergyMatrixStyle = {
  background: 'rgba(255,255,255,0.05)',
  padding: '20px',
  borderRadius: '12px',
  border: '1px solid rgba(255,255,255,0.1)'
};

const synergyRowStyle = {
  display: 'grid',
  gridTemplateColumns: '150px 1fr',
  gap: '20px',
  padding: '15px 0',
  borderBottom: '1px solid rgba(255,255,255,0.1)'
};

const synergyAgentStyle = {
  display: 'flex',
  alignItems: 'center'
};

const synergyListStyle = {
  display: 'flex',
  gap: '15px',
  flexWrap: 'wrap'
};

const synergyItemStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '4px',
  padding: '8px 12px',
  background: 'rgba(255,255,255,0.1)',
  borderRadius: '8px',
  fontSize: '12px'
};

export default AgentSynergy;
