export default function SentenceHighlighter({ sentences }) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-gray-800 leading-relaxed text-lg">
            {sentences.map((item, idx) => {
                let bgClass = "bg-green-100 hover:bg-green-200 text-green-900";
                if (item.risk_level === 'high') bgClass = "bg-red-200 hover:bg-red-300 text-red-900 font-medium";
                else if (item.risk_level === 'medium') bgClass = "bg-yellow-100 hover:bg-yellow-200 text-yellow-900";

                return (
                    <span 
                        key={idx} 
                        className={`${bgClass} rounded px-1 py-0.5 mx-0.5 cursor-pointer transition-colors inline-block`}
                        title={`Risk: ${item.risk_level.toUpperCase()} | AI Prob: ${item.ai_probability}%\nReasons: ${item.reasons.join(', ')}`}
                    >
                        {item.sentence}
                    </span>
                );
            })}
        </div>
    );
}
