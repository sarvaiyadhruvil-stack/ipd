import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import StatCard from '../components/StatCard';
import { FileText, Activity, UserCheck, ShieldAlert } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function StudentDashboard() {
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

    const totalFiles = history.length;
    const avgAI = totalFiles ? (history.reduce((acc, curr) => acc + curr.ai_probability, 0) / totalFiles).toFixed(1) : 0;
    const avgHuman = totalFiles ? (100 - avgAI).toFixed(1) : 0;

    const chartData = history.slice().reverse().map((item, idx) => ({
        name: `Upload ${idx + 1}`,
        ai: item.ai_probability,
        human: item.human_probability
    }));

    if (loading) return <div>Loading dashboard...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
                <Link to="/dashboard/upload" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
                    Upload New File
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                    title="Total Uploads" 
                    value={totalFiles} 
                    icon={<FileText size={24} />} 
                    color="bg-blue-500" 
                />
                <StatCard 
                    title="Avg AI Probability" 
                    value={`${avgAI}%`} 
                    icon={<Activity size={24} />} 
                    color="bg-red-500" 
                />
                <StatCard 
                    title="Avg Human Probability" 
                    value={`${avgHuman}%`} 
                    icon={<UserCheck size={24} />} 
                    color="bg-green-500" 
                />
            </div>

            {totalFiles > 0 ? (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mt-6">
                    <h2 className="text-lg font-bold mb-4">Recent AI Scores Trend</h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="ai" stroke="#ef4444" name="AI Probability" />
                                <Line type="monotone" dataKey="human" stroke="#22c55e" name="Human Probability" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            ) : (
                <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
                    <ShieldAlert size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">No uploads yet. Upload a file to see your statistics.</p>
                </div>
            )}
        </div>
    );
}
