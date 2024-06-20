import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "./CartApi";
import { ApiContext } from "./Api";
import { AuthContext } from "./Auth";

function Cart() {
  const { user } = useContext(AuthContext);
  const { products, isLoading } = useContext(ApiContext); // Use ApiContext
  const {
    cartItems,
    removeFromCart,
    updateCartItemQuantity,
    cartTotal,
    clearCart,
    checkout,
  } = useContext(CartContext);

  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    await checkout(); // Call the checkout function from the context
    setIsCheckingOut(false);
  };

  if (!user) {
    return <p className="text-center text-gray-500 mt-10">Please log in to view your cart</p>; 
  } else if (isLoading) { 
    return <p className="text-center text-gray-500 mt-10">Loading cart items...</p>;
  } else if (cartItems.length === 0) {
    return <p className="text-center text-gray-500 mt-10">Your cart is empty.</p>;
  }

  return (
    <div className="container mx-auto mt-10 bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold mb-4">Your Shopping Cart</h1>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {/* Loop through cartItems and find the corresponding product */}
            {cartItems.map((item, index) => (
                <tr key={index}>
                  <td>
                    <div className="flex items-center space-x-3">
                      <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12">
                          <img src={item.image} alt={item.title} />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">{item.title}</div>
                      </div>
                    </div>
                  </td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>
                    <input
                      type="number"
                      min={1} 
                      value={item.quantity}
                      onChange={(e) => {
                        let newQuantity = parseInt(e.target.value);
                        if (isNaN(newQuantity) || newQuantity < 1) {
                          newQuantity = 1; 
                        }
                        updateCartItemQuantity(
                          item.id,
                          newQuantity
                        );
                      }}
                      className="w-16 input input-bordered"
                    />
                  </td>
                  <td>${(item.quantity * item.price).toFixed(2)}</td>
                  <th>
                    <button
                      className="btn btn-error btn-sm"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </button>
                  </th>
                </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Summary */}
      <div className="mt-8 text-right">
        <p className="text-lg font-semibold">Total: ${cartTotal.toFixed(2)}</p>
        <button
          className={`btn btn-primary mt-4 ${isCheckingOut ? "loading" : ""}`}
          onClick={handleCheckout}
          disabled={isCheckingOut}
        >
          {isCheckingOut ? "Checking Out..." : "Proceed to Checkout"}
        </button>
      </div>

      <Link to="/">
        <button className="btn btn-secondary">Back to Home</button>
      </Link>
    </div>
  );
}

export default Cart;