import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User, LogOut } from 'lucide-react';

function Navbar() {
    const { user, logout } = useContext(AuthContext);

    return (
        <header className="bg-white border-b px-6 py-4 flex items-center justify-between shadow-sm">
            <h1 className="text-xl font-semibold text-gray-800">
                AI Score Detector
            </h1>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-gray-600">
                    <User size={20} />
                    <span className="font-medium">{user?.name}</span>
                    <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full uppercase tracking-wide">
                        {user?.role}
                    </span>
                </div>
                <button
                    onClick={logout}
                    className="flex items-center gap-2 text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
                >
                    <LogOut size={18} />
                    <span>Logout</span>
                </button>
            </div>
        </header>
    );
}

export default Navbar;
