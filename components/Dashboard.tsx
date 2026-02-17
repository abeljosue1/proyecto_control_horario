"use client";

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { WorkSession } from '@/types';
import Timer from '@/components/dashboard/Timer';
import StatusBadge from '@/components/dashboard/StatusBadge';
import Controls from '@/components/dashboard/Controls';
import StatCard from '@/components/dashboard/StatCard';

export default function Dashboard() {
    const { user } = useAuth();
    const [currentSession, setCurrentSession] = useState<WorkSession | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCurrentSession = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('work_sessions')
                .select('*')
                .eq('user_id', user.id)
                .in('status', ['working', 'paused'])
                .maybeSingle();

            if (error) {
                console.warn("Supabase error (expected if table missing):", error.message);
            }

            if (data) {
                setCurrentSession(data as WorkSession);
            } else {
                setCurrentSession(null);
            }
        } catch (err) {
            console.error("Error fetching session:", err);
            setError("Error de conexión al cargar la sesión.");
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            fetchCurrentSession();
        }
    }, [user, fetchCurrentSession]);

    const handleStart = async () => {
        if (!user) return;
        setError(null);
        try {
            const { data, error } = await supabase
                .from('work_sessions')
                .insert([
                    {
                        user_id: user.id,
                        start_time: new Date().toISOString(),
                        status: 'working'
                    }
                ])
                .select()
                .single();

            if (error) throw error;
            setCurrentSession(data as WorkSession);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Error desconocido';
            setError("Error al iniciar sesión: " + message);
        }
    };

    const handlePause = async () => {
        if (!currentSession) return;
        setError(null);
        try {
            const { data, error } = await supabase
                .from('work_sessions')
                .update({
                    status: 'paused',
                    pause_time: new Date().toISOString()
                })
                .eq('id', currentSession.id)
                .select()
                .single();

            if (error) throw error;
            setCurrentSession(data as WorkSession);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Error desconocido';
            setError("Error al pausar: " + message);
        }
    };

    const handleResume = async () => {
        if (!currentSession) return;
        setError(null);
        try {
            const { data, error } = await supabase
                .from('work_sessions')
                .update({
                    status: 'working',
                    // Optional: clear pause_time logic if needed
                })
                .eq('id', currentSession.id)
                .select()
                .single();

            if (error) throw error;
            setCurrentSession(data as WorkSession);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Error desconocido';
            setError("Error al reanudar: " + message);
        }
    };

    const handleEnd = async () => {
        if (!currentSession) return;
        setError(null);
        const endTime = new Date();
        try {
            const { error } = await supabase
                .from('work_sessions')
                .update({
                    status: 'finished',
                    end_time: endTime.toISOString()
                })
                .eq('id', currentSession.id);

            if (error) throw error;

            setCurrentSession(null);
            // Reload page to refresh history - this legacy behavior is kept for now.
            window.location.reload();

        } catch (err) {
            const message = err instanceof Error ? err.message : 'Error desconocido';
            setError("Error al finalizar: " + message);
        }
    };

    if (loading) return <div className="p-6 text-center text-gray-500 animate-pulse">Cargando panel...</div>;

    return (
        <div className="bg-white/80 backdrop-blur-xl shadow-xl rounded-3xl p-8 mb-8 border border-white/20 relative overflow-hidden transition-all duration-500 hover:shadow-2xl">
            {/* Decorative top border */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500"></div>

            <div className="flex flex-col items-center justify-center space-y-8 relative z-10">

                {/* Header & Status */}
                <div className="text-center space-y-4">
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">Control de Jornada</h2>
                    <StatusBadge status={currentSession?.status} />
                </div>

                {/* BIG CLOCK */}
                <Timer />

                {/* Session Details */}
                {currentSession && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <StatCard
                            label="Hora Inicio"
                            value={new Date(currentSession.start_time).toLocaleTimeString()}
                            type="info"
                        />
                        {currentSession.pause_time && currentSession.status === 'paused' && (
                            <StatCard
                                label="Hora Pausa"
                                value={new Date(currentSession.pause_time).toLocaleTimeString()}
                                type="warning"
                            />
                        )}
                    </div>
                )}

                {/* Controls */}
                <div className="w-full max-w-md">
                    <Controls
                        status={currentSession?.status}
                        onStart={handleStart}
                        onPause={handlePause}
                        onResume={handleResume}
                        onEnd={handleEnd}
                        disabled={false}
                    />
                </div>

                {/* Error Message */}
                {error && (
                    <div className="text-rose-600 bg-rose-50 px-4 py-3 rounded-xl text-sm border border-rose-100 w-full max-w-md text-center shadow-sm animate-in fade-in zoom-in duration-300">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
}
