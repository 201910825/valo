import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function GrowthChart({ matches }) {
  // matches가 배열이 아니거나 undefined인 경우를 처리
  if (!matches || !Array.isArray(matches) || matches.length === 0) {
    return (
      <div style={noDataStyle}>
        <p>📈 성장 분석을 위한 매치 데이터가 없습니다.</p>
      </div>
    );
  }

  // 실제 매치 데이터 구조에 맞게 데이터 변환
  const data = matches.map((match, idx) => {
    const kills = match.kills || 0;
    const deaths = Math.max(1, match.deaths || 1); // 0으로 나누는 것을 방지
    const assists = match.assists || 0;
    const score = match.score || 0;
    
    return {
      name: `경기 ${idx + 1}`,
      KDA: parseFloat(((kills + assists) / deaths).toFixed(2)),
      킬수: kills,
      데스수: deaths,
      어시스트: assists,
      점수: score,
      에이전트: match.agent || '알 수 없음',
      맵: match.map || '알 수 없음',
      결과: match.result || '알 수 없음'
    };
  });

  // 평균 계산
  const avgKDA = (data.reduce((sum, match) => sum + match.KDA, 0) / data.length).toFixed(2);
  const avgKills = (data.reduce((sum, match) => sum + match.킬수, 0) / data.length).toFixed(1);
  const avgScore = (data.reduce((sum, match) => sum + match.점수, 0) / data.length).toFixed(1);

  return (
    <div style={containerStyle}>
      {/* 요약 통계 */}
      <div style={summaryStyle}>
        <div style={statBoxStyle}>
          <span style={statLabelStyle}>평균 KDA</span>
          <span style={statValueStyle}>{avgKDA}</span>
        </div>
        <div style={statBoxStyle}>
          <span style={statLabelStyle}>평균 킬</span>
          <span style={statValueStyle}>{avgKills}</span>
        </div>
        <div style={statBoxStyle}>
          <span style={statLabelStyle}>평균 점수</span>
          <span style={statValueStyle}>{avgScore}</span>
        </div>
        <div style={statBoxStyle}>
          <span style={statLabelStyle}>총 경기</span>
          <span style={statValueStyle}>{matches.length}</span>
        </div>
      </div>

      {/* KDA 성장 차트 */}
      <div style={chartContainerStyle}>
        <h3 style={chartTitleStyle}>📈 KDA 성장 추이</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="name" 
              stroke="#fff"
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              stroke="#fff"
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1e1e2f', 
                border: '1px solid #00D4AA',
                borderRadius: '8px',
                color: '#fff'
              }}
              formatter={(value, name, props) => {
                if (name === 'KDA') {
                  const match = props.payload;
                  return [
                    `${value} (${match.킬수}/${match.데스수}/${match.어시스트})`,
                    'KDA'
                  ];
                }
                return [value, name];
              }}
              labelFormatter={(label, payload) => {
                if (payload && payload.length > 0) {
                  const match = payload[0].payload;
                  return `${label} - ${match.에이전트} @ ${match.맵} (${match.결과})`;
                }
                return label;
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="KDA" 
              stroke="#00D4AA" 
              strokeWidth={3}
              dot={{ fill: '#00D4AA', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#00D4AA', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 킬/데스/어시스트 차트 */}
      <div style={chartContainerStyle}>
        <h3 style={chartTitleStyle}>⚔️ 킬/데스/어시스트 추이</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="name" 
              stroke="#fff"
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              stroke="#fff"
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1e1e2f', 
                border: '1px solid #00D4AA',
                borderRadius: '8px',
                color: '#fff'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="킬수" 
              stroke="#00D4AA" 
              strokeWidth={2}
              dot={{ fill: '#00D4AA', r: 3 }}
            />
            <Line 
              type="monotone" 
              dataKey="데스수" 
              stroke="#FF453A" 
              strokeWidth={2}
              dot={{ fill: '#FF453A', r: 3 }}
            />
            <Line 
              type="monotone" 
              dataKey="어시스트" 
              stroke="#FFD60A" 
              strokeWidth={2}
              dot={{ fill: '#FFD60A', r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 성과 트렌드 분석 */}
      <div style={trendAnalysisStyle}>
        <h3 style={chartTitleStyle}>📊 성과 트렌드 분석</h3>
        <div style={trendGridStyle}>
          {getTrendAnalysis(data).map((trend, index) => (
            <div key={index} style={trendItemStyle}>
              <div style={trendIconStyle}>{trend.icon}</div>
              <div>
                <div style={trendTitleStyle}>{trend.title}</div>
                <div style={trendDescStyle}>{trend.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 트렌드 분석 함수
function getTrendAnalysis(data) {
  if (data.length < 2) return [];

  const recent = data.slice(-3); // 최근 3경기
  const early = data.slice(0, 3); // 초기 3경기
  
  const recentAvgKDA = recent.reduce((sum, m) => sum + m.KDA, 0) / recent.length;
  const earlyAvgKDA = early.reduce((sum, m) => sum + m.KDA, 0) / early.length;
  
  const trends = [];
  
  // KDA 트렌드
  if (recentAvgKDA > earlyAvgKDA * 1.1) {
    trends.push({
      icon: '📈',
      title: 'KDA 상승세',
      description: `최근 KDA가 ${(recentAvgKDA - earlyAvgKDA).toFixed(2)} 향상되었습니다.`
    });
  } else if (recentAvgKDA < earlyAvgKDA * 0.9) {
    trends.push({
      icon: '📉',
      title: 'KDA 하락세',
      description: `최근 KDA가 ${(earlyAvgKDA - recentAvgKDA).toFixed(2)} 하락했습니다.`
    });
  } else {
    trends.push({
      icon: '➡️',
      title: 'KDA 안정세',
      description: '최근 KDA가 안정적으로 유지되고 있습니다.'
    });
  }

  // 승률 트렌드
  const recentWins = recent.filter(m => m.결과 === '승리').length;
  const recentWinRate = (recentWins / recent.length) * 100;
  
  if (recentWinRate >= 70) {
    trends.push({
      icon: '🔥',
      title: '연승 중',
      description: `최근 승률 ${recentWinRate.toFixed(0)}%로 좋은 폼을 보이고 있습니다.`
    });
  } else if (recentWinRate <= 30) {
    trends.push({
      icon: '❄️',
      title: '부진한 상태',
      description: `최근 승률 ${recentWinRate.toFixed(0)}%로 개선이 필요합니다.`
    });
  }

  return trends;
}

// 스타일 정의
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

const summaryStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
  gap: '15px',
  marginBottom: '25px'
};

const statBoxStyle = {
  backgroundColor: 'rgba(255,255,255,0.05)',
  padding: '15px',
  borderRadius: '8px',
  textAlign: 'center',
  border: '1px solid rgba(255,255,255,0.1)'
};

const statLabelStyle = {
  display: 'block',
  fontSize: '12px',
  color: 'rgba(255,255,255,0.7)',
  marginBottom: '5px'
};

const statValueStyle = {
  display: 'block',
  fontSize: '20px',
  fontWeight: 'bold',
  color: '#00D4AA'
};

const chartContainerStyle = {
  backgroundColor: 'rgba(255,255,255,0.05)',
  padding: '20px',
  borderRadius: '8px',
  marginBottom: '20px',
  border: '1px solid rgba(255,255,255,0.1)'
};

const chartTitleStyle = {
  marginBottom: '15px',
  color: '#00D4AA',
  fontSize: '16px'
};

const trendAnalysisStyle = {
  backgroundColor: 'rgba(255,255,255,0.05)',
  padding: '20px',
  borderRadius: '8px',
  border: '1px solid rgba(255,255,255,0.1)'
};

const trendGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '15px'
};

const trendItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '10px',
  backgroundColor: 'rgba(255,255,255,0.05)',
  borderRadius: '6px'
};

const trendIconStyle = {
  fontSize: '24px'
};

const trendTitleStyle = {
  fontWeight: 'bold',
  marginBottom: '2px'
};

const trendDescStyle = {
  fontSize: '12px',
  color: 'rgba(255,255,255,0.7)'
};
