import React from 'react';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import { useAuth } from '../context/AuthContext';

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
        
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Welcome back!</h2>
          {user && (
            <div className="space-y-2">
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>User ID:</strong> {user.id}</p>
            </div>
          )}
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-green-50 p-6 rounded border border-green-200">
            <h3 className="text-lg font-semibold text-green-800 mb-2">Study Progress</h3>
            <p className="text-green-600">Track your kanji learning journey</p>
          </div>
          
          <div className="bg-green-50 p-6 rounded border border-green-200">
            <h3 className="text-lg font-semibold text-green-800 mb-2">Practice Sets</h3>
            <p className="text-green-600">Practice with custom kanji sets</p>
          </div>
          
          <div className="bg-green-50 p-6 rounded border border-green-200">
            <h3 className="text-lg font-semibold text-green-800 mb-2">Statistics</h3>
            <p className="text-green-600">View your learning statistics</p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default DashboardPage;