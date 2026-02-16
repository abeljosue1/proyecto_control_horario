"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { WorkSession } from '@/types';
import { Play, Pause, Square, Clock } from 'lucide-react';

export default function Dashboard() {
    const { user } = useAuth();
    const [currentSession, setCurrentSession] = useState<WorkSession | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentTime, setCurrentTime] = useState<Date | null>(null); // Start null to avoid hydration mismatch

    useEffect(() => {
        // Set initial time on mount
        setCurrentTime(new Date());

        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (user) {
            fetchCurrentSession();
        }
    }, [user]);

    const fetchCurrentSession = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('work_sessions')
                .select('*')
                .eq('user_id', user?.id)
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
        } finally {
            setLoading(false);
        }
    };

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
        } catch (err: any) {
            setError("Error starting session: " + err.message);
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
        } catch (err: any) {
            setError("Error pausing session: " + err.message);
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
                    // Optional: clear pause_time if you want to track multiple pauses differently
                    // For now, we keep the last pause time or could clear it. 
                    // Let's keep it simple and just change status.
                })
                .eq('id', currentSession.id)
                .select()
                .single();

            if (error) throw error;
            setCurrentSession(data as WorkSession);
        } catch (err: any) {
            setError("Error resuming: " + err.message);
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

            // Show a quick summary before clearing? 
            // For now, clear session to allow new start.
            // You could store 'lastSession' here to display a success message.
            setCurrentSession(null);

            // Reload page or trigger context update to refresh history could be good, 
            // but for now we rely on the user refreshing or the History component polling/subscribing.
            window.location.reload(); // Simple way to refresh history for now

        } catch (err: any) {
            setError("Error ending session: " + err.message);
        }
    };

    if (loading) return <div className="p-6 text-center">Cargando panel...</div>;

    // Helper to format time
    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    return (
        <div className="bg-white shadow-xl rounded-2xl p-8 mb-8 border border-gray-100">
            <div className="flex flex-col items-center justify-center space-y-8">

                {/* Header & Status */}
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Control de Jornada</h2>
                    <div className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide uppercase ${currentSession?.status === 'working' ? 'bg-green-100 text-green-700' :
                            currentSession?.status === 'paused' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-gray-100 text-gray-600'
                        }`}>
                        <span className={`w-2 h-2 rounded-full mr-2 ${currentSession?.status === 'working' ? 'bg-green-500 animate-pulse' :
                                currentSession?.status === 'paused' ? 'bg-yellow-500' :
                                    'bg-gray-400'
                            }`}></span>
                        {currentSession?.status === 'working' ? 'En Curso' :
                            currentSession?.status === 'paused' ? 'Pausado' :
                                'Listo para iniciar'}
                    </div>
                </div>

                {/* BIG CLOCK */}
                <div className="flex flex-col items-center justify-center bg-gray-50 rounded-3xl p-10 w-full max-w-md shadow-inner border border-gray-200 relative overflow-hidden">
                    <p className="text-gray-500 text-sm font-medium mb-2 uppercase tracking-wider">Hora Actual</p>
                    <div className="text-7xl font-black text-gray-900 font-mono tracking-tight z-10">
                        {currentTime ? formatTime(currentTime) : '--:--:--'}
                    </div>
                    {/* Decorative background element */}
                    <Clock className="absolute -right-4 -bottom-4 w-48 h-48 text-gray-100 opacity-50 z-0" />
                </div>

                {/* Session Details */}
                {currentSession && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md">
                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex flex-col items-center">
                            <span className="text-xs text-blue-600 font-bold uppercase mb-1">Hora Inicio</span>
                            <span className="text-xl font-mono text-blue-900">
                                {new Date(currentSession.start_time).toLocaleTimeString()}
                            </span>
                        </div>

                        {currentSession.pause_time && currentSession.status === 'paused' && (
                            <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 flex flex-col items-center">
                                <span className="text-xs text-yellow-600 font-bold uppercase mb-1">Hora Pausa</span>
                                <span className="text-xl font-mono text-yellow-900">
                                    {new Date(currentSession.pause_time).toLocaleTimeString()}
                                </span>
                            </div>
                        )}
                    </div>
                )}

                {/* Controls */}
                <div className="flex flex-wrap justify-center gap-4 w-full max-w-md">
                    {!currentSession && (
                        <button
                            onClick={handleStart}
                            className="flex-1 flex items-center justify-center px-8 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition transform hover:scale-105 shadow-lg shadow-green-200 font-bold text-lg"
                        >
                            <Play className="w-6 h-6 mr-2" /> Iniciar
                        </button>
                    )}

                    {currentSession?.status === 'working' && (
                        <button
                            onClick={handlePause}
                            className="flex-1 flex items-center justify-center px-8 py-4 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 transition transform hover:scale-105 shadow-lg shadow-yellow-200 font-bold text-lg"
                        >
                            <Pause className="w-6 h-6 mr-2" /> Pausar
                        </button>
                    )}

                    {currentSession?.status === 'paused' && (
                        <button
                            onClick={handleResume}
                            className="flex-1 flex items-center justify-center px-8 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition transform hover:scale-105 shadow-lg shadow-green-200 font-bold text-lg"
                        >
                            <Play className="w-6 h-6 mr-2" /> Reanudar
                        </button>
                    )}

                    {currentSession && (
                        <button
                            onClick={handleEnd}
                            className="flex-1 flex items-center justify-center px-8 py-4 bg-red-600 text-white rounded-xl hover:bg-red-700 transition transform hover:scale-105 shadow-lg shadow-red-200 font-bold text-lg"
                        >
                            <Square className="w-6 h-6 mr-2" /> Finalizar
                        </button>
                    )}
                </div>

                {/* Error Message */}
                {error && (
                    <div className="text-red-500 bg-red-50 px-4 py-2 rounded-lg text-sm border border-red-100">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
}
