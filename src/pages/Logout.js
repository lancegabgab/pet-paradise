import { useNavigate } from 'react-router-dom';
import UserContext from '../UserContext';
import { useContext, useEffect } from 'react';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

export default function Logout() {
  const { unsetUser, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    Swal.fire({
      title: 'Logout',
      text: 'Are you sure you want to logout?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        unsetUser();
        setUser({ id: null, isAdmin: null });

        Swal.fire({
          icon: 'success',
          title: 'Logged Out',
          text: 'You are now logged out',
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          navigate('/');
        });
      } else {
        navigate(-1);
      }
    });
  }, [navigate, setUser, unsetUser]);

  return null; 
}
