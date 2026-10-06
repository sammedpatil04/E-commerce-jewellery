import { useEffect } from 'react';

const Toast = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const bgColors = {
        success: '#1A1A1A',
        error: '#D32F2F',
        info: '#333333'
    };

    const iconColors = {
        success: '#D4AF37',
        error: '#FFFFFF',
        info: '#FFFFFF'
    };

    return (
        <div style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: bgColors[type] || bgColors.info,
            color: 'white',
            padding: '12px 30px',
            borderRadius: '4px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            zIndex: 3000,
            minWidth: '300px',
            justifyContent: 'center',
            animation: 'slideUp 0.4s ease-out',
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '14px',
            letterSpacing: '0.5px'
        }}>
            <span style={{ color: iconColors[type], fontSize: '18px' }}>
                {type === 'success' ? '✦' : type === 'error' ? '⚠' : 'ℹ'}
            </span>
            {message}
        </div>
    );
};

export default Toast;
