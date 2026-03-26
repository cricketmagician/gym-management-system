'use client';

import { CreditCard, Save, CheckCircle2, AlertCircle, QrCode } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import UPIQRCode from './UPIQRCode';

interface GymPaymentSettingsProps {
    gymId: string;
    gymName: string;
    initialUpiId: string;
    initialUpiNumber: string;
}

export default function GymPaymentSettings({ gymId, gymName, initialUpiId, initialUpiNumber }: GymPaymentSettingsProps) {
    const [upiId, setUpiId] = useState(initialUpiId);
    const [upiNumber, setUpiNumber] = useState(initialUpiNumber);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const router = useRouter();

    const handleSave = async () => {
        setLoading(true);
        setStatus('idle');
        try {
            const res = await fetch(`/api/v1/gyms/${gymId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ upiId, upiNumber })
            });

            if (!res.ok) throw new Error('Failed to update gym settings');
            
            setStatus('success');
            router.refresh();
            setTimeout(() => setStatus('idle'), 3000);
        } catch (err) {
            console.error(err);
            setStatus('error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '32px', background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '24px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ padding: '8px', background: 'rgba(var(--brand-primary-rgb), 0.1)', borderRadius: '10px' }}>
                    <QrCode size={20} color="var(--brand-primary)" />
                </div> 
                Gym Payment Settings (Admin Only)
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>UPI ID</label>
                            <input 
                                type="text" 
                                value={upiId} 
                                onChange={(e) => setUpiId(e.target.value)}
                                placeholder="e.g. yourgym@upi"
                                style={{ padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.02)', fontSize: '0.9375rem', fontWeight: 600 }}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>UPI Number / Phone</label>
                            <input 
                                type="text" 
                                value={upiNumber} 
                                onChange={(e) => setUpiNumber(e.target.value)}
                                placeholder="e.g. 9876543210"
                                style={{ padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.02)', fontSize: '0.9375rem', fontWeight: 600 }}
                            />
                        </div>
                    </div>

                    <button 
                        onClick={handleSave} 
                        disabled={loading}
                        style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            gap: '10px', 
                            padding: '16px', 
                            background: status === 'success' ? '#22c55e' : (status === 'error' ? '#ef4444' : '#000'), 
                            color: '#fff', 
                            borderRadius: '16px', 
                            fontWeight: 800, 
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'all 0.3s ease',
                            border: 'none',
                            opacity: loading ? 0.7 : 1,
                            fontSize: '0.9375rem'
                        }}
                    >
                        {loading ? 'Saving...' : (
                            status === 'success' ? (
                                <><CheckCircle2 size={18} /> Settings Saved!</>
                            ) : (
                                status === 'error' ? (
                                    <><AlertCircle size={18} /> Error Saving</>
                                ) : (
                                    <><Save size={18} /> Update Payment Details</>
                                )
                            )
                        )}
                    </button>
                </div>
                
                {upiId && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                        <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', textAlign: 'center' }}>Live UPI QR Preview</p>
                        <UPIQRCode upiId={upiId} gymName={gymName} />
                    </div>
                )}
            </div>
        </div>
    );
}
