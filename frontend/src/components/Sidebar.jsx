import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, Upload, History, FileText } from 'lucide-react';

function Sidebar() {
    const { user } = useContext(AuthContext);
    const location = useLocation();

    const studentLinks = [
        { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { path: '/dashboard/upload', label: 'Upload File', icon: <Upload size={20} /> },
        { path: '/dashboard/history', label: 'My History', icon: <History size={20} /> },
    ];

    const teacherLinks = [
        { path: '/teacher', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    ];

    const links = user?.role === 'teacher' ? teacherLinks : studentLinks;

    return (
        <aside className="w-64 bg-indigo-900 text-white flex flex-col">
            <div className="p-6 border-b border-indigo-800">
                <h2 className="text-2xl font-bold tracking-tight">AI Detector</h2>
            </div>
            <nav className="flex-1 p-4 space-y-2">
                {links.map((link) => (
                    <Link
                        key={link.path}
                        to={link.path}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                            location.pathname === link.path || (location.pathname.startsWith(link.path) && link.path !== '/dashboard' && link.path !== '/teacher')
                                ? 'bg-indigo-800 text-white font-medium shadow-sm'
                                : 'text-indigo-200 hover:bg-indigo-800/50 hover:text-white'
                        }`}
                    >
                        {link.icon}
                        {link.label}
                    </Link>
                ))}
            </nav>
            <div className="p-4 border-t border-indigo-800 text-indigo-300 text-sm text-center">
                MVP Version 40%
            </div>
        </aside>
    );
}

export default Sidebar;
