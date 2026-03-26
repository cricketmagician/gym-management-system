"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X, User as UserIcon, Shield, Save } from 'lucide-react';
import { getDirectImageUrl } from '@/lib/image-utils';

interface User {
    id: string;
    name: string;
    email: string | null;
    phone: string;
    gender: string;
    photoUrl?: string | null;
    memberships?: {
        startDate: Date;
        planId: string;
    }[];
}

export default function EditMemberModal({ user }: { user: User }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [plans, setPlans] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        name: user.name,
        email: user.email || '',
        phone: user.phone,
        gender: user.gender,
        photoUrl: user.photoUrl || '',
        startDate: user.memberships?.[0]?.startDate
            ? new Date(user.memberships[0].startDate).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0],
        planId: user.memberships?.[0]?.planId || ''
    });

    useEffect(() => {
        fetch('/api/v1/plans')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setPlans(data);
            })
            .catch(console.error);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`/api/v1/members/${user.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!res.ok) throw new Error("Failed to update profile");
            setShowModal(false);
            router.refresh();
        } catch (error) {
            console.error(error);
            alert("An error occurred while updating profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                className="scale-hover"
                style={{ 
                    background: 'var(--brand-primary)', 
                    color: 'white', 
                    border: 'none', 
                    padding: '12px 24px', 
                    borderRadius: '14px', 
                    fontSize: '0.875rem', 
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    boxShadow: '0 10px 20px rgba(79, 70, 229, 0.2)'
                }}
            >
                <UserIcon size={16} /> Manage Profile
            </button>

            {showModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    backdropFilter: 'blur(20px)',
                    display: 'flex',
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    zIndex: 1000,
                    padding: '20px'
                }}>
                    <div className="card" style={{ 
                        padding: '40px', 
                        width: '100%', 
                        maxWidth: '480px', 
                        maxHeight: '90vh', 
                        overflowY: 'auto',
                        background: '#080808',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '32px',
                        position: 'relative',
                        boxShadow: '0 40px 100px rgba(0,0,0,0.5)',
                        scrollbarWidth: 'thin',
                        scrollbarColor: 'rgba(255,255,255,0.1) transparent'
                    }}>
                        <button 
                            onClick={() => setShowModal(false)}
                            style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer' }}
                        >
                            <X size={20} />
                        </button>
                        
                        <div style={{ marginBottom: '32px' }}>
                            <div style={{ color: 'var(--brand-primary)', background: 'rgba(79, 70, 229, 0.1)', width: 'fit-content', padding: '6px 12px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>Operational Command</div>
                            <h2 style={{ fontSize: '1.75rem', fontWeight: 950, letterSpacing: '-0.04em' }}>Edit Member Profile</h2>
                        </div>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Full Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Phone Number</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}
                                    placeholder="+91..."
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Email Address (Optional)</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}
                                    placeholder="john@example.com"
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Profile Photo URL</label>
                                <input
                                    type="url"
                                    value={formData.photoUrl}
                                    onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                                    style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}
                                    placeholder="Google Drive or Dropbox link..."
                                />
                                {formData.photoUrl && (
                                    <div style={{ marginTop: '8px' }}>
                                        <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase' }}>Photo Preview</p>
                                        <img 
                                            src={getDirectImageUrl(formData.photoUrl)} 
                                            alt="Preview" 
                                            style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '12px', border: '1px solid var(--border-color)' }} 
                                        />
                                    </div>
                                )}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Gender</label>
                                <select
                                    value={formData.gender}
                                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                    style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', background: 'var(--surface-color)', color: 'var(--text-primary)' }}
                                >
                                    <option value="MALE">Male</option>
                                    <option value="FEMALE">Female</option>
                                    <option value="OTHER">Other</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Registration Start Date</label>
                                <input
                                    type="date"
                                    required
                                    value={formData.startDate}
                                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                    style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', background: 'var(--surface-color)', color: 'var(--text-primary)' }}
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Membership Plan</label>
                                <select
                                    value={formData.planId}
                                    onChange={(e) => setFormData({ ...formData, planId: e.target.value })}
                                    style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', background: 'var(--surface-color)', color: 'var(--text-primary)' }}
                                >
                                    <option value="">Select Plan</option>
                                    {plans.map(plan => (
                                        <option key={plan.id} value={plan.id}>
                                            {plan.name} ({plan.durationDays} days)
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                                <button type="button" onClick={() => setShowModal(false)} className="btn" style={{ flex: 1, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', borderRadius: '14px', fontWeight: 700 }}>Cancel</button>
                                <button type="submit" disabled={loading} className="btn btn-primary" style={{ flex: 2, borderRadius: '14px', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                    {loading ? 'Saving...' : <><Save size={18} /> SAVE CHANGES</>}
                                </button>
                            </div>

                            <div style={{ padding: '24px', background: 'rgba(239, 68, 68, 0.03)', borderRadius: '24px', border: '1px solid rgba(239, 68, 68, 0.1)', marginTop: '24px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                                    <Shield size={16} className="text-red-500" />
                                    <p style={{ fontSize: '0.75rem', fontWeight: 800, color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Security Zone</p>
                                </div>
                                <button 
                                    type="button"
                                    onClick={async () => {
                                        if (window.confirm('Reset password to standard default (gym123)?')) {
                                            setLoading(true);
                                            try {
                                                const res = await fetch(`/api/v1/members/${user.id}/reset-password`, { method: 'POST' });
                                                if (res.ok) alert('Password reset to: gym123');
                                                else alert('Reset failed');
                                            } catch (err) { alert('Reset failed'); }
                                            setLoading(false);
                                        }
                                    }}
                                    className="scale-hover"
                                    style={{ width: '100%', padding: '14px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '14px', fontWeight: 900, fontSize: '0.875rem' }}
                                >
                                    RESET PASSWORD (gym123)
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
