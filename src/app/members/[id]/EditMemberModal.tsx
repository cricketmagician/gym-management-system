"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
                className="btn"
                style={{ background: 'var(--brand-primary)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 600 }}
            >
                Manage Profile
            </button>

            {showModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', zIndex: 100
                }}>
                    <div className="card" style={{ padding: '32px', width: '100%', maxWidth: '400px' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '24px' }}>Edit Member Profile</h2>
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
                            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                                <button type="button" onClick={() => setShowModal(false)} className="btn" style={{ flex: 1, border: '1px solid var(--border-color)', background: 'transparent' }}>Cancel</button>
                                <button type="submit" disabled={loading} className="btn btn-primary" style={{ flex: 2 }}>
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
