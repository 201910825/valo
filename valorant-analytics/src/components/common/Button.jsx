import React from 'react';

export default function Button({ children, onClick, style }) {
  const defaultStyle = {
    padding: '8px 16px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: '#4f46e5',
    color: '#fff',
    fontWeight: 'bold',
    ...style
  };

  return (
    <button onClick={onClick} style={defaultStyle}>
      {children}
    </button>
  );
}
