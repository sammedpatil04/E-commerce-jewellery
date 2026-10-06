import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Button from './ui/Button';
import Input from './ui/Input';
import Card from './ui/Card';

const AuthModal = ({ isOpen, onClose }) => {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const { login, register } = useAuth();

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        let res;
        if (isLoginMode) {
            res = await login(email, password);
        } else {
            res = await register(name, email, password);
        }

        if (res.success) {
            onClose();
            alert(isLoginMode ? "Login successful!" : "Account created successfully!");
        } else {
            alert(res.message);
        }
    };

    return (
        <div className="modal" style={{ display: 'flex' }}>
            <Card className="modal-content" style={{ maxWidth: '400px', padding: '40px', position: 'relative' }}>
                <span className="close-modal" onClick={onClose} style={{ top: '15px', right: '15px', position: 'absolute' }}>&times;</span>
                <h2 style={{ textAlign: 'center', marginBottom: '30px', fontFamily: "'Playfair Display', serif" }}>
                    {isLoginMode ? 'Login' : 'Join Divine Jewels'}
                </h2>

                <form onSubmit={handleSubmit}>
                    {!isLoginMode && (
                        <Input
                            label="FULL NAME"
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    )}
                    <Input
                        label="EMAIL ADDRESS"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Input
                        label="PASSWORD"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ marginBottom: '10px' }}
                    />
                    
                    <Button type="submit" variant="primary" style={{ width: '100%', marginTop: '15px' }}>
                        {isLoginMode ? 'LOGIN' : 'CREATE ACCOUNT'}
                    </Button>
                </form>

                <p style={{ marginTop: '25px', textAlign: 'center', fontFamily: "'Montserrat', sans-serif", fontSize: '12px' }}>
                    <a onClick={() => setIsLoginMode(!isLoginMode)} style={{ color: '#666', cursor: 'pointer', textDecoration: 'underline' }}>
                        {isLoginMode ? "Don't have an account? Sign up" : "Already have an account? Login"}
                    </a>
                </p>
            </Card>
        </div>
    );
};

export default AuthModal;
