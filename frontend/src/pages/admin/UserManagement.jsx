import React, { useState, useEffect } from 'react';
import { FiSearch, FiUserCheck, FiUserX } from 'react-icons/fi';
import api from '../../services/api';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import toast from 'react-hot-toast';
import './AdminPages.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(`/admin/users?search=${search}`);
      setUsers(res.data.data);
    } catch (error) {
      toast.error('Gagal memuat data pengguna');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchUsers();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      await api.put(`/admin/users/${userId}`, { isActive: !currentStatus });
      toast.success(`Status pengguna berhasil diperbarui`);
      fetchUsers();
    } catch (error) {
      toast.error('Gagal memperbarui status pengguna');
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-header space-between">
        <div>
          <h2 className="admin-title">Manajemen Pengguna</h2>
          <p className="admin-subtitle">Kelola semua pengguna yang terdaftar di aplikasi</p>
        </div>
        <div className="admin-search">
          <Input 
            placeholder="Cari nama atau email..." 
            icon={FiSearch} 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Pengguna</th>
                <th>Peran</th>
                <th>Status</th>
                <th>Tanggal Bergabung</th>
                <th className="text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="table-empty">
                    <div className="btn-spinner"></div> Memuat data...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="table-empty">
                    Tidak ada pengguna ditemukan.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div className="user-cell">
                        <div className="user-cell-avatar">
                          {u.fullName.charAt(0)}
                        </div>
                        <div>
                          <p className="user-cell-name">{u.fullName}</p>
                          <p className="user-cell-email">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <Badge variant={u.role === 'Admin' ? 'danger' : u.role === 'Seller' ? 'warning' : 'primary'}>
                        {u.role}
                      </Badge>
                    </td>
                    <td>
                      <Badge variant={u.isActive ? 'success' : 'secondary'}>
                        {u.isActive ? 'Aktif' : 'Nonaktif'}
                      </Badge>
                    </td>
                    <td className="text-muted">
                      {new Date(u.createdAt).toLocaleDateString('id-ID')}
                    </td>
                    <td className="text-right">
                      <Button 
                        variant={u.isActive ? 'secondary' : 'primary'} 
                        size="sm"
                        onClick={() => toggleUserStatus(u.id, u.isActive)}
                      >
                        {u.isActive ? <FiUserX size={16} /> : <FiUserCheck size={16} />}
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default UserManagement;
