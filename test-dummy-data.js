#!/usr/bin/env node

// 더미 데이터 생성 테스트 스크립트
// 사용법: node test-dummy-data.js

console.log('🎮 Valorant Analytics - 더미 데이터 테스트\n');

// 더미 데이터 생성 함수들 (간소화된 버전)
const agents = ['Jett', 'Reyna', 'Phoenix', 'Sage', 'Sova', 'Omen', 'Viper', 'Cypher', 'Raze', 'Killjoy'];
const maps = ['Bind', 'Haven', 'Split', 'Ascent', 'Icebox', 'Breeze', 'Fracture', 'Pearl', 'Lotus', 'Sunset'];

function generateTestMatches(playerName, count = 3) {
  console.log(`📊 ${playerName}의 최근 ${count}경기 더미 데이터:\n`);
  
  for (let i = 0; i < count; i++) {
    const kills = Math.floor(Math.random() * 20) + 5;
    const deaths = Math.floor(Math.random() * 15) + 3;
    const assists = Math.floor(Math.random() * 12) + 2;
    const kda = ((kills + assists) / deaths).toFixed(2);
    const agent = agents[Math.floor(Math.random() * agents.length)];
    const map = maps[Math.floor(Math.random() * maps.length)];
    const result = Math.random() > 0.5 ? '승리' : '패배';
    
    console.log(`🎯 경기 ${i + 1}:`);
    console.log(`   맵: ${map} | 에이전트: ${agent}`);
    console.log(`   KDA: ${kills}/${deaths}/${assists} (${kda})`);
    console.log(`   결과: ${result === '승리' ? '🏆' : '😞'} ${result}\n`);
  }
}

function generateTestStats(playerName) {
  const totalMatches = Math.floor(Math.random() * 100) + 50;
  const winRate = Math.floor(Math.random() * 40) + 40; // 40-80%
  const avgKDA = (Math.random() * 1.5 + 0.8).toFixed(2); // 0.8-2.3
  
  console.log(`📈 ${playerName}의 전체 통계:\n`);
  console.log(`   총 경기 수: ${totalMatches}경기`);
  console.log(`   승률: ${winRate}%`);
  console.log(`   평균 KDA: ${avgKDA}`);
  console.log(`   선호 에이전트: ${agents[Math.floor(Math.random() * agents.length)]}`);
  console.log(`   선호 맵: ${maps[Math.floor(Math.random() * maps.length)]}\n`);
}

// 테스트 실행
const testPlayers = ['Hide on bush', 'Faker', 'TenZ', 'ScreaM'];
const randomPlayer = testPlayers[Math.floor(Math.random() * testPlayers.length)];

console.log('🔄 더미 데이터 생성 테스트 중...\n');

generateTestMatches(randomPlayer);
generateTestStats(randomPlayer);

console.log('✅ 더미 데이터 생성 테스트 완료!');
console.log('💡 실제 앱에서는 더 정교한 알고리즘으로 현실적인 데이터를 생성합니다.\n');

console.log('🚀 앱을 실행하려면:');
console.log('   npm run dev  또는  ./start-dev.sh');
