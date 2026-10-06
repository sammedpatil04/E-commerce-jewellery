import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import CartModal from '../components/CartModal';
import AuthModal from '../components/AuthModal';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../api/axios';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [currentCollection, setCurrentCollection] = useState('all');

    // Modal States
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isAuthOpen, setIsAuthOpen] = useState(false);

    useEffect(() => {
        fetchProducts();
        setCategories([
            { name: 'All', slug: 'all' },
            { name: 'Necklaces', slug: 'necklaces' },
            { name: 'Rings', slug: 'rings' },
            { name: 'Earrings', slug: 'earrings' }
        ]);
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await api.get('/products');
            setProducts(res.data);
        } catch (err) {
            console.error("Failed to fetch products", err);
        }
    };

    const openProductModal = (product) => {
        setSelectedProduct(product);
        setIsProductModalOpen(true);
    };

    const closeProductModal = () => {
        setIsProductModalOpen(false);
        setSelectedProduct(null);
    };

    const filteredProducts = currentCollection === 'all'
        ? products.filter(p => p.category_slug !== 'diamond')
        : products.filter(p => p.category_slug === currentCollection);

    const groupedProducts = {};
    filteredProducts.forEach(p => {
        const key = p.category_name || 'Others';
        if (!groupedProducts[key]) groupedProducts[key] = [];
        groupedProducts[key].push(p);
    });

    const diamondProducts = products.filter(p => p.category_slug === 'diamond');

    return (
        <div className="home-page">
            <Navbar
                onOpenAuth={() => setIsAuthOpen(true)}
                onOpenCart={() => setIsCartOpen(true)}
            />

            <Hero />

            <div className="collection-nav" id="collection">
                {categories.map(cat => (
                    <button
                        key={cat.slug}
                        className={`collection-link ${currentCollection === cat.slug ? 'active' : ''}`}
                        onClick={() => setCurrentCollection(cat.slug)}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            <div className="products-section">
                <div id="products-container">
                    {Object.keys(groupedProducts).map(sectionName => (
                        <div key={sectionName}>
                            <h2 className="section-title">{sectionName}</h2>
                            <div className="products-grid">
                                {groupedProducts[sectionName].map(product => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        onClick={openProductModal}
                                        onBuyNow={openProductModal}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {diamondProducts.length > 0 && (
                <div className="products-section" id="diamond">
                    <h2 className="section-title">Diamond Collection</h2>
                    <div className="products-grid" id="diamond-products">
                        {diamondProducts.map(product => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onClick={openProductModal}
                                onBuyNow={openProductModal}
                            />
                        ))}
                    </div>
                </div>
            )}

            <Footer />

            <ProductModal
                product={selectedProduct}
                isOpen={isProductModalOpen}
                onClose={closeProductModal}
                onOpenAuth={() => setIsAuthOpen(true)}
            />

            <CartModal
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                onOpenAuth={() => setIsAuthOpen(true)}
            />

            <AuthModal
                isOpen={isAuthOpen}
                onClose={() => setIsAuthOpen(false)}
            />
        </div>
    );
};

export default Home;
