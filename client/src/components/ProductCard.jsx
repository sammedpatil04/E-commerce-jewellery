import { useAuth } from '../context/AuthContext';

const ProductCard = ({ product, onClick }) => {
    return (
        <div className="product-card" onClick={() => onClick(product)}>
            <div className="product-image-container">
                <img className="product-image" src={product.image_url} alt={product.name} />
                <div className="quick-view-overlay">
                    QUICK VIEW
                </div>
            </div>
            <div className="product-info">
                <div className="product-name">{product.name}</div>
                <div className="product-price">
                    ₹{product.current_price ? Number(product.current_price).toLocaleString() : Number(product.price).toLocaleString()}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
