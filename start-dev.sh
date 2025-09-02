#!/bin/bash

# Valorant Analytics 개발 환경 시작 스크립트

echo "🚀 Valorant Analytics 개발 환경을 시작합니다..."

# 환경 변수 설정
export NODE_ENV=development
export ELECTRON_IS_DEV=1

# 기존 프로세스 종료
echo "🔄 기존 프로세스 정리 중..."
pkill -f "electron" 2>/dev/null || true
pkill -f "react-scripts" 2>/dev/null || true

# 포트 3000 해제 대기
sleep 2

echo "📦 네이티브 모듈 빌드 확인 중..."
cd native
if [ ! -f "build/Release/tracker.node" ]; then
    echo "🔨 네이티브 모듈 빌드 중..."
    node-gyp configure
    node-gyp build
fi
cd ..

echo "🎯 React 개발 서버와 Electron 시작 중..."
npm run dev

echo "✅ 개발 환경이 시작되었습니다!"
echo "💡 React 앱: http://localhost:3000"
echo "💡 Electron 앱이 자동으로 열립니다"
