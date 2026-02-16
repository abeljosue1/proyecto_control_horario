"use client";

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Dashboard from '@/components/Dashboard';
import History from '@/components/History';

export default function Home() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Cargando aplicación...</div>;
  }

  if (!user) {
    return null; // Redirecting
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-10">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-800">Control Horario MVP</h1>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-600 mr-4">{user.email}</span>
              <button
                onClick={signOut}
                className="px-4 py-2 text-sm text-red-600 border border-red-600 rounded hover:bg-red-50"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <Dashboard />
        <History />
      </main>
    </div>
  );
}
