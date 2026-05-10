import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import StatCard from '../components/StatCard';
import RiskBadge from '../components/RiskBadge';
import { Users, FileText, AlertTriangle, Eye, Download } from 'lucide-react';

export default function TeacherDashboard() {
    const [stats, setStats] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const [statsRes, subsRes] = await Promise.all([
                    api.get('/api/teacher/dashboard'),
                    api.get('/api/teacher/submissions')
                ]);
                setStats(statsRes.data);
                setSubmissions(subsRes.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
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
            alert("Report generation failed.");
        }
    };

    if (loading) return <div>Loading dashboard...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                    title="Total Submissions" 
                    value={stats?.total_submissions} 
                    icon={<FileText size={24} />} 
                    color="bg-blue-500" 
                />
                <StatCard 
                    title="Average AI Score" 
                    value={`${stats?.average_ai_probability}%`} 
                    icon={<Users size={24} />} 
                    color="bg-purple-500" 
                />
                <StatCard 
                    title="High Risk Submissions" 
                    value={stats?.high_risk_submissions_count} 
                    icon={<AlertTriangle size={24} />} 
                    color="bg-red-500" 
                />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mt-6">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-lg font-bold">All Student Submissions</h2>
                </div>
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm">
                            <th className="p-4 font-semibold">Student</th>
                            <th className="p-4 font-semibold">File Name</th>
                            <th className="p-4 font-semibold">Date</th>
                            <th className="p-4 font-semibold">AI Risk</th>
                            <th className="p-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {submissions.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="p-8 text-center text-gray-500">No submissions found.</td>
                            </tr>
                        ) : submissions.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50 transition">
                                <td className="p-4 font-medium text-gray-900">{item.student_name}</td>
                                <td className="p-4 text-gray-600">{item.file_name}</td>
                                <td className="p-4 text-gray-500 text-sm">
                                    {new Date(item.created_at).toLocaleDateString()}
                                </td>
                                <td className="p-4">
                                    <RiskBadge probability={item.ai_probability} />
                                </td>
                                <td className="p-4 flex justify-end gap-2">
                                    <Link to={`/teacher/result/${item.id}`} className="text-indigo-600 hover:bg-indigo-50 p-2 rounded-lg transition" title="View Details">
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
