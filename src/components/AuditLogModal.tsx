"use client";

import React, { useEffect, useState } from 'react';
import { X, Shield, Clock, User, Activity, Loader2, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

interface AuditLog {
    id: string;
    action: string;
    timestamp: string;
    actor?: {
        name: string;
        email: string;
    };
    newData?: any;
    oldData?: any;
}

interface AuditLogModalProps {
    isOpen: boolean;
    onClose: () => void;
    gymId: string;
    gymName: string;
}

export default function AuditLogModal({ isOpen, onClose, gymId, gymName }: AuditLogModalProps) {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen && gymId) {
            fetchLogs();
        }
    }, [isOpen, gymId]);

    const fetchLogs = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`/api/v1/superadmin/audit?gymId=${gymId}`);
            if (!res.ok) throw new Error('Failed to fetch audit logs');
            const data = await res.json();
            setLogs(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', justifyContent: 'flex-end' }}>
            {/* Backdrop */}
            <div 
                onClick={onClose}
                style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', animation: 'fadeIn 0.3s ease' }} 
            />

            {/* Slide-over Content */}
            <div style={{ 
                position: 'relative', 
                width: '100%', 
                maxWidth: '500px', 
                height: '100%', 
                background: '#0a0a0a', 
                borderLeft: '1px solid rgba(255,255,255,0.05)',
                display: 'flex',
                flexDirection: 'column',
                animation: 'slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: '-20px 0 50px rgba(0,0,0,0.5)'
            }}>
                {/* Header */}
                <div style={{ padding: '32px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b', fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                            <Shield size={14} /> Investigating Facility
                        </div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 950, letterSpacing: '-0.02em', color: '#fff' }}>{gymName}</h2>
                    </div>
                    <button 
                        onClick={onClose}
                        style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                        className="scale-hover"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Log Stream */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {loading ? (
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px', color: 'rgba(255,255,255,0.2)' }}>
                            <Loader2 size={32} className="animate-spin" />
                            <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>Decrypting Audit Stream...</span>
                        </div>
                    ) : error ? (
                        <div style={{ padding: '24px', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.1)', borderRadius: '16px', color: '#ef4444', display: 'flex', gap: '12px' }}>
                            <AlertCircle size={20} />
                            <span style={{ fontWeight: 600 }}>{error}</span>
                        </div>
                    ) : logs.length === 0 ? (
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px', color: 'rgba(255,255,255,0.2)', textAlign: 'center' }}>
                            <Activity size={32} />
                            <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>No operational shifts detected yet.</span>
                        </div>
                    ) : (
                        logs.map(log => (
                            <div key={log.id} style={{ 
                                padding: '20px', 
                                background: 'rgba(255,255,255,0.02)', 
                                border: '1px solid rgba(255,255,255,0.05)', 
                                borderRadius: '20px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '12px',
                                transition: 'all 0.2s ease'
                            }} className="log-item">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: log.action.includes('DELETE') ? '#ef4444' : log.action.includes('CREATE') ? '#10b981' : '#3b82f6' }}></div>
                                        <span style={{ fontWeight: 800, fontSize: '0.9375rem', color: '#fff' }}>{log.action}</span>
                                    </div>
                                    <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>{format(new Date(log.timestamp), 'HH:mm')}</span>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>
                                    <User size={14} />
                                    <span>{log.actor?.name || 'System Auto'}</span>
                                    <span style={{ opacity: 0.3 }}>•</span>
                                    <Clock size={14} />
                                    <span>{format(new Date(log.timestamp), 'MMM d, yyyy')}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                <div style={{ padding: '32px', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                    <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>Total Investigated entries: {logs.length}</p>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
                .log-item:hover {
                    background: rgba(255,255,255,0.04);
                    border-color: rgba(255,255,255,0.1);
                    transform: translateX(-4px);
                }
            `}</style>
        </div>
    );
}
