"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getDirectImageUrl } from '@/lib/image-utils';

export default function NewMemberPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [plans, setPlans] = useState<any[]>([]);
    const [selectedPlanId, setSelectedPlanId] = useState('');
    const [amount, setAmount] = useState<string>('');
    const [photoUrl, setPhotoUrl] = useState<string>('');
    const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [endDateDisplay, setEndDateDisplay] = useState<string>('');

    React.useEffect(() => {
        fetch('/api/v1/plans')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setPlans(data);
            })
            .catch(console.error);
    }, []);

    useEffect(() => {
        if (selectedPlanId && startDate && plans.length > 0) {
            const plan = plans.find(p => p.id === selectedPlanId);
            if (plan) {
                const end = new Date(startDate);
                end.setDate(end.getDate() + plan.durationDays);
                setEndDateDisplay(end.toLocaleDateString());
            } else {
                setEndDateDisplay('');
            }
        } else {
            setEndDateDisplay('');
        }
    }, [selectedPlanId, startDate, plans]);

    const handlePlanChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const id = e.target.value;
        setSelectedPlanId(id);
        // Pricing is now fully customized by the gym at checkout based on negotiation/discounts
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData(e.currentTarget);

        try {
            const res = await fetch('/api/v1/members', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phone: formData.get('phone'),
                    email: formData.get('email') || null,
                    name: formData.get('name'),
                    gender: formData.get('gender'),
                    password: formData.get('password'),
                    amount: amount ? Number(amount) : 0,
                    planId: selectedPlanId || null,
                    startDate: new Date(startDate).toISOString(),
                    photoUrl: photoUrl || null
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to create member');

            router.push('/members');
            router.refresh();
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '600px', margin: '0 auto' }}>
            <header>
                <h1 style={{ fontSize: '1.875rem', fontWeight: 700, letterSpacing: '-0.025em' }}>Create New Member</h1>
                <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Add a new user to the pulsefit database.</p>
            </header>

            <div className="card" style={{ padding: '32px' }}>
                {error && <div style={{ padding: '12px', background: 'var(--status-expired-bg)', color: 'var(--status-expired-text)', borderRadius: '8px', marginBottom: '24px' }}>{error}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Gender</label>
                        <select name="gender" required style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', background: 'var(--surface-color)', color: 'var(--text-primary)' }}>
                            <option value="">Select Gender</option>
                            <option value="MALE">Male</option>
                            <option value="FEMALE">Female</option>
                            <option value="OTHER">Other</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Full Name</label>
                        <input name="name" type="text" required style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} placeholder="John Doe" />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Phone Number</label>
                        <input name="phone" type="tel" required style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} placeholder="+91 9876543210" />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Email Address (Optional)</label>
                        <input name="email" type="email" style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} placeholder="john@example.com" />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Profile Photo URL (Optional)</label>
                        <input 
                            name="photoUrl" 
                            type="url" 
                            value={photoUrl}
                            onChange={(e) => setPhotoUrl(e.target.value)}
                            style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} 
                            placeholder="Google Drive link..." 
                        />
                        {photoUrl && (
                            <div style={{ marginTop: '8px' }}>
                                <p style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase' }}>Preview</p>
                                <img src={getDirectImageUrl(photoUrl)} alt="Preview" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '16px', border: '1px solid var(--border-color)' }} />
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Member Login Password</label>
                        <input name="password" type="password" required style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} placeholder="••••••••" />
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>This password allows the member to log into their own PulseFit dashboard.</span>
                    </div>

                    <div style={{ display: 'flex', gap: '16px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Start Date</label>
                            <input
                                type="date"
                                required
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', background: 'var(--surface-color)', color: 'var(--text-primary)' }}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Membership</label>
                            <select
                                name="planId"
                                required
                                value={selectedPlanId}
                                onChange={handlePlanChange}
                                style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', background: 'var(--surface-color)', color: 'var(--text-primary)' }}
                            >
                                <option value="">Select Plan</option>
                                {plans.map(plan => (
                                    <option key={plan.id} value={plan.id}>
                                        {plan.name} ({plan.durationDays} days)
                                    </option>
                                ))}
                            </select>
                            {endDateDisplay && (
                                <span style={{ fontSize: '0.75rem', color: 'var(--brand-primary)', fontWeight: 600 }}>
                                    Ends on: {endDateDisplay}
                                </span>
                            )}
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Amount Paid (₹)</label>
                        <input
                            name="amount"
                            type="number"
                            min="0"
                            step="0.01"
                            required
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}
                            placeholder="3999.00"
                        />
                    </div>

                    <div style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
                        <button type="button" onClick={() => router.back()} className="btn" style={{ flex: 1, border: '1px solid var(--border-color)', background: 'transparent' }}>Cancel</button>
                        <button type="submit" disabled={loading} className="btn btn-primary" style={{ flex: 2 }}>
                            {loading ? 'Creating...' : 'Create Member'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
