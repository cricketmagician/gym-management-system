"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RenewButton({ membershipId, currentStatus }: { membershipId: string, currentStatus: string }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [amount, setAmount] = useState('');
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);

    // Calculate preview end date (assuming 30 days as a standard duration for manual renewal)
    const calculateEndDate = () => {
        const start = new Date(startDate);
        start.setDate(start.getDate() + 30);
        return start.toLocaleDateString();
    };

    const handleRenew = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`/api/v1/memberships/${membershipId}/renew`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: Number(amount),
                    startDate: new Date(startDate).toISOString()
                })
            });

            if (!res.ok) throw new Error("Failed to renew membership");
            setShowModal(false);
            setAmount('');
            setStartDate(new Date().toISOString().split('T')[0]);
            router.refresh();
        } catch (error) {
            console.error(error);
            alert("An error occurred while renewing");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                className="btn"
                style={{ background: 'var(--surface-color)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
            >
                Renew / Pay
            </button>

            {showModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', zIndex: 100
                }}>
                    <div className="card" style={{ padding: '32px', width: '100%', maxWidth: '400px' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '16px' }}>Record Payment & Renew</h2>
                        <form onSubmit={handleRenew} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Start Date</label>
                                <input
                                    type="date"
                                    required
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', background: 'var(--surface-color)', color: 'var(--text-primary)' }}
                                />
                                <span style={{ fontSize: '0.75rem', color: 'var(--brand-primary)', fontWeight: 600 }}>
                                    New Expiry: {calculateEndDate()}
                                </span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Amount Paid (₹)</label>
                                <input
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
                            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                                <button type="button" onClick={() => setShowModal(false)} className="btn" style={{ flex: 1, border: '1px solid var(--border-color)', background: 'transparent' }}>Cancel</button>
                                <button type="submit" disabled={loading} className="btn btn-primary" style={{ flex: 1 }}>
                                    {loading ? 'Processing...' : 'Confirm'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
