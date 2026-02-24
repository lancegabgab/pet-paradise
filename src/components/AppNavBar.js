import React from 'react';
import { NavLink } from 'react-router-dom';
import { useContext } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import UserContext from '../UserContext';
import '../style.css';
import logo from '../images/componentPhotos/petParadiseTextNoBg.png';

const AppNavBar = () => {
  const { user } = useContext(UserContext);

  return (
    <Navbar expand="lg" id="bgColor1">
      <Container>
        <Navbar.Brand as={NavLink} to="/">
          <img src={logo} alt="Pet Paradise" id="navBarLogo" />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto"> 
            <Nav.Link as={NavLink} to="/home" id="fontColor1">
              Home
            </Nav.Link>
            <Nav.Link as={NavLink} to="/about" id="fontColor1">
              About
            </Nav.Link>

            {user.id !== null ? (
              user.isAdmin === true ? (
                <>
                  <Nav.Link as={NavLink} to="/products/all" id="fontColor1">
                    Products
                  </Nav.Link>
                  <Nav.Link as={NavLink} to="/users" id="fontColor1">
                    Users
                  </Nav.Link>
                  <Nav.Link as={NavLink} to="/allorders" id="fontColor1">
                    Orders
                  </Nav.Link>
                  <Nav.Link as={NavLink} to="/profile" id="fontColor1">
                    Profile
                  </Nav.Link>
                  <Nav.Link as={NavLink} to="/logout" id="fontColor1">
                    Logout
                  </Nav.Link>
                </>
              ) : (
                <>
                  <Nav.Link as={NavLink} to="/products/users" id="fontColor1">
                    Shop
                  </Nav.Link>
                  <Nav.Link as={NavLink} to="/cart" id="fontColor1">
                    Cart
                  </Nav.Link>
                  <Nav.Link as={NavLink} to="/myorders" id="fontColor1">
                    Orders
                  </Nav.Link>
                  <Nav.Link as={NavLink} to="/profile" id="fontColor1">
                    Profile
                  </Nav.Link>
                  <Nav.Link as={NavLink} to="/logout" id="fontColor1">
                    Logout
                  </Nav.Link>
                </>
              )
            ) : (
              <>
                <Nav.Link as={NavLink} to="/" id="fontColor1">
                  Login
                </Nav.Link>
                <Nav.Link as={NavLink} to="/register" id="fontColor1">
                  Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavBar;
