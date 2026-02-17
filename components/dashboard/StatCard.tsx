interface StatCardProps {
    label: string;
    value: string;
    type: 'info' | 'warning' | 'success';
}

export default function StatCard({ label, value, type }: StatCardProps) {
    // We use explicit logic below instead of the helper to ensure Tailwind classes are detected/safe.
    // Extract base color name for label text since we can't construct classes dynamically like `text-${color}-600` safely with Tailwind compiler without safelisting.
    // So I used a custom helper above or fixed classes.
    // Let's refine the implementation to be safer with Tailwind.

    let containerClass = '';
    let labelClass = '';
    let valueClass = '';

    if (type === 'warning') {
        containerClass = 'bg-amber-50 border-amber-100';
        labelClass = 'text-amber-600';
        valueClass = 'text-amber-900';
    } else if (type === 'success') {
        containerClass = 'bg-emerald-50 border-emerald-100';
        labelClass = 'text-emerald-600';
        valueClass = 'text-emerald-900';
    } else {
        containerClass = 'bg-blue-50 border-blue-100';
        labelClass = 'text-blue-600';
        valueClass = 'text-blue-900';
    }

    return (
        <div className={`${containerClass} p-4 rounded-xl border flex flex-col items-center justify-center transition-all hover:shadow-md`}>
            <span className={`text-xs font-bold uppercase mb-1 tracking-wider ${labelClass}`}>{label}</span>
            <span className={`text-xl font-mono font-medium ${valueClass}`}>
                {value}
            </span>
        </div>
    );
}
