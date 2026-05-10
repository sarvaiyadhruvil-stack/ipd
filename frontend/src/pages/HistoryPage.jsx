import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import RiskBadge from '../components/RiskBadge';
import { Download, Eye, FileText } from 'lucide-react';

export default function HistoryPage() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await api.get('/api/uploads/my');
                setHistory(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const downloadReport = async (id, filename) => {
        try {
            const res = await api.get(`/api/reports/${id}/pdf`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Report_${filename}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (err) {
            console.error("Failed to download report", err);
            alert("Report generation failed.");
        }
    };

    if (loading) return <div>Loading history...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Upload History</h1>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm">
                            <th className="p-4 font-semibold">File Name</th>
                            <th className="p-4 font-semibold">Date</th>
                            <th className="p-4 font-semibold">AI Risk</th>
                            <th className="p-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {history.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="p-8 text-center text-gray-500">No uploads found.</td>
                            </tr>
                        ) : history.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50 transition">
                                <td className="p-4 flex items-center gap-3">
                                    <FileText className="text-gray-400" size={20} />
                                    <span className="font-medium text-gray-900">{item.file_name}</span>
                                </td>
                                <td className="p-4 text-gray-500 text-sm">
                                    {new Date(item.created_at).toLocaleDateString()}
                                </td>
                                <td className="p-4">
                                    <RiskBadge probability={item.ai_probability} />
                                </td>
                                <td className="p-4 flex justify-end gap-2">
                                    <Link to={`/dashboard/result/${item.id}`} className="text-indigo-600 hover:bg-indigo-50 p-2 rounded-lg transition" title="View Details">
                                        <Eye size={18} />
                                    </Link>
                                    <button 
                                        onClick={() => downloadReport(item.id, item.file_name)}
                                        className="text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition"
                                        title="Download PDF Report"
                                    >
                                        <Download size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
