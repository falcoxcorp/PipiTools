import React from 'react';
import Input from '../../../Components/Input/Input';
import { Form } from 'react-bootstrap';

const LiquidityGeneratorTokenForm = ({
  yieldGenerateFee, handleYieldGenerateFee, yieldGenerateFeeError,
  liquidityGenerateFee, handleLiquidityGenerateFee, liquidityGenerateFeeError,
  marketingAddress, handleMarketingAddress, marketingAddressError,
  marketingPercent, handleMarketingPercent, marketingPercentError
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
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '15px'
      }}>
        <Input
          label={"Yield Generate Fee(%)*"}
          type={"number"}
          placeholder={"Input Yield Generate Fee"}
          value={yieldGenerateFee}
          onChange={(e) => handleYieldGenerateFee(e.target.value)}
          error={yieldGenerateFeeError !== 'null' && <Form.Text className="text-danger">{yieldGenerateFeeError}</Form.Text>}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '10px',
            padding: '15px',
            color: '#000'
          }}
        />
        
        <Input
          label={"Liquidity Generate Fee (%)*"}
          type={"number"}
          placeholder={"Input Liquidity Generate Fee"}
          value={liquidityGenerateFee}
          onChange={(e) => handleLiquidityGenerateFee(e.target.value)}
          error={liquidityGenerateFeeError !== 'null' && <Form.Text className="text-danger">{liquidityGenerateFeeError}</Form.Text>}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '10px',
            padding: '15px',
            color: '#000'
          }}
        />
        
        <Input
          label={"Marketing Address*"}
          type={"text"}
          placeholder={"Input Marketing Address"}
          value={marketingAddress}
          onChange={(e) => handleMarketingAddress(e.target.value)}
          error={marketingAddressError !== 'null' && <Form.Text className="text-danger">{marketingAddressError}</Form.Text>}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '10px',
            padding: '15px',
            color: '#000'
          }}
        />
        
        <Input
          label={"Marketing Percent(%)*"}
          type={"number"}
          placeholder={"Input Marketing Percent"}
          value={marketingPercent}
          onChange={(e) => handleMarketingPercent(e.target.value)}
          error={marketingPercentError !== 'null' && <Form.Text className="text-danger">{marketingPercentError}</Form.Text>}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '10px',
            padding: '15px',
            color: '#000'
          }}
        />
      </div>
    </div>
  );
};

export default LiquidityGeneratorTokenForm;