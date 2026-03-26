"use client";

import React, { useState } from 'react';
import { Plus, X, Building2, User, Mail, Lock, Globe, Sparkles, Loader2, CheckCircle2, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';
import AuditLogModal from './AuditLogModal';

interface Gym {
    id: string;
    name: string;
    slug: string;
    primaryColor: string | null;
    _count: {
        users: number;
        memberships: number;
    }
}

interface SuperAdminClientProps {
    initialGyms: Gym[];
}

export default function SuperAdminClient({ initialGyms }: SuperAdminClientProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [auditModalOpen, setAuditModalOpen] = useState(false);
    const [selectedGymForAudit, setSelectedGymForAudit] = useState<{id: string, name: string} | null>(null);
    const router = useRouter();

    const [formData, setFormData] = useState({
        gymName: '',
        gymSlug: '',
        adminName: '',
        adminEmail: '',
        adminPassword: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/v1/superadmin/gyms', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to register gym');

            setSuccess(true);
            setTimeout(() => {
                setIsModalOpen(false);
                setSuccess(false);
                setFormData({ gymName: '', gymSlug: '', adminName: '', adminEmail: '', adminPassword: '' });
                router.refresh();
            }, 2000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 900 }}>Active Gym Tenants</h2>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    style={{ background: '#fff', color: '#000', padding: '12px 24px', borderRadius: '16px', border: 'none', fontWeight: 800, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                    className="scale-hover"
                >
                    <Plus size={18} /> Register New Gym
                </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 12px' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', color: 'rgba(255,255,255,0.4)', fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                            <th style={{ padding: '0 24px' }}>Gym Entity</th>
                            <th style={{ padding: '0 24px' }}>Admin Score</th>
                            <th style={{ padding: '0 24px' }}>Status</th>
                            <th style={{ padding: '0 24px', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {initialGyms.map(gym => (
                            <tr key={gym.id} style={{ background: 'rgba(255,255,255,0.02)', transition: 'background 0.3s' }} className="row-hover">
                                <td style={{ padding: '20px 24px', borderRadius: '16px 0 0 16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <div style={{ width: '48px', height: '48px', background: gym.primaryColor || '#333', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.75rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                                            {gym.name?.[0] || 'G'}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 800, fontSize: '1rem' }}>{gym.name}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>SLUG: {gym.slug}</div>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: '20px 24px' }}>
                                    <div style={{ fontWeight: 700 }}>{gym._count.users} Members</div>
                                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>{gym._count.memberships} Active Plans</div>
                                </td>
                                <td style={{ padding: '20px 24px' }}>
                                    <div style={{ display: 'inline-flex', padding: '6px 12px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800 }}>ACTIVE</div>
                                </td>
                                <td style={{ padding: '20px 24px', textAlign: 'right', borderRadius: '0 16px 16px 0' }}>
                                    <button 
                                        onClick={() => {
                                            setSelectedGymForAudit({ id: gym.id, name: gym.name });
                                            setAuditModalOpen(true);
                                        }}
                                        style={{ padding: '10px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}
                                        className="scale-hover"
                                    >
                                        <Shield size={14} className="text-amber-500" /> Manage Audit
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(20px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div style={{ width: '100%', maxWidth: '600px', background: '#080808', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '32px', padding: '48px', position: 'relative', boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }} className="modal-entrance">
                        <button onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', top: '32px', right: '32px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer' }}><X size={24} /></button>
                        
                        {success ? (
                            <div style={{ textAlign: 'center', padding: '40px 0' }}>
                                <CheckCircle2 size={64} className="text-teal-500" style={{ marginBottom: '24px' }} />
                                <h2 style={{ fontSize: '2rem', fontWeight: 950, marginBottom: '12px' }}>Gym Synchronized</h2>
                                <p style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>Provisioning elite infrastructure for {formData.gymName}...</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                                <div>
                                    <div style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', padding: '6px 14px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 900, letterSpacing: '0.1em', width: 'fit-content', marginBottom: '16px' }}>UNIVERSAL ONBOARDING</div>
                                    <h2 style={{ fontSize: '2rem', fontWeight: 950, letterSpacing: '-0.04em' }}>Register New Entity</h2>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <div className="input-field">
                                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Gym Name</label>
                                        <div style={{ position: 'relative' }}>
                                            <Building2 size={18} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '16px', color: 'rgba(255,255,255,0.2)' }} />
                                            <input 
                                                type="text" 
                                                required
                                                placeholder="Elite Fitness Center"
                                                value={formData.gymName}
                                                onChange={e => setFormData({...formData, gymName: e.target.value})}
                                                style={{ width: '100%', padding: '16px 16px 16px 44px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', color: '#fff', fontSize: '0.9375rem', fontWeight: 700, outline: 'none' }} 
                                            />
                                        </div>
                                    </div>
                                    <div className="input-field">
                                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Gym Slug</label>
                                        <div style={{ position: 'relative' }}>
                                            <Globe size={18} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '16px', color: 'rgba(255,255,255,0.2)' }} />
                                            <input 
                                                type="text" 
                                                required
                                                placeholder="elite-fitness"
                                                value={formData.gymSlug}
                                                onChange={e => setFormData({...formData, gymSlug: e.target.value.toLowerCase().replace(/ /g, '-')})}
                                                style={{ width: '100%', padding: '16px 16px 16px 44px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', color: '#fff', fontSize: '0.9375rem', fontWeight: 700, outline: 'none' }} 
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.05)' }}></div>

                                <div className="input-field">
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Assign Admin Operator</label>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        <div style={{ position: 'relative' }}>
                                            <User size={18} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '16px', color: 'rgba(255,255,255,0.2)' }} />
                                            <input 
                                                type="text" 
                                                required
                                                placeholder="Admin Name"
                                                value={formData.adminName}
                                                onChange={e => setFormData({...formData, adminName: e.target.value})}
                                                style={{ width: '100%', padding: '16px 16px 16px 44px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', color: '#fff', fontSize: '0.9375rem', fontWeight: 700, outline: 'none' }} 
                                            />
                                        </div>
                                        <div style={{ position: 'relative' }}>
                                            <Mail size={18} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '16px', color: 'rgba(255,255,255,0.2)' }} />
                                            <input 
                                                type="email" 
                                                required
                                                placeholder="admin@elite.com"
                                                value={formData.adminEmail}
                                                onChange={e => setFormData({...formData, adminEmail: e.target.value})}
                                                style={{ width: '100%', padding: '16px 16px 16px 44px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', color: '#fff', fontSize: '0.9375rem', fontWeight: 700, outline: 'none' }} 
                                            />
                                        </div>
                                        <div style={{ position: 'relative' }}>
                                            <Lock size={18} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '16px', color: 'rgba(255,255,255,0.2)' }} />
                                            <input 
                                                type="password" 
                                                required
                                                placeholder="Set Secure Password"
                                                value={formData.adminPassword}
                                                onChange={e => setFormData({...formData, adminPassword: e.target.value})}
                                                style={{ width: '100%', padding: '16px 16px 16px 44px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', color: '#fff', fontSize: '0.9375rem', fontWeight: 700, outline: 'none' }} 
                                            />
                                        </div>
                                    </div>
                                </div>

                                {error && <p style={{ color: '#ef4444', fontSize: '0.875rem', fontWeight: 700, textAlign: 'center' }}>{error}</p>}

                                <button 
                                    disabled={loading}
                                    style={{ width: '100%', background: '#fff', color: '#000', padding: '18px', borderRadius: '18px', border: 'none', fontWeight: 950, fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', cursor: loading ? 'not-allowed' : 'pointer' }}
                                    className="scale-hover"
                                >
                                    {loading ? <Loader2 size={24} className="animate-spin" /> : <><Sparkles size={20} /> INITIALIZE TENANT ENTITY</>}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}

            <AuditLogModal 
                isOpen={auditModalOpen} 
                onClose={() => setAuditModalOpen(false)} 
                gymId={selectedGymForAudit?.id || ''} 
                gymName={selectedGymForAudit?.name || ''} 
            />

            <style jsx>{`
                .row-hover:hover {
                    background: rgba(255,255,255,0.04) !important;
                }
                .modal-entrance {
                    animation: modalIn 0.5s cubic-bezier(0.16, 1, 0.3, 1);
                }
                @keyframes modalIn {
                    from { opacity: 0; transform: translateY(20px) scale(0.95); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
            `}</style>
        </>
    );
}
