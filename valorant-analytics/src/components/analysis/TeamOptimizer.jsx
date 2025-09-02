import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line } from 'recharts';
import { VALORANT_CONTENT } from '../../api/riotAPI';

const TeamOptimizer = ({ matches = [], currentTeam = [] }) => {
  const [optimization, setOptimization] = useState(null);
  const [selectedMap, setSelectedMap] = useState('전체');
  const [teamSynergy, setTeamSynergy] = useState(null);
  const [loading, setLoading] = useState(false);

  // 에이전트 역할 분류
  const agentRoles = {
    'Duelist': ['Jett', 'Reyna', 'Phoenix', 'Raze', 'Yoru', 'Neon', 'Iso'],
    'Initiator': ['Sova', 'Breach', 'Skye', 'KAY/O', 'Fade', 'Gekko'],
    'Controller': ['Omen', 'Viper', 'Astra', 'Harbor', 'Clove'],
    'Sentinel': ['Sage', 'Cypher', 'Killjoy', 'Chamber', 'Deadlock']
  };

  // 에이전트별 시너지 매트릭스 (실제 게임 데이터 기반)
  const synergyMatrix = {
    'Jett': { 'Sage': 0.85, 'Sova': 0.80, 'Omen': 0.75, 'Cypher': 0.70 },
    'Reyna': { 'Sage': 0.75, 'Sova': 0.85, 'Omen': 0.80, 'Breach': 0.75 },
    'Phoenix': { 'Sage': 0.80, 'Cypher': 0.75, 'Omen': 0.85, 'Breach': 0.70 },
    'Sage': { 'Jett': 0.85, 'Reyna': 0.75, 'Phoenix': 0.80, 'Sova': 0.90 },
    'Sova': { 'Jett': 0.80, 'Reyna': 0.85, 'Sage': 0.90, 'Raze': 0.85 },
    'Omen': { 'Jett': 0.75, 'Reyna': 0.80, 'Phoenix': 0.85, 'Sage': 0.80 },
    // ... 더 많은 조합들
  };

  useEffect(() => {
    if (matches && matches.length > 0) {
      analyzeTeamOptimization();
    }
  }, [matches, selectedMap]);

  const analyzeTeamOptimization = () => {
    setLoading(true);
    
    // 맵 필터링
    const filteredMatches = selectedMap === '전체' 
      ? matches 
      : matches.filter(match => match.map === selectedMap);

    // 에이전트 조합 분석
    const agentCombos = analyzeAgentCombinations(filteredMatches);
    const roleBalance = analyzeRoleBalance(filteredMatches);
    const mapSpecificData = analyzeMapPerformance(filteredMatches);
    
    setOptimization({
      bestCombos: agentCombos,
      roleBalance,
      mapPerformance: mapSpecificData,
      recommendations: generateRecommendations(agentCombos, roleBalance)
    });

    // 현재 팀 시너지 계산
    if (currentTeam.length > 0) {
      calculateTeamSynergy(currentTeam);
    }

    setLoading(false);
  };

  const analyzeAgentCombinations = (matches) => {
    const combinations = {};
    
    matches.forEach(match => {
      const agent = match.agent;
      if (!combinations[agent]) {
        combinations[agent] = {
          agent,
          matches: 0,
          wins: 0,
          totalKills: 0,
          totalDeaths: 0,
          totalAssists: 0,
          totalScore: 0
        };
      }
      
      combinations[agent].matches++;
      if (match.result === '승리') combinations[agent].wins++;
      combinations[agent].totalKills += match.kills;
      combinations[agent].totalDeaths += match.deaths;
      combinations[agent].totalAssists += match.assists;
      combinations[agent].totalScore += match.score;
    });

    return Object.values(combinations)
      .map(combo => ({
        ...combo,
        winRate: (combo.wins / combo.matches * 100).toFixed(1),
        avgKDA: ((combo.totalKills + combo.totalAssists) / Math.max(1, combo.totalDeaths)).toFixed(2),
        avgScore: (combo.totalScore / combo.matches).toFixed(1),
        efficiency: calculateAgentEfficiency(combo)
      }))
      .sort((a, b) => parseFloat(b.efficiency) - parseFloat(a.efficiency))
      .slice(0, 10);
  };

  const getRecommendation = (role, stats) => {
    const winRate = stats.matches > 0 ? (stats.wins / stats.matches * 100) : 0;
    if (winRate >= 60) return '🔥 강점 역할';
    if (winRate >= 50) return '✅ 안정적';
    if (winRate >= 40) return '⚠️ 개선 필요';
    return '❌ 연습 필요';
  };

  const analyzeRoleBalance = (matches) => {
    const roleStats = {
      'Duelist': { matches: 0, wins: 0, avgKills: 0 },
      'Initiator': { matches: 0, wins: 0, avgKills: 0 },
      'Controller': { matches: 0, wins: 0, avgKills: 0 },
      'Sentinel': { matches: 0, wins: 0, avgKills: 0 }
    };

    matches.forEach(match => {
      const role = getAgentRole(match.agent);
      if (role && roleStats[role]) {
        roleStats[role].matches++;
        if (match.result === '승리') roleStats[role].wins++;
        roleStats[role].avgKills += match.kills;
      }
    });

    return Object.entries(roleStats).map(([role, stats]) => ({
      role,
      winRate: stats.matches > 0 ? (stats.wins / stats.matches * 100).toFixed(1) : 0,
      avgKills: stats.matches > 0 ? (stats.avgKills / stats.matches).toFixed(1) : 0,
      matches: stats.matches,
      recommendation: getRecommendation(role, stats)
    }));
  };

  const analyzeMapPerformance = (matches) => {
    const mapStats = {};
    
    matches.forEach(match => {
      if (!mapStats[match.map]) {
        mapStats[match.map] = {
          map: match.map,
          matches: 0,
          wins: 0,
          bestAgents: {}
        };
      }
      
      mapStats[match.map].matches++;
      if (match.result === '승리') mapStats[match.map].wins++;
      
      if (!mapStats[match.map].bestAgents[match.agent]) {
        mapStats[match.map].bestAgents[match.agent] = { wins: 0, matches: 0 };
      }
      mapStats[match.map].bestAgents[match.agent].matches++;
      if (match.result === '승리') {
        mapStats[match.map].bestAgents[match.agent].wins++;
      }
    });

    return Object.values(mapStats).map(mapData => ({
      ...mapData,
      winRate: (mapData.wins / mapData.matches * 100).toFixed(1),
      topAgent: getTopAgentForMap(mapData.bestAgents)
    }));
  };

  const calculateAgentEfficiency = (combo) => {
    const winRateWeight = 0.4;
    const kdaWeight = 0.3;
    const scoreWeight = 0.3;
    
    const winRateScore = parseFloat(combo.winRate) / 100;
    const kdaScore = Math.min(parseFloat(combo.avgKDA) / 2, 1); // KDA 2.0을 만점으로
    const scoreScore = Math.min(parseFloat(combo.avgScore) / 300, 1); // 300점을 만점으로
    
    return ((winRateScore * winRateWeight + kdaScore * kdaWeight + scoreScore * scoreWeight) * 100).toFixed(1);
  };

  const getAgentRole = (agentName) => {
    for (const [role, agents] of Object.entries(agentRoles)) {
      if (agents.includes(agentName)) return role;
    }
    return null;
  };

  const getTopAgentForMap = (bestAgents) => {
    let topAgent = '';
    let bestWinRate = 0;
    
    Object.entries(bestAgents).forEach(([agent, stats]) => {
      const winRate = stats.matches > 2 ? (stats.wins / stats.matches) : 0;
      if (winRate > bestWinRate) {
        bestWinRate = winRate;
        topAgent = agent;
      }
    });
    
    return { agent: topAgent, winRate: (bestWinRate * 100).toFixed(1) };
  };

  const calculateTeamSynergy = (team) => {
    if (team.length < 2) return;
    
    let totalSynergy = 0;
    let combinations = 0;
    
    for (let i = 0; i < team.length; i++) {
      for (let j = i + 1; j < team.length; j++) {
        const agent1 = team[i];
        const agent2 = team[j];
        const synergy = synergyMatrix[agent1]?.[agent2] || 0.5; // 기본값 0.5
        totalSynergy += synergy;
        combinations++;
      }
    }
    
    const averageSynergy = combinations > 0 ? (totalSynergy / combinations) : 0.5;
    
    setTeamSynergy({
      score: (averageSynergy * 100).toFixed(1),
      rating: getSynergyRating(averageSynergy),
      roleBalance: analyzeCurrentTeamRoles(team)
    });
  };

  const analyzeCurrentTeamRoles = (team) => {
    const roleCounts = {
      'Duelist': 0,
      'Initiator': 0,
      'Controller': 0,
      'Sentinel': 0
    };
    
    team.forEach(agent => {
      const role = getAgentRole(agent);
      if (role) roleCounts[role]++;
    });
    
    return roleCounts;
  };

  const getSynergyRating = (score) => {
    if (score >= 0.8) return '🔥 환상적';
    if (score >= 0.7) return '⭐ 우수';
    if (score >= 0.6) return '✅ 양호';
    if (score >= 0.5) return '⚠️ 보통';
    return '❌ 개선필요';
  };

  const generateRecommendations = (agentCombos, roleBalance) => {
    const recommendations = [];
    
    // 최고 효율 에이전트 추천
    if (agentCombos.length > 0) {
      recommendations.push({
        type: '최고 효율 에이전트',
        title: `${agentCombos[0].agent} 추천`,
        description: `승률 ${agentCombos[0].winRate}%, 평균 KDA ${agentCombos[0].avgKDA}`,
        priority: 'high'
      });
    }
    
    // 역할 밸런스 추천
    const lowPerformingRole = roleBalance.find(role => parseFloat(role.winRate) < 50);
    if (lowPerformingRole) {
      recommendations.push({
        type: '역할 개선',
        title: `${lowPerformingRole.role} 역할 강화 필요`,
        description: `현재 승률 ${lowPerformingRole.winRate}% - 연습 또는 다른 에이전트 시도`,
        priority: 'medium'
      });
    }
    
    return recommendations;
  };



  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
        <span className="ml-3 text-lg">팀 최적화 분석 중...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">🎯 팀 최적화 분석</h2>
        <p className="opacity-90">AI 기반 에이전트 조합 분석 및 전략 최적화</p>
      </div>

      {/* 맵 선택 */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <label className="block text-sm font-medium text-gray-700 mb-2">분석할 맵 선택</label>
        <select 
          value={selectedMap} 
          onChange={(e) => setSelectedMap(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
        >
          <option value="전체">전체 맵</option>
          {VALORANT_CONTENT.maps.map(map => (
            <option key={map.id} value={map.name}>{map.name}</option>
          ))}
        </select>
      </div>

      {/* 현재 팀 시너지 */}
      {teamSynergy && (
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-bold mb-4">🤝 현재 팀 시너지</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-500 mb-2">{teamSynergy.score}점</div>
              <div className="text-lg">{teamSynergy.rating}</div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">역할 구성</h4>
              {Object.entries(teamSynergy.roleBalance).map(([role, count]) => (
                <div key={role} className="flex justify-between py-1">
                  <span>{role}</span>
                  <span className="font-semibold">{count}명</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {optimization && (
        <>
          {/* 최고 효율 에이전트 */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-4">🏆 최고 효율 에이전트 TOP 5</h3>
            <div className="space-y-3">
              {optimization.bestCombos.slice(0, 5).map((combo, index) => (
                <div key={combo.agent} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-bold mr-3">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-semibold">{combo.agent}</div>
                      <div className="text-sm text-gray-600">{combo.matches}경기</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-600">승률 {combo.winRate}%</div>
                    <div className="text-sm text-gray-600">KDA {combo.avgKDA}</div>
                    <div className="text-xs text-red-500">효율성 {combo.efficiency}점</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 역할별 분석 */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-4">⚔️ 역할별 성과 분석</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={optimization.roleBalance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="role" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="winRate" fill="#ef4444" name="승률 (%)" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {optimization.roleBalance.map(role => (
                <div key={role.role} className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="font-semibold">{role.role}</div>
                  <div className="text-sm text-gray-600">{role.matches}경기</div>
                  <div className="text-sm font-semibold text-red-500">{role.recommendation}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 맵별 성과 */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-4">🗺️ 맵별 성과 분석</h3>
            <div className="space-y-3">
              {optimization.mapPerformance.map(mapData => (
                <div key={mapData.map} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-lg">{mapData.map}</h4>
                    <div className="text-right">
                      <div className="font-bold text-green-600">승률 {mapData.winRate}%</div>
                      <div className="text-sm text-gray-600">{mapData.matches}경기</div>
                    </div>
                  </div>
                  {mapData.topAgent.agent && (
                    <div className="text-sm text-gray-700">
                      🏆 최고 에이전트: <span className="font-semibold text-red-500">{mapData.topAgent.agent}</span> 
                      <span className="text-green-600"> ({mapData.topAgent.winRate}% 승률)</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 추천사항 */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-4">💡 AI 추천사항</h3>
            <div className="space-y-3">
              {optimization.recommendations.map((rec, index) => (
                <div key={index} className={`p-4 rounded-lg border-l-4 ${
                  rec.priority === 'high' ? 'border-red-500 bg-red-50' :
                  rec.priority === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                  'border-blue-500 bg-blue-50'
                }`}>
                  <div className="font-semibold text-gray-800">{rec.title}</div>
                  <div className="text-sm text-gray-600 mt-1">{rec.description}</div>
                  <div className="text-xs text-gray-500 mt-2">카테고리: {rec.type}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TeamOptimizer;
