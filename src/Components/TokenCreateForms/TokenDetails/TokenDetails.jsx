import React from 'react';
import Input from '../../../Components/Input/Input';
import { Form } from 'react-bootstrap';

const TokenDetails = ({
  tokenType,
  tokenName, handleTokenName, tokenNameError,
  tokenSymbol, handleTokenSymbol, tokenSymbolError,
  tokenDecimal, handleTokenDecimal, tokenDecimalError,
  tokenTotalSupply, handleTokenTotalSupply, tokenTotalSupplyError
}) => {
  return (
    <div style={{
      background: 'rgba(239, 239, 243, 0.8)',
      backdropFilter: 'blur(10px)',
      borderRadius: '15px',
      padding: '20px',
      boxShadow: '0 8px 32px rgba(2, 0, 0, 0.3)',
      border: '1px solid rgba(185, 161, 161, 0.1)',
      marginBottom: '20px'
    }}>
      <Input
        label={"Name*"}
        type={"text"}
        placeholder={"Input token Name"}
        value={tokenName}
        onChange={(e) => handleTokenName(e.target.value)}
        error={tokenNameError !== 'null' && <Form.Text className="text-danger">{tokenNameError}</Form.Text>}
        style={{
          marginBottom: '15px',
          background: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '10px',
          padding: '10px',
          color: '#000'
        }}
      />
      
      <Input
        label={"Symbol*"}
        type={"text"}
        placeholder={"Input token Symbol"}
        value={tokenSymbol}
        onChange={(e) => handleTokenSymbol(e.target.value)}
        error={tokenSymbolError !== 'null' && <Form.Text className="text-danger">{tokenSymbolError}</Form.Text>}
        style={{
          marginBottom: '15px',
          background: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '10px',
          padding: '10px',
          color: '#000'
        }}
      />
      
      {tokenType == 0 && (
        <Input
          label={"Decimals*"}
          type={"number"}
          placeholder={"Input token Decimals"}
          value={tokenDecimal}
          onChange={(e) => handleTokenDecimal(e.target.value)}
          error={tokenDecimalError !== 'null' && <Form.Text className="text-danger">{tokenDecimalError}</Form.Text>}
          style={{
            marginBottom: '15px',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '10px',
            padding: '10px',
            color: '#000'
          }}
        />
      )}
      
      <Input
        label={"Total Supply*"}
        type={"number"}
        placeholder={"Input token Total Supply"}
        value={tokenTotalSupply}
        onChange={(e) => handleTokenTotalSupply(e.target.value)}
        error={tokenTotalSupplyError !== 'null' && <Form.Text className="text-danger">{tokenTotalSupplyError}</Form.Text>}
        style={{
          marginBottom: '15px',
          background: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '10px',
          padding: '10px',
          color: '#000'
        }}
      />
    </div>
  );
};

export default TokenDetails;