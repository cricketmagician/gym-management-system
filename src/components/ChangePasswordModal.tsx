"use client";

import React, { useState } from 'react';
import { X, Lock, ShieldCheck, Loader2, KeyRound } from 'lucide-react';

interface ChangePasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        if (formData.newPassword !== formData.confirmPassword) {
            setError("New passwords do not match");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/v1/user/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    oldPassword: formData.oldPassword,
                    newPassword: formData.newPassword
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to update password");

            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
                onClose();
            }, 2000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            {/* Backdrop */}
            <div 
                onClick={onClose}
                style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(20px)', animation: 'fadeIn 0.3s ease' }} 
            />

            {/* Modal Content */}
            <div style={{ 
                position: 'relative', 
                width: '100%', 
                maxWidth: '440px', 
                background: '#080808', 
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '32px',
                padding: '40px',
                display: 'flex',
                flexDirection: 'column',
                gap: '32px',
                animation: 'modalIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: '0 30px 60px rgba(0,0,0,0.5)'
            }}>
                <button 
                    onClick={onClose}
                    style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer' }}
                >
                    <X size={20} />
                </button>

                {success ? (
                    <div style={{ textAlign: 'center', padding: '40px 0' }}>
                        <div style={{ width: '64px', height: '64px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                            <ShieldCheck size={32} />
                        </div>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 950, marginBottom: '12px' }}>Security Updated</h2>
                        <p style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>Your credentials have been successfully rotated.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b', fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                                <KeyRound size={14} /> Security Rotations
                            </div>
                            <h2 style={{ fontSize: '1.75rem', fontWeight: 950, letterSpacing: '-0.02em', color: '#fff' }}>Change Password</h2>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div className="input-field">
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: '8px' }}>Current Password</label>
                                <div style={{ position: 'relative' }}>
                                    <Lock size={18} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '16px', color: 'rgba(255,255,255,0.2)' }} />
                                    <input 
                                        type="password" 
                                        required
                                        value={formData.oldPassword}
                                        onChange={e => setFormData({...formData, oldPassword: e.target.value})}
                                        style={{ width: '100%', padding: '16px 16px 16px 44px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', color: '#fff', outline: 'none' }} 
                                    />
                                </div>
                            </div>

                            <div className="input-field">
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: '8px' }}>New Rotation</label>
                                <div style={{ position: 'relative' }}>
                                    <Lock size={18} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '16px', color: 'rgba(255,255,255,0.2)' }} />
                                    <input 
                                        type="password" 
                                        required
                                        value={formData.newPassword}
                                        onChange={e => setFormData({...formData, newPassword: e.target.value})}
                                        style={{ width: '100%', padding: '16px 16px 16px 44px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', color: '#fff', outline: 'none' }} 
                                    />
                                </div>
                            </div>

                            <div className="input-field">
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: '8px' }}>Confirm Rotation</label>
                                <div style={{ position: 'relative' }}>
                                    <Lock size={18} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '16px', color: 'rgba(255,255,255,0.2)' }} />
                                    <input 
                                        type="password" 
                                        required
                                        value={formData.confirmPassword}
                                        onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                                        style={{ width: '100%', padding: '16px 16px 16px 44px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', color: '#fff', outline: 'none' }} 
                                    />
                                </div>
                            </div>
                        </div>

                        {error && <p style={{ color: '#ef4444', fontSize: '0.8125rem', fontWeight: 700, textAlign: 'center' }}>{error}</p>}

                        <button 
                            disabled={loading}
                            style={{ width: '100%', background: '#fff', color: '#000', padding: '16px', borderRadius: '14px', border: 'none', fontWeight: 950, fontSize: '0.9375rem', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                            className="scale-hover"
                        >
                            {loading ? <Loader2 size={20} className="animate-spin" /> : "ROTATE CREDENTIALS"}
                        </button>
                    </form>
                )}
            </div>

            <style jsx>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes modalIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
            `}</style>
        </div>
    );
}
