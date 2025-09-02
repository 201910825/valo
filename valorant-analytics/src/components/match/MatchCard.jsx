import React from 'react';

function calculateInsight(match) {
  const insights = [];
  const kills = match.kills || 0;
  const deaths = match.deaths || 1;
  const assists = match.assists || 0;
  const score = match.score || 0;
  
  const kda = (kills + assists) / Math.max(1, deaths);
  
  // KDA 분석
  if (kda >= 2.0) {
    insights.push({ type: 'positive', text: `훌륭한 KDA ${kda.toFixed(2)}! 좋은 플레이를 보여주셨습니다.`, icon: '🔥' });
  } else if (kda < 1.0) {
    insights.push({ type: 'negative', text: `KDA ${kda.toFixed(2)}가 낮습니다. 더 신중한 플레이를 고려해보세요.`, icon: '⚠️' });
  } else {
    insights.push({ type: 'neutral', text: `KDA ${kda.toFixed(2)}는 평균적입니다. 조금 더 공격적으로 플레이해보세요.`, icon: '💡' });
  }

  // 킬 수 분석
  if (kills >= 20) {
    insights.push({ type: 'positive', text: '뛰어난 킬 수! 팀에 큰 기여를 했습니다.', icon: '⚡' });
  } else if (kills < 10) {
    insights.push({ type: 'negative', text: '킬 수가 적습니다. 더 적극적인 교전 참여를 고려해보세요.', icon: '🎯' });
  }

  // 점수 분석
  if (score >= 20) {
    insights.push({ type: 'positive', text: '높은 점수! 라운드 기여도가 뛰어납니다.', icon: '⭐' });
  }

  // 결과 분석
  if (match.result === '승리') {
    insights.push({ type: 'positive', text: '승리 축하드립니다! 이 폼을 유지하세요.', icon: '🏆' });
  } else {
    insights.push({ type: 'negative', text: '아쉬운 패배입니다. 다음 경기에서 더 좋은 결과를 기대합니다.', icon: '💪' });
  }

  return insights;
}

