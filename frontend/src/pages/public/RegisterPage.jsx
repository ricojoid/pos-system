import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiUser } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import './Auth.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({ 
    fullName: '', 
    email: '', 
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email || !formData.password) {
      setError('Semua field wajib diisi');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Password tidak cocok');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password minimal 6 karakter');
      return;
    }

    setIsLoading(true);
    const result = await register(formData.fullName, formData.email, formData.password);
    
    if (result.success) {
      navigate('/');
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
            <h1 className="auth-title">Buat Akun Baru</h1>
            <p className="auth-subtitle">Daftar sebagai pembeli untuk mulai berbelanja</p>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <Input
              label="Nama Lengkap"
              name="fullName"
              placeholder="John Doe"
              value={formData.fullName}
              onChange={handleChange}
              icon={FiUser}
            />

            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="nama@email.com"
              value={formData.email}
              onChange={handleChange}
              icon={FiMail}
            />
            
            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              icon={FiLock}
            />

            <Input
              label="Konfirmasi Password"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              icon={FiLock}
            />

            <Button 
              type="submit" 
              variant="primary" 
              fullWidth 
              size="lg"
              isLoading={isLoading}
              className="mt-4"
            >
              Daftar
            </Button>
          </form>

          <div className="auth-footer">
            <p>
              Sudah punya akun? <Link to="/login" className="auth-link">Login disini</Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
