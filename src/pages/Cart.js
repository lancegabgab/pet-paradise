import { useContext, useEffect, useState } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Box,
  Divider,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import UserContext from "../UserContext";
import Swal from "sweetalert2";
import NoImage from '../images/NoImage.jpg';

const Cart = () => {
  const { user } = useContext(UserContext);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUserCart = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/cart/get-cart`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        }
      );

      const { cart: fetchedCart } = await response.json();

      if (Array.isArray(fetchedCart.items)) {
        setCart(fetchedCart.items);
      } else {
        setCart([]);
      }
    } catch (err) {
      setError("Failed to fetch cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserCart();
  }, [user]);

  const handleEditQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;

    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const handleRemoveProduct = async (productId) => {
    await fetch(
      `${process.env.REACT_APP_API_URL}/cart/${productId}/remove-from-cart`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      }
    );

    setCart((prev) => prev.filter((item) => item.productId !== productId));

    Swal.fire("Removed!", "Item removed from cart", "success");
  };

  const handleClearCart = async () => {
    await fetch(`${process.env.REACT_APP_API_URL}/cart/clear-cart`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
    });

    setCart([]);
    Swal.fire("Cleared!", "Cart has been cleared", "success");
  };

  const handleCheckout = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/order/checkout`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
        body: JSON.stringify({ productsOrdered: cart }),
      }
    );

    if (response.ok) {
      setCart([]);
      Swal.fire("Success!", "Order placed successfully!", "success");
    } else {
      Swal.fire("Error", "Checkout failed", "error");
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Your Shopping Cart
      </Typography>

      {loading && (
        <Box textAlign="center" mt={2}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Typography color="error" align="center">
          {error}
        </Typography>
      )}

      <Grid container spacing={4} mt={2}>
        <Grid item xs={12} md={8}>
          {cart.length === 0 ? (
            <Card>
              <CardContent>
                <Typography align="center">
                  Your cart is empty.
                </Typography>
              </CardContent>
            </Card>
          ) : (
            <>
              {cart.map((item) => (
                <Card key={item.productId} sx={{ mb: 3 }}>
                  <CardContent>
                    <Grid container alignItems="center" spacing={2}>
                      <Grid item xs={12} md={4}>
                        <Typography fontWeight="bold">
                          {item.productId}
                        </Typography>
                        <Typography color="text.secondary">
                          ₱{item.price.toLocaleString("en-PH")}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <Box display="flex" alignItems="center">
                          <IconButton
                            onClick={() =>
                              handleEditQuantity(
                                item.productId,
                                item.quantity - 1
                              )
                            }
                          >
                            <RemoveIcon />
                          </IconButton>

                          <Typography>{item.quantity}</Typography>

                          <IconButton
                            onClick={() =>
                              handleEditQuantity(
                                item.productId,
                                item.quantity + 1
                              )
                            }
                          >
                            <AddIcon />
                          </IconButton>
                        </Box>
                      </Grid>

                      <Grid item xs={12} md={3}>
                        <Typography>
                          ₱
                          {(item.price * item.quantity).toLocaleString(
                            "en-PH"
                          )}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={1}>
                        <IconButton
                          color="error"
                          onClick={() =>
                            handleRemoveProduct(item.productId)
                          }
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))}

              <Button
                variant="outlined"
                color="error"
                onClick={handleClearCart}
              >
                Clear Cart
              </Button>
            </>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>

              <Divider sx={{ mb: 2 }} />

              <Box display="flex" justifyContent="space-between">
                <Typography>Total ({cart.length} items)</Typography>
                <Typography fontWeight="bold">
                  ₱{calculateTotal().toLocaleString("en-PH")}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={handleCheckout}
                disabled={cart.length === 0}
              >
                Proceed to Checkout
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Cart;
