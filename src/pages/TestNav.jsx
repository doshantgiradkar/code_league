// Test navigation directly
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function TestNav() {
    const navigate = useNavigate();

    useEffect(() => {
        console.log('Test nav loaded');
        setTimeout(() => {
            console.log('Navigating to dashboard...');
            navigate('/dashboard');
        }, 2000);
    }, [navigate]);

    return <div style={{ color: 'white', padding: '20px' }}>Testing navigation... Check console</div>;
}
