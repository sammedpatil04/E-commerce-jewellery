import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Package, ShoppingBag, LogOut, BarChart2 } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Textarea from '../components/ui/Textarea';
import Card from '../components/ui/Card';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('products');
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    
    // Reports State
    const [reportTab, setReportTab] = useState('customers');
    const [reportData, setReportData] = useState([]);

    // Form State
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({
        name: '', description: '', price: '', image_url: '', category_id: 1, is_featured: false, weight_grams: '', material_type: 'gold', diamond_carats: ''
    });

    const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (activeTab === 'products') fetchProducts();
        if (activeTab === 'orders') fetchOrders();
        if (activeTab === 'reports') fetchReportData(reportTab);
    }, [activeTab, reportTab]);

    const fetchProducts = async () => {
        const res = await api.get('/products');
        setProducts(res.data);
    };

    const fetchOrders = async () => {
        try {
            const res = await api.get('/admin/orders');
            setOrders(res.data);
        } catch (err) {
            alert("Failed to fetch orders");
        }
    };

    const fetchReportData = async (tab) => {
        try {
            const res = await api.get(`/admin/reports/${tab}`);
            setReportData(res.data);
        } catch (err) {
            alert("Failed to fetch report data");
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...formData, price: 0 };
            if (isEditing) {
                await api.put(`/admin/products/${editId}`, payload);
            } else {
                await api.post('/admin/products', payload);
            }
            alert(isEditing ? 'Product Updated' : 'Product Created');
            setIsEditing(false);
            setFormData({ name: '', description: '', price: '', image_url: '', category_id: 1, is_featured: false, weight_grams: '', material_type: 'gold', diamond_carats: '' });
            fetchProducts();
        } catch (err) {
            alert('Error saving product');
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Delete this product?')) {
            await api.delete(`/admin/products/${id}`);
            fetchProducts();
        }
    };

    const handleEdit = (p) => {
        setIsEditing(true);
        setEditId(p.id);
        setFormData({
            name: p.name,
            description: p.description,
            price: p.price,
            image_url: p.image_url,
            category_id: p.category_id,
            is_featured: p.is_featured,
            weight_grams: p.weight_grams || '',
            material_type: p.material_type || 'gold',
            diamond_carats: p.diamond_carats || ''
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleOrderStatus = async (id, status) => {
        await api.put(`/admin/orders/${id}`, { status });
        fetchOrders();
    };

    const renderReportContent = () => {
        if (!reportData.length) return <p style={{ padding: '20px', color: '#666' }}>No data available for this report.</p>;

        switch (reportTab) {
            case 'customers':
                return (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f8f9fa', textAlign: 'left', borderBottom: '2px solid #eee' }}>
                                <th style={{ padding: '15px' }}>Name</th>
                                <th style={{ padding: '15px' }}>Email</th>
                                <th style={{ padding: '15px' }}>Joined Date</th>
                                <th style={{ padding: '15px' }}>Total Orders</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reportData.map((item, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '15px' }}>{item.name}</td>
                                    <td style={{ padding: '15px' }}>{item.email}</td>
                                    <td style={{ padding: '15px' }}>{new Date(item.created_at).toLocaleDateString()}</td>
                                    <td style={{ padding: '15px' }}>{item.total_orders}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                );
            case 'orders-daily':
                return (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f8f9fa', textAlign: 'left', borderBottom: '2px solid #eee' }}>
                                <th style={{ padding: '15px' }}>Date</th>
                                <th style={{ padding: '15px' }}>Sold Product</th>
                                <th style={{ padding: '15px' }}>Quantity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reportData.map((item, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '15px' }}>{item.date ? new Date(item.date).toLocaleDateString() : 'N/A'}</td>
                                    <td style={{ padding: '15px' }}>{item.product_name || 'No Products'}</td>
                                    <td style={{ padding: '15px' }}>{item.total_quantity || 0}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                );
            case 'sales-daily':
                return (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f8f9fa', textAlign: 'left', borderBottom: '2px solid #eee' }}>
                                <th style={{ padding: '15px' }}>Date</th>
                                <th style={{ padding: '15px' }}>Total Sales (₹)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reportData.map((item, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '15px' }}>{new Date(item.date).toLocaleDateString()}</td>
                                    <td style={{ padding: '15px' }}>₹{Number(item.total_sales).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                );
            case 'trending':
                return (
                    <div className="products-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
                        {reportData.map((p, i) => (
                            <div key={i} className="product-card">
                                <div style={{ height: '200px', overflow: 'hidden' }}>
                                    <img src={p.image_url} alt={p.name} className="product-image" />
                                </div>
                                <div style={{ padding: '15px' }}>
                                    <h4>{p.name}</h4>
                                    <p style={{ color: '#D4AF37' }}>Sold: {p.total_sold} units</p>
                                </div>
                            </div>
                        ))}
                    </div>
                );
            case 'feedback':
                return (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f8f9fa', textAlign: 'left', borderBottom: '2px solid #eee' }}>
                                <th style={{ padding: '15px' }}>Date</th>
                                <th style={{ padding: '15px' }}>Name</th>
                                <th style={{ padding: '15px' }}>Email</th>
                                <th style={{ padding: '15px' }}>Message</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reportData.map((item, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '15px', whiteSpace: 'nowrap' }}>{new Date(item.created_at).toLocaleDateString()}</td>
                                    <td style={{ padding: '15px' }}>{item.name}</td>
                                    <td style={{ padding: '15px' }}>{item.email}</td>
                                    <td style={{ padding: '15px' }}>{item.message}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                );
            case 'categories':
                const filteredData = reportData.filter(item => {
                    const name = item.name.toLowerCase();
                    return !name.includes('anklet') && !name.includes('pendent') && !name.includes('pendant');
                });
                const diamondItems = filteredData.filter(item => item.name.toLowerCase().includes('diamond'));
                const goldItems = filteredData.filter(item => !item.name.toLowerCase().includes('diamond'));

                const renderTable = (items) => (
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
                        <thead>
                            <tr style={{ background: '#f8f9fa', textAlign: 'left', borderBottom: '2px solid #eee' }}>
                                <th style={{ padding: '15px' }}>Category Name</th>
                                <th style={{ padding: '15px' }}>Total Products</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '15px' }}>{item.name}</td>
                                    <td style={{ padding: '15px' }}>{item.product_count}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                );

                return (
                    <div style={{ padding: '20px' }}>
                        {diamondItems.length > 0 && (
                            <>
                                <h3 style={{ fontSize: '18px', marginBottom: '15px', fontFamily: "'Playfair Display', serif", borderLeft: '4px solid #D4AF37', paddingLeft: '10px' }}>Diamond</h3>
                                {renderTable(diamondItems)}
                            </>
                        )}
                        {goldItems.length > 0 && (
                            <>
                                <h3 style={{ fontSize: '18px', marginBottom: '15px', marginTop: '20px', fontFamily: "'Playfair Display', serif", borderLeft: '4px solid #D4AF37', paddingLeft: '10px' }}>Gold</h3>
                                {renderTable(goldItems)}
                            </>
                        )}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1>Admin Dashboard</h1>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => navigate('/')} className="buy-btn" style={{ background: 'transparent', color: '#333', border: '1px solid #ccc' }}>View Site</button>
                    <button onClick={handleLogout} className="remove-btn" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <button
                    className={`collection-btn ${activeTab === 'products' ? 'active' : ''}`}
                    onClick={() => setActiveTab('products')}
                    style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <Package size={18} /> Products
                </button>
                <button
                    className={`collection-btn ${activeTab === 'orders' ? 'active' : ''}`}
                    onClick={() => setActiveTab('orders')}
                    style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <ShoppingBag size={18} /> Orders
                </button>
                <button
                    className={`collection-btn ${activeTab === 'reports' ? 'active' : ''}`}
                    onClick={() => setActiveTab('reports')}
                    style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <BarChart2 size={18} /> Reports
                </button>
            </div>

            {activeTab === 'products' ? (
                <div>
                    <Card style={{ marginBottom: '40px' }}>
                        <div style={{ marginBottom: '25px', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
                            <h3 style={{ fontSize: '22px', fontWeight: '600', color: '#111' }}>
                                {isEditing ? 'Edit Product' : 'Add New Product'}
                            </h3>
                        </div>
                        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <Input
                                placeholder="Product Name"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                            <Input
                                placeholder="Image URL"
                                value={formData.image_url}
                                onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                                required
                            />
                            <Select
                                options={[
                                    { value: "1", label: "Necklaces" },
                                    { value: "2", label: "Rings" },
                                    { value: "3", label: "Earrings" },
                                    { value: "4", label: "Diamond" },
                                    { value: "5", label: "Bangles" },
                                    { value: "6", label: "Anklets" },
                                    { value: "7", label: "Pendants" },
                                    { value: "8", label: "Bracelets" }
                                ]}
                                value={formData.category_id}
                                onChange={e => setFormData({ ...formData, category_id: e.target.value })}
                            />
                            <Select
                                options={[
                                    { value: "gold", label: "Gold" },
                                    { value: "diamond", label: "Diamond" },
                                    { value: "silver", label: "Silver" },
                                    { value: "platinum", label: "Platinum" }
                                ]}
                                value={formData.material_type}
                                onChange={e => setFormData({ ...formData, material_type: e.target.value })}
                            />
                            <Input
                                type="number" step="0.01"
                                placeholder="Weight (Grams)"
                                value={formData.weight_grams}
                                onChange={e => setFormData({ ...formData, weight_grams: e.target.value })}
                            />
                            <Input
                                type="number" step="0.01"
                                placeholder="Diamond Carats (Optional)"
                                value={formData.diamond_carats}
                                onChange={e => setFormData({ ...formData, diamond_carats: e.target.value })}
                            />

                            <div style={{ gridColumn: '1 / -1' }}>
                                <Textarea
                                    placeholder="Description"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            
                            <div className="ui-checkbox-wrapper" style={{ gridColumn: '1 / -1' }}>
                                <input
                                    type="checkbox"
                                    id="featured-product-checkbox"
                                    checked={formData.is_featured}
                                    onChange={e => setFormData({ ...formData, is_featured: e.target.checked })}
                                />
                                <label htmlFor="featured-product-checkbox" style={{ cursor: 'pointer' }}>Featured Product</label>
                            </div>
                            
                            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '15px', marginTop: '10px' }}>
                                <Button type="submit" variant="primary" style={{ flex: 1 }}>
                                    {isEditing ? 'Update Product' : 'Create Product'}
                                </Button>
                                {isEditing && (
                                    <Button type="button" variant="secondary" onClick={() => { setIsEditing(false); setFormData({ name: '', description: '', price: '', image_url: '', category_id: 1, is_featured: false, weight_grams: '', material_type: 'gold', diamond_carats: '' }); }} style={{ flex: 1 }}>
                                        Cancel Edit
                                    </Button>
                                )}
                            </div>
                        </form>
                    </Card>

                    <div className="products-grid">
                        {products.map(p => (
                            <div key={p.id} className="product-card">
                                <img src={p.image_url} className="product-image" alt={p.name} />
                                <div className="product-info">
                                    <h4>{p.name}</h4>
                                    <p>₹{p.current_price ? Number(p.current_price).toLocaleString() : Number(p.price).toLocaleString()}</p>
                                    <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                                        <button className="buy-btn" onClick={() => handleEdit(p)} style={{ flex: 1, padding: '5px' }}>EDIT</button>
                                        <button className="remove-btn" onClick={() => handleDelete(p.id)} style={{ flex: 1, padding: '5px' }}>Delete</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : activeTab === 'orders' ? (
                <div>
                    <h2>Orders</h2>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                        <thead>
                            <tr style={{ background: '#eee', textAlign: 'left' }}>
                                <th style={{ padding: '10px' }}>ID</th>
                                <th style={{ padding: '10px' }}>User Details</th>
                                <th style={{ padding: '10px' }}>Amount</th>
                                <th style={{ padding: '10px' }}>Status</th>
                                <th style={{ padding: '10px' }}>Date</th>
                                <th style={{ padding: '10px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '10px' }}>#{order.id}</td>
                                    <td style={{ padding: '10px' }}>
                                        <div style={{ fontWeight: '500' }}>{order.user_name}</div>
                                        <div style={{ color: '#666', fontSize: '13px' }}>{order.user_email}</div>    
                                    </td>
                                    <td style={{ padding: '10px' }}>₹{Number(order.total_amount).toLocaleString()}</td>
                                    <td style={{ padding: '10px' }}>
                                        <span style={{
                                            padding: '5px 10px',
                                            borderRadius: '15px',
                                            fontSize: '12px',
                                            fontWeight: '600',
                                            background: order.status === 'completed' || order.status === 'COMPLETED' ? '#d4edda' : '#fff3cd',
                                            color: order.status === 'completed' || order.status === 'COMPLETED' ? '#155724' : '#856404'
                                        }}>
                                            {order.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td style={{ padding: '10px' }}>{new Date(order.created_at).toLocaleDateString()}</td>
                                    <td style={{ padding: '10px' }}>
                                        {order.status !== 'completed' && order.status !== 'COMPLETED' && (
                                            <button
                                                className="buy-btn"
                                                style={{ fontSize: '12px', padding: '5px 10px' }}
                                                onClick={() => handleOrderStatus(order.id, 'completed')}
                                            >
                                                Mark Completed
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div style={{ background: '#fff', borderRadius: '10px', padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '25px', flexWrap: 'wrap' }}>
                        {['customers', 'orders-daily', 'sales-daily', 'trending', 'feedback', 'categories'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setReportTab(tab)}
                                style={{
                                    padding: '8px 20px',
                                    borderRadius: '20px',
                                    border: '1px solid #eee',
                                    background: reportTab === tab ? '#333' : '#fff',
                                    color: reportTab === tab ? '#fff' : '#666',
                                    cursor: 'pointer',
                                    fontWeight: reportTab === tab ? '600' : '400',
                                    textTransform: 'capitalize'
                                }}
                            >
                                {tab.replace('-', ' ')}
                            </button>
                        ))}
                    </div>
                    {renderReportContent()}
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
