type BadgeVariants = {
    kind: "WARNING" | "INFO" | "ERROR";
}

export function Badge({ kind }: BadgeVariants) {
    let color

    switch (kind) {
        case 'ERROR':
            color = 'bg-red-200 text-red-800'
            break;
        case 'INFO':
            color = 'bg-blue-200 text-blue-800'
            break;
        case 'WARNING':
            color = 'bg-yellow-200 text-yellow-800'
            break;
        default:
            color = 'bg-slate-50 text-slate-800'
    }

    return (
        <div className={`w-20 rounded py-1 px-2 font-bold text-sm text-center ${color}`}>
            {kind}
        </div>
    )
}