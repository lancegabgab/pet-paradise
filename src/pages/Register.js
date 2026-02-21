import { Form, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../style.css';
import 'react-bootstrap';

export default function Register() {
  const [formFields, setFormFields] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobileNo: '',
    password: '',
    confirmPassword: '',
  });

  const [formErrors, setFormErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobileNo: '',
    password: '',
    confirmPassword: '',
  });

  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      firstName: '',
      lastName: '',
      email: '',
      mobileNo: '',
      password: '',
      confirmPassword: '',
    }));

    if (
      formFields.firstName !== '' &&
      formFields.lastName !== '' &&
      formFields.email !== '' &&
      formFields.mobileNo !== '' &&
      formFields.password !== '' &&
      formFields.confirmPassword !== ''
    ) {
      if (!formFields.email.includes('@')) {
        setFormErrors((prevErrors) => ({ ...prevErrors, email: 'Email must contain @' }));
      }

      if (formFields.mobileNo.length !== 11) {
        setFormErrors((prevErrors) => ({ ...prevErrors, mobileNo: 'Mobile number must be 11 digits' }));
      }

      if (formFields.password.length < 8) {
        setFormErrors((prevErrors) => ({ ...prevErrors, password: 'Password must be at least 8 characters' }));
      }

      if (formFields.password !== formFields.confirmPassword) {
        setFormErrors((prevErrors) => ({ ...prevErrors, confirmPassword: 'Passwords must match' }));
      } else {
        setFormErrors((prevErrors) => ({ ...prevErrors, confirmPassword: '' }));
      }

      if (
        formFields.email.includes('@') &&
        formFields.mobileNo.length === 11 &&
        formFields.password.length >= 8 &&
        formFields.password === formFields.confirmPassword
      ) {
        setIsActive(true);
      } else {
        setIsActive(false);
      }
    } else {
      setIsActive(false);

      if (formFields.firstName === '') {
        setFormErrors((prevErrors) => ({ ...prevErrors, firstName: 'First name cannot be empty' }));
      }

      if (formFields.lastName === '') {
        setFormErrors((prevErrors) => ({ ...prevErrors, lastName: 'Last name cannot be empty' }));
      }

      if (formFields.email === '') {
        setFormErrors((prevErrors) => ({ ...prevErrors, email: 'Email cannot be empty' }));
      }

      if (formFields.mobileNo === '') {
        setFormErrors((prevErrors) => ({ ...prevErrors, mobileNo: 'Mobile number cannot be empty' }));
      }

      if (formFields.password === '') {
        setFormErrors((prevErrors) => ({ ...prevErrors, password: 'Password cannot be empty' }));
      }
    }
  }, [formFields.firstName, formFields.lastName, formFields.email, formFields.mobileNo, formFields.password, formFields.confirmPassword]);

  function registerUser(event) {
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
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then((data) => {
        if (data.message === 'Registered Successfully') {
          setFormFields({
            firstName: '',
            lastName: '',
            email: '',
            mobileNo: '',
            password: '',
            confirmPassword: '',
          });

          // SweetAlert2 for success
          Swal.fire({
            icon: 'success',
            title: 'Registration Successful',
            text: 'You have been successfully registered!',
          });
        } else {
          // SweetAlert2 for other registration errors
          Swal.fire({
            icon: 'error',
            title: 'Registration Failed',
            text: 'Something went wrong during registration. Please try again.',
          });
        }
      })
      .catch((error) => {
        console.error('Error during registration:', error);

        // SweetAlert2 for generic error
        Swal.fire({
          icon: 'error',
          title: 'Error during registration',
          text: 'An error occurred during registration. Please try again later.',
        });
      });
  }

  return (
    <div className="d-flex justify-content-center align-items-center bg-secondary py-4 ">
      <Form onSubmit={(event) => registerUser(event)} className="bg-white p-3 rounded w-25 font-details">
        <h1 className="mb-3 text-center font-highlight">Register</h1>

        <Form.Group className="mb-2">
          <Form.Label>First Name: </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter First Name"
            required
            onChange={(event) => setFormFields((prevFields) => ({ ...prevFields, firstName: event.target.value }))}
            className="rounded-0 font-details"
          />
          {formErrors.firstName && <div className="text-danger">{formErrors.firstName}</div>}
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Last Name: </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Last Name"
            required
            onChange={(event) => setFormFields((prevFields) => ({ ...prevFields, lastName: event.target.value }))}
            className="rounded-0 font-details"
          />
          {formErrors.lastName && <div className="text-danger">{formErrors.lastName}</div>}
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Email: </Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter Email"
            required
            onChange={(event) => setFormFields((prevFields) => ({ ...prevFields, email: event.target.value }))}
            className="rounded-0 font-details"
          />
          {formErrors.email && <div className="text-danger">{formErrors.email}</div>}
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>MobileNo: </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter MobileNo"
            required
            onChange={(event) => setFormFields((prevFields) => ({ ...prevFields, mobileNo: event.target.value }))}
            className="rounded-0 font-details"
          />
          {formErrors.mobileNo && <div className="text-danger">{formErrors.mobileNo}</div>}
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Password: </Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter Password"
            required
            onChange={(event) => setFormFields((prevFields) => ({ ...prevFields, password: event.target.value }))}
            className="rounded-0 font-details"
          />
          {formErrors.password && <div className="text-danger">{formErrors.password}</div>}
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Confirm Password: </Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm Password"
            required
            onChange={(event) => setFormFields((prevFields) => ({ ...prevFields, confirmPassword: event.target.value }))}
            className="rounded-0 font-details"
          />
          {formErrors.confirmPassword && <div className="text-danger">{formErrors.confirmPassword}</div>}
        </Form.Group>

        {isActive === true ? (
          <Button
            type="submit"
            id="submitBtn"
            className="btn btn-success border rounded-0 font-details"
          >
            Submit
          </Button>
        ) : (
          <Button
            variant="danger"
            type="submit"
            id="submitBtn"
            disabled
            className="font-details"
          >
            Please complete the form!
          </Button>
        )}
        <div className="text-center mt-3">
          <small>
            Already have an account? <Link to="/">Login here</Link>
          </small>
        </div>
      </Form>
    </div>
  );
}
