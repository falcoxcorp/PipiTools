import React, { useState, useEffect } from 'react';
import { Card, Form } from 'react-bootstrap';
import { useAccount, useConnect, useWriteContract } from 'wagmi';
import { multicall } from '@wagmi/core';
import BigNumber from 'bignumber.js';
import { wagmiconfig } from '../../wagmiconfig/wagmiconfig';
import Input from '../../Components/Input/Input';
import erc20Abi from '../../constants/abi/erc20.json';
import lockAbi from '../../constants/abi/lock.json';
import lptokenAbi from '../../constants/abi/lptoken.json';
import FormButton from '../../Components/FormButton/FormButton';
import { VerifyToken } from '../../Components/VerifyToken/VerifyToken';
import { locker } from '../../constants/constants';
import { Link } from 'react-router-dom';
import { waitForTransactionReceipt } from '@wagmi/core';
import './LockCreate.css';

const LockCreate = () => {
  const { chain, address } = useAccount();
  const { connectAsync } = useConnect();
  const { writeContractAsync } = useWriteContract();

  const [tokenAddress, setTokenAddress] = useState('');
  const [enableDifferentOwner, setEnableDifferentOwner] = useState(false);
  const [owner, setOwner] = useState('');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [enableVesting, setEnableVesting] = useState(false);
  const [lockUntil, setLockUntil] = useState('');
  const [tgeDate, setTgeDate] = useState('');
  const [tgePercent, setTgePercent] = useState('');
  const [cycle, setCycle] = useState('');
  const [cycleReleasePercent, setCycleReleasePercent] = useState('');

  // Token details
  const [name, setName] = useState(null);
  const [symbol, setSymbol] = useState(null);
  const [totalSupply, setTotalSupply] = useState(null);
  const [decimals, setDecimals] = useState(null);
  const tokenContract = {
    address: tokenAddress.trim(),
    abi: erc20Abi,
  };

  // Errors
  const [tokenAddressError, setTokenAddressError] = useState(tokenAddress === '' ? 'null' : null);
  const [ownerError, setOwnerError] = useState(enableDifferentOwner && owner === '' ? 'null' : null);
  const [titleError, setTitleError] = useState(null);
  const [amountError, setAmountError] = useState(amount === '' ? 'null' : null);
  const [lockUntilError, setLockUntilError] = useState(!enableVesting && lockUntil === '' ? 'null' : null);
  const [tgeDateError, setTgeDateError] = useState(enableVesting && tgeDate === '' ? 'null' : null);
  const [tgePercentError, setTgePercentError] = useState(enableVesting && tgePercent === '' ? 'null' : null);
  const [cycleError, setCycleError] = useState(enableVesting && cycle === '' ? 'null' : null);
  const [cycleReleasePercentError, setCycleReleasePercentError] = useState(enableVesting && cycleReleasePercent === '' ? 'null' : null);

  // Button states
  const [enableApprove, setEnableApprove] = useState(false);
  const [enableSubmit, setEnableSubmit] = useState(true);
  const [complete, setComplete] = useState(false);

  // Transaction hashes
  const [approvalHash, setApprovalHash] = useState(null);
  const [lockHash, setLockHash] = useState(null);

  // Date management
  const [minTime, setMinTime] = useState('');
  const [maxTime, setMaxTime] = useState('');

  useEffect(() => {
    const now = new Date();
    const oneHourFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const maxFutureTime = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);

    setMinTime(oneHourFromNow.toISOString().slice(0, 16));
    setMaxTime(maxFutureTime.toISOString().slice(0, 16));
  }, []);

  useEffect(() => {
    VerifyToken(tokenAddress, setName, setSymbol, setDecimals, setTotalSupply, setTokenAddressError);
  }, [tokenAddress, chain]);

  const handleOwner = (value) => {
    if (value <= 0) {
      setOwnerError('Owner address must be valid!');
    } else {
      setOwnerError(null);
    }
    setOwner(value);
  };

  const handleTitle = (value) => {
    setTitle(value);
  };

  const handleAmount = (value) => {
    if (value <= 0) {
      setAmountError('Amount must be positive number!');
    } else {
      setAmountError(null);
    }
    setAmount(value);
  };

  const handleLockUntil = (value) => {
    const newLockUntil = new Date(value);
    if (isNaN(newLockUntil.getTime())) {
      setLockUntilError('Start time must not be empty');
    } else {
      setLockUntilError(null);
      setLockUntil(value);
    }
  };

  const handleTgePercent = (value) => {
    if (value <= 0) {
      setTgePercentError('TGE percent must be positive number!');
    } else {
      setTgePercentError(null);
    }
    setTgePercent(value);
  };

  const handleTgeDate = (value) => {
    const newTgeDate = new Date(value);
    if (isNaN(newTgeDate.getTime())) {
      setTgeDateError('TGE date must not be empty');
    } else {
      setTgeDateError(null);
      setTgeDate(value);
    }
  };

  const handleCycle = (value) => {
    if (value <= 0) {
      setCycleError('Cycle must be positive number!');
    } else {
      setCycleError(null);
    }
    setCycle(value);
  };

  const handleCycleReleasePercent = (value) => {
    if (value <= 0) {
      setCycleReleasePercentError('Cycle release percent must be positive number!');
    } else {
      setCycleReleasePercentError(null);
    }
    setCycleReleasePercent(value);
  };

  const handleApprove = async () => {
    try {
      if (!address) {
        await connectAsync();
      }
      const args = [
        locker[chain?.id],
        new BigNumber(amount).times(10 ** decimals).toFixed()
      ];

      const data = await writeContractAsync({
        ...tokenContract,
        functionName: 'approve',
        args,
      });
      
      setApprovalHash('Loading...');
      const receipt = await waitForTransactionReceipt(wagmiconfig, {
        hash: data,
      });
      
      setApprovalHash(receipt.transactionHash);
      setLockHash(null);
      setEnableApprove(true);
      setEnableSubmit(false);
    } catch (error) {
      setApprovalHash('Error occurred. Try again.');
      setLockHash(null);
      setEnableApprove(false);
      setEnableSubmit(true);
      const message = error.shortMessage;
      if (message) {
        if (message.includes('reason:')) {
          const reason = message.split('reason:')[1].trim();
          alert(reason);
        } else {
          alert(message);
        }
      }
    }
  };

  const checkIsLPToken = async () => {
    try {
      const results = await multicall(wagmiconfig, {
        contracts: [
          {
            address: tokenAddress,
            abi: lptokenAbi,
            functionName: 'factory',
          },
          {
            address: tokenAddress,
            abi: lptokenAbi,
            functionName: 'token0',
          },
          {
            address: tokenAddress,
            abi: lptokenAbi,
            functionName: 'token1',
          },
        ],
      });

      if (results[0].result && results[1].result && results[2].result) {
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error checking LP token:", error);
      return false;
    }
  };

  const handleSubmit = async () => {
    try {
      if (!address) {
        await connectAsync();
      }

      const isLp = await checkIsLPToken();

      const args = enableVesting ? [
        enableDifferentOwner ? owner : address,
        tokenAddress,
        isLp,
        new BigNumber(amount).times(10 ** decimals).toFixed(),
        new BigNumber(Date.parse(`${tgeDate.replace("T", " ")} GMT`)).div(1000).toFixed(),
        new BigNumber(tgePercent).times(100).toFixed(),
        new BigNumber(cycle).times(3600 * 24).toFixed(),
        new BigNumber(cycleReleasePercent).times(100).toFixed(),
        title
      ] : [
        enableDifferentOwner ? owner : address,
        tokenAddress,
        isLp,
        new BigNumber(amount).times(10 ** decimals).toFixed(),
        new BigNumber(Date.parse(`${lockUntil.replace("T", " ")} GMT`)).div(1000).toFixed(),
        title
      ];

      const data = await writeContractAsync({
        chainID: parseInt(chain.id, 10),
        abi: lockAbi,
        address: locker[chain?.id],
        functionName: enableVesting ? 'vestingLock' : 'lock',
        args,
      });
      
      setLockHash(data);
      setComplete(true);
    } catch (error) {
      setLockHash(null);
      const message = error.shortMessage;
      if (message) {
        if (message.includes('reason:')) {
          const reason = message.split('reason:')[1].trim();
          alert(reason);
        } else {
          alert(message);
        }
      }
    }
  };

  return (
    <div className="locklist-container">
      <div className="lockpage">
        <Card className="glass-card">
          <Card.Body>
            <center><h2 className="form-title">Create Token Lock</h2></center>
            <Form>
              <Input
                label={"Token or LP Token address*"}
                type={"text"}
                placeholder={"Input token address"}
                value={tokenAddress}
                onChange={(e) => setTokenAddress(e.target.value)}
                note={(name && symbol && totalSupply) ? (
                  `Name: ${name} Symbol: ${symbol} Decimals: ${decimals.toString()} Total Supply: ${totalSupply.toString()}`
                ) : (
                  "Enter the token address and verify"
                )}
                error={tokenAddressError !== 'null' && <span className="text-danger">{tokenAddressError}</span>}
              />
              
              <Form.Group className="mb-3 form-group-custom">
                <Form.Check
                  type="checkbox"
                  label="Use Different Owner?"
                  checked={enableDifferentOwner}
                  onChange={() => {
                    const newEnableDifferentOwner = !enableDifferentOwner;
                    setEnableDifferentOwner(newEnableDifferentOwner);
                    setOwner('');
                    if (newEnableDifferentOwner && owner === '') {
                      setOwnerError('null');
                    } else {
                      setOwnerError(null);
                    }
                  }}
                  className="form-check-custom"
                />
              </Form.Group>
              
              {enableDifferentOwner && (
                <Input
                  label={`Owner*`}
                  type={"text"}
                  placeholder={"Enter owner address"}
                  value={owner}
                  onChange={(e) => handleOwner(e.target.value)}
                  error={ownerError !== 'null' && <span className="text-danger">{ownerError}</span>}
                />
              )}

              <Input
                label={`Title`}
                type={"text"}
                placeholder={"Enter Lock Title"}
                value={title}
                onChange={(e) => handleTitle(e.target.value)}
                error={titleError !== 'null' && <span className="text-danger">{titleError}</span>}
              />

              <Input
                label={`Amount*`}
                type={"number"}
                placeholder={"Enter amount"}
                min={0}
                value={amount}
                onChange={(e) => handleAmount(e.target.value)}
                error={amountError !== 'null' && <span className="text-danger">{amountError}</span>}
              />

              <Form.Group className="mb-3 form-group-custom">
                <Form.Check
                  type="checkbox"
                  label="Use Vesting?"
                  checked={enableVesting}
                  onChange={() => {
                    const newEnableVesting = !enableVesting;
                    setEnableVesting(newEnableVesting);
                    setLockUntil('');

                    if (!newEnableVesting && lockUntil === '') {
                      setLockUntilError('null');
                    } else {
                      setLockUntilError(null);
                    }

                    setTgeDate('');
                    setTgePercent('');
                    setCycle('');
                    setCycleReleasePercent('');

                    if (newEnableVesting) {
                      if (tgeDate === '') setTgeDateError('null');
                      if (tgePercent === '') setTgePercentError('null');
                      if (cycle === '') setCycleError('null');
                      if (cycleReleasePercent === '') setCycleReleasePercentError('null');
                    } else {
                      setTgeDateError(null);
                      setTgePercentError(null);
                      setCycleError(null);
                      setCycleReleasePercentError(null);
                    }
                  }}
                  className="form-check-custom"
                />
              </Form.Group>
              
              {enableVesting ? (
                <>
                  <Form.Group className="mb-3 form-group-custom">
                    <Form.Label>TGE Date (UTC)*</Form.Label>
                    <Form.Control
                      type="datetime-local"
                      value={tgeDate}
                      min={minTime}
                      max={maxTime}
                      onChange={(e) => handleTgeDate(e.target.value)}
                      className="form-control-custom"
                    />
                    {tgeDateError !== 'null' && <span className="text-danger">{tgeDateError}</span>}
                  </Form.Group>
                  
                  <Input
                    label={`TGE Percent*`}
                    type={"number"}
                    placeholder={"Enter TGE Percentage"}
                    min={0}
                    value={tgePercent}
                    onChange={(e) => handleTgePercent(e.target.value)}
                    error={tgePercentError !== 'null' && <span className="text-danger">{tgePercentError}</span>}
                  />

                  <Input
                    label={`Cycle (days)*`}
                    type={"number"}
                    placeholder={"Enter cycle"}
                    min={0}
                    value={cycle}
                    onChange={(e) => handleCycle(e.target.value)}
                    error={cycleError !== 'null' && <span className="text-danger">{cycleError}</span>}
                  />

                  <Input
                    label={`Cycle Release Percent*`}
                    type={"number"}
                    placeholder={"Enter Cycle Release Percentage"}
                    min={0}
                    value={cycleReleasePercent}
                    onChange={(e) => handleCycleReleasePercent(e.target.value)}
                    error={cycleReleasePercentError !== 'null' && <span className="text-danger">{cycleReleasePercentError}</span>}
                  />
                </>
              ) : (
                <>
                  <Form.Label>*Lock Until / Unlock Date (UTC)</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    value={lockUntil}
                    min={minTime}
                    max={maxTime}
                    onChange={(e) => handleLockUntil(e.target.value)}
                    className="form-control-custom"
                  />
                  {lockUntilError !== 'null' && <span className="text-danger">{lockUntilError}</span>}
                </>
              )}

              <div className="form-actions">
                {complete ? (
                  <FormButton
                    href='/lock/tokens'
                    disabled={!complete}
                    buttonName={"Go to Locks page"}
                    className="btn-primary"
                  />
                ) : (
                  <>
                    <FormButton
                      onClick={handleApprove}
                      disabled={
                        tokenAddressError ||
                        ownerError ||
                        titleError ||
                        amountError ||
                        lockUntilError ||
                        tgePercentError ||
                        tgeDateError ||
                        cycleError ||
                        cycleReleasePercentError ||
                        enableApprove
                      }
                      buttonName={"Approve"}
                      className="btn-primary"
                    />
                    <FormButton
                      onClick={handleSubmit}
                      disabled={enableSubmit}
                      buttonName={"Submit"}
                      className="btn-primary"
                    />
                  </>
                )}
              </div>
            </Form>

            {approvalHash && (
              <div className="transaction-hash">
                Approval Hash: <Link to={`${chain.blockExplorers.default.url}/tx/${approvalHash}`} target="_blank" rel="noopener noreferrer">
                  {approvalHash}
                </Link>
              </div>
            )}
            
            {lockHash && (
              <div className="transaction-hash">
                Lock Hash: <Link to={`${chain.blockExplorers.default.url}/tx/${lockHash}`} target="_blank" rel="noopener noreferrer">
                  {lockHash}
                </Link>
              </div>
            )}
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default LockCreate;