import { Link } from 'react-router-dom';
import { ShieldCheck, FileSearch, Zap } from 'lucide-react';

function LandingPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Nav */}
            <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                <div className="text-2xl font-bold text-indigo-600 flex items-center gap-2">
                    <ShieldCheck size={32} /> AI Score Detector
                </div>
                <div className="flex gap-4">
                    <Link to="/login" className="text-gray-600 hover:text-indigo-600 font-medium px-4 py-2">Log In</Link>
                    <Link to="/register" className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-indigo-700 transition">Get Started</Link>
                </div>
            </nav>

            {/* Hero */}
            <main className="max-w-7xl mx-auto px-6 py-20 text-center">
                <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-8">
                    Detect AI-Generated <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                        Assignments Instantly
                    </span>
                </h1>
                <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10">
                    A smart heuristic engine to analyze PDF and image submissions. Get detailed insights, probability scores, and sentence-level highlights.
                </p>
                <div className="flex justify-center gap-4 mb-20">
                    <Link to="/register" className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition transform hover:-translate-y-1">
                        Try Demo Now
                    </Link>
                </div>

                {/* Features */}
                <div className="grid md:grid-cols-3 gap-8 text-left">
                    <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
                            <FileSearch size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Deep Text Analysis</h3>
                        <p className="text-gray-500">Extracts text from PDFs and images using advanced OCR, and analyzes sentence patterns.</p>
                    </div>
                    <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6">
                            <ShieldCheck size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Heuristic Engine</h3>
                        <p className="text-gray-500">Evaluates burstiness, vocabulary diversity, and prompt leakage to calculate AI probability.</p>
                    </div>
                    <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-6">
                            <Zap size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Instant Reports</h3>
                        <p className="text-gray-500">Generate and download comprehensive PDF reports with highlighted suspicious sentences.</p>
                    </div>
                </div>

                <div className="mt-20 p-8 bg-amber-50 rounded-2xl border border-amber-200 max-w-3xl mx-auto">
                    <h4 className="font-bold text-amber-800 mb-2">Disclaimer</h4>
                    <p className="text-amber-700 text-sm">
                        This MVP uses a heuristic AI scoring engine, not a trained transformer model. It provides probability-based writing pattern analysis and should not be treated as absolute proof. Human review is always recommended.
                    </p>
                </div>
            </main>
        </div>
    );
}

export default LandingPage;
