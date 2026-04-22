import React, { useState, useEffect } from 'react';
import { getDocuments, deleteDocument, requestVerification, uploadFile } from '../../services/api';
import { FileText, Upload, Trash2, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { useSelector } from 'react-redux';
import Badge from '../shared/Badge';

const JobseekerDocumentsView = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    const fetchDocuments = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await getDocuments();
            setDocuments(data);
        } catch (err) {
            console.error("FETCH DOCS ERROR:", err);
            setError(err.message || 'Failed to load documents');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.type !== 'application/pdf') {
                alert('Only PDF documents are allowed.');
                return;
            }
            setUploading(true);
            try {
                await uploadFile(file, 'cv');
                fetchDocuments();
            } catch (err) {
                alert(`Upload failed: ${err.message}`);
            } finally {
                setUploading(false);
            }
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this document?')) return;

        try {
            await deleteDocument(id);
            setDocuments(documents.filter(doc => doc.id !== id));
        } catch (err) {
            alert(`Delete failed: ${err.message}`);
        }
    };

    const handleReqVerification = async () => {
        if (documents.length === 0) {
            alert('Please upload your CV or other documents before requesting verification.');
            return;
        }

        setLoading(true);
        try {
            const data = await requestVerification();
            alert(data.message);
            fetchDocuments();
        } catch (err) {
            alert(err.message || 'Failed to submit verification request.');
        } finally {
            setLoading(false);
        }
    };

    const isVerificationPending = documents.some(doc => doc.status === 'Under Review');
    const filteredDocuments = documents.filter(doc => doc.type !== 'profile_picture');

    return (
        <div className="dashboard-content-area">
            <div className="section-header-flex">
                <h2 className="text-2xl font-bold">My Documents</h2>
                <button
                    className="btn-maroon"
                    onClick={() => document.getElementById('doc-upload').click()}
                    disabled={uploading}
                >
                    {uploading ? <Loader size={18} className="animate-spin" /> : <Upload size={18} />}
                    {uploading ? 'Uploading...' : 'Upload New'}
                </button>
                <input
                    type="file"
                    id="doc-upload"
                    hidden
                    onChange={handleFileUpload}
                    accept=".pdf"
                />
            </div>

            {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl mt-4 border border-red-100">{error}</div>}

            <div className="card mt-6">
                {loading ? (
                    <div className="text-center py-8 flex flex-col items-center gap-2">
                        <Loader className="animate-spin text-maroon" />
                        <p className="text-gray-500 font-medium">Loading your documents...</p>
                    </div>
                ) : filteredDocuments.length === 0 ? (
                    <div className="text-center py-12 text-gray-400 font-medium italic">
                        No documents uploaded yet. (Only PDF allowed)
                    </div>
                ) : (
                    <div className="doc-list space-y-4">
                        {filteredDocuments.map(doc => (
                            <div key={doc.id} className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-md transition-all group">
                                <div className="p-3 bg-white rounded-xl text-maroon border border-gray-100 shadow-sm">
                                    <FileText size={20} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-gray-900 truncate">{doc.name}</h4>
                                    <p className="text-xs text-gray-500 uppercase font-black tracking-widest mt-0.5">{doc.type} • {doc.size} • {doc.date}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Badge variant={doc.status === 'Under Review' ? 'yellow' : (doc.status === 'Verified' ? 'success' : 'yellow')}>
                                        {doc.status === 'Verified' ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                                        <span className="ml-1">{doc.status}</span>
                                    </Badge>
                                    <button
                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                        onClick={() => handleDelete(doc.id)}
                                        disabled={doc.status === 'Under Review'}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="card mt-8 promo-card bg-maroon p-8 rounded-3xl text-white">
                <h3 className="text-xl font-bold mb-2">Verification Badge</h3>
                <p className="opacity-80 text-sm leading-relaxed max-w-lg">
                    {isVerificationPending
                        ? 'Your portfolio is currently under review by our team. We will notify you once it is verified.'
                        : 'Get your documents verified by our team to earn the professional badge and appear higher in employer search results.'}
                </p>
                <button
                    className={`mt-6 px-8 py-3 bg-white text-maroon rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all shadow-xl ${isVerificationPending || loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={handleReqVerification}
                    disabled={isVerificationPending || loading}
                >
                    {loading && <Loader size={16} className="animate-spin inline mr-2" />}
                    {isVerificationPending ? 'Verification Pending' : 'Request Portfolio Review'}
                </button>
            </div>
        </div>
    );
};

export default JobseekerDocumentsView;
