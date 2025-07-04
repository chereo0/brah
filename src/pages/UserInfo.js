import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

function UserInfo() {
  const { user, logout, updateUser, token } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user ? user.name : '');
  const [email, setEmail] = useState(user ? user.email : '');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) navigate('/signin');
  }, [user, navigate]);
  if (!user) return null;

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    try {
      const res = await fetch(`http://localhost:5000/api/auth/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, email })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Update failed');
      updateUser({ ...user, name: data.name, email: data.email });
      setSuccess('Profile updated!');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '3rem auto', padding: '2rem', background: '#fff', borderRadius: 12, boxShadow: '0 2px 16px rgba(232,140,174,0.08)' }}>
      <h2>User Info</h2>
      {user.isAdmin ? (
        <div style={{ marginBottom: 20 }}>
          <div><strong>Name:</strong> {user.name}</div>
          <div><strong>Email:</strong> {user.email}</div>
          <div><strong>User ID:</strong> {user.id}</div>
          <div><strong>Admin:</strong> Yes</div>
        </div>
      ) : (
        <form onSubmit={handleUpdate} style={{ marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label><strong>Name:</strong></label><br />
            <input value={name} onChange={e => setName(e.target.value)} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #eee' }} />
          </div>
          <div>
            <label><strong>Email:</strong></label><br />
            <input value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #eee' }} />
          </div>
          <div><strong>User ID:</strong> {user.id}</div>
          <div><strong>Admin:</strong> No</div>
          {success && <div style={{ color: 'green' }}>{success}</div>}
          {error && <div style={{ color: 'red' }}>{error}</div>}
          <button type="submit" style={{ background: '#e88cae', color: '#fff', border: 'none', borderRadius: 20, padding: '0.7rem 2rem', fontSize: '1rem', fontWeight: 500, cursor: 'pointer' }}>Update</button>
        </form>
      )}
      <button onClick={() => { logout(); navigate('/'); }} style={{ background: '#e88cae', color: '#fff', border: 'none', borderRadius: 20, padding: '0.7rem 2rem', fontSize: '1rem', fontWeight: 500, cursor: 'pointer' }}>Logout</button>
    </div>
  );
}

export default UserInfo; 