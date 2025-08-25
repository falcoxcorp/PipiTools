import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { 
  Button, 
  Dropdown, 
  DropdownButton,
  Container,
  Navbar as BootstrapNavbar,
  Nav
} from 'react-bootstrap';
import { 
  FaRocket, 
  FaRegDotCircle,
  FaLock,
  FaCoins,
  FaGem,
  FaBook
} from 'react-icons/fa';
import { BsStars } from 'react-icons/bs';
import { GiToken } from 'react-icons/gi';
import { PiHandDepositBold } from 'react-icons/pi';
import { motion } from 'framer-motion';
import "./Navbar.css";

const Navbar = () => {
    const iconHover = {
        scale: 1.2,
        y: -2,
        transition: { 
            type: "spring", 
            stiffness: 500, 
            damping: 10,
            duration: 0.3
        }
    };
    
    const linkHover = {
        scale: 1.05,
        color: "#ffd700",
        textShadow: "0 0 8px rgba(255, 215, 0, 0.5)",
        transition: { 
            duration: 0.3,
            ease: "easeOut"
        }
    };

    const floatingAnimation = {
        y: [0, -5, 0],
        transition: {
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
        }
    };

    return (
        <BootstrapNavbar expand="lg" className="gradient-navbar" variant="dark" fixed="top">
            <Container fluid>
                <motion.div
                    animate={floatingAnimation}
                >
                    <BootstrapNavbar.Brand as={Link} to="/" className="d-flex align-items-center">
                        <motion.img 
                            src="/logo.png" 
                            alt="Logo" 
                            style={{ width: '10rem' }}
                            whileHover={{ 
                                scale: 1.05,
                                rotate: [0, 5, -5, 0]
                            }}
                        />
                    </BootstrapNavbar.Brand>
                </motion.div>
                
                <BootstrapNavbar.Toggle aria-controls="navbarNav" />
                
                <BootstrapNavbar.Collapse id="navbarNav">
                    <Nav className="ms-auto align-items-center">
                        <DropdownButton
                            as={Nav.Item}
                            title={
                                <motion.div 
                                    className="d-flex align-items-center"
                                    whileHover={linkHover}
                                >
                                    <motion.span whileHover={iconHover}>
                                        <FaRocket className="me-2" />
                                    </motion.span>
                                    Launchpads
                                </motion.div>
                            }
                            className="nav-dropdown"
                            variant="dark"
                            menuVariant="dark"
                        >
                            <Dropdown.Item 
                                as={Link} 
                                to="/launchpads/launchpad"
                                className="dropdown-item-custom"
                            >
                                <motion.div whileHover={{ x: 5 }}>
                                    Create a launchpad
                                </motion.div>
                            </Dropdown.Item>
                            <Dropdown.Item 
                                as={Link} 
                                to="/launchpads/fairlaunch"
                                className="dropdown-item-custom"
                            >
                                <motion.div whileHover={{ x: 5 }}>
                                    Create a fairlaunch
                                </motion.div>
                            </Dropdown.Item>
                            <Dropdown.Item 
                                as={Link} 
                                to="/launchpads/launchpad-list"
                                className="dropdown-item-custom"
                            >
                                <motion.div whileHover={{ x: 5 }}>
                                    Launchpads List
                                </motion.div>
                            </Dropdown.Item>
                        </DropdownButton>

                        <DropdownButton
                            as={Nav.Item}
                            title={
                                <motion.div 
                                    className="d-flex align-items-center"
                                    whileHover={linkHover}
                                >
                                    <motion.span whileHover={iconHover}>
                                        <FaLock className="me-2" />
                                    </motion.span>
                                    Lock
                                </motion.div>
                            }
                            className="nav-dropdown"
                            variant="dark"
                            menuVariant="dark"
                        >
                            <Dropdown.Item 
                                as={Link} 
                                to="/lock/create"
                                className="dropdown-item-custom"
                            >
                                <motion.div whileHover={{ x: 5 }}>
                                    Create a Lock
                                </motion.div>
                            </Dropdown.Item>
                            <Dropdown.Item 
                                as={Link} 
                                to="/lock/tokens"
                                className="dropdown-item-custom"
                            >
                                <motion.div whileHover={{ x: 5 }}>
                                    Lock List
                                </motion.div>
                            </Dropdown.Item>
                        </DropdownButton>

                        <DropdownButton
                            as={Nav.Item}
                            title={
                                <motion.div 
                                    className="d-flex align-items-center"
                                    whileHover={linkHover}
                                >
                                    <motion.span whileHover={iconHover}>
                                        <GiToken className="me-2" />
                                    </motion.span>
                                    Token
                                </motion.div>
                            }
                            className="nav-dropdown"
                            variant="dark"
                            menuVariant="dark"
                        >
                            <Dropdown.Item 
                                as={Link} 
                                to="/token"
                                className="dropdown-item-custom"
                            >
                                <motion.div whileHover={{ x: 5 }}>
                                    Create a Token
                                </motion.div>
                            </Dropdown.Item>
                        </DropdownButton>

                        <DropdownButton
                            as={Nav.Item}
                            title={
                                <motion.div 
                                    className="d-flex align-items-center"
                                    whileHover={linkHover}
                                >
                                    <motion.span whileHover={iconHover}>
                                        <FaCoins className="me-2" />
                                    </motion.span>
                                    Staking
                                </motion.div>
                            }
                            className="nav-dropdown"
                            variant="dark"
                            menuVariant="dark"
                        >
                            <Dropdown.Item 
                                href="https://staking.pipitools.finance/staking/create" 
                                target="_blank"
                                className="dropdown-item-custom"
                            >
                                <motion.div whileHover={{ x: 5 }}>
                                    Create Stakings
                                </motion.div>
                            </Dropdown.Item>
                            <Dropdown.Item 
                                href="https://staking.pipitools.finance/staking/pools" 
                                target="_blank"
                                className="dropdown-item-custom"
                            >
                                <motion.div whileHover={{ x: 5 }}>
                                    Stakings Pools
                                </motion.div>
                            </Dropdown.Item>
                        </DropdownButton>

                        <motion.div whileHover={linkHover}>
                            <Button 
                                as={Link} 
                                to="/documents" 
                                variant="link" 
                                className="nav-link-custom d-flex align-items-center"
                            >
                                <motion.span whileHover={iconHover}>
                                    <FaBook className="me-2" />
                                </motion.span>
                                Documents
                            </Button>
                        </motion.div>
                    </Nav>
                    
                    <div className="ms-lg-3 connection-button-container">
                        <motion.div whileHover={{ scale: 1.05 }}>
                            <ConnectButton 
                                chainStatus="icon"
                                accountStatus="address"
                                showBalance={false}
                            />
                        </motion.div>
                    </div>
                </BootstrapNavbar.Collapse>
            </Container>
        </BootstrapNavbar>
    );
};

export default Navbar;