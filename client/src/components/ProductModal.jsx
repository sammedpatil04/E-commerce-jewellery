import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Button from './ui/Button';
import Card from './ui/Card';


const ProductModal = ({ product, isOpen, onClose, onOpenAuth }) => {
    const { addToCart } = useCart();
    const { user } = useAuth();

    if (!isOpen || !product) return null;

    const handleAddToCart = () => {
        if (!user) {
            alert("Please login to add items to cart");
            onClose();
            onOpenAuth();
            return;
        }
        addToCart(product);
        alert("Product added to cart!");
        onClose();
    };

    return (
        <div className="modal" style={{ display: 'flex', padding: '20px' }}>
            <Card className="modal-content" style={{ maxWidth: '850px', padding: '0', overflow: 'hidden', display: 'flex', flexWrap: 'wrap', position: 'relative' }}>
                <span className="close-modal" onClick={onClose} style={{ top: '15px', right: '15px', position: 'absolute', zIndex: 10, background: 'rgba(255,255,255,0.9)', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', cursor: 'pointer', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>&times;</span>
                
                <div style={{ flex: '1 1 300px', minHeight: '350px' }}>
                    <img src={product.image_url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                
                <div style={{ flex: '1 1 300px', padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', marginBottom: '15px', color: '#111' }}>{product.name}</h2>
                    <p style={{ color: '#666', lineHeight: '1.6', marginBottom: '25px', fontSize: '15px' }}>{product.description}</p>
                    
                    {product.is_featured && (
                        <div style={{ marginBottom: '20px', display: 'inline-block', background: '#f8f8f8', padding: '6px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: '600', color: '#333', border: '1px solid #eee' }}>
                            ✨ Featured Collection
                        </div>
                    )}
                    
                    <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '24px', fontWeight: '700', color: '#d4af37', marginBottom: '30px' }}>
                        ₹{Number(product.price).toLocaleString()}
                    </div>
                    
                    <Button variant="primary" style={{ width: '100%', padding: '16px' }} onClick={handleAddToCart}>
                        Add to Cart
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default ProductModal;
