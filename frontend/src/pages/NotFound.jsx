import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
            <h1 className="text-9xl font-black text-gray-200">404</h1>
            <p className="text-2xl font-bold text-gray-800 mt-4">Page not found</p>
            <p className="text-gray-500 mt-2 mb-8">Sorry, we couldn't find the page you're looking for.</p>
            <Link to="/" className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition">
                Go back home
            </Link>
        </div>
    );
}
