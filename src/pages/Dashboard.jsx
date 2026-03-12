import { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, ExternalLink, Globe, UploadCloud, Loader2, FileArchive, X, Sparkles, Calendar } from 'lucide-react';
import api from '../api/axios';

export default function Dashboard() {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Upload state
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchSites();
  }, []);

  const fetchSites = async () => {
    try {
      const res = await api.get('/sites');
      setSites(res.data);
    } catch (err) {
      setError('Failed to load your sites.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this site?')) return;
    try {
      await api.delete(`/sites/${id}`);
      setSites(sites.filter(site => site.id !== id));
    } catch (err) {
      alert('Failed to delete site.');
    }
  };

  const handleFileChange = (file) => {
    if (file && file.name.endsWith('.zip')) {
      setSelectedFile(file);
      setUploadError('');
    } else {
      setSelectedFile(null);
      setUploadError('Please select a valid .zip file.');
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileChange(file);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!projectName.trim() || !selectedFile) {
      setUploadError('Project name and ZIP file are required.');
      return;
    }
    setUploadError('');
    setIsUploading(true);
    const formData = new FormData();
    formData.append('projectName', projectName.trim());
    formData.append('file', selectedFile);
    try {
      const res = await api.post('/sites/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSites([...sites, res.data]);
      setShowUploadModal(false);
      setProjectName('');
      setSelectedFile(null);
    } catch (err) {
      setUploadError(err.response?.data || 'Failed to upload. Ensure project name is unique.');
    } finally {
      setIsUploading(false);
    }
  };

  const closeModal = () => {
    setShowUploadModal(false);
    setProjectName('');
    setSelectedFile(null);
    setUploadError('');
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 mb-10 animate-fade-up">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <div
              className="w-1 h-7 rounded-full"
              style={{ background: 'linear-gradient(to bottom, #6366f1, #3b82f6)' }}
            />
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Your Hosted Sites
            </h1>
          </div>
          <p className="text-sm text-white/40 font-medium ml-5">
            Manage and deploy your static websites
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="btn-primary flex items-center gap-2.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Deploy New Site
        </button>
      </div>

      {/* Error */}
      {error && (
        <div
          className="mb-6 px-4 py-3.5 rounded-xl text-sm font-medium text-red-400 flex items-center gap-2.5"
          style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <Loader2 className="w-10 h-10 text-indigo-400 animate-spin" />
          <p className="text-sm text-white/30 font-medium">Loading your sites...</p>
        </div>
      ) : sites.length === 0 ? (
        /* Empty state */
        <div
          className="rounded-3xl p-14 flex flex-col items-center text-center animate-fade-up"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px dashed rgba(255,255,255,0.1)',
          }}
        >
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 animate-float"
            style={{
              background: 'rgba(99,102,241,0.12)',
              border: '1px solid rgba(99,102,241,0.25)',
            }}
          >
            <Globe className="w-10 h-10 text-indigo-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No sites deployed yet</h3>
          <p className="text-sm text-white/40 max-w-sm mb-8 leading-relaxed">
            Upload a ZIP file containing your HTML, CSS, and JS files to get your first site live in seconds.
          </p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-semibold text-white/80 hover:text-white transition-all duration-200"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(99,102,241,0.15)';
              e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
            }}
          >
            <UploadCloud className="w-4 h-4" />
            Deploy your first site
          </button>
        </div>
      ) : (
        /* Site cards */
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 card-stagger">
          {sites.map(site => (
            <div
              key={site.id}
              className="rounded-2xl p-6 flex flex-col card-hover"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {/* Card top */}
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-3.5">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(59,130,246,0.2))',
                      border: '1px solid rgba(99,102,241,0.2)',
                    }}
                  >
                    <Globe className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-white text-base truncate leading-tight">
                      {site.projectName}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Calendar className="w-3 h-3 text-white/30 flex-shrink-0" />
                      <p className="text-xs text-white/30 truncate">{formatDate(site.uploadDate)}</p>
                    </div>
                  </div>
                </div>

                {/* Delete */}
                <button
                  onClick={() => handleDelete(site.id)}
                  className="p-2 rounded-lg flex-shrink-0 transition-all duration-200 text-white/25 hover:text-red-400"
                  style={{ background: 'transparent' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  title="Delete site"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Card footer */}
              <div
                className="flex items-center justify-between pt-4 mt-auto"
                style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
              >
                <a
                  href={`http://localhost:8080${site.siteUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors px-3 py-1.5 rounded-lg"
                  style={{ background: 'rgba(99,102,241,0.08)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.18)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(99,102,241,0.08)'}
                >
                  Visit Site
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
                  style={{
                    background: 'rgba(34,197,94,0.1)',
                    border: '1px solid rgba(34,197,94,0.2)',
                    color: '#4ade80',
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  Live
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div
            className="w-full max-w-md rounded-3xl p-8 animate-scale-in"
            style={{
              background: 'rgba(12,16,28,0.95)',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 40px 100px rgba(0,0,0,0.6)',
            }}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between mb-7">
              <div>
                <h2 className="text-xl font-bold text-white">Deploy New Site</h2>
                <p className="text-xs text-white/40 mt-1">Upload your static assets as a ZIP file</p>
              </div>
              <button
                onClick={closeModal}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 text-white/40 hover:text-white"
                style={{ background: 'rgba(255,255,255,0.05)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpload} className="space-y-5">
              {/* Upload error */}
              {uploadError && (
                <div
                  className="px-4 py-3 rounded-xl text-sm font-medium text-red-400 flex items-center gap-2"
                  style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                  {uploadError}
                </div>
              )}

              {/* Project name */}
              <div>
                <label className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-2">
                  Project Name
                </label>
                <input
                  type="text"
                  required
                  maxLength={30}
                  className="input-dark"
                  placeholder="e.g. my-portfolio"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value.replace(/[^a-zA-Z0-9\-_]/g, ''))}
                />
                <p className="mt-1.5 text-xs text-white/25">Letters, numbers, hyphens, underscores only</p>
              </div>

              {/* Drop zone */}
              <div>
                <label className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-2">
                  ZIP Archive
                </label>
                <div
                  className="relative flex flex-col items-center justify-center py-10 px-6 rounded-2xl text-center cursor-pointer transition-all duration-200"
                  style={{
                    border: `2px dashed ${dragOver || selectedFile ? 'rgba(99,102,241,0.6)' : 'rgba(255,255,255,0.1)'}`,
                    background: dragOver ? 'rgba(99,102,241,0.08)' : selectedFile ? 'rgba(99,102,241,0.05)' : 'rgba(255,255,255,0.02)',
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                    style={{
                      background: selectedFile ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.05)',
                      border: `1px solid ${selectedFile ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.08)'}`,
                    }}
                  >
                    <FileArchive className={`w-7 h-7 ${selectedFile ? 'text-indigo-400' : 'text-white/30'}`} />
                  </div>
                  {selectedFile ? (
                    <>
                      <p className="text-sm font-semibold text-indigo-400">{selectedFile.name}</p>
                      <p className="text-xs text-white/30 mt-1">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-semibold text-white/60">
                        Click to browse or drag & drop
                      </p>
                      <p className="text-xs text-white/25 mt-1">ZIP files up to 10MB</p>
                    </>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".zip"
                    className="sr-only"
                    onChange={(e) => handleFileChange(e.target.files[0])}
                  />
                </div>
              </div>

              {/* Upload button */}
              <button
                type="submit"
                disabled={isUploading || !selectedFile || !projectName}
                className="btn-primary w-full flex items-center justify-center gap-2.5 py-3.5 text-sm disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deploying...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Deploy Site
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
