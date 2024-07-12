import React from 'react';

export default function errorMsgCard(errorMSG: any) {
  return (
    <div
      style={{
        backgroundColor: '#f3f3886e',
        border: 'solid #e6e60d',
        padding: '28px',
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        fontSize: '20px',
        color: 'gray',
      }}
    >
      {errorMSG}
    </div>
  );
}
