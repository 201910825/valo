import React from 'react';
import { useNavigate } from 'react-router-dom';

const PageHeader = ({ title, subtitle, showBackButton = true }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div style={headerContainerStyle}>
      {showBackButton && (
        <button style={backButtonStyle} className="back-button" onClick={handleBack}>
          <span style={backArrowStyle}>←</span>
          <span className="back-text">홈으로</span>
        </button>
      )}
      
      <div style={titleContainerStyle}>
        <h1 style={titleStyle}>{title}</h1>
        {subtitle && <p style={subtitleStyle}>{subtitle}</p>}
      </div>
    </div>
  );
};

// 반응형 스타일
const headerContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginBottom: 'clamp(20px, 5vw, 30px)',
  padding: '0',
  width: '100%',
  gap: 'clamp(15px, 3vw, 20px)'
};

const backButtonStyle = {
  alignSelf: 'flex-start',
  display: 'flex',
  alignItems: 'center',
  gap: 'clamp(6px, 1.5vw, 8px)',
  background: 'rgba(255,255,255,0.1)',
  border: '1px solid rgba(255,255,255,0.2)',
  borderRadius: 'clamp(6px, 1.5vw, 8px)',
  padding: 'clamp(8px, 2vw, 12px) clamp(12px, 3vw, 16px)',
  color: '#fff',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  fontSize: 'clamp(12px, 3vw, 14px)',
  fontWeight: '500',
  backdropFilter: 'blur(10px)',
  minHeight: '44px', // 터치 최적화
  textDecoration: 'none'
};

const backArrowStyle = {
  fontSize: '16px',
  fontWeight: 'bold'
};

const backTextStyle = {
  // CSS-in-JS에서는 클래스로 처리
};

const titleContainerStyle = {
  textAlign: 'center',
  maxWidth: '800px',
  width: '100%'
};

const titleStyle = {
  color: '#fff',
  textShadow: '2px 2px 8px rgba(0,0,0,0.7)',
  margin: 0,
  fontSize: 'clamp(24px, 5vw, 36px)', // 반응형 폰트 크기
  fontWeight: 'bold'
};

const subtitleStyle = {
  color: 'rgba(255,255,255,0.8)',
  margin: '10px 0 0 0',
  fontSize: 'clamp(14px, 3vw, 16px)', // 반응형 폰트 크기
  lineHeight: '1.5'
};

// CSS-in-JS에서 미디어 쿼리를 위한 스타일 객체 확장
const createResponsiveStyle = (baseStyle, mediaQueries = {}) => {
  const style = { ...baseStyle };
  
  // 미디어 쿼리 적용을 위한 클래스 생성
  Object.entries(mediaQueries).forEach(([query, styles]) => {
    if (window.matchMedia && window.matchMedia(query.replace('@media ', '')).matches) {
      Object.assign(style, styles);
    }
  });
  
  return style;
};

export default PageHeader;
