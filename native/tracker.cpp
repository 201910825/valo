#include "napi.h"
#include <vector>
#include <string>
#include <random>
#include <ctime>

using namespace Napi;

// 더미 데이터 생성을 위한 헬퍼 함수들
std::vector<std::string> agents = {"Jett", "Reyna", "Phoenix", "Sage", "Sova", "Breach", "Omen", "Viper", "Cypher", "Raze"};
std::vector<std::string> maps = {"Bind", "Haven", "Split", "Ascent", "Icebox", "Breeze", "Fracture", "Pearl", "Lotus"};

int getRandomNumber(int min, int max) {
    static std::random_device rd;
    static std::mt19937 gen(rd());
    std::uniform_int_distribution<> dis(min, max);
    return dis(gen);
}

Array GetMatches(const CallbackInfo& info) {
    Env env = info.Env();
    Array arr = Array::New(env);

    // 여러 매치 데이터 생성
    for (int i = 0; i < 5; i++) {
        Object match = Object::New(env);
        match.Set("matchId", "match_" + std::to_string(i + 1));
        match.Set("playerName", "Player" + std::to_string(i + 1));
        match.Set("agent", agents[getRandomNumber(0, agents.size() - 1)]);
        match.Set("map", maps[getRandomNumber(0, maps.size() - 1)]);
        match.Set("kills", getRandomNumber(5, 30));
        match.Set("deaths", getRandomNumber(3, 20));
        match.Set("assists", getRandomNumber(2, 15));
        match.Set("score", getRandomNumber(10, 25));
        match.Set("rank", "Diamond " + std::to_string(getRandomNumber(1, 3)));
        match.Set("gameMode", "Competitive");
        match.Set("result", getRandomNumber(0, 1) ? "승리" : "패배");
        
        arr.Set(uint32_t(i), match);
    }
    
    return arr;
}

Object GetPlayerStats(const CallbackInfo& info) {
    Env env = info.Env();
    
    if (info.Length() < 1 || !info[0].IsString()) {
        TypeError::New(env, "플레이어 이름이 필요합니다").ThrowAsJavaScriptException();
        return Object::New(env);
    }
    
    std::string playerName = info[0].As<String>().Utf8Value();
    
    Object stats = Object::New(env);
    stats.Set("playerName", playerName);
    stats.Set("totalMatches", getRandomNumber(50, 200));
    stats.Set("winRate", getRandomNumber(45, 75));
    stats.Set("avgKills", getRandomNumber(15, 25));
    stats.Set("avgDeaths", getRandomNumber(10, 18));
    stats.Set("avgAssists", getRandomNumber(5, 12));
    stats.Set("headShotRate", getRandomNumber(15, 35));
    stats.Set("currentRank", "Diamond 2");
    stats.Set("peakRank", "Immortal 1");
    
    return stats;
}

Array GetRealtimeData(const CallbackInfo& info) {
    Env env = info.Env();
    Array arr = Array::New(env);
    
    // 실시간 게임 데이터 시뮬레이션
    Object currentGame = Object::New(env);
    currentGame.Set("isInGame", true);
    currentGame.Set("gameMode", "Competitive");
    currentGame.Set("map", maps[getRandomNumber(0, maps.size() - 1)]);
    currentGame.Set("round", getRandomNumber(1, 24));
    currentGame.Set("score", "7-5");
    currentGame.Set("playerAgent", agents[getRandomNumber(0, agents.size() - 1)]);
    currentGame.Set("kills", getRandomNumber(0, 20));
    currentGame.Set("deaths", getRandomNumber(0, 15));
    currentGame.Set("assists", getRandomNumber(0, 10));
    
    arr.Set(uint32_t(0), currentGame);
    return arr;
}

Object Init(Env env, Object exports) {
    exports.Set("getMatches", Function::New(env, GetMatches));
    exports.Set("getPlayerStats", Function::New(env, GetPlayerStats));
    exports.Set("getRealtimeData", Function::New(env, GetRealtimeData));
    return exports;
}

NODE_API_MODULE(tracker, Init)
