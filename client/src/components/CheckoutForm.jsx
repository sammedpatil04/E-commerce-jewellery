import { useState } from 'react';
import Input from './ui/Input';
import Textarea from './ui/Textarea';
import Button from './ui/Button';

const CheckoutForm = ({ total, onConfirm, onCancel }) => {
    const [formData, setFormData] = useState({
        customer_name: '',
        shipping_address: '',
        email: '',
        contact_number: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onConfirm(formData);
    };

    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 7);
    const formattedDate = deliveryDate.toLocaleDateString('en-IN', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    return (
        <div className="checkout-form">
            <h3 style={{ fontSize: '24px', marginBottom: '25px', fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>Checkout Details</h3>
            <form onSubmit={handleSubmit}>
                <Input
                    label="FULL NAME"
                    type="text"
                    name="customer_name"
                    required
                    value={formData.customer_name}
                    onChange={handleChange}
                    placeholder="e.g. John Doe"
                />

                <Input
                    label="EMAIL ADDRESS"
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. john@example.com"
                />

                <Input
                    label="MOBILE NUMBER"
                    type="tel"
                    name="contact_number"
                    required
                    value={formData.contact_number}
                    onChange={handleChange}
                    placeholder="e.g. 9876543210"
                    pattern="[0-9]{10}"
                />

                <Textarea
                    label="SHIPPING ADDRESS"
                    name="shipping_address"
                    required
                    value={formData.shipping_address}
                    onChange={handleChange}
                    placeholder="Enter your complete delivery address..."
                    rows="3"
                />

                <div className="order-summary-box">
                    <p>
                        <span>Payment Method</span>
                        <span>Cash on Delivery</span>
                    </p>
                    <p>
                        <span>Delivery Estimate</span>
                        <span style={{ color: '#27ae60' }}>{formattedDate}</span>
                    </p>
                    <p className="total-row">
                        <span>Total to Pay</span>
                        <span>₹{total.toLocaleString()}</span>
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '15px' }}>
                    <Button type="button" variant="secondary" onClick={onCancel} style={{ flex: 1 }}>
                        BACK
                    </Button>
                    <Button type="submit" variant="primary" style={{ flex: 1 }}>
                        CONFIRM ORDER
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default CheckoutForm;
