import React, { useState, useEffect } from 'react';
import { userAPI } from '../services/api';
import { toast } from 'react-toastify';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const response = await userAPI.getUsers();
      setUsers(response.users);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId, userName) => {
    if (window.confirm(`Are you sure you want to delete ${userName}?`)) {
      try {
        await userAPI.deleteUser(userId);
        toast.success('User deleted successfully');
        fetchUsers(); // Refresh the list
      } catch (error) {
        toast.error('Failed to delete user');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="card">
        <div style={{ textAlign: 'center' }}>
          <span className="loading"></span>
          <p>Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Registered Users</h2>
        <button className="btn btn-secondary" onClick={fetchUsers}>
          Refresh
        </button>
      </div>
      
      {users.length === 0 ? (
        <p>No users registered yet.</p>
      ) : (
        <>
          <p>Total users: {users.length}</p>
          <div className="user-list">
            {users.map(user => (
              <div key={user.id} className="user-card">
                <h3>{user.name}</h3>
                <p>{user.email}</p>
                <p><small>Registered: {new Date(user.created_at).toLocaleDateString()}</small></p>
                <button 
                  className="btn btn-danger"
                  onClick={() => handleDeleteUser(user.id, user.name)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default UserList;
