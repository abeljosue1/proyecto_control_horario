import { WorkSessionStatus } from '@/types';
import { Play, Pause, Square } from 'lucide-react';

interface ControlsProps {
    status: WorkSessionStatus | undefined;
    onStart: () => void;
    onPause: () => void;
    onResume: () => void;
    onEnd: () => void;
    disabled?: boolean;
}

export default function Controls({ status, onStart, onPause, onResume, onEnd, disabled }: ControlsProps) {
    if (!status || status === 'finished') {
        return (
            <button
                onClick={onStart}
                disabled={disabled}
                className="w-full flex items-center justify-center px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 active:scale-95 transition-all shadow-lg shadow-emerald-200 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed group"
            >
                <Play className="w-6 h-6 mr-2 fill-white/20 group-hover:fill-white/40 transition-colors" />
                Iniciar Jornada
            </button>
        );
    }

    return (
        <div className="flex flex-col sm:flex-row gap-4 w-full">
            {status === 'working' ? (
                <button
                    onClick={onPause}
                    disabled={disabled}
                    className="flex-1 flex items-center justify-center px-6 py-4 bg-amber-500 text-white rounded-xl hover:bg-amber-600 active:scale-95 transition-all shadow-lg shadow-amber-200 font-bold text-lg disabled:opacity-50"
                >
                    <Pause className="w-6 h-6 mr-2 fill-white/20" />
                    Pausar
                </button>
            ) : (
                <button
                    onClick={onResume}
                    disabled={disabled}
                    className="flex-1 flex items-center justify-center px-6 py-4 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 active:scale-95 transition-all shadow-lg shadow-emerald-200 font-bold text-lg disabled:opacity-50"
                >
                    <Play className="w-6 h-6 mr-2 fill-white/20" />
                    Reanudar
                </button>
            )}

            <button
                onClick={onEnd}
                disabled={disabled}
                className="flex-1 flex items-center justify-center px-6 py-4 bg-white text-rose-600 border-2 border-rose-100 rounded-xl hover:bg-rose-50 hover:border-rose-200 active:scale-95 transition-all shadow-lg shadow-rose-100 font-bold text-lg disabled:opacity-50"
            >
                <Square className="w-6 h-6 mr-2 fill-rose-600/20" />
                Finalizar
            </button>
        </div>
    );
}
