import { WorkSessionStatus } from '@/types';

interface StatusBadgeProps {
    status: WorkSessionStatus | undefined;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
    const getStatusConfig = () => {
        switch (status) {
            case 'working':
                return {
                    text: 'En Curso',
                    containerClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
                    dotClass: 'bg-emerald-500 animate-pulse'
                };
            case 'paused':
                return {
                    text: 'Pausado',
                    containerClass: 'bg-amber-100 text-amber-800 border-amber-200',
                    dotClass: 'bg-amber-500'
                };
            default:
                return {
                    text: 'Listo para iniciar',
                    containerClass: 'bg-slate-100 text-slate-600 border-slate-200',
                    dotClass: 'bg-slate-400'
                };
        }
    };

    const config = getStatusConfig();

    return (
        <div className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold tracking-wide uppercase border ${config.containerClass} shadow-sm transition-colors duration-300`}>
            <span className={`w-2.5 h-2.5 rounded-full mr-2.5 ${config.dotClass}`}></span>
            {config.text}
        </div>
    );
}
