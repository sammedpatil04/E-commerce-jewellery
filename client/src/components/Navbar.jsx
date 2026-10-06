import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ onOpenAuth, onOpenCart }) => {
    const { cart } = useCart();
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const scrollToSection = (id) => {
        const section = document.getElementById(id);
        if (section) section.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <header>
            <nav>
                <div className="logo" onClick={() => navigate('/')} style={{cursor: 'pointer'}}>Divine Jewels</div>
                <ul className="nav-links">
                    <li><a onClick={() => scrollToSection('home')}>HOME</a></li>
                    <li><a onClick={() => scrollToSection('collection')}>COLLECTIONS</a></li>
                    <li><a onClick={() => scrollToSection('diamond')}>DIAMONDS</a></li>
                    <li><a onClick={() => scrollToSection('contact')}>CONTACT</a></li>
                </ul>
                <div className="nav-right">
                    <button className="nav-action-btn" onClick={onOpenCart}>
                        CART ({cart.length})
                    </button>

                    {user ? (
                        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                            {user.role === 'admin' && (
                                <button
                                    className="nav-action-btn"
                                    onClick={() => navigate('/admin')}
                                >
                                    ADMIN
                                </button>
                            )}
                            <button
                                className="nav-action-btn"
                                onClick={logout}
                            >
                                LOGOUT
                            </button>
                        </div>
                    ) : (
                        <button className="nav-action-btn" onClick={onOpenAuth}>
                            LOGIN
                        </button>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
