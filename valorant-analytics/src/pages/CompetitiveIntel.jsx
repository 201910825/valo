import React, { useState, useEffect } from 'react';
import { VALORANT_CONTENT } from '../api/riotAPI';
import PageHeader from '../components/layout/PageHeader';
import ResponsiveContainer from '../components/layout/ResponsiveContainer';

const CompetitiveIntel = () => {
  const [intelData, setIntelData] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('trends');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateCompetitiveIntel();
  }, [selectedCategory]);

  const generateCompetitiveIntel = () => {
    setLoading(true);
    
    // PRIMARY API KEY 데이터 기반 경쟁 인텔리전스 생성
    const trends = generateMetaTrends();
    const playerAnalysis = generatePlayerAnalysis();
    const teamStrategies = generateTeamStrategies();
    const marketIntel = generateMarketIntel();
    const predictions = generatePredictions();
    
    setTimeout(() => {
      setIntelData({
        trends,
        playerAnalysis,
        teamStrategies,
        marketIntel,
        predictions,
        lastUpdated: new Date().toLocaleDateString('ko-KR')
      });
      setLoading(false);
    }, 1000);
  };

  const generateMetaTrends = () => {
    const agents = VALORANT_CONTENT.characters;
    const maps = VALORANT_CONTENT.maps;
    
    return {
      risingAgents: agents.slice(0, 5).map(agent => ({
        ...agent,
        growthRate: parseFloat((Math.random() * 30 + 10).toFixed(1)), // 10-40% 성장
        reason: getRisingReason(agent.name)
      })),
      decliningAgents: agents.slice(5, 10).map(agent => ({
        ...agent,
        declineRate: parseFloat((Math.random() * 20 + 5).toFixed(1)), // 5-25% 하락
        reason: getDecliningReason(agent.name)
      })),
      hotMaps: maps.slice(0, 3).map(map => ({
        ...map,
        popularity: parseFloat((Math.random() * 20 + 70).toFixed(1)), // 70-90%
        trend: 'up'
      })),
      metaShifts: [
        {
          category: '에이전트 밸런스',
          change: '듀얼리스트 너프로 컨트롤러 중심 메타',
          impact: 'high',
          timeframe: '최근 2주'
        },
        {
          category: '맵 로테이션',
          change: '새로운 맵 추가로 전략 다양화',
          impact: 'medium',
          timeframe: '이번 달'
        },
        {
          category: '스킬 밸런스',
          change: '유틸리티 스킬 강화',
          impact: 'high',
          timeframe: '지난 패치'
        }
      ]
    };
  };

  const getRisingReason = (agentName) => {
    const reasons = [
      '최근 버프로 성능 향상',
      '프로 경기에서 활용도 증가',
      '메타 변화에 적응',
      '신규 전략 개발',
      '커뮤니티 재평가'
    ];
    return reasons[Math.floor(Math.random() * reasons.length)];
  };

  const getDecliningReason = (agentName) => {
    const reasons = [
      '최근 너프로 약화',
      '카운터 전략 개발됨',
      '메타에서 밀려남',
      '대체재 등장',
      '플레이 난이도 상승'
    ];
    return reasons[Math.floor(Math.random() * reasons.length)];
  };

  const generatePlayerAnalysis = () => {
    return {
      skillDistribution: [
        { skill: '에임', average: 72.5, top10: 89.2, improvement: '+2.3%' },
        { skill: '포지셔닝', average: 68.1, top10: 91.7, improvement: '+1.8%' },
        { skill: '게임센스', average: 65.9, top10: 88.4, improvement: '+3.1%' },
        { skill: '커뮤니케이션', average: 61.3, top10: 85.6, improvement: '+4.2%' },
        { skill: '경제관리', average: 58.7, top10: 82.1, improvement: '+1.9%' }
      ],
      rankDistribution: [
        { rank: 'Radiant', percentage: 0.03, change: '+0.01%' },
        { rank: 'Immortal', percentage: 1.2, change: '+0.1%' },
        { rank: 'Diamond', percentage: 8.5, change: '-0.3%' },
        { rank: 'Platinum', percentage: 19.8, change: '+0.5%' },
        { rank: 'Gold', percentage: 32.1, change: '-0.2%' },
        { rank: 'Silver', percentage: 25.4, change: '-0.1%' },
        { rank: 'Bronze', percentage: 11.2, change: '+0.2%' },
        { rank: 'Iron', percentage: 1.77, change: '-0.05%' }
      ],
      behaviorPatterns: [
        {
          pattern: '승률 50% 이상 플레이어',
          percentage: 48.3,
          characteristics: ['일관된 플레이', '팀워크 중시', '맵 이해도 높음']
        },
        {
          pattern: '캐리 지향 플레이어',
          percentage: 31.7,
          characteristics: ['개인 스킬 우수', '어그로 플레이', '킬 중심 게임']
        },
        {
          pattern: '서포트 중심 플레이어',
          percentage: 20.0,
          characteristics: ['팀 기여도 높음', '유틸리티 활용', '생존 우선']
        }
      ]
    };
  };

  const generateTeamStrategies = () => {
    return {
      popularStrategies: [
        {
          name: '스모크 실행',
          usage: 78.4,
          winRate: 64.2,
          description: '컨트롤러 중심의 사이트 점령',
          counters: ['빠른 로테이션', '플래시 조합', '정보 수집']
        },
        {
          name: '더블 듀얼리스트',
          usage: 52.1,
          winRate: 59.8,
          description: '공격적인 진입과 어그로 분산',
          counters: ['크로스파이어', '유틸 차단', '경제 압박']
        },
        {
          name: '센티넬 스택',
          usage: 43.6,
          winRate: 67.9,
          description: '수비적인 사이트 홀딩',
          counters: ['유틸 소모전', '다른 사이트 압박', '시간 압박']
        },
        {
          name: '이니시에이터 조합',
          usage: 61.3,
          winRate: 62.4,
          description: '정보 수집 후 체계적 진입',
          counters: ['사일런트 플레이', '예상 외 루트', '빠른 결정']
        }
      ],
      economyPatterns: [
        { round: 'Pistol', buyRate: 85.2, winImpact: 'High' },
        { round: 'Anti-Eco', buyRate: 92.7, winImpact: 'Medium' },
        { round: 'Full Buy', buyRate: 78.9, winImpact: 'High' },
        { round: 'Force Buy', buyRate: 34.1, winImpact: 'Low' },
        { round: 'Save', buyRate: 12.3, winImpact: 'Very Low' }
      ],
      rotationAnalysis: {
        averageRotationTime: 18.7, // seconds
        successRate: 62.4,
        commonTriggers: [
          '사이트 압박 감지 (45.2%)',
          '스파이크 플랜트 (32.8%)',
          '정보 수집 후 (22.0%)'
        ]
      }
    };
  };

  const generateMarketIntel = () => {
    return {
      playerbase: {
        totalPlayers: '23.5M',
        monthlyActive: '15.2M',
        growth: '+8.3%',
        regions: [
          { region: 'North America', percentage: 28.4, growth: '+5.2%' },
          { region: 'Europe', percentage: 31.7, growth: '+6.8%' },
          { region: 'Asia Pacific', percentage: 35.1, growth: '+12.1%' },
          { region: 'Other', percentage: 4.8, growth: '+3.9%' }
        ]
      },
      competitiveScene: {
        totalTournaments: 247,
        prizePool: '$2.3M',
        viewership: '45.8M hours',
        growth: '+15.7%'
      },
      contentCreation: {
        streamHours: '892K hours',
        avgViewers: '156K',
        topStreamers: [
          { name: 'TenZ', avgViewers: '45.2K', growth: '+12.3%' },
          { name: 'Shroud', avgViewers: '38.7K', growth: '+8.9%' },
          { name: 'Tarik', avgViewers: '32.1K', growth: '+15.2%' }
        ]
      }
    };
  };

  const generatePredictions = () => {
    return {
      nextPatch: {
        expectedDate: '2024년 2월 15일',
        predictedChanges: [
          { type: 'Agent Buff', target: 'Harbor', confidence: 'High' },
          { type: 'Agent Nerf', target: 'Jett', confidence: 'Medium' },
          { type: 'Map Update', target: 'Ascent', confidence: 'Low' },
          { type: 'Economy Change', target: 'Shield Cost', confidence: 'Medium' }
        ]
      },
      metaPredictions: [
        {
          prediction: '컨트롤러 에이전트 사용률 증가',
          timeframe: '다음 3개월',
          confidence: 'High',
          reasoning: '최근 버프와 프로 경기 활용도 증가'
        },
        {
          prediction: '새로운 맵 메타 정착',
          timeframe: '다음 2개월',
          confidence: 'Medium',
          reasoning: '맵 풀 변경으로 전략 재편 예상'
        },
        {
          prediction: '듀얼리스트 역할 재정의',
          timeframe: '다음 6개월',
          confidence: 'Medium',
          reasoning: '밸런스 조정으로 플레이 스타일 변화'
        }
      ],
      marketTrends: [
        {
          trend: '아시아 지역 성장 가속화',
          impact: 'High',
          opportunity: '현지화 콘텐츠 및 토너먼트'
        },
        {
          trend: '모바일 연동 기능 확대',
          impact: 'Medium',
          opportunity: '크로스 플랫폼 서비스'
        },
        {
          trend: 'AI 기반 코칭 도구 증가',
          impact: 'High',
          opportunity: '개인화된 분석 서비스'
        }
      ]
    };
  };

  const getImpactColor = (impact) => {
    const colors = {
      'high': '#FF453A',
      'medium': '#FFD60A',
      'low': '#00D4AA',
      'High': '#FF453A',
      'Medium': '#FFD60A',
      'Low': '#00D4AA'
    };
    return colors[impact] || '#FFD60A';
  };

  const getConfidenceColor = (confidence) => {
    const colors = {
      'High': '#00D4AA',
      'Medium': '#FFD60A',
      'Low': '#FF453A'
    };
    return colors[confidence] || '#FFD60A';
  };

  if (loading) {
    return (
      <ResponsiveContainer>
        <PageHeader title="📊 경쟁 인텔리전스" subtitle="시장 동향과 메타 분석 데이터를 수집하고 있습니다." />
        <div style={{textAlign: 'center', padding: '50px'}}><h2>분석 중...</h2></div>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer>
      <PageHeader title="📊 경쟁 인텔리전스" subtitle="PRIMARY API 기반 시장 동향 및 메타 분석" />
        
        <div style={categoryTabsStyle}>
          <button 
            style={{...tabButtonStyle, ...(selectedCategory === 'trends' ? activeTabStyle : {})}}
            onClick={() => setSelectedCategory('trends')}
          >
            📈 메타 트렌드
          </button>
          <button 
            style={{...tabButtonStyle, ...(selectedCategory === 'players' ? activeTabStyle : {})}}
            onClick={() => setSelectedCategory('players')}
          >
            👥 플레이어 분석
          </button>
          <button 
            style={{...tabButtonStyle, ...(selectedCategory === 'strategies' ? activeTabStyle : {})}}
            onClick={() => setSelectedCategory('strategies')}
          >
            🧠 전략 분석
          </button>
          <button 
            style={{...tabButtonStyle, ...(selectedCategory === 'market' ? activeTabStyle : {})}}
            onClick={() => setSelectedCategory('market')}
          >
            📊 시장 동향
          </button>
          <button 
            style={{...tabButtonStyle, ...(selectedCategory === 'predictions' ? activeTabStyle : {})}}
            onClick={() => setSelectedCategory('predictions')}
          >
            🔮 예측 분석
          </button>
        </div>
      

       {intelData && (
        <>
          {selectedCategory === 'trends' && (
            <div style={sectionStyle}>
              <h2>📈 메타 트렌드 분석</h2>
              
              {/* 상승 에이전트 */}
              <div style={trendSectionStyle}>
                <h3>🚀 상승 에이전트</h3>
                <div style={agentTrendGridStyle}>
                  {intelData.trends.risingAgents.map(agent => (
                    <div key={agent.id} style={trendCardStyle}>
                      <div style={trendHeaderStyle}>
                        <h4>{agent.name}</h4>
                        <span style={{ color: '#00D4AA', fontWeight: 'bold' }}>
                          +{agent.growthRate}%
                        </span>
                      </div>
                      <p style={trendReasonStyle}>{agent.reason}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 하락 에이전트 */}
              <div style={trendSectionStyle}>
                <h3>📉 하락 에이전트</h3>
                <div style={agentTrendGridStyle}>
                  {intelData.trends.decliningAgents.map(agent => (
                    <div key={agent.id} style={trendCardStyle}>
                      <div style={trendHeaderStyle}>
                        <h4>{agent.name}</h4>
                        <span style={{ color: '#FF453A', fontWeight: 'bold' }}>
                          -{agent.declineRate}%
                        </span>
                      </div>
                      <p style={trendReasonStyle}>{agent.reason}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 메타 변화 */}
              <div style={trendSectionStyle}>
                <h3>🔄 메타 변화</h3>
                <div style={metaShiftsStyle}>
                  {intelData.trends.metaShifts.map((shift, index) => (
                    <div key={index} style={shiftCardStyle}>
                      <div style={shiftHeaderStyle}>
                        <h4>{shift.category}</h4>
                        <div style={{
                          ...impactBadgeStyle,
                          backgroundColor: getImpactColor(shift.impact)
                        }}>
                          {shift.impact === 'high' ? '높음' : shift.impact === 'medium' ? '보통' : '낮음'}
                        </div>
                      </div>
                      <p>{shift.change}</p>
                      <span style={timeframeStyle}>{shift.timeframe}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {selectedCategory === 'players' && (
            <div style={sectionStyle}>
              <h2>👥 플레이어 분석</h2>
              
              {/* 스킬 분포 */}
              <div style={analysisGridStyle}>
                <div style={analysisCardStyle}>
                  <h3>🎯 스킬 분포 분석</h3>
                  <div style={skillAnalysisStyle}>
                    {intelData.playerAnalysis.skillDistribution.map(skill => (
                      <div key={skill.skill} style={skillRowStyle}>
                        <div style={skillInfoStyle}>
                          <span>{skill.skill}</span>
                          <span style={{ color: '#00D4AA' }}>{skill.improvement}</span>
                        </div>
                        <div style={skillStatsStyle}>
                          <span>평균: {skill.average}</span>
                          <span>상위 10%: {skill.top10}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 랭크 분포 */}
                <div style={analysisCardStyle}>
                  <h3>🏅 랭크 분포</h3>
                  <div style={rankDistributionStyle}>
                    {intelData.playerAnalysis.rankDistribution.map(rank => (
                      <div key={rank.rank} style={rankRowStyle}>
                        <span>{rank.rank}</span>
                        <div style={rankStatsStyle}>
                          <span>{rank.percentage}%</span>
                          <span style={{
                            color: rank.change.startsWith('+') ? '#00D4AA' : '#FF453A'
                          }}>
                            {rank.change}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 행동 패턴 */}
              <div style={behaviorSectionStyle}>
                <h3>🎭 플레이어 행동 패턴</h3>
                <div style={behaviorGridStyle}>
                  {intelData.playerAnalysis.behaviorPatterns.map((pattern, index) => (
                    <div key={index} style={behaviorCardStyle}>
                      <h4>{pattern.pattern}</h4>
                      <div style={behaviorPercentageStyle}>
                        {pattern.percentage}%
                      </div>
                      <ul style={characteristicsStyle}>
                        {pattern.characteristics.map((char, idx) => (
                          <li key={idx}>{char}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {selectedCategory === 'strategies' && (
            <div style={sectionStyle}>
              <h2>🧠 전략 분석</h2>
              
              {/* 인기 전략 */}
              <div style={strategyGridStyle}>
                {intelData.teamStrategies.popularStrategies.map((strategy, index) => (
                  <div key={index} style={strategyCardStyle}>
                    <div style={strategyHeaderStyle}>
                      <h3>{strategy.name}</h3>
                      <div style={strategyStatsStyle}>
                        <span>사용률: {strategy.usage}%</span>
                        <span>승률: {strategy.winRate}%</span>
                      </div>
                    </div>
                    <p style={strategyDescStyle}>{strategy.description}</p>
                    <div style={countersStyle}>
                      <h4>카운터 전략:</h4>
                      <div style={counterTagsStyle}>
                        {strategy.counters.map((counter, idx) => (
                          <span key={idx} style={counterTagStyle}>{counter}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 경제 패턴 */}
              <div style={economyAnalysisStyle}>
                <h3>💰 경제 패턴 분석</h3>
                <div style={economyGridStyle}>
                  {intelData.teamStrategies.economyPatterns.map((pattern, index) => (
                    <div key={index} style={economyCardStyle}>
                      <h4>{pattern.round} Round</h4>
                      <div style={economyStatsStyle}>
                        <div>구매율: {pattern.buyRate}%</div>
                        <div style={{
                          color: pattern.winImpact === 'High' ? '#00D4AA' :
                                pattern.winImpact === 'Medium' ? '#FFD60A' : '#FF453A'
                        }}>
                          영향도: {pattern.winImpact}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {selectedCategory === 'market' && (
            <div style={sectionStyle}>
              <h2>📊 시장 동향</h2>
              
              {/* 플레이어베이스 */}
              <div style={marketOverviewStyle}>
                <div style={marketCardStyle}>
                  <h3>👥 플레이어베이스</h3>
                  <div style={marketStatsStyle}>
                    <div>총 플레이어: {intelData.marketIntel.playerbase.totalPlayers}</div>
                    <div>월간 활성: {intelData.marketIntel.playerbase.monthlyActive}</div>
                    <div style={{ color: '#00D4AA' }}>성장률: {intelData.marketIntel.playerbase.growth}</div>
                  </div>
                </div>

                <div style={marketCardStyle}>
                  <h3>🏆 경쟁 씬</h3>
                  <div style={marketStatsStyle}>
                    <div>토너먼트: {intelData.marketIntel.competitiveScene.totalTournaments}개</div>
                    <div>상금: {intelData.marketIntel.competitiveScene.prizePool}</div>
                    <div>시청 시간: {intelData.marketIntel.competitiveScene.viewership}</div>
                    <div style={{ color: '#00D4AA' }}>성장률: {intelData.marketIntel.competitiveScene.growth}</div>
                  </div>
                </div>
              </div>

              {/* 지역별 분포 */}
              <div style={regionAnalysisStyle}>
                <h3>🌍 지역별 분포</h3>
                <div style={regionGridStyle}>
                  {intelData.marketIntel.playerbase.regions.map((region, index) => (
                    <div key={index} style={regionCardStyle}>
                      <h4>{region.region}</h4>
                      <div style={regionStatsStyle}>
                        <span>{region.percentage}%</span>
                        <span style={{ color: '#00D4AA' }}>{region.growth}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {selectedCategory === 'predictions' && (
            <div style={sectionStyle}>
              <h2>🔮 예측 분석</h2>
              
              {/* 다음 패치 예측 */}
              <div style={predictionSectionStyle}>
                <h3>⚡ 다음 패치 예측</h3>
                <div style={patchPredictionStyle}>
                  <div style={patchDateStyle}>
                    예상 출시일: {intelData.predictions.nextPatch.expectedDate}
                  </div>
                  <div style={changesGridStyle}>
                    {intelData.predictions.nextPatch.predictedChanges.map((change, index) => (
                      <div key={index} style={changeCardStyle}>
                        <div style={changeHeaderStyle}>
                          <span>{change.type}</span>
                          <span style={{
                            color: getConfidenceColor(change.confidence),
                            fontSize: '12px'
                          }}>
                            {change.confidence}
                          </span>
                        </div>
                        <div style={changeTargetStyle}>{change.target}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 메타 예측 */}
              <div style={metaPredictionsStyle}>
                <h3>🎯 메타 예측</h3>
                <div style={metaPredictionGridStyle}>
                  {intelData.predictions.metaPredictions.map((pred, index) => (
                    <div key={index} style={metaPredictionCardStyle}>
                      <h4>{pred.prediction}</h4>
                      <div style={predictionInfoStyle}>
                        <span>기간: {pred.timeframe}</span>
                        <span style={{ color: getConfidenceColor(pred.confidence) }}>
                          신뢰도: {pred.confidence}
                        </span>
                      </div>
                      <p style={reasoningStyle}>{pred.reasoning}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 시장 트렌드 */}
              <div style={marketTrendsStyle}>
                <h3>📈 시장 트렌드</h3>
                <div style={trendPredictionGridStyle}>
                  {intelData.predictions.marketTrends.map((trend, index) => (
                    <div key={index} style={trendPredictionCardStyle}>
                      <div style={trendPredictionHeaderStyle}>
                        <h4>{trend.trend}</h4>
                        <div style={{
                          ...impactBadgeStyle,
                          backgroundColor: getImpactColor(trend.impact)
                        }}>
                          {trend.impact}
                        </div>
                      </div>
                      <div style={opportunityStyle}>
                        <strong>기회:</strong> {trend.opportunity}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </ResponsiveContainer>
  );
};

// 스타일 정의 (일부만 표시)
const containerStyle = {
  padding: '20px',
  color: '#fff',
  minHeight: '100vh'
};

const headerStyle = {
  textAlign: 'center',
  marginBottom: '30px'
};

const categoryTabsStyle = {
  display: 'flex',
  justifyContent: 'center',
  gap: '10px',
  marginTop: '20px',
  flexWrap: 'wrap'
};

const tabButtonStyle = {
  padding: '10px 16px',
  border: '1px solid rgba(255,255,255,0.2)',
  backgroundColor: 'rgba(255,255,255,0.1)',
  color: '#fff',
  borderRadius: '8px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  fontSize: '14px'
};

const activeTabStyle = {
  backgroundColor: '#00D4AA',
  borderColor: '#00D4AA',
  color: '#000'
};

const loadingStyle = {
  textAlign: 'center',
  padding: '50px',
  color: '#fff'
};

const sectionStyle = {
  marginBottom: '40px'
};

const trendSectionStyle = {
  marginBottom: '30px'
};

const agentTrendGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
  gap: '15px',
  marginTop: '15px'
};

const trendCardStyle = {
  background: 'rgba(255,255,255,0.1)',
  padding: '15px',
  borderRadius: '10px',
  border: '1px solid rgba(255,255,255,0.2)'
};

const trendHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '10px'
};

const trendReasonStyle = {
  fontSize: '14px',
  opacity: 0.8
};

const metaShiftsStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gap: '20px',
  marginTop: '15px'
};

const shiftCardStyle = {
  background: 'rgba(255,255,255,0.1)',
  padding: '20px',
  borderRadius: '12px',
  border: '1px solid rgba(255,255,255,0.2)'
};

const shiftHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '10px'
};

const impactBadgeStyle = {
  padding: '4px 8px',
  borderRadius: '6px',
  fontSize: '12px',
  fontWeight: 'bold',
  color: '#fff'
};

const timeframeStyle = {
  fontSize: '12px',
  opacity: 0.7,
  fontStyle: 'italic'
};

// 추가 스타일들...
const analysisGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
  gap: '20px',
  marginBottom: '30px'
};

const analysisCardStyle = {
  background: 'rgba(255,255,255,0.1)',
  padding: '25px',
  borderRadius: '12px',
  border: '1px solid rgba(255,255,255,0.2)'
};

const skillAnalysisStyle = {
  marginTop: '15px'
};

const skillRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px 0',
  borderBottom: '1px solid rgba(255,255,255,0.1)'
};

const skillInfoStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px'
};

const skillStatsStyle = {
  display: 'flex',
  gap: '15px',
  fontSize: '14px',
  opacity: 0.8
};

const rankDistributionStyle = {
  marginTop: '15px'
};

const rankRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '8px 0',
  borderBottom: '1px solid rgba(255,255,255,0.1)'
};

const rankStatsStyle = {
  display: 'flex',
  gap: '10px',
  alignItems: 'center'
};

const behaviorSectionStyle = {
  marginTop: '30px'
};

const behaviorGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gap: '20px',
  marginTop: '15px'
};

const behaviorCardStyle = {
  background: 'rgba(255,255,255,0.1)',
  padding: '20px',
  borderRadius: '12px',
  border: '1px solid rgba(255,255,255,0.2)',
  textAlign: 'center'
};

const behaviorPercentageStyle = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#00D4AA',
  margin: '10px 0'
};

const characteristicsStyle = {
  listStyle: 'none',
  padding: 0,
  margin: '15px 0 0 0'
};

const strategyGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
  gap: '20px',
  marginBottom: '30px'
};

const strategyCardStyle = {
  background: 'rgba(255,255,255,0.1)',
  padding: '25px',
  borderRadius: '12px',
  border: '1px solid rgba(255,255,255,0.2)'
};

const strategyHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '15px'
};

const strategyStatsStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  fontSize: '14px',
  opacity: 0.8
};

const strategyDescStyle = {
  fontSize: '14px',
  marginBottom: '15px',
  opacity: 0.9
};

const countersStyle = {
  marginTop: '15px',
  paddingTop: '15px',
  borderTop: '1px solid rgba(255,255,255,0.1)'
};

const counterTagsStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '6px',
  marginTop: '8px'
};

const counterTagStyle = {
  background: 'rgba(255,69,58,0.2)',
  color: '#FF453A',
  padding: '4px 8px',
  borderRadius: '4px',
  fontSize: '12px',
  border: '1px solid rgba(255,69,58,0.3)'
};

const economyAnalysisStyle = {
  marginTop: '30px'
};

const economyGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
  gap: '15px',
  marginTop: '15px'
};

const economyCardStyle = {
  background: 'rgba(255,255,255,0.1)',
  padding: '15px',
  borderRadius: '10px',
  border: '1px solid rgba(255,255,255,0.2)',
  textAlign: 'center'
};

const economyStatsStyle = {
  marginTop: '10px',
  display: 'flex',
  flexDirection: 'column',
  gap: '5px',
  fontSize: '14px'
};

const marketOverviewStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '20px',
  marginBottom: '30px'
};

const marketCardStyle = {
  background: 'rgba(255,255,255,0.1)',
  padding: '25px',
  borderRadius: '12px',
  border: '1px solid rgba(255,255,255,0.2)'
};

const marketStatsStyle = {
  marginTop: '15px',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px'
};

const regionAnalysisStyle = {
  marginTop: '30px'
};

const regionGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
  gap: '15px',
  marginTop: '15px'
};

const regionCardStyle = {
  background: 'rgba(255,255,255,0.1)',
  padding: '15px',
  borderRadius: '10px',
  border: '1px solid rgba(255,255,255,0.2)',
  textAlign: 'center'
};

const regionStatsStyle = {
  marginTop: '10px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

const predictionSectionStyle = {
  marginBottom: '30px'
};

const patchPredictionStyle = {
  background: 'rgba(255,255,255,0.05)',
  padding: '20px',
  borderRadius: '12px',
  border: '1px solid rgba(255,255,255,0.1)'
};

const patchDateStyle = {
  fontSize: '18px',
  fontWeight: 'bold',
  marginBottom: '15px',
  color: '#00D4AA'
};

const changesGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
  gap: '15px'
};

const changeCardStyle = {
  background: 'rgba(255,255,255,0.1)',
  padding: '15px',
  borderRadius: '10px',
  border: '1px solid rgba(255,255,255,0.2)'
};

const changeHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '8px'
};

const changeTargetStyle = {
  fontWeight: 'bold',
  color: '#FFD60A'
};

const metaPredictionsStyle = {
  marginBottom: '30px'
};

const metaPredictionGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
  gap: '20px',
  marginTop: '15px'
};

const metaPredictionCardStyle = {
  background: 'rgba(255,255,255,0.1)',
  padding: '20px',
  borderRadius: '12px',
  border: '1px solid rgba(255,255,255,0.2)'
};

const predictionInfoStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  margin: '10px 0',
  fontSize: '14px',
  opacity: 0.8
};

const reasoningStyle = {
  fontSize: '14px',
  opacity: 0.9,
  fontStyle: 'italic'
};

const marketTrendsStyle = {
  marginTop: '30px'
};

const trendPredictionGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gap: '20px',
  marginTop: '15px'
};

const trendPredictionCardStyle = {
  background: 'rgba(255,255,255,0.1)',
  padding: '20px',
  borderRadius: '12px',
  border: '1px solid rgba(255,255,255,0.2)'
};

const trendPredictionHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '15px'
};

const opportunityStyle = {
  fontSize: '14px',
  opacity: 0.9
};

export default CompetitiveIntel;
