import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import SentenceHighlighter from '../components/SentenceHighlighter';
import { AlertTriangle, Download, Info } from 'lucide-react';

export default function ResultPage() {
    const { id } = useParams();
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchResult = async () => {
            try {
                const res = await api.get(`/api/uploads/${id}`);
                setResult(res.data);
            } catch (err) {
                setError('Result not found or unauthorized.');
            } finally {
                setLoading(false);
            }
        };
        fetchResult();
    }, [id]);

    const downloadReport = async () => {
        try {
            const res = await api.get(`/api/reports/${id}/pdf`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Report_${result.file_name}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (err) {
            alert("Report generation failed.");
        }
    };

    if (loading) return <div>Loading results...</div>;
    if (error) return <div className="text-red-500">{error}</div>;
    if (!result) return null;

    let bgClass = "bg-green-50 border-green-200";
    let textClass = "text-green-700";
    if (result.ai_probability >= 70) {
        bgClass = "bg-red-50 border-red-200";
        textClass = "text-red-700";
    } else if (result.ai_probability >= 40) {
        bgClass = "bg-yellow-50 border-yellow-200";
        textClass = "text-yellow-700";
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Analysis Result</h1>
                    <p className="text-gray-500">{result.file_name}</p>
                </div>
                <button 
                    onClick={downloadReport}
                    className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition shadow-sm"
                >
                    <Download size={18} /> Download PDF
                </button>
            </div>

            <div className={`p-8 rounded-2xl border flex flex-col items-center justify-center text-center shadow-sm ${bgClass}`}>
                <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-2">AI Probability Score</h2>
                <div className={`text-6xl font-black mb-4 ${textClass}`}>
                    {result.ai_probability}%
                </div>
                <p className="text-gray-600 max-w-lg mx-auto">
                    Confidence: <strong>{result.confidence_level}</strong> | Reliability: <strong>{result.reliability_score}/100</strong>
                </p>
            </div>

            {result.prompt_leakage_flags?.length > 0 && (
                <div className="bg-orange-50 border border-orange-200 p-4 rounded-xl flex items-start gap-3 text-orange-800">
                    <AlertTriangle className="mt-0.5 flex-shrink-0" size={20} />
                    <div>
                        <h4 className="font-bold">Prompt Leakage Detected</h4>
                        <ul className="list-disc pl-5 mt-1 space-y-1 text-sm">
                            {result.prompt_leakage_flags.map((flag, idx) => (
                                <li key={idx}>{flag}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-2 mb-4 text-gray-800 font-bold">
                            <Info size={20} className="text-indigo-500" />
                            <h3>Why this score?</h3>
                        </div>
                        <ul className="space-y-3 text-sm text-gray-600">
                            {result.explanations.map((exp, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                    <span className="text-indigo-400 mt-1">•</span>
                                    <span>{exp}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="md:col-span-2 space-y-4">
                    <h3 className="font-bold text-gray-900 text-lg">Sentence-Level Highlights</h3>
                    <div className="flex gap-4 mb-2 text-xs font-medium">
                        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-200"></span> High Risk</span>
                        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-yellow-100"></span> Medium Risk</span>
                        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-100"></span> Low Risk</span>
                    </div>
                    <SentenceHighlighter sentences={result.sentence_analysis} />
                </div>
            </div>
        </div>
    );
}
