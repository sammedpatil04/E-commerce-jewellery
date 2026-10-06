import { useState, useEffect } from 'react';
import api from '../api/axios';

const Hero = () => {
    const [goldRate, setGoldRate] = useState('₹6,750/gram');

    useEffect(() => {
        const fetchRate = async () => {
            try {
                const res = await api.get('/products/rates/live-gold');
                if (res.data && res.data.gold_22k) {
                    setGoldRate(`₹${Number(res.data.gold_22k).toLocaleString('en-IN')}/gram`);
                }
            } catch (err) {
                // fallback to default
            }
        };
        fetchRate();
    }, []);

    return (
        <section className="hero" id="home">
            <div className="hero-content">
                <div className="hero-text">
                    <h1>Timeless Elegance</h1>
                    <p>Discover our exquisite collection of handcrafted jewellery, designed for the modern connoisseur.</p>
                </div>
            </div>
            <div className="hero-bottom-left">
                <div className="rate-box">
                    <div className="rate-item">
                        <span className="rate-label">LIVE GOLD RATE (22K)</span>
                        <span className="rate-value" id="gold-rate">{goldRate}</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
