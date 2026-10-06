import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div>Loading...</div>;
    if (!user || user.role !== 'admin') return <Navigate to="/" />;
    return children;
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <CartProvider>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/admin/*" element={
                            <AdminRoute>
                                <AdminDashboard />
                            </AdminRoute>
                        } />
                    </Routes>
                </CartProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;
