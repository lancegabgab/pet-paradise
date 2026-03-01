import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import SearchByName from './SearchByName';
import SearchByPrice from './SearchByPrice';
import NoImage from '../images/NoImage.jpg';

import {
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Typography,
  Button,
  Grid,
  CircularProgress,
  Alert,
  Container
} from '@mui/material';

export default function UserView() {
  const [activeProducts, setActiveProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [error, setError] = useState(null);

  const fetchActiveProducts = async () => {
    setLoadingProducts(true);
    setError(null);

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/products/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access')}`
        }
      });

      const data = await res.json();
      if (Array.isArray(data)) {
        setActiveProducts(data);
      } else {
        setError('Invalid response structure');
      }
    } catch (err) {
      setError('Error fetching products');
    } finally {
      setLoadingProducts(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    setAddingToCart(true);

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/cart/add-to-cart`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('access')}`
          },
          body: JSON.stringify({ productId, quantity })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to add to cart');
      }

      Swal.fire({
        icon: 'success',
        title: 'Added to Cart!',
        timer: 1200,
        showConfirmButton: false
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.message
      });
    } finally {
      setAddingToCart(false);
    }
  };

  useEffect(() => {
    fetchActiveProducts();
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Products
      </Typography>

      {loadingProducts && (
        <Grid container justifyContent="center" sx={{ mt: 4 }}>
          <CircularProgress />
        </Grid>
      )}

      {error && <Alert severity="error">{error}</Alert>}

      {!loadingProducts && !error && (
        <Grid container spacing={3}>
          {activeProducts.map(product => (
            <Grid item xs={12} sm={6} md={4} key={product._id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: '0.3s',
                  '&:hover': { boxShadow: 6 }
                }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {product.name}
                  </Typography>
                  <CardMedia
                    component="img"
                    height="180"
                    image={product.image ? product.image : NoImage}
                  />
                  {/* <Typography variant="body2" color="text.secondary">
                    {product.description}
                  </Typography> */}

                  <Typography
                    variant="h6"
                    color="primary"
                    sx={{ mt: 2 }}
                  >
                    ₱{product.price}
                  </Typography>
                </CardContent>

                <CardActions>
                  <Button
                    fullWidth
                    variant="contained"
                    disabled={addingToCart}
                    onClick={() => addToCart(product._id)}
                  >
                    {addingToCart ? 'Adding...' : 'Add to Cart'}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {!loadingProducts && !error && activeProducts.length === 0 && (
        <Alert severity="info">No products found</Alert>
      )}
    </Container>
  );
}
