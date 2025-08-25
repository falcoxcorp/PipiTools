import React, { useEffect, useState } from "react";
import "./HomePage.css";
import { Button, Card } from "react-bootstrap";
import { readContract } from "@wagmi/core";
import managerAbi from "../../constants/abi/manager.json";
import erc20Abi from "../../constants/abi/erc20.json";
import { wagmiconfig } from "../../wagmiconfig/wagmiconfig";
import { MdDoubleArrow } from "react-icons/md";
import { Link } from "react-router-dom";
import { manager } from "../../constants/constants";
import { formatUnits } from "viem";
import { motion } from "framer-motion";

const HomePage = () => {
  const [launchpads, setLaunchpads] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function capitalize(str) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : '';
  };

  const chainIds = [1116, 56]; // Example chain IDs

  useEffect(() => {
    const fetchLaunchpads = async () => {
      try {
        const data = await sampleLaunchpads();
        setLaunchpads(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLaunchpads();
  }, []);

  const sampleLaunchpads = async () => {
    const allLaunchpads = [];

    for (const chainId of chainIds) {
      try {
        const chainSize = await readContract(wagmiconfig, {
          abi: managerAbi,
          address: manager[chainId],
          functionName: 'getContributionsLength',
          chainId: chainId
        });

        const result = await readContract(wagmiconfig, {
          abi: managerAbi,
          address: manager[chainId],
          functionName: 'getLaunchpads',
          args: [3, Math.max(0, parseInt(chainSize) - 3)],
          chainId: chainId
        });

        const dataWithTokenNames = await Promise.all(
          result.reverse().map(async (item) => {
            try {
              const decimals = await readContract(wagmiconfig, {
                abi: erc20Abi,
                address: item.token,
                functionName: 'decimals',
                chainId: chainId
              });

              const tokenName = await readContract(wagmiconfig, {
                abi: erc20Abi,
                address: item.token,
                functionName: 'name',
                chainId: chainId
              });
              const tokenSymbol = await readContract(wagmiconfig, {
                abi: erc20Abi,
                address: item.token,
                functionName: 'symbol',
                chainId: chainId
              });

              // Get native token symbol for the chain
              const nativeTokenSymbol = wagmiconfig.chains.find(c => c.id === chainId)?.nativeCurrency?.symbol || 'ETH';

              // Check if presale is live
              const currentTimestamp = Math.floor(Date.now() / 1000);
              const isLive = currentTimestamp < parseInt(item.endTime);

              return { 
                ...item, 
                tokenName, 
                tokenSymbol, 
                decimals, 
                chainId, 
                isLive, 
                nativeTokenSymbol 
              };
            } catch (tokenError) {
              console.error('Failed to fetch token name:', tokenError);
              return { 
                ...item, 
                tokenName: 'Unknown', 
                isLive: false, 
                nativeTokenSymbol: wagmiconfig.chains.find(c => c.id === chainId)?.nativeCurrency?.symbol || 'ETH' 
              };
            }
          })
        );
        allLaunchpads.push(...dataWithTokenNames);
      } catch (err) {
        console.error(`Failed to fetch data for chain ${chainId}:`, err);
      }
    }

    const sortedLaunchpads = allLaunchpads.sort((a, b) => {
      return -1 * (parseInt(a.endTime) - parseInt(b.endTime));
    });

    return sortedLaunchpads.slice(0, 3);
  };

  if (loading) return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Loading launchpads...</p>
    </div>
  );
  
  if (error) return (
    <div className="error-container">
      <p>Error fetching data: {error.message}</p>
    </div>
  );

  return (
    <div className="homepage-container">
      {/* Launchpads Section */}
      <motion.section 
        className="launchpads-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="launchpads-card">
          <div className="container">
            {launchpads.length > 0 && (
              <>
                <Card.Body className="launchpads-content">
                  <Card.Title className="section-title">
                    Featured Launchpads
                  </Card.Title>
                  <div className="launchpads-grid">
                    {launchpads.map((item, index) => (
                      <motion.div
                        key={index}
                        custom={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -5 }}
                      >
                        <Card className={`launchpad-card ${item.isLive ? 'live' : 'ended'}`}>
                          <Card.Body>
                            <div className="card-header">
                              <motion.div 
                                className="logo-container"
                                whileHover={{ rotate: 10, scale: 1.1 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                              >
                                <Card.Img
                                  variant="top"
                                  src={item.logoUrl}
                                  alt="Launchpad Logo"
                                  className="launchpad-logo"
                                />
                                <div className="logo-glow"></div>
                              </motion.div>
                              <div className={`status-badge ${item.isLive ? 'live' : 'ended'}`}>
                                <span className="status-dot"></span>
                                {item.isLive ? 'LIVE' : 'NOT LIVE'}
                              </div>
                            </div>
                            <Card.Title className="launchpad-title">
                              {item.tokenName} <span className="symbol">({item.tokenSymbol})</span>
                            </Card.Title>
                            <ul className="details-list">
                              {!item.hardCap && (
                                <li>
                                  <strong>Soft Cap:</strong>
                                  <span className="value soft">{formatUnits(item.softCap, item.decimals)} {item.nativeTokenSymbol}</span>
                                </li>
                              )}
                              {item.hardCap && (
                                <li>
                                  <strong>Soft - Hard Cap:</strong>
                                  <span className="value soft">
                                    {formatUnits(item.softCap, item.decimals)} - {formatUnits(item.hardCap, item.decimals)} {item.nativeTokenSymbol}
                                  </span>
                                </li>
                              )}
                              <li>
                                <strong>Presale Type:</strong>
                                <span className={`type ${item.liquidity == 0 ? 'public' : item.presaleType}`}>
                                  {item.liquidity == 0 ? 'Public' : capitalize(item.presaleType?.toString())}
                                </span>
                              </li>
                              {item.presaleType == 'standard' && (
                                <li>
                                  <strong>Tokens For Presale:</strong>
                                  <span className="value">
                                    {(parseInt(item.hardCap) * parseInt(item.rate) / 10 ** (parseInt(wagmiconfig.chains.find(c => c.id === item.chainId).nativeCurrency.decimals) + parseInt(item.decimals))).toLocaleString()} {item.tokenSymbol}
                                  </span>
                                </li>
                              )}
                              {item.presaleType == 'fair' && (
                                <li>
                                  <strong>Tokens For Presale:</strong>
                                  <span className="value">
                                    {formatUnits(BigInt(item.total.toString()), item.decimals)} {item.tokenSymbol}
                                  </span>
                                </li>
                              )}
                              <li className="highlight">
                                <strong>Liquidity:</strong>
                                <span className="value highlight">{parseInt(item.liquidity) / 10}%</span>
                              </li>
                              <li className="highlight">
                                <strong>Lock Time:</strong>
                                <span className="value highlight">{parseInt(item.lockTime) / 86400} Days</span>
                              </li>
                            </ul>
                            <motion.div 
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Button
                                variant={item.isLive ? "success" : "secondary"}
                                href={`/launchpads/${item.presaleType?.toString()}/${item.addr}/${item.chainId}`}
                                className="view-button"
                              >
                                {item.isLive ? 'Join Presale' : 'View Details'}
                              </Button>
                            </motion.div>
                          </Card.Body>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                  <div className="more-launchpads">
                    <Link to="/launchpads/launchpad-list" className="more-link">
                      View All Launchpads <MdDoubleArrow />
                    </Link>
                  </div>
                </Card.Body>
              </>
            )}
          </div>
        </Card>
      </motion.section>

      {/* Pipitools Ecosystem Section */}
      <motion.section 
        className="ecosystem-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Card className="ecosystem-card">
          <div className="container">
            <Card.Title className="section-title">
              <span>Pipitools Finance</span> Ecosystem
            </Card.Title>
            <p className="ecosystem-description">
             
            </p>
            <div className="ecosystem-grid">
              {[
                
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  whileHover={{ y: -5 }}
                  className="ecosystem-item"
                >
                  <Link to={item.link} target="_blank" rel="noopener noreferrer">
                    <div className="ecosystem-image-container">
                      <img src={item.image} alt={item.title} className="ecosystem-image" />
                    </div>
                    <div className="ecosystem-caption">
                      <h3>{item.title}</h3>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </Card>
      </motion.section>

      {/* Feature Sections */}
      {[
        {
          title: "PipiSwap: Trade Smart, Grow Securely",
          description: "Discover PipiSwap, the exchange platform with the lowest fees and an innovative approach to maximizing your profits. With only a 0.30% fee per transaction, 50% (0.15%) of this fee goes directly to pool owners, ensuring consistent and automatic profitability for your projects. Our autoLP technology ensures sustainable and secure growth, fostering ecosystem stability.",
          buttonText: "PipiSwap",
          link: "https://pipiswap.finance/",
          image: "/Launchpad-img.png",
          reverse: false
        },
        {
          title: "Easy and efficient betting with Pipitools.finance!",
          description: "Pipitools.finance is the perfect solution to create and manage your staking pools! 🚀 Set up and manage your stakes in minutes with full control, customizing rewards and rules to your needs. Designed to attract users and benefit developers, our system guarantees a profitable and sustainable environment. Don't wait any longer, join now, create your pool and take your projects to the next level. 🌐 Visit us at Pipitools.finance and make it happen.",
          buttonText: "Staking",
          link: "https://staking.pipitools.finance/",
          image: "/Staking-img.png",
          reverse: true
        }
      ].map((feature, index) => (
        <motion.section 
          key={index}
          className="feature-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * index, duration: 0.5 }}
        >
          <Card className={`feature-card ${feature.reverse ? 'reverse' : ''}`}>
            <div className="container">
              <div className="feature-content">
                <div className="feature-text">
                  <Card.Title className="feature-title">
                    {feature.title}
                  </Card.Title>
                  <p className="feature-description">
                    {feature.description}
                  </p>
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <Button href={feature.link} className="feature-button">
                      {feature.buttonText} <MdDoubleArrow />
                    </Button>
                  </motion.div>
                </div>
                <div className="feature-image-container">
                  <img src={feature.image} alt={feature.title} className="feature-image" />
                </div>
              </div>
            </div>
          </Card>
        </motion.section>
      ))}

      {/* Partners Section */}
      <motion.section 
        className="partners-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <Card className="partners-card">
          <div className="container">
            <Card.Title className="section-title">
              <span>Partners</span>
            </Card.Title>
            <p className="partners-description">
              This space is exclusive for our allies, where together we boost the growth of PIPI_LOL.
            </p>
            <div className="partners-grid">
              {[
                {
                  name: "FalcoX",
                  link: "https://falcox.net/",
                  image: "/FalcoX.png"
                },
                {
                  name: "CoinMarketCap",
                  link: "https://coinmarketcap.com/es/",
                  image: "/CoinMarketCap.png"
                },
                {
                  name: "AVE",
                  link: "https://ave.ai/",
                  image: "/AVE.png"
                },
                {
                  name: "CoinGecko",
                  link: "https://www.coingecko.com/",
                  image: "/CoinGecko.png"
                }
              ].map((partner, index) => (
                <motion.div 
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="partner-item"
                >
                  <Link to={partner.link} target="_blank" rel="noopener noreferrer">
                    <div className="partner-image-container">
                      <img src={partner.image} alt={partner.name} className="partner-image" />
                    </div>
                    <div className="partner-caption">
                      <h3>{partner.name}</h3>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </Card>
      </motion.section>
    </div>
  );
};

export default HomePage;