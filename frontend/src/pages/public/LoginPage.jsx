import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import './Auth.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('Email dan password wajib diisi');
      return;
    }

    setIsLoading(true);
    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      if (result.role === 'Admin') navigate('/admin/dashboard');
      else if (result.role === 'Seller') navigate('/seller/dashboard');
      else navigate('/');
    } else {
      setError(result.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <Card glass padding="lg" className="auth-card fade-in">
          <div className="auth-header">
            <h2 className="auth-title">Selamat Datang Kembali</h2>
            <p className="auth-subtitle">Login untuk mengakses akun Tokoku Anda</p>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="nama@email.com"
              value={formData.email}
              onChange={handleChange}
              icon={FiMail}
              error={error && !formData.email ? 'Email wajib diisi' : ''}
            />
            
            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              icon={FiLock}
              error={error && !formData.password ? 'Password wajib diisi' : ''}
            />
            
            <div className="auth-forgot">
              <Link to="/forgot-password">Lupa password?</Link>
            </div>

            <Button 
              type="submit" 
              variant="primary" 
              fullWidth 
              size="lg"
              isLoading={isLoading}
              className="mt-4"
            >
              Login
            </Button>
          </form>

          <div className="auth-footer">
            <p>
              Belum punya akun? <Link to="/register" className="auth-link">Daftar sekarang</Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
