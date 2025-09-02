import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

export default function TeamAnalysis({ matches }) {
  // matches가 배열이 아니거나 undefined인 경우를 처리
  if (!matches || !Array.isArray(matches) || matches.length === 0) {
    return (
      <div style={noDataStyle}>
        <p>📊 팀 분석을 위한 매치 데이터가 없습니다.</p>
      </div>
    );
  }

  // 에이전트별 성과 분석
  const agentStats = {};
  const mapStats = {};
  let totalWins = 0;
  let totalLosses = 0;

  matches.forEach((match) => {
    const agent = match.agent || '알 수 없음';
    const map = match.map || '알 수 없음';
    const isWin = match.result === '승리';

    // 에이전트별 통계
    if (!agentStats[agent]) {
      agentStats[agent] = { wins: 0, losses: 0, kills: 0, deaths: 0, assists: 0, games: 0 };
    }
    agentStats[agent].games += 1;
    agentStats[agent].kills += match.kills || 0;
    agentStats[agent].deaths += match.deaths || 0;
    agentStats[agent].assists += match.assists || 0;
    
    if (isWin) {
      agentStats[agent].wins += 1;
      totalWins += 1;
    } else {
      agentStats[agent].losses += 1;
      totalLosses += 1;
    }

    // 맵별 통계
    if (!mapStats[map]) {
      mapStats[map] = { wins: 0, losses: 0, games: 0 };
    }
    mapStats[map].games += 1;
    if (isWin) {
      mapStats[map].wins += 1;
    } else {
      mapStats[map].losses += 1;
    }
  });

  // 에이전트별 데이터 변환
  const agentData = Object.keys(agentStats).map(agent => ({
    name: agent,
    승률: ((agentStats[agent].wins / agentStats[agent].games) * 100).toFixed(1),
    평균킬: (agentStats[agent].kills / agentStats[agent].games).toFixed(1),
    평균데스: (agentStats[agent].deaths / agentStats[agent].games).toFixed(1),
    평균어시: (agentStats[agent].assists / agentStats[agent].games).toFixed(1),
    경기수: agentStats[agent].games
  }));

  // 맵별 데이터 변환
  const mapData = Object.keys(mapStats).map(map => ({
    name: map,
    승리: mapStats[map].wins,
    패배: mapStats[map].losses,
    승률: ((mapStats[map].wins / mapStats[map].games) * 100).toFixed(1)
  }));

  // 전체 승률 파이 차트 데이터
  const winRateData = [
    { name: '승리', value: totalWins, color: '#00D4AA' },
    { name: '패배', value: totalLosses, color: '#FF453A' }
  ];

  return (
    <div style={containerStyle}>
      {/* 전체 승률 */}
      <div style={chartSectionStyle}>
        <h3 style={chartTitleStyle}>🏆 전체 승률</h3>
        <div style={pieChartContainerStyle}>
          <PieChart width={300} height={200}>
            <Pie
              data={winRateData}
              cx={150}
              cy={100}
              innerRadius={40}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {winRateData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value, name) => [`${value}경기`, name]} />
            <Legend />
          </PieChart>
          <div style={winRateTextStyle}>
            <p><strong>승률: {((totalWins / (totalWins + totalLosses)) * 100).toFixed(1)}%</strong></p>
            <p>총 {totalWins + totalLosses}경기 중 {totalWins}승 {totalLosses}패</p>
          </div>
        </div>
      </div>

      {/* 에이전트별 성과 */}
      <div style={chartSectionStyle}>
        <h3 style={chartTitleStyle}>🎯 에이전트별 성과</h3>
        <BarChart width={600} height={300} data={agentData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="name" stroke="#fff" />
          <YAxis stroke="#fff" />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e1e2f', border: '1px solid #00D4AA' }}
            labelStyle={{ color: '#fff' }}
          />
          <Legend />
          <Bar dataKey="승률" fill="#00D4AA" name="승률 (%)" />
        </BarChart>
      </div>

      {/* 맵별 성과 */}
      <div style={chartSectionStyle}>
        <h3 style={chartTitleStyle}>🗺️ 맵별 성과</h3>
        <BarChart width={600} height={300} data={mapData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="name" stroke="#fff" />
          <YAxis stroke="#fff" />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e1e2f', border: '1px solid #00D4AA' }}
            labelStyle={{ color: '#fff' }}
          />
          <Legend />
          <Bar dataKey="승리" fill="#00D4AA" name="승리" />
          <Bar dataKey="패배" fill="#FF453A" name="패배" />
        </BarChart>
      </div>

      {/* 상세 통계 테이블 */}
      <div style={tableContainerStyle}>
        <h3 style={chartTitleStyle}>📋 에이전트별 상세 통계</h3>
        <table style={tableStyle}>
          <thead>
            <tr style={tableHeaderStyle}>
              <th>에이전트</th>
              <th>경기수</th>
              <th>승률</th>
              <th>평균 K/D/A</th>
            </tr>
          </thead>
          <tbody>
            {agentData.map((agent, index) => (
              <tr key={index} style={tableRowStyle}>
                <td style={tableCellStyle}>{agent.name}</td>
                <td style={tableCellStyle}>{agent.경기수}</td>
                <td style={tableCellStyle}>{agent.승률}%</td>
                <td style={tableCellStyle}>
                  {agent.평균킬}/{agent.평균데스}/{agent.평균어시}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const containerStyle = {
  color: '#fff'
};

const noDataStyle = {
  textAlign: 'center',
  padding: '40px',
  color: 'rgba(255,255,255,0.6)',
  backgroundColor: 'rgba(255,255,255,0.05)',
  borderRadius: '8px',
  border: '1px solid rgba(255,255,255,0.1)'
};

const chartSectionStyle = {
  marginBottom: '30px',
  padding: '20px',
  backgroundColor: 'rgba(255,255,255,0.05)',
  borderRadius: '8px',
  border: '1px solid rgba(255,255,255,0.1)'
};

const chartTitleStyle = {
  marginBottom: '15px',
  color: '#00D4AA'
};

const pieChartContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '20px'
};

const winRateTextStyle = {
  fontSize: '14px'
};

const tableContainerStyle = {
  marginTop: '20px'
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  backgroundColor: 'rgba(255,255,255,0.05)',
  borderRadius: '8px',
  overflow: 'hidden'
};

const tableHeaderStyle = {
  backgroundColor: 'rgba(0, 212, 170, 0.2)',
  color: '#fff'
};

const tableRowStyle = {
  borderBottom: '1px solid rgba(255,255,255,0.1)'
};

const tableCellStyle = {
  padding: '12px',
  textAlign: 'center',
  borderRight: '1px solid rgba(255,255,255,0.1)'
};
