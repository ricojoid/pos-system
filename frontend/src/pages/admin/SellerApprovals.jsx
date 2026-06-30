import React, { useState, useEffect } from 'react';
import { FiCheck, FiX } from 'react-icons/fi';
import api from '../../services/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import toast from 'react-hot-toast';
import './AdminPages.css';

const SellerApprovals = () => {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/admin/seller-requests');
      setRequests(res.data);
    } catch (error) {
      toast.error('Gagal memuat permintaan penjual');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (id, status) => {
    try {
      await api.put(`/admin/seller-requests/${id}`, { 
        status,
        adminNotes: status === 'Approved' ? 'Disetujui oleh Admin' : 'Ditolak'
      });
      toast.success(`Permintaan berhasil di-${status.toLowerCase()}`);
      fetchRequests();
    } catch (error) {
      toast.error('Gagal memproses permintaan');
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h2 className="admin-title">Persetujuan Toko</h2>
        <p className="admin-subtitle">Tinjau dan kelola pendaftaran toko baru dari pengguna</p>
      </div>

      <div className="admin-grid">
        {isLoading ? (
          <p className="text-muted">Memuat data...</p>
        ) : requests.length === 0 ? (
          <div className="empty-grid-state">
            Tidak ada permintaan pendaftaran toko saat ini.
          </div>
        ) : (
          requests.map((req) => (
            <Card key={req.id}>
              <div className="approval-card-header">
                <div>
                  <h3 className="approval-store-name">{req.storeName}</h3>
                  <p className="approval-user">oleh: {req.userFullName || 'User'}</p>
                </div>
                <Badge variant={
                  req.status === 'Pending' ? 'warning' : 
                  req.status === 'Approved' ? 'success' : 'danger'
                }>
                  {req.status}
                </Badge>
              </div>
              
              <div className="approval-description">
                <p>{req.description || 'Tidak ada deskripsi'}</p>
              </div>

              {req.status === 'Pending' && (
                <div className="approval-actions">
                  <Button 
                    variant="success" 
                    className="flex-1"
                    onClick={() => handleAction(req.id, 'Approved')}
                  >
                    <FiCheck /> Setujui
                  </Button>
                  <Button 
                    variant="danger" 
                    className="flex-1"
                    onClick={() => handleAction(req.id, 'Rejected')}
                  >
                    <FiX /> Tolak
                  </Button>
                </div>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default SellerApprovals;
