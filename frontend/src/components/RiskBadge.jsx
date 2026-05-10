export default function RiskBadge({ probability }) {
    let colorClass = "bg-green-100 text-green-800 border-green-200";
    let label = "Low Risk";

    if (probability >= 70) {
        colorClass = "bg-red-100 text-red-800 border-red-200";
        label = "High Risk";
    } else if (probability >= 40) {
        colorClass = "bg-yellow-100 text-yellow-800 border-yellow-200";
        label = "Medium Risk";
    }

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${colorClass}`}>
            {label} ({probability}%)
        </span>
    );
}
