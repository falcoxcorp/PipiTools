import React from 'react';
import { Form } from 'react-bootstrap';

const TokenTypeSelector = ({ handleTokenType }) => {
  return (
    <Form.Group className="mb-3" style={{
      background: 'rgba(239, 239, 243, 0.8)',
      backdropFilter: 'blur(10px)',
      borderRadius: '15px',
      padding: '20px',
      boxShadow: '0 8px 32px rgba(2, 0, 0, 0.3)',
      border: '1px solid rgba(185, 161, 161, 0.1)',
      marginBottom: '20px'
    }}>
      <Form.Label style={{
        color: '#000',
        fontSize: '1.2rem',
        fontWeight: 'bold',
        marginBottom: '15px',
        display: 'block'
      }}>Type</Form.Label>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <Form.Check
          type="radio"
          name="tokenType"
          label="Standard Token"
          defaultChecked
          onChange={() => handleTokenType(0)}
          style={{
            color: '#000',
            padding: '8px',
            borderRadius: '8px',
            background: 'rgba(255, 255, 255, 0.1)',
            transition: 'all 0.3s ease'
          }}
        />
        <Form.Check
          type="radio"
          name="tokenType"
          label="Liquidity Generator Token"
          onChange={() => handleTokenType(1)}
          style={{
            color: '#000',
            padding: '8px',
            borderRadius: '8px',
            background: 'rgba(255, 255, 255, 0.1)',
            transition: 'all 0.3s ease'
          }}
        />
        <Form.Check
          type="radio"
          name="tokenType"
          label="Pipi Token"
          onChange={() => handleTokenType(4)}
          style={{
            color: '#000',
            padding: '8px',
            borderRadius: '8px',
            background: 'rgba(255, 255, 255, 0.1)',
            transition: 'all 0.3s ease'
          }}
        />
      </div>
    </Form.Group>
  );
};

export default TokenTypeSelector;