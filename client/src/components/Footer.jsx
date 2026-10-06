import { useState } from 'react';

const Footer = () => {

    return (
        <footer id="contact" style={{ background: '#111', color: '#fff', padding: '60px 40px' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '30px' }}>
                
                {/* About Us Section */}
                <div>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', color: '#fff', marginBottom: '20px' }}>
                        About Us
                    </h3>
                    <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '14px', color: '#888', lineHeight: '1.8' }}>
                        Divine Jewels offers the finest selection of handcrafted jewelry with premium quality metals and stones. We are committed to bringing you timeless elegance.<br/>
                        © 2026 Divine Jewels. All rights reserved.
                    </p>
                </div>
                
                {/* Contact Us Section */}
                <div>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', color: '#fff', marginBottom: '20px' }}>
                        Contact Us
                    </h3>
                    <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '14px', color: '#888', lineHeight: '1.8' }}>
                        Email: info@divinejewels.com<br/>
                        Phone: +91 98765 43210<br/>
                        Address: 123 Jewelry Street, Mumbai, India
                    </p>
                </div>

                {/* Feedback Form (Preserved from earlier request) */}
                <div style={{ marginTop: '30px', paddingTop: '30px', borderTop: '1px solid #333' }}>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', color: '#fff', marginBottom: '20px' }}>
                        Feedback Form
                    </h3>
                    <div className="feedback-container" style={{ width: '100%', maxWidth: '600px' }}>
                        <form action="https://api.web3forms.com/submit" method="POST">
                            <input type="hidden" name="access_key" value="23e8c0bf-98cc-4e13-b169-2edeb57ccbe3" />
                            <input type="hidden" name="redirect" value="http://localhost:5173" />
                            <input type="hidden" name="subject" value="New Feedback for Divine Jewels" />

                            <input type="text" name="name" className="feedback-input" placeholder="Your Name" required />
                            <input type="email" name="email" className="feedback-input" placeholder="Your Email" required />
                            <input type="text" name="message" className="feedback-input" placeholder="Tell us what you think..." required />
                            
                            <button type="submit" className="btn-gold" style={{ marginTop: '20px', width: 'auto', padding: '15px 40px' }}>
                                SEND MESSAGE
                            </button>
                        </form>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
