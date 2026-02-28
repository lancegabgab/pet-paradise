import { Form, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../style.css';

export default function Register() {

  const navigate = useNavigate();

  const [formFields, setFormFields] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobileNo: '',
    password: '',
    confirmPassword: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [isActive, setIsActive] = useState(false);

  const validateForm = () => {
    let errors = {};

    if (!formFields.firstName.trim())
      errors.firstName = "First name is required";

    if (!formFields.lastName.trim())
      errors.lastName = "Last name is required";

    if (!formFields.email.includes("@"))
      errors.email = "Invalid email address";

    if (formFields.mobileNo.length !== 11)
      errors.mobileNo = "Mobile number must be 11 digits";

    if (formFields.password.length < 8)
      errors.password = "Password must be at least 8 characters";

    if (formFields.password !== formFields.confirmPassword)
      errors.confirmPassword = "Passwords do not match";

    setFormErrors(errors);
    setIsActive(Object.keys(errors).length === 0);
  };

  useEffect(() => {
    validateForm();
  }, [formFields]);

  const registerUser = (event) => {
    event.preventDefault();

    fetch(`${process.env.REACT_APP_API_URL}/users/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: formFields.firstName,
        lastName: formFields.lastName,
        email: formFields.email,
        mobileNo: formFields.mobileNo,
        password: formFields.password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {

        if (data.message === 'Registered Successfully') {

          Swal.fire({
            icon: 'success',
            title: 'Registration successful',
            text: 'You can now sign in.',
          }).then(() => {
            navigate('/');
          });

        } else {
          Swal.fire({
            icon: 'error',
            title: 'Registration failed',
            text: data.error || 'Something went wrong.',
          });
        }

      })
      .catch(() => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Server error. Please try again later.',
        });
      });
  };

  return (
    <div className="d-flex justify-content-center align-items-center bg-secondary py-5">
      <Form onSubmit={registerUser} className="bg-white p-4 rounded w-25">

        <h1 className="mb-4 text-center">Create an account</h1>

        <Form.Group className="mb-3">
          <Form.Label>First name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your first name"
            value={formFields.firstName}
            onChange={(e) =>
              setFormFields({ ...formFields, firstName: e.target.value })
            }
          />
          {formErrors.firstName && (
            <small className="text-danger">{formErrors.firstName}</small>
          )}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Last name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your last name"
            value={formFields.lastName}
            onChange={(e) =>
              setFormFields({ ...formFields, lastName: e.target.value })
            }
          />
          {formErrors.lastName && (
            <small className="text-danger">{formErrors.lastName}</small>
          )}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter your email address"
            value={formFields.email}
            onChange={(e) =>
              setFormFields({ ...formFields, email: e.target.value })
            }
          />
          {formErrors.email && (
            <small className="text-danger">{formErrors.email}</small>
          )}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Mobile number</Form.Label>
          <Form.Control
            type="tel"
            placeholder="Enter your mobile number"
            value={formFields.mobileNo}
            onChange={(e) =>
              setFormFields({ ...formFields, mobileNo: e.target.value })
            }
          />
          {formErrors.mobileNo && (
            <small className="text-danger">{formErrors.mobileNo}</small>
          )}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Create a password"
            value={formFields.password}
            onChange={(e) =>
              setFormFields({ ...formFields, password: e.target.value })
            }
          />
          {formErrors.password && (
            <small className="text-danger">{formErrors.password}</small>
          )}
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>Confirm password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm your password"
            value={formFields.confirmPassword}
            onChange={(e) =>
              setFormFields({ ...formFields, confirmPassword: e.target.value })
            }
          />
          {formErrors.confirmPassword && (
            <small className="text-danger">{formErrors.confirmPassword}</small>
          )}
        </Form.Group>

        <Button
          type="submit"
          variant="success"
          disabled={!isActive}
          className="w-100"
        >
          Sign up
        </Button>

        <div className="text-center mt-3">
          <small>
            Already have an account? <Link to="/">Sign in</Link>
          </small>
        </div>

      </Form>
    </div>
  );
}
