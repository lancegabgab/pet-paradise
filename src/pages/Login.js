import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import UserContext from '../UserContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isActive, setIsActive] = useState(true);
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (email !== '' && password !== '') {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [email, password]);

  function authenticate(e) {
    e.preventDefault();

    fetch(`${process.env.REACT_APP_API_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    }).then((response) => response.json())
      .then((data) => {
        if (data.access) {
          localStorage.setItem('access', data.access);
          retrieveUserDetails(data.access);

          // SweetAlert2 notification on successful login
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'You are now logged in',
            timer: 1500,
            showConfirmButton: false,
          }).then(() => {
          navigate('/products/all');
        });;
        } else if (data.error === 'No Email Found') {
          // SweetAlert2 notification for email not found
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Email not found',
          });
        } else {
          // SweetAlert2 notification for other errors
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `${email} does not exist`,
          });
        }
      });

    setEmail('');
    setPassword('');
  }

  const retrieveUserDetails = (token) => {
    fetch(`${process.env.REACT_APP_API_URL}/users/details`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser({
          id: data._id,
          isAdmin: data.isAdmin,
        });
      });
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col xs={12} md={4}>
          <Form onSubmit={(e) => isActive && authenticate(e)}>
            <h1 className="my-5 text-center">Login</h1>
            <Form.Group controlId="userEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            {isActive ? (
              <Button variant="primary" type="submit" id="submitBtn">
                Submit
              </Button>
            ) : (
              <Button variant="danger" type="submit" id="submitBtn" disabled>
                Submit
              </Button>
            )}
            <div className="text-center mt-3">
              <small>
                No account yet? <Link to="/register">Register here</Link>
              </small>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
