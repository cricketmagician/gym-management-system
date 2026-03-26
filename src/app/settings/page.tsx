"use client"

import React, { useState, useEffect } from 'react';
import QRCode from "react-qr-code";
import { Download, Save, Instagram, Phone, MapPin, Globe, Loader2, CheckCircle2, Building, QrCode as QrIcon } from 'lucide-react';

export default function SettingsPage() {
    const [gym, setGym] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState<any>(null);

    // Dynamic QR Value based on Gym ID
    const qrValue = gym ? JSON.stringify({ action: 'check-in', gymId: gym.id }) : "";

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/v1/admin/gym-config');
            const data = await res.json();
            setGym(data);
        } catch (error) {
            console.error("Failed to fetch settings", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setStatus(null);

        try {
            const res = await fetch('/api/v1/admin/gym-config', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(gym)
            });

            if (res.ok) {
                setStatus({ type: 'success', message: 'Settings updated successfully!' });
                setTimeout(() => setStatus(null), 3000);
            }
        } catch (error) {
            setStatus({ type: 'error', message: 'Failed to update settings.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500 font-bold"><Loader2 className="animate-spin mx-auto mb-2" /> Loading Admin Portal...</div>;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <header>
                <h1 style={{ fontSize: '1.875rem', fontWeight: 900, letterSpacing: '-0.025em' }}>Gym Settings & Assets</h1>
                <p style={{ color: 'var(--text-secondary)', marginTop: '4px', fontWeight: 500 }}>Configure your facility profile and manage check-in assets.</p>
            </header>

            <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
                {/* Left Column: QR Assets */}
                <div className="card" style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', padding: '48px', border: '2px dashed var(--brand-primary)', borderRadius: '24px' }}>
                    <div style={{ textAlign: 'center' }}>
                         <div style={{ background: 'var(--brand-primary)', color: 'white', padding: '8px', borderRadius: '12px', width: 'fit-content', margin: '0 auto 16px' }}>
                            <QrIcon size={24} />
                        </div>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Check-in QR Code</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '8px', fontWeight: 500 }}>Print and display this QR code at your entrance.</p>
                    </div>

                    <div style={{ background: 'white', padding: '24px', borderRadius: '24px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', border: '1px solid #eee' }}>
                        {qrValue && <QRCode value={qrValue} size={250} />}
                    </div>

                    <p style={{ fontSize: '0.75rem', color: '#888', fontWeight: 600 }}>Unique ID: {gym?.id}</p>
                    
                    <button className="btn btn-primary" style={{ width: '100%', maxWidth: '240px', display: 'flex', gap: '8px', justifyContent: 'center', fontWeight: 'bold', padding: '14px', borderRadius: '14px' }}>
                        <Download size={18} /> Download Print-Ready
                    </button>
                </div>

                {/* Right Column: Configuration Form */}
                <div className="card" style={{ flex: '1 1 500px', padding: '32px', borderRadius: '24px' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Building size={22} className="text-brand-primary" /> Facility Profile
                    </h2>
                    
                    <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 800, color: '#aaa', textTransform: 'uppercase', marginBottom: '6px' }}>Gym Display Name</label>
                            <input 
                                type="text" 
                                value={gym.name}
                                onChange={(e) => setGym({...gym, name: e.target.value})}
                                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--surface-color)', fontWeight: 600 }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 800, color: '#aaa', textTransform: 'uppercase', marginBottom: '6px' }}>Location Description</label>
                            <textarea 
                                value={gym.locationDesc || ''}
                                onChange={(e) => setGym({...gym, locationDesc: e.target.value})}
                                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--surface-color)', fontWeight: 600, minHeight: '80px' }}
                                placeholder="Sector 18, NOIDA..."
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 800, color: '#aaa', textTransform: 'uppercase', marginBottom: '6px' }}>Dashboard Banner URL</label>
                            <input 
                                type="url" 
                                value={gym.bannerUrl || ''}
                                onChange={(e) => setGym({...gym, bannerUrl: e.target.value})}
                                placeholder="https://images.unsplash.com/your-gym-photo"
                                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--surface-color)', fontWeight: 600 }}
                            />
                            {gym.bannerUrl && (
                                <img src={gym.bannerUrl} alt="Preview" style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '12px', marginTop: '8px', border: '1px solid #eee' }} />
                            )}
                        </div>

                        <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '8px 0' }} />

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 800, color: '#aaa', textTransform: 'uppercase', marginBottom: '6px' }}>
                                    <Phone size={10} style={{ marginRight: '4px' }} /> WhatsApp Number
                                </label>
                                <input 
                                    type="text" 
                                    value={gym.whatsappNumber || ''}
                                    onChange={(e) => setGym({...gym, whatsappNumber: e.target.value})}
                                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--surface-color)', fontWeight: 600 }}
                                    placeholder="+91 9876543210"
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 800, color: '#aaa', textTransform: 'uppercase', marginBottom: '6px' }}>
                                    <Instagram size={10} style={{ marginRight: '4px' }} /> Instagram Link
                                </label>
                                <input 
                                    type="text" 
                                    value={gym.instagramLink || ''}
                                    onChange={(e) => setGym({...gym, instagramLink: e.target.value})}
                                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--surface-color)', fontWeight: 600 }}
                                    placeholder="https://instagram.com/..."
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={saving}
                            style={{ 
                                marginTop: '12px',
                                background: 'black', 
                                color: 'white', 
                                padding: '16px', 
                                borderRadius: '16px', 
                                border: 'none', 
                                fontWeight: 800, 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                gap: '8px', 
                                cursor: 'pointer',
                                opacity: saving ? 0.7 : 1
                            }}
                        >
                            {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                            Update Facility Profile
                        </button>

                        {status && (
                            <div style={{ 
                                padding: '12px', 
                                borderRadius: '12px', 
                                background: status.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                color: status.type === 'success' ? '#15803d' : '#b91c1c',
                                fontSize: '0.85rem',
                                fontWeight: 700,
                                textAlign: 'center'
                            }}>
                                {status.message}
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}
