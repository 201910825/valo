import React, { useState } from 'react';

export default function SearchBar({ onSearch, disabled = false }) {
  const [summoner, setSummoner] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (summoner.trim() && !disabled) {
      onSearch(summoner.trim());
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={containerStyle}>
      <div style={searchBoxStyle}>
        <input 
          type="text" 
          value={summoner} 
          onChange={(e) => setSummoner(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="플레이어 이름 또는 태그 입력 (예: PlayerName#TAG)" 
          style={inputStyle}
          disabled={disabled}
        />
        <button 
          type="submit" 
          style={{
            ...buttonStyle,
            opacity: disabled ? 0.6 : 1,
            cursor: disabled ? 'not-allowed' : 'pointer'
          }}
          disabled={disabled || !summoner.trim()}
        >
          {disabled ? '검색 중...' : '🔍 검색'}
        </button>
      </div>
      <div style={hintStyle}>
        <small>💡 팁: 정확한 플레이어명과 태그를 입력하세요</small>
      </div>
    </form>
  );
}

const containerStyle = {
  marginBottom: '25px'
};

const searchBoxStyle = {
  display: 'flex',
  gap: '10px',
  marginBottom: '8px'
};

const inputStyle = {
  flex: 1,
  padding: '12px 16px',
  fontSize: '16px',
  border: '2px solid rgba(255,255,255,0.2)',
  borderRadius: '8px',
  backgroundColor: 'rgba(255,255,255,0.1)',
  color: '#fff',
  outline: 'none',
  transition: 'all 0.3s ease'
};

const buttonStyle = {
  padding: '12px 24px',
  fontSize: '16px',
  fontWeight: 'bold',
  border: 'none',
  borderRadius: '8px',
  backgroundColor: '#00D4AA',
  color: '#fff',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  minWidth: '120px'
};

const hintStyle = {
  color: 'rgba(255,255,255,0.6)',
  textAlign: 'center'
};