export default function MatchCard({ match }) {
  if (!match) {
    return (
      <div style={errorCardStyle}>
        <p>매치 데이터를 불러올 수 없습니다.</p>
      </div>
    );
  }

  const insights = calculateInsight(match);
  const kda = ((match.kills || 0) + (match.assists || 0)) / Math.max(1, match.deaths || 1);
  const isWin = match.result === '승리';

  return (
    <div style={{...cardStyle, borderColor: isWin ? '#00D4AA' : '#FF453A'}}>
      {/* 헤더 */}
      <div style={headerStyle}>
        <div style={matchInfoStyle}>
          <h3 style={mapTitleStyle}>{match.map || '알 수 없는 맵'}</h3>
          <span style={matchIdStyle}>#{match.matchId}</span>
        </div>
        <div style={{...resultBadgeStyle, backgroundColor: isWin ? '#00D4AA' : '#FF453A'}}>
          {match.result || '결과 없음'}
        </div>
      </div>

      {/* 에이전트 정보 */}
      <div style={agentSectionStyle}>
        <div style={agentInfoStyle}>
          <span style={agentNameStyle}>{match.agent || '알 수 없는 에이전트'}</span>
          <span style={gameTypeStyle}>{match.gameMode || 'Competitive'}</span>
        </div>
        <div style={rankStyle}>{match.rank || 'Unranked'}</div>
      </div>

      {/* 통계 */}
      <div style={statsGridStyle}>
        <div style={statItemStyle}>
          <span style={statLabelStyle}>K/D/A</span>
          <span style={statValueStyle}>
            <span style={{color: '#00D4AA'}}>{match.kills || 0}</span>/
            <span style={{color: '#FF453A'}}>{match.deaths || 0}</span>/
            <span style={{color: '#FFD60A'}}>{match.assists || 0}</span>
          </span>
        </div>
        <div style={statItemStyle}>
          <span style={statLabelStyle}>KDA</span>
          <span style={{...statValueStyle, color: kda >= 1.5 ? '#00D4AA' : kda >= 1.0 ? '#FFD60A' : '#FF453A'}}>
            {kda.toFixed(2)}
          </span>
        </div>
        <div style={statItemStyle}>
          <span style={statLabelStyle}>점수</span>
          <span style={statValueStyle}>{match.score || 0}</span>
        </div>
      </div>

      {/* 게임 세부 정보 */}
      {(match.gameLength || match.gameStart) && (
        <div style={gameDetailsStyle}>
          {match.gameLength && <span>⏱️ {match.gameLength}분</span>}
          {match.gameStart && <span>📅 {match.gameStart}</span>}
        </div>
      )}

      {/* 인사이트 */}
      <div style={insightsStyle}>
        <h4 style={insightsTitleStyle}>📊 분석 결과</h4>
        <div style={insightListStyle}>
          {insights.map((insight, idx) => (
            <div key={idx} style={{...insightItemStyle, borderColor: getInsightColor(insight.type)}}>
              <span style={insightIconStyle}>{insight.icon}</span>
              <span style={insightTextStyle}>{insight.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function getInsightColor(type) {
  switch (type) {
    case 'positive': return '#00D4AA';
    case 'negative': return '#FF453A';
    default: return '#FFD60A';
  }
}

// 스타일 정의
const cardStyle = {
  backgroundColor: 'rgba(255,255,255,0.05)',
  border: '2px solid',
  borderRadius: '12px',
  padding: '20px',
  margin: '15px 0',
  color: '#fff',
  transition: 'all 0.3s ease'
};

const errorCardStyle = {
  ...cardStyle,
  borderColor: '#FF453A',
  textAlign: 'center',
  color: 'rgba(255,255,255,0.6)'
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '15px',
  paddingBottom: '10px',
  borderBottom: '1px solid rgba(255,255,255,0.1)'
};

const matchInfoStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px'
};

const mapTitleStyle = {
  margin: 0,
  fontSize: '18px',
  fontWeight: 'bold'
};

const matchIdStyle = {
  fontSize: '12px',
  color: 'rgba(255,255,255,0.6)',
  fontFamily: 'monospace'
};

const resultBadgeStyle = {
  padding: '6px 12px',
  borderRadius: '6px',
  fontSize: '12px',
  fontWeight: 'bold',
  color: '#fff'
};

const agentSectionStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '15px'
};

const agentInfoStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '2px'
};

const agentNameStyle = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#00D4AA'
};

const gameTypeStyle = {
  fontSize: '12px',
  color: 'rgba(255,255,255,0.6)'
};

const rankStyle = {
  fontSize: '14px',
  fontWeight: 'bold',
  color: '#FFD60A'
};

const statsGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '15px',
  marginBottom: '15px'
};

const statItemStyle = {
  backgroundColor: 'rgba(255,255,255,0.05)',
  padding: '10px',
  borderRadius: '8px',
  textAlign: 'center'
};

const statLabelStyle = {
  display: 'block',
  fontSize: '11px',
  color: 'rgba(255,255,255,0.6)',
  marginBottom: '4px',
  textTransform: 'uppercase'
};

const statValueStyle = {
  display: 'block',
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#fff'
};

const gameDetailsStyle = {
  display: 'flex',
  gap: '15px',
  fontSize: '12px',
  color: 'rgba(255,255,255,0.6)',
  marginBottom: '15px',
  paddingBottom: '10px',
  borderBottom: '1px solid rgba(255,255,255,0.1)'
};

const insightsStyle = {
  marginTop: '15px'
};

const insightsTitleStyle = {
  fontSize: '14px',
  margin: '0 0 10px 0',
  color: '#00D4AA'
};

const insightListStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px'
};

const insightItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '8px',
  backgroundColor: 'rgba(255,255,255,0.03)',
  borderLeft: '3px solid',
  borderRadius: '4px'
};

const insightIconStyle = {
  fontSize: '16px',
  minWidth: '20px'
};

const insightTextStyle = {
  fontSize: '12px',
  lineHeight: '1.4'
};
