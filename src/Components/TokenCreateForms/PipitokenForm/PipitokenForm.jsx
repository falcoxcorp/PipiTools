import React from 'react';
import Input from '../../../Components/Input/Input';
import { Form } from 'react-bootstrap';

const PipitokenForm = ({
  marketingAddress, handleMarketingAddress, marketingAddressError,
  charityAddress, handleCharityAddress, charityAddressError,
  devloperAddress, handleDevloperAddress, devloperAddressError,
  
  marketingPercent, handleMarketingPercent, marketingPercentError,
  devloperPercent, handleDevloperPercent, devloperPercentError,
  liquidityPercent, handleLiquidityPercent, liquidityPercentError,
  charityFee, handleCharityFee, charityFeeError,

  sellDevloperPercent, handleSellDevloperPercent, sellDevloperPercentError,
  sellCharityFee, handleSellCharityFee, sellCharityFeeError,
  sellMarketingPercent, handleSellMarketingPercent, sellMarketingPercentError,
  sellLiquidityPercent, handleSellLiquidityPercent, sellLiquidityPercentError
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
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px'
      }}>
        {/* Address Section */}
        <div style={{
          gridColumn: '1 / -1',
          marginBottom: '15px',
          padding: '15px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '10px'
        }}>
          <h3 style={{ color: '#000', marginBottom: '15px' }}>Address Settings</h3>
          <Input
            label={"Marketing Address*"}
            type={"text"}
            placeholder={"Input Marketing Address"}
            value={marketingAddress}
            onChange={(e) => handleMarketingAddress(e.target.value)}
            error={marketingAddressError !== 'null' && <Form.Text className="text-danger">{marketingAddressError}</Form.Text>}
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
            label={"Charity Address*"}
            type={"text"}
            placeholder={"Input Charity Address"}
            value={charityAddress}
            onChange={(e) => handleCharityAddress(e.target.value)}
            error={charityAddressError !== 'null' && <Form.Text className="text-danger">{charityAddressError}</Form.Text>}
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
            label={"Developer Address*"}
            type={"text"}
            placeholder={"Input Developer Address"}
            value={devloperAddress}
            onChange={(e) => handleDevloperAddress(e.target.value)}
            error={devloperAddressError !== 'null' && <Form.Text className="text-danger">{devloperAddressError}</Form.Text>}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
              padding: '10px',
              color: '#000'
            }}
          />
        </div>

        {/* Buy Tax Section */}
        <div style={{
          marginBottom: '15px',
          padding: '15px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '10px'
        }}>
          <h3 style={{ color: '#000', marginBottom: '15px' }}>Buy Tax Settings</h3>
          <Input
            label={"Developer Buy Tax (%)*"}
            type={"number"}
            placeholder={"Input Developer Buy Tax"}
            value={devloperPercent}
            onChange={(e) => handleDevloperPercent(e.target.value)}
            error={devloperPercentError !== 'null' && <Form.Text className="text-danger">{devloperPercentError}</Form.Text>}
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
            label={"Buy Charity Fee (%)*"}
            type={"number"}
            placeholder={"Input Buy Charity Fee"}
            value={charityFee}
            onChange={(e) => handleCharityFee(e.target.value)}
            error={charityFeeError !== 'null' && <Form.Text className="text-danger">{charityFeeError}</Form.Text>}
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
            label={"Buy Marketing Percent (%)*"}
            type={"number"}
            placeholder={"Input Buy Marketing Percent"}
            value={marketingPercent}
            onChange={(e) => handleMarketingPercent(e.target.value)}
            error={marketingPercentError !== 'null' && <Form.Text className="text-danger">{marketingPercentError}</Form.Text>}
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
            label={"Buy Liquidity Fee (%)*"}
            type={"number"}
            placeholder={"Input Buy Liquidity Fee"}
            value={liquidityPercent}
            onChange={(e) => handleLiquidityPercent(e.target.value)}
            error={liquidityPercentError !== 'null' && <Form.Text className="text-danger">{liquidityPercentError}</Form.Text>}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
              padding: '10px',
              color: '#000'
            }}
          />
        </div>

        {/* Sell Tax Section */}
        <div style={{
          padding: '15px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '10px'
        }}>
          <h3 style={{ color: '#000', marginBottom: '15px' }}>Sell Tax Settings</h3>
          <Input
            label={"Developer Sell Tax (%)*"}
            type={"number"}
            placeholder={"Input Developer Sell Tax"}
            value={sellDevloperPercent}
            onChange={(e) => handleSellDevloperPercent(e.target.value)}
            error={sellDevloperPercentError !== 'null' && <Form.Text className="text-danger">{sellDevloperPercentError}</Form.Text>}
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
            label={"Sell Charity Fee (%)*"}
            type={"number"}
            placeholder={"Input Sell Charity Fee"}
            value={sellCharityFee}
            onChange={(e) => handleSellCharityFee(e.target.value)}
            error={sellCharityFeeError !== 'null' && <Form.Text className="text-danger">{sellCharityFeeError}</Form.Text>}
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
            label={"Sell Marketing Percent (%)*"}
            type={"number"}
            placeholder={"Input Sell Marketing Percent"}
            value={sellMarketingPercent}
            onChange={(e) => handleSellMarketingPercent(e.target.value)}
            error={sellMarketingPercentError !== 'null' && <Form.Text className="text-danger">{sellMarketingPercentError}</Form.Text>}
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
            label={"Sell Liquidity Fee (%)*"}
            type={"number"}
            placeholder={"Input Sell Liquidity Fee"}
            value={sellLiquidityPercent}
            onChange={(e) => handleSellLiquidityPercent(e.target.value)}
            error={sellLiquidityPercentError !== 'null' && <Form.Text className="text-danger">{sellLiquidityPercentError}</Form.Text>}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
              padding: '10px',
              color: '#000'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default PipitokenForm;