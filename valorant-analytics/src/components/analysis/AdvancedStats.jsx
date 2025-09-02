import React, { useState, useEffect } from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, Cell, PieChart, Pie, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const AdvancedStats = ({ matches = [], playerStats = null }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('30일');
  const [selectedMetric, setSelectedMetric] = useState('KDA');
  const [heatmapData, setHeatmapData] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [performanceRadar, setPerformanceRadar] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (matches && matches.length > 0) {
      generateAdvancedAnalytics();
    }
  }, [matches, selectedTimeframe, selectedMetric]);

  const generateAdvancedAnalytics = () => {
    setLoading(true);
    
    // 시간대별 필터링
    const filteredMatches = filterByTimeframe(matches, selectedTimeframe);
    
    // 다양한 분석 생성
    const heatmap = generateHeatmapData(filteredMatches);
    const trends = generateTrendAnalysis(filteredMatches);
    const radar = generatePerformanceRadar(filteredMatches);
    
    setHeatmapData(heatmap);
    setTrendData(trends);
    setPerformanceRadar(radar);
    
    setLoading(false);
  };

  const filterByTimeframe = (matches, timeframe) => {
    const now = new Date();
    const days = timeframe === '7일' ? 7 : timeframe === '30일' ? 30 : 90;
    const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    
    return matches.filter(match => {
      const matchDate = new Date(match.gameStart);
      return matchDate >= cutoff;
    });
  };

  const generateHeatmapData = (matches) => {
    // 시간대별 성과 히트맵 (시간 vs 요일)
    const heatmap = {};
    const hours = Array.from({length: 24}, (_, i) => i);
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    
    // 초기화
    days.forEach(day => {
      heatmap[day] = {};
      hours.forEach(hour => {
        heatmap[day][hour] = { matches: 0, wins: 0, totalKDA: 0 };
      });
    });
    
    matches.forEach(match => {
      const date = new Date(match.gameStart);
      const day = days[date.getDay()];
      const hour = date.getHours();
      
      if (heatmap[day] && heatmap[day][hour]) {
        heatmap[day][hour].matches++;
        if (match.result === '승리') heatmap[day][hour].wins++;
        heatmap[day][hour].totalKDA += (match.kills + match.assists) / Math.max(1, match.deaths);
      }
    });
    
    // 히트맵 데이터 변환
    const heatmapArray = [];
    days.forEach((day, dayIndex) => {
      hours.forEach(hour => {
        const data = heatmap[day][hour];
        if (data.matches > 0) {
          heatmapArray.push({
            day: dayIndex,
            hour,
            dayName: day,
            matches: data.matches,
            winRate: (data.wins / data.matches * 100).toFixed(1),
            avgKDA: (data.totalKDA / data.matches).toFixed(2),
            intensity: data.matches * (data.wins / data.matches) // 강도 계산
          });
        }
      });
    });
    
    return heatmapArray;
  };

  const generateTrendAnalysis = (matches) => {
    // 시간순 정렬
    const sortedMatches = [...matches].sort((a, b) => new Date(a.gameStart) - new Date(b.gameStart));
    
    // 이동평균 계산 (5게임)
    const windowSize = 5;
    const trends = [];
    
    for (let i = windowSize - 1; i < sortedMatches.length; i++) {
      const window = sortedMatches.slice(i - windowSize + 1, i + 1);
      const date = new Date(window[window.length - 1].gameStart).toLocaleDateString('ko-KR');
      
      const avgKDA = window.reduce((sum, match) => 
        sum + (match.kills + match.assists) / Math.max(1, match.deaths), 0
      ) / windowSize;
      
      const winRate = window.filter(match => match.result === '승리').length / windowSize * 100;
      
      const avgScore = window.reduce((sum, match) => sum + match.score, 0) / windowSize;
      
      const avgDamage = window.reduce((sum, match) => sum + (match.damageDealt || 0), 0) / windowSize;
      
      // 헤드샷률 계산
      const totalShots = window.reduce((sum, match) => 
        sum + (match.headshots || 0) + (match.bodyshots || 0) + (match.legshots || 0), 0
      );
      const totalHeadshots = window.reduce((sum, match) => sum + (match.headshots || 0), 0);
      const headShotRate = totalShots > 0 ? (totalHeadshots / totalShots * 100) : 0;
      
      trends.push({
        date,
        matchNumber: i + 1,
        KDA: parseFloat(avgKDA.toFixed(2)),
        winRate: parseFloat(winRate.toFixed(1)),
        score: parseFloat(avgScore.toFixed(1)),
        damage: parseFloat(avgDamage.toFixed(0)),
        headShotRate: parseFloat(headShotRate.toFixed(1)),
        form: calculateForm(window) // 폼 상태
      });
    }
    
    return trends;
  };

  const calculateForm = (matches) => {
    const weights = [0.1, 0.15, 0.2, 0.25, 0.3]; // 최근 게임일수록 높은 가중치
    let weightedScore = 0;
    let totalWeight = 0;
    
    matches.forEach((match, index) => {
      const weight = weights[index] || 0.1;
      const performance = calculateMatchPerformance(match);
      weightedScore += performance * weight;
      totalWeight += weight;
    });
    
    const form = weightedScore / totalWeight;
    if (form >= 80) return '🔥 핫';
    if (form >= 60) return '📈 상승';
    if (form >= 40) return '➡️ 보통';
    if (form >= 20) return '📉 하락';
    return '❄️ 슬럼프';
  };

  const calculateMatchPerformance = (match) => {
    const kdaScore = Math.min((match.kills + match.assists) / Math.max(1, match.deaths) * 20, 40);
    const winBonus = match.result === '승리' ? 30 : 0;
    const scoreBonus = Math.min(match.score / 10, 30);
    return kdaScore + winBonus + scoreBonus;
  };

  const generatePerformanceRadar = (matches) => {
    if (matches.length === 0) return [];
    
    // 각 카테고리별 점수 계산 (0-100)
    const categories = [
      { name: '킬 능력', key: 'kills', max: 30 },
      { name: '생존력', key: 'deaths', max: 20, inverse: true }, // 낮을수록 좋음
      { name: '팀워크', key: 'assists', max: 15 },
      { name: '점수', key: 'score', max: 300 },
      { name: '헤드샷', key: 'headshots', max: 15 },
      { name: '경제력', key: 'economyRating', max: 5000 }
    ];
    
    const radar = categories.map(category => {
      const values = matches.map(match => match[category.key] || 0);
      const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
      
      let score;
      if (category.inverse) {
        // 데스는 낮을수록 좋음
        score = Math.max(0, 100 - (avg / category.max * 100));
      } else {
        score = Math.min(100, (avg / category.max * 100));
      }
      
      return {
        category: category.name,
        value: parseFloat(score.toFixed(1)),
        average: parseFloat(avg.toFixed(1))
      };
    });
    
    return radar;
  };

  const getHeatmapColor = (intensity) => {
    const maxIntensity = Math.max(...heatmapData.map(d => d.intensity));
    const normalized = intensity / maxIntensity;
    
    if (normalized >= 0.8) return '#dc2626'; // 빨강
    if (normalized >= 0.6) return '#ea580c'; // 주황
    if (normalized >= 0.4) return '#facc15'; // 노랑
    if (normalized >= 0.2) return '#84cc16'; // 연두
    return '#e5e7eb'; // 회색
  };

  const getMetricData = () => {
    switch (selectedMetric) {
      case 'KDA': return trendData.map(d => ({ ...d, value: d.KDA }));
      case '승률': return trendData.map(d => ({ ...d, value: d.winRate }));
      case '점수': return trendData.map(d => ({ ...d, value: d.score }));
      case '데미지': return trendData.map(d => ({ ...d, value: d.damage }));
      case '헤드샷률': return trendData.map(d => ({ ...d, value: d.headShotRate }));
      default: return trendData.map(d => ({ ...d, value: d.KDA }));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-lg">고급 통계 분석 중...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">📊 고급 통계 분석</h2>
        <p className="opacity-90">심층 데이터 분석 및 성과 트렌드 시각화</p>
      </div>

      {/* 필터 컨트롤 */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">기간 선택</label>
            <select 
              value={selectedTimeframe} 
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="7일">최근 7일</option>
              <option value="30일">최근 30일</option>
              <option value="90일">최근 90일</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">분석 지표</label>
            <select 
              value={selectedMetric} 
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="KDA">KDA</option>
              <option value="승률">승률</option>
              <option value="점수">점수</option>
              <option value="데미지">데미지</option>
              <option value="헤드샷률">헤드샷률</option>
            </select>
          </div>
        </div>
      </div>

      {/* 성과 트렌드 차트 */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-bold mb-4">📈 성과 트렌드 ({selectedMetric})</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={getMetricData()}>
            <defs>
              <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="matchNumber" />
            <YAxis />
            <Tooltip 
              formatter={(value) => [value, selectedMetric]}
              labelFormatter={(label) => `${label}번째 게임`}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#3b82f6" 
              fillOpacity={1} 
              fill="url(#colorMetric)" 
            />
          </AreaChart>
        </ResponsiveContainer>
        
        {/* 폼 상태 표시 */}
        <div className="mt-4 flex flex-wrap gap-2">
          {trendData.slice(-10).map((trend, index) => (
            <div key={index} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
              {trend.form}
            </div>
          ))}
        </div>
      </div>

      {/* 성능 레이더 차트 */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-bold mb-4">🎯 종합 성능 분석</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={performanceRadar}>
                <PolarGrid />
                <PolarAngleAxis dataKey="category" />
                <PolarRadiusAxis 
                  angle={30} 
                  domain={[0, 100]} 
                  tick={false}
                />
                <Radar
                  name="성능"
                  dataKey="value"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.3}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3">
            {performanceRadar.map((item, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">{item.category}</span>
                <div className="text-right">
                  <div className="font-bold text-blue-600">{item.value}점</div>
                  <div className="text-sm text-gray-500">평균: {item.average}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 시간대별 히트맵 */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-bold mb-4">🕐 시간대별 성과 히트맵</h3>
        <div className="mb-4 text-sm text-gray-600">
          더 진한 색상 = 더 많은 게임 & 높은 승률
        </div>
        <div className="overflow-x-auto">
          <div className="grid grid-cols-25 gap-1 min-w-[800px]">
            {/* 시간 헤더 */}
            <div></div>
            {Array.from({length: 24}, (_, i) => (
              <div key={i} className="text-xs text-center p-1 font-medium">
                {i}시
              </div>
            ))}
            
            {/* 요일별 데이터 */}
            {['일', '월', '화', '수', '목', '금', '토'].map((day, dayIndex) => (
              <React.Fragment key={day}>
                <div className="text-xs p-2 font-medium flex items-center">
                  {day}
                </div>
                {Array.from({length: 24}, (_, hour) => {
                  const dataPoint = heatmapData.find(d => d.day === dayIndex && d.hour === hour);
                  return (
                    <div
                      key={hour}
                      className="aspect-square rounded text-xs flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                      style={{
                        backgroundColor: dataPoint ? getHeatmapColor(dataPoint.intensity) : '#f3f4f6',
                        color: dataPoint && dataPoint.intensity > 0.5 ? 'white' : 'black'
                      }}
                      title={dataPoint ? 
                        `${day}요일 ${hour}시: ${dataPoint.matches}게임, 승률 ${dataPoint.winRate}%` : 
                        '데이터 없음'
                      }
                    >
                      {dataPoint ? dataPoint.matches : ''}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
        <div className="mt-4 flex items-center justify-center space-x-4 text-sm">
          <span>낮음</span>
          <div className="flex space-x-1">
            {['#e5e7eb', '#84cc16', '#facc15', '#ea580c', '#dc2626'].map(color => (
              <div key={color} className="w-4 h-4 rounded" style={{backgroundColor: color}}></div>
            ))}
          </div>
          <span>높음</span>
        </div>
      </div>

      {/* 통계 요약 */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-bold mb-4">📋 통계 요약</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {trendData.length > 0 ? trendData[trendData.length - 1]?.KDA : 'N/A'}
            </div>
            <div className="text-sm text-gray-600">현재 KDA</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {trendData.length > 0 ? trendData[trendData.length - 1]?.winRate + '%' : 'N/A'}
            </div>
            <div className="text-sm text-gray-600">최근 승률</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {trendData.length > 0 ? trendData[trendData.length - 1]?.form : 'N/A'}
            </div>
            <div className="text-sm text-gray-600">현재 폼</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedStats;
