"use client";

import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export default function Timer() {
    const [currentTime, setCurrentTime] = useState<Date | null>(null);

    useEffect(() => {
        // Use setTimeout to avoid synchronous state update warning
        const timeout = setTimeout(() => setCurrentTime(new Date()), 0);

        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => {
            clearTimeout(timeout);
            clearInterval(timer);
        };
    }, []);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    return (
        <div className="flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm rounded-3xl p-10 w-full max-w-md shadow-lg border border-white/20 relative overflow-hidden group hover:shadow-xl transition-all duration-300">
            <p className="text-gray-500 text-sm font-medium mb-2 uppercase tracking-widest">Hora Actual</p>
            <div className="text-7xl font-black text-slate-800 font-mono tracking-tight z-10 tabular-nums">
                {currentTime ? formatTime(currentTime) : '--:--:--'}
            </div>
            {/* Decorative background element */}
            <Clock className="absolute -right-6 -bottom-6 w-48 h-48 text-indigo-50 opacity-40 z-0 group-hover:scale-110 transition-transform duration-700 pointer-events-none" />
        </div>
    );
}
