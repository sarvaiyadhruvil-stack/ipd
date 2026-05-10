import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import api from '../api/axios';
import { UploadCloud, File, X, AlertCircle } from 'lucide-react';

export default function UploadPage() {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const onDrop = useCallback(acceptedFiles => {
        setError('');
        if (acceptedFiles?.length > 0) {
            setFile(acceptedFiles[0]);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'image/png': ['.png'],
            'image/jpeg': ['.jpg', '.jpeg']
        },
        maxSize: 10 * 1024 * 1024, // 10MB
        multiple: false,
        onDropRejected: (fileRejections) => {
            setError(fileRejections[0]?.errors[0]?.message || 'Invalid file type or size.');
        }
    });

    const handleUpload = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setLoading(true);
        setStatus('Uploading and analyzing...');
        setError('');

        try {
            const res = await api.post('/api/uploads/analyze', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            navigate(`/dashboard/result/${res.data.submission_id}`);
        } catch (err) {
            setError(err.response?.data?.detail || 'An error occurred during analysis.');
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Upload Document</h1>
            <p className="text-gray-500">Upload a PDF or Image for AI writing detection.</p>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-start gap-3">
                    <AlertCircle className="mt-0.5" size={20} />
                    <span>{error}</span>
                </div>
            )}

            {!file ? (
                <div 
                    {...getRootProps()} 
                    className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-colors ${
                        isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400 bg-white'
                    }`}
                >
                    <input {...getInputProps()} />
                    <UploadCloud size={48} className="mx-auto text-indigo-400 mb-4" />
                    <p className="text-lg font-medium text-gray-700">Drag & drop a file here, or click to select</p>
                    <p className="text-sm text-gray-500 mt-2">Supports PDF, PNG, JPG up to 10MB.</p>
                </div>
            ) : (
                <div className="bg-white border border-gray-200 rounded-2xl p-6 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="bg-indigo-100 p-3 rounded-xl text-indigo-600">
                            <File size={24} />
                        </div>
                        <div>
                            <p className="font-medium text-gray-900">{file.name}</p>
                            <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                    </div>
                    {!loading && (
                        <button onClick={() => setFile(null)} className="text-gray-400 hover:text-red-500">
                            <X size={20} />
                        </button>
                    )}
                </div>
            )}

            <div className="flex justify-end">
                <button
                    onClick={handleUpload}
                    disabled={!file || loading}
                    className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {loading && <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                    {loading ? status : 'Analyze File'}
                </button>
            </div>
        </div>
    );
}
