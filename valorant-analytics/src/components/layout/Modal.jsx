import React from 'react';

export default function Modal({ isOpen, title, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <h2>{title}</h2>
          <button onClick={onClose} style={closeBtnStyle}>X</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}

const overlayStyle = {
  position: 'fixed',
  top:0, left:0, right:0, bottom:0,
  backgroundColor: 'rgba(0,0,0,0.6)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000
};

const modalStyle = {
  backgroundColor: '#1e1e2f',
  borderRadius: '12px',
  padding: '20px',
  width: '700px',
  maxHeight: '80%',
  overflowY: 'auto',
  boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
  color:'#fff'
};

const closeBtnStyle = {
  background: 'none',
  border: 'none',
  fontSize: '18px',
  cursor: 'pointer',
  color:'#fff'
};
