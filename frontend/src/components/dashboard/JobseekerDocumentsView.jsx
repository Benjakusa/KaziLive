import React, { useState, useEffect } from 'react';
import { BASE_URL } from '../../services/api';
import { FileText, Upload, Trash2, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { useSelector } from 'react-redux';
import Badge from '../shared/Badge';

const JobseekerDocumentsView = () => {
    const { token } = useSelector((state) => state.auth);
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    const fetchDocuments = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/jobseeker/documents`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                setDocuments(data);
            } else {
                setError(data.error || 'Failed to fetch documents');
            }
        } catch (err) {
            setError('Failed to load documents. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchDocuments();
    }, [token]);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.type !== 'application/pdf') {
                alert('Only PDF documents are allowed.');
                return;
            }
            setUploading(true);
            const formData = new FormData();
            formData.append('file', file);
            formData.append('file_type', 'CV');

            try {
                const response = await fetch(`${BASE_URL}/jobseeker/upload`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: formData
                });
                if (response.ok) {
                    fetchDocuments();
                } else {
                    const data = await response.json();
                    alert(`Upload failed: ${data.error}${data.details ? ` - ${data.details}` : ''}`);
                }
            } catch (err) {
                alert('Upload failed. Please check your connection.');
            } finally {
                setUploading(false);
            }
        }
    };

    const deleteDocument = async (id) => {
        if (!window.confirm('Are you sure you want to delete this document?')) return;

        try {
            const response = await fetch(`${BASE_URL}/jobseeker/documents/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                setDocuments(documents.filter(doc => doc.id !== id));
            } else {
                const data = await response.json();
                alert(`Delete failed: ${data.error}`);
            }
        } catch (err) {
            alert('Delete failed');
        }
    };

    const handleRequestVerification = async () => {
        if (documents.length === 0) {
            alert('Please upload your CV or other documents before requesting verification.');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/jobseeker/request-verification`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                alert(data.message);
                fetchDocuments(); // Refresh list to show 'Under Review' status
            } else {
                alert(data.error || 'Request failed');
            }
        } catch (err) {
            alert('Failed to submit verification request.');
        } finally {
            setLoading(false);
        }
    };

    const isVerificationPending = documents.some(doc => doc.status === 'Under Review');
    const filteredDocuments = documents.filter(doc => doc.type !== 'profile_picture');

    return (
        <div className="dashboard-content-area">
            <div className="section-header-flex">
                <h2>My Documents</h2>
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

            {error && <div className="alert alert-error mt-4">{error}</div>}

            <div className="card mt-6">
                {loading ? (
                    <div className="text-center py-8">Loading your documents...</div>
                ) : filteredDocuments.length === 0 ? (
                    <div className="text-center py-8 text-muted">No documents uploaded yet. (Only PDF allowed)</div>
                ) : (
                    <div className="doc-list">
                        {filteredDocuments.map(doc => (
                            <div key={doc.id} className="doc-item">
                                <div className="doc-icon">
                                    <FileText size={24} />
                                </div>
                                <div className="doc-info">
                                    <h4>{doc.name}</h4>
                                    <p>{doc.type} • {doc.size} • Uploaded on {doc.date}</p>
                                </div>
                                <div className="doc-status">
                                    <Badge variant={doc.status === 'Under Review' ? 'yellow' : (doc.status === 'Verified' ? 'success' : 'yellow')}>
                                        {doc.status === 'Verified' ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                                        {doc.status}
                                    </Badge>
                                </div>
                                <button
                                    className="btn-icon-text danger"
                                    onClick={() => deleteDocument(doc.id)}
                                    disabled={doc.status === 'Under Review'}
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="card mt-6 promo-card bg-maroon-dark">
                <h3>Verification Badge</h3>
                <p className="text-white-muted">
                    {isVerificationPending
                        ? 'Your portfolio is currently under review by our team.'
                        : 'Get your documents verified by our team to earn the verified badge and appear higher in search results.'}
                </p>
                <button
                    className={`btn-yellow mt-4 ${isVerificationPending || loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={handleRequestVerification}
                    disabled={isVerificationPending || loading}
                >
                    {loading ? <Loader size={18} className="animate-spin" /> : null}
                    {isVerificationPending ? 'Verification Pending' : 'Request Portfolio Review'}
                </button>
            </div>
        </div>
    );
};

export default JobseekerDocumentsView;
