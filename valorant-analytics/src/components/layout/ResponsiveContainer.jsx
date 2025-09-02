import React from 'react';

const ResponsiveContainer = ({ children, className = '' }) => {
  return (
    <div style={containerStyle} className={`responsive-container ${className}`}>
      {children}
    </div>
  );
};

// 반응형 컨테이너 스타일
const containerStyle = {
  padding: 'clamp(20px, 4vw, 30px)', // 상단 패딩 증가
  color: '#fff',
  minHeight: '100vh',
  width: '100%',
  maxWidth: '1400px',
  margin: '0 auto',
  boxSizing: 'border-box',
  // 모바일 최적화
  overflowX: 'hidden',
  wordWrap: 'break-word',
  
  // Firefox 스크롤바 스타일링
  scrollbarWidth: 'thin',
  scrollbarColor: 'rgba(255,255,255,0.3) transparent'
};

// 반응형 섹션 스타일
export const responsiveSectionStyle = {
  marginBottom: 'clamp(20px, 6vw, 40px)',
  padding: '0',
  width: '100%'
};

// 반응형 그리드 스타일들
export const createResponsiveGrid = (minWidth = '280px', gap = '20px') => ({
  display: 'grid',
  gridTemplateColumns: `repeat(auto-fill, minmax(${minWidth}, 1fr))`,
  gap: gap,
  width: '100%',
  
  // 모바일에서 단일 컬럼
  '@media (max-width: 480px)': {
    gridTemplateColumns: '1fr',
    gap: '15px'
  }
});

// 반응형 카드 스타일
export const responsiveCardStyle = {
  background: 'rgba(255,255,255,0.1)',
  padding: 'clamp(15px, 4vw, 25px)',
  borderRadius: 'clamp(8px, 2vw, 12px)',
  border: '1px solid rgba(255,255,255,0.2)',
  backdropFilter: 'blur(10px)',
  transition: 'all 0.3s ease',
  
  // 모바일 터치 최적화
  minHeight: '44px', // 최소 터치 영역
  cursor: 'pointer',
  
  // 호버 효과 (데스크탑만)
  '@media (hover: hover)': {
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
      background: 'rgba(255,255,255,0.15)'
    }
  }
};

// 반응형 텍스트 스타일들
export const responsiveTextStyles = {
  h1: {
    fontSize: 'clamp(24px, 6vw, 36px)',
    lineHeight: '1.2',
    margin: '0 0 clamp(15px, 4vw, 20px) 0',
    fontWeight: 'bold'
  },
  h2: {
    fontSize: 'clamp(20px, 5vw, 28px)',
    lineHeight: '1.3',
    margin: '0 0 clamp(12px, 3vw, 16px) 0',
    fontWeight: '600'
  },
  h3: {
    fontSize: 'clamp(16px, 4vw, 20px)',
    lineHeight: '1.4',
    margin: '0 0 clamp(8px, 2vw, 12px) 0',
    fontWeight: '600'
  },
  h4: {
    fontSize: 'clamp(14px, 3vw, 16px)',
    lineHeight: '1.4',
    margin: '0 0 clamp(6px, 1.5vw, 10px) 0',
    fontWeight: '500'
  },
  body: {
    fontSize: 'clamp(14px, 3vw, 16px)',
    lineHeight: '1.6',
    margin: '0'
  },
  small: {
    fontSize: 'clamp(12px, 2.5vw, 14px)',
    lineHeight: '1.5',
    opacity: 0.8
  }
};

// 반응형 버튼 스타일
export const responsiveButtonStyle = {
  padding: 'clamp(8px, 2vw, 12px) clamp(12px, 3vw, 20px)',
  fontSize: 'clamp(12px, 3vw, 14px)',
  borderRadius: 'clamp(6px, 1.5vw, 8px)',
  border: '1px solid rgba(255,255,255,0.2)',
  background: 'rgba(255,255,255,0.1)',
  color: '#fff',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  fontWeight: '500',
  minHeight: '44px', // 터치 최적화
  minWidth: '44px',
  
  // 활성 상태
  ':active': {
    transform: 'scale(0.98)'
  }
};

// 반응형 플렉스 유틸리티
export const responsiveFlexStyles = {
  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 'clamp(10px, 2vw, 20px)'
  },
  spaceBetween: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 'clamp(10px, 2vw, 15px)'
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'clamp(10px, 2vw, 15px)'
  }
};

// 브레이크포인트 유틸리티
export const breakpoints = {
  mobile: '480px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1400px'
};

// 미디어 쿼리 헬퍼
export const mediaQuery = {
  mobile: `@media (max-width: ${breakpoints.mobile})`,
  tablet: `@media (max-width: ${breakpoints.tablet})`,
  desktop: `@media (min-width: ${breakpoints.desktop})`,
  wide: `@media (min-width: ${breakpoints.wide})`
};

export default ResponsiveContainer;
