import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import CheckoutForm from './CheckoutForm';
import Button from './ui/Button';
import Card from './ui/Card';

const CartModal = ({ isOpen, onClose, onOpenAuth }) => {
    const { cart, removeFromCart, total, clearCart } = useCart();
    const { user } = useAuth();
    const [isCheckout, setIsCheckout] = useState(false);

    if (!isOpen) return null;

    const handleClose = () => {
        setIsCheckout(false);
        onClose();
    };

    const handleProceed = () => {
        if (!user) {
            alert("Please login to proceed with checkout");
            handleClose();
            onOpenAuth();
            return;
        }
        setIsCheckout(true);
    };

    const handleConfirmOrder = async (formData) => {
        if (cart.length === 0) return;

        try {
            const payload = {
                items: cart.map(i => ({ productId: i.id, quantity: i.quantity })),
                shippingDetails: formData
            };

            const res = await api.post('/orders', payload);

            if (res.status === 201) {
                alert("Order placed successfully! ID: " + res.data.orderId);
                clearCart();
                handleClose();
            }
        } catch (e) {
            alert("Checkout failed: " + (e.response?.data?.message || e.message));
        }
    };

    return (
        <div className="modal" style={{ display: 'flex' }}>
            <Card className="modal-content" style={{ maxWidth: isCheckout ? '500px' : '600px', padding: '40px', position: 'relative' }}>
                <span className="close-modal" onClick={handleClose} style={{ top: '15px', right: '15px', position: 'absolute' }}>&times;</span>
                
                {isCheckout ? (
                    <CheckoutForm 
                        total={total} 
                        onConfirm={handleConfirmOrder} 
                        onCancel={() => setIsCheckout(false)} 
                    />
                ) : (
                    <>
                        <h2 style={{ fontFamily: "'Playfair Display', serif", marginBottom: '20px' }}>Shopping Cart</h2>
                        <div id="cart-items" style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '10px' }}>
                            {cart.length === 0 ? (
                                <p style={{ textAlign: 'center', padding: '40px', color: '#666' }}>Your cart is empty</p>
                            ) : (
                                cart.map((item, index) => (
                                    <div className="cart-item" key={`${item.id}-${index}`} style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
                                        <img src={item.image_url} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} alt={item.name} />
                                        <div style={{ flex: 1 }}>
                                            <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: '16px', margin: 0 }}>{item.name}</h4>
                                            <p style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600, marginTop: '5px', color: '#d4af37' }}>
                                                ₹{Number(item.price).toLocaleString()} x {item.quantity}
                                            </p>
                                        </div>
                                        <Button variant="danger" style={{ padding: '6px 12px', fontSize: '11px' }} onClick={() => removeFromCart(item.id)}>Remove</Button>
                                    </div>
                                ))
                            )}
                        </div>
                        <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
                            <h3 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '18px', display: 'flex', justifyContent: 'space-between' }}>
                                Total: <span>₹{total.toLocaleString()}</span>
                            </h3>
                            <Button
                                variant="primary"
                                style={{ marginTop: '20px', width: '100%' }}
                                onClick={handleProceed}
                                disabled={cart.length === 0}
                            >
                                Proceed to Checkout
                            </Button>
                        </div>
                    </>
                )}
            </Card>
        </div>
    );
};

export default CartModal;
