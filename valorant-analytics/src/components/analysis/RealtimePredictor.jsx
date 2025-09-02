import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const RealtimePredictor = ({ matches = [], realtimeData = [], playerStats = null }) => {
  const [prediction, setPrediction] = useState(null);
  const [confidence, setConfidence] = useState(0);
  const [factors, setFactors] = useState([]);
  const [liveAnalysis, setLiveAnalysis] = useState(null);
  const [isLive, setIsLive] = useState(false);
  const [predictionHistory, setPredictionHistory] = useState([]);

  useEffect(() => {
    if (realtimeData && realtimeData.length > 0) {
      const currentGame = realtimeData[0];
      setIsLive(currentGame.isInGame);
      
      if (currentGame.isInGame && matches.length > 0) {
        generateRealtimePrediction(currentGame, matches, playerStats);
        analyzeLivePerformance(currentGame, matches);
      }
    }
  }, [realtimeData, matches, playerStats]);

  const generateRealtimePrediction = (currentGame, historicalMatches, stats) => {
    // ML 기반 승률 예측 알고리즘
    const predictionFactors = calculatePredictionFactors(currentGame, historicalMatches, stats);
    const winProbability = calculateWinProbability(predictionFactors);
    const confidenceLevel = calculateConfidence(predictionFactors, historicalMatches.length);
    
    setPrediction({
      winProbability: winProbability.toFixed(1),
      loseProbability: (100 - winProbability).toFixed(1),
      outcome: winProbability > 50 ? '승리' : '패배',
      expectedScore: predictExpectedScore(predictionFactors, currentGame),
      timeToWin: predictGameDuration(predictionFactors, currentGame)
    });
    
    setConfidence(confidenceLevel);
    setFactors(predictionFactors);
    
    // 예측 기록 업데이트
    updatePredictionHistory(winProbability, currentGame);
  };

  const calculatePredictionFactors = (currentGame, matches, stats) => {
    const factors = [];
    
    // 1. 에이전트 성과 분석
    const agentMatches = matches.filter(m => m.agent === currentGame.playerAgent);
    const agentWinRate = agentMatches.length > 0 ? 
      (agentMatches.filter(m => m.result === '승리').length / agentMatches.length) * 100 : 50;
    
    factors.push({
      name: '에이전트 숙련도',
      value: agentWinRate,
      weight: 0.25,
      impact: agentWinRate > 60 ? 'positive' : agentWinRate < 40 ? 'negative' : 'neutral',
      description: `${currentGame.playerAgent} 승률: ${agentWinRate.toFixed(1)}%`
    });
    
    // 2. 맵 성과 분석
    const mapMatches = matches.filter(m => m.map === currentGame.map);
    const mapWinRate = mapMatches.length > 0 ? 
      (mapMatches.filter(m => m.result === '승리').length / mapMatches.length) * 100 : 50;
    
    factors.push({
      name: '맵 적응도',
      value: mapWinRate,
      weight: 0.20,
      impact: mapWinRate > 60 ? 'positive' : mapWinRate < 40 ? 'negative' : 'neutral',
      description: `${currentGame.map} 승률: ${mapWinRate.toFixed(1)}%`
    });
    
    // 3. 현재 KDA 분석
    const currentKDA = (currentGame.kills + currentGame.assists) / Math.max(1, currentGame.deaths);
    const avgKDA = stats?.avgKDA || 1.0;
    const kdaPerformance = (currentKDA / avgKDA) * 100;
    
    factors.push({
      name: '현재 성과',
      value: Math.min(kdaPerformance, 200), // 최대 200%로 제한
      weight: 0.30,
      impact: currentKDA > avgKDA * 1.2 ? 'positive' : currentKDA < avgKDA * 0.8 ? 'negative' : 'neutral',
      description: `현재 KDA: ${currentKDA.toFixed(2)} (평균: ${avgKDA})`
    });
    
    // 4. 게임 모드 분석
    const modeMatches = matches.filter(m => m.gameMode === currentGame.gameMode);
    const modeWinRate = modeMatches.length > 0 ? 
      (modeMatches.filter(m => m.result === '승리').length / modeMatches.length) * 100 : 50;
    
    factors.push({
      name: '게임 모드 적응도',
      value: modeWinRate,
      weight: 0.15,
      impact: modeWinRate > 55 ? 'positive' : modeWinRate < 45 ? 'negative' : 'neutral',
      description: `${currentGame.gameMode} 승률: ${modeWinRate.toFixed(1)}%`
    });
    
    // 5. 최근 폼 분석
    const recentMatches = matches.slice(-5);
    const recentWinRate = recentMatches.length > 0 ? 
      (recentMatches.filter(m => m.result === '승리').length / recentMatches.length) * 100 : 50;
    
    factors.push({
      name: '최근 폼',
      value: recentWinRate,
      weight: 0.10,
      impact: recentWinRate > 60 ? 'positive' : recentWinRate < 40 ? 'negative' : 'neutral',
      description: `최근 5게임 승률: ${recentWinRate.toFixed(1)}%`
    });
    
    return factors;
  };

  const calculateWinProbability = (factors) => {
    let weightedSum = 0;
    let totalWeight = 0;
    
    factors.forEach(factor => {
      weightedSum += (factor.value / 100) * factor.weight;
      totalWeight += factor.weight;
    });
    
    const baseProbability = (weightedSum / totalWeight) * 100;
    
    // 추가 보정 (라운드 진행도, 점수 상황 등)
    // 실제 구현에서는 더 복잡한 ML 모델 사용 가능
    
    return Math.max(5, Math.min(95, baseProbability)); // 5-95% 범위로 제한
  };

  const calculateConfidence = (factors, sampleSize) => {
    // 데이터 양과 요인들의 일관성을 기반으로 신뢰도 계산
    const dataSufficiency = Math.min(sampleSize / 50, 1); // 50게임 이상이면 최대
    const factorConsistency = calculateFactorConsistency(factors);
    
    return Math.floor((dataSufficiency * 0.6 + factorConsistency * 0.4) * 100);
  };

  const calculateFactorConsistency = (factors) => {
    const positiveFactors = factors.filter(f => f.impact === 'positive').length;
    const negativeFactors = factors.filter(f => f.impact === 'negative').length;
    const neutralFactors = factors.filter(f => f.impact === 'neutral').length;
    
    // 요인들이 한 방향으로 일관되게 나타날수록 신뢰도 높음
    const maxFactors = Math.max(positiveFactors, negativeFactors, neutralFactors);
    return maxFactors / factors.length;
  };

  const predictExpectedScore = (factors, currentGame) => {
    const currentRound = currentGame.round || 1;
    const totalRounds = 25; // 기본 25라운드 (연장 가능)
    
    // 현재 성과 기반으로 최종 점수 예측
    const currentPerformance = factors.find(f => f.name === '현재 성과')?.value || 100;
    const expectedKillsPerRound = (currentGame.kills / currentRound) * (currentPerformance / 100);
    const expectedFinalKills = Math.floor(expectedKillsPerRound * totalRounds);
    
    return `${expectedFinalKills}/${Math.floor(expectedFinalKills * 0.8)}/${Math.floor(expectedFinalKills * 0.6)}`;
  };

  const predictGameDuration = (factors, currentGame) => {
    const winProbability = calculateWinProbability(factors);
    const currentRound = currentGame.round || 1;
    
    // 승률이 높을수록 빠른 승리 예측
    if (winProbability > 70) {
      return `${Math.floor(20 + Math.random() * 5)}분 후 승리 예상`;
    } else if (winProbability > 30) {
      return `${Math.floor(25 + Math.random() * 10)}분 후 결과 확정`;
    } else {
      return `${Math.floor(30 + Math.random() * 15)}분 후 패배 예상`;
    }
  };

  const analyzeLivePerformance = (currentGame, matches) => {
    const currentRound = currentGame.round || 1;
    const currentKDA = (currentGame.kills + currentGame.assists) / Math.max(1, currentGame.deaths);
    
    // 라운드별 예상 성과와 비교
    const expectedKillsPerRound = matches.reduce((sum, m) => sum + m.kills, 0) / matches.length / 13; // 평균 13라운드
    const expectedKills = expectedKillsPerRound * currentRound;
    
    const performance = {
      killsVsExpected: {
        current: currentGame.kills,
        expected: Math.floor(expectedKills),
        status: currentGame.kills > expectedKills ? 'above' : currentGame.kills < expectedKills * 0.8 ? 'below' : 'normal'
      },
      kdaVsAverage: {
        current: currentKDA,
        average: matches.reduce((sum, m) => sum + (m.kills + m.assists) / Math.max(1, m.deaths), 0) / matches.length,
        status: currentKDA > 1.5 ? 'excellent' : currentKDA > 1.0 ? 'good' : currentKDA > 0.7 ? 'average' : 'poor'
      },
      roundProgress: {
        current: currentRound,
        total: 25,
        phase: currentRound <= 12 ? '전반전' : currentRound <= 24 ? '후반전' : '연장전'
      }
    };
    
    setLiveAnalysis(performance);
  };

  const updatePredictionHistory = (winProb, currentGame) => {
    const newEntry = {
      round: currentGame.round,
      winProbability: winProb,
      timestamp: Date.now()
    };
    
    setPredictionHistory(prev => {
      const updated = [...prev, newEntry];
      return updated.slice(-20); // 최근 20개 라운드만 유지
    });
  };

  const getFactorColor = (impact) => {
    switch (impact) {
      case 'positive': return 'text-green-600 bg-green-50';
      case 'negative': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return 'text-green-600';
    if (confidence >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (!isLive) {
    return (
      <div className="bg-white rounded-lg p-8 shadow-sm text-center">
        <div className="text-6xl mb-4">🎮</div>
        <h3 className="text-xl font-bold text-gray-700 mb-2">게임 중이 아닙니다</h3>
        <p className="text-gray-500">실시간 매치 예측을 보려면 게임을 시작하세요!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">🔮 실시간 매치 예측</h2>
        <p className="opacity-90">AI 기반 실시간 승률 예측 및 성과 분석</p>
      </div>

      {/* 메인 예측 결과 */}
      {prediction && (
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 승률 예측 */}
            <div className="text-center">
              <h3 className="text-lg font-bold mb-4">🎯 승률 예측</h3>
              <div className="relative">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: '승리', value: parseFloat(prediction.winProbability), fill: '#10b981' },
                        { name: '패배', value: parseFloat(prediction.loseProbability), fill: '#ef4444' }
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {[
                        { name: '승리', value: parseFloat(prediction.winProbability), fill: '#10b981' },
                        { name: '패배', value: parseFloat(prediction.loseProbability), fill: '#ef4444' }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{prediction.winProbability}%</div>
                    <div className="text-sm text-gray-600">{prediction.outcome}</div>
                  </div>
                </div>
              </div>
              <div className={`mt-4 text-sm ${getConfidenceColor(confidence)}`}>
                신뢰도: {confidence}%
              </div>
            </div>

            {/* 예측 상세 정보 */}
            <div>
              <h3 className="text-lg font-bold mb-4">📊 예측 상세</h3>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="font-semibold text-sm text-gray-700">예상 최종 KDA</div>
                  <div className="text-lg font-bold text-blue-600">{prediction.expectedScore}</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="font-semibold text-sm text-gray-700">게임 종료 예상</div>
                  <div className="text-lg font-bold text-purple-600">{prediction.timeToWin}</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="font-semibold text-sm text-gray-700">분석 기반</div>
                  <div className="text-sm text-gray-600">{factors.length}개 요인 분석</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 예측 요인 분석 */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-bold mb-4">🔍 예측 요인 분석</h3>
        <div className="space-y-3">
          {factors.map((factor, index) => (
            <div key={index} className={`p-4 rounded-lg border-l-4 ${
              factor.impact === 'positive' ? 'border-green-500' :
              factor.impact === 'negative' ? 'border-red-500' : 'border-gray-500'
            }`}>
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">{factor.name}</span>
                <div className="text-right">
                  <div className={`font-bold ${
                    factor.impact === 'positive' ? 'text-green-600' :
                    factor.impact === 'negative' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {factor.value.toFixed(1)}점
                  </div>
                  <div className="text-xs text-gray-500">가중치 {(factor.weight * 100).toFixed(0)}%</div>
                </div>
              </div>
              <div className="text-sm text-gray-600">{factor.description}</div>
              <div className="mt-2 bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    factor.impact === 'positive' ? 'bg-green-500' :
                    factor.impact === 'negative' ? 'bg-red-500' : 'bg-gray-500'
                  }`}
                  style={{ width: `${Math.min(factor.value, 100)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 라이브 성과 분석 */}
      {liveAnalysis && (
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-bold mb-4">⚡ 실시간 성과 분석</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">킬 수 (예상 대비)</div>
              <div className={`text-2xl font-bold ${
                liveAnalysis.killsVsExpected.status === 'above' ? 'text-green-600' :
                liveAnalysis.killsVsExpected.status === 'below' ? 'text-red-600' : 'text-blue-600'
              }`}>
                {liveAnalysis.killsVsExpected.current} / {liveAnalysis.killsVsExpected.expected}
              </div>
              <div className="text-xs text-gray-500">
                {liveAnalysis.killsVsExpected.status === 'above' ? '기대 이상' :
                 liveAnalysis.killsVsExpected.status === 'below' ? '기대 이하' : '예상 수준'}
              </div>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">현재 KDA</div>
              <div className={`text-2xl font-bold ${
                liveAnalysis.kdaVsAverage.status === 'excellent' ? 'text-green-600' :
                liveAnalysis.kdaVsAverage.status === 'good' ? 'text-blue-600' :
                liveAnalysis.kdaVsAverage.status === 'average' ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {liveAnalysis.kdaVsAverage.current.toFixed(2)}
              </div>
              <div className="text-xs text-gray-500">
                평균: {liveAnalysis.kdaVsAverage.average.toFixed(2)}
              </div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">게임 진행도</div>
              <div className="text-2xl font-bold text-purple-600">
                {liveAnalysis.roundProgress.current}/{liveAnalysis.roundProgress.total}
              </div>
              <div className="text-xs text-gray-500">
                {liveAnalysis.roundProgress.phase}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 예측 히스토리 */}
      {predictionHistory.length > 0 && (
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-bold mb-4">📈 예측 변화 추이</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={predictionHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="round" />
              <YAxis domain={[0, 100]} />
              <Tooltip 
                formatter={(value) => [`${value}%`, '승률 예측']}
                labelFormatter={(label) => `${label}라운드`}
              />
              <Line 
                type="monotone" 
                dataKey="winProbability" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default RealtimePredictor;
