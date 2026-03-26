"use client"

import React, { useState, useEffect } from 'react';
import QRCode from "react-qr-code";
import { Download, Save, Instagram, Phone, MapPin, Globe, Loader2, CheckCircle2, Building, QrCode as QrIcon, Wifi } from 'lucide-react';
import { getDirectImageUrl } from '@/lib/image-utils';
import UPIQRCode from '@/components/UPIQRCode';

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
                <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '8px', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Gym Settings & Assets</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', fontWeight: 500, opacity: 0.9 }}>Global configuration and facility access management.</p>
            </header>

            <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
                {/* Left Column: QR Assets */}
                <div className="card" style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', padding: '48px', border: '2px dashed var(--brand-primary)', borderRadius: '24px' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ background: 'var(--brand-primary)', color: 'white', padding: '8px', borderRadius: '12px', width: 'fit-content', margin: '0 auto 16px' }}>
                            <QrIcon size={24} />
                        </div>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>Check-in QR Code</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '8px', fontWeight: 500 }}>Print and display this QR code at your entrance.</p>
                    </div>

                    <div style={{ background: 'white', padding: '24px', borderRadius: '24px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', border: '1px solid #eee' }}>
                        {qrValue && <QRCode value={qrValue} size={250} />}
                    </div>

                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Unique ID: {gym?.id}</p>
                    
                    <button className="btn btn-primary" style={{ width: '100%', maxWidth: '240px', display: 'flex', gap: '8px', justifyContent: 'center', fontWeight: 'bold', padding: '14px', borderRadius: '14px' }}>
                        <Download size={18} /> Download Print-Ready
                    </button>
                </div>

                {/* Right Column: Configuration Form */}
                <div className="card" style={{ flex: '1 1 500px', padding: '32px', borderRadius: '24px', background: 'var(--surface-color)', border: '1px solid var(--border-color)' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-primary)' }}>
                        <Building size={22} color="var(--brand-primary)" /> Facility Profile
                    </h2>
                    
                    <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>Gym Display Name</label>
                            <input 
                                type="text" 
                                value={gym.name}
                                onChange={(e) => setGym({...gym, name: e.target.value})}
                                style={{ width: '100%', padding: '14px 18px', borderRadius: '14px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)', fontWeight: 600, fontSize: '1rem' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>Location Description</label>
                            <textarea 
                                value={gym.locationDesc || ''}
                                onChange={(e) => setGym({...gym, locationDesc: e.target.value})}
                                style={{ width: '100%', padding: '14px 18px', borderRadius: '14px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)', fontWeight: 600, fontSize: '1rem', minHeight: '100px', resize: 'none' }}
                                placeholder="Sector 18, NOIDA..."
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>Dashboard Banner URL</label>
                            <input 
                                type="url" 
                                value={gym.bannerUrl || ''}
                                onChange={(e) => setGym({...gym, bannerUrl: e.target.value})}
                                placeholder="https://images.unsplash.com/your-gym-photo"
                                style={{ width: '100%', padding: '14px 18px', borderRadius: '14px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)', fontWeight: 600, fontSize: '1rem' }}
                            />
                            {gym.bannerUrl && (
                                <div style={{ marginTop: '12px' }}>
                                    <p style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase' }}>Preview</p>
                                    <img src={getDirectImageUrl(gym.bannerUrl)} alt="Preview" style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '16px', border: '1px solid var(--border-color)' }} />
                                </div>
                            )}
                        </div>

                        <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '8px 0' }} />

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>
                                    WhatsApp Number
                                </label>
                                <input 
                                    type="text" 
                                    value={gym.whatsappNumber || ''}
                                    onChange={(e) => setGym({...gym, whatsappNumber: e.target.value})}
                                    style={{ width: '100%', padding: '14px 18px', borderRadius: '14px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)', fontWeight: 600, fontSize: '1rem' }}
                                    placeholder="+91 9876543210"
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>
                                    Instagram Link
                                </label>
                                <input 
                                    type="text" 
                                    value={gym.instagramLink || ''}
                                    onChange={(e) => setGym({...gym, instagramLink: e.target.value})}
                                    style={{ width: '100%', padding: '14px 18px', borderRadius: '14px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)', fontWeight: 600, fontSize: '1rem' }}
                                    placeholder="https://instagram.com/..."
                                />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>
                                    Merchant UPI ID
                                </label>
                                <input 
                                    type="text" 
                                    value={gym.upiId || ''}
                                    onChange={(e) => setGym({...gym, upiId: e.target.value})}
                                    style={{ width: '100%', padding: '14px 18px', borderRadius: '14px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)', fontWeight: 600, fontSize: '1rem' }}
                                    placeholder="yourgym@upi"
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>
                                    UPI Phone / Number
                                </label>
                                <input 
                                    type="text" 
                                    value={gym.upiNumber || ''}
                                    onChange={(e) => setGym({...gym, upiNumber: e.target.value})}
                                    style={{ width: '100%', padding: '14px 18px', borderRadius: '14px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)', fontWeight: 600, fontSize: '1rem' }}
                                    placeholder="9876543210"
                                />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>
                                    Gym Wifi SSID
                                </label>
                                <input 
                                    type="text" 
                                    value={gym.wifiSsid || ''}
                                    onChange={(e) => setGym({...gym, wifiSsid: e.target.value})}
                                    style={{ width: '100%', padding: '14px 18px', borderRadius: '14px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)', fontWeight: 600, fontSize: '1rem' }}
                                    placeholder="PulseFit_5G"
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>
                                    Wifi Password
                                </label>
                                <input 
                                    type="text" 
                                    value={gym.wifiPassword || ''}
                                    onChange={(e) => setGym({...gym, wifiPassword: e.target.value})}
                                    style={{ width: '100%', padding: '14px 18px', borderRadius: '14px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)', fontWeight: 600, fontSize: '1rem' }}
                                    placeholder="password123"
                                />
                            </div>
                        </div>

                        {gym.upiId && (
                            <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '32px', background: 'rgba(0,0,0,0.02)', borderRadius: '24px', border: '1px solid var(--border-color)' }}>
                                <p style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Global Payment QR Preview</p>
                                <UPIQRCode upiId={gym.upiId} gymName={gym.name} />
                                <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600, opacity: 0.7 }}>This QR code will be dynamically generated for all member renewal reminders.</p>
                            </div>
                        )}

                        <button 
                            type="submit" 
                            disabled={saving}
                            style={{ 
                                marginTop: '12px',
                                background: 'var(--text-primary)', 
                                color: 'var(--surface-color)', 
                                padding: '18px', 
                                borderRadius: '18px', 
                                border: 'none', 
                                fontWeight: 900, 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                gap: '10px', 
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                opacity: saving ? 0.7 : 1,
                                width: '100%',
                                fontSize: '1rem',
                                letterSpacing: '0.02em',
                                boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                            }}
                        >
                            {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                            {saving ? "SAVING UPDATES..." : "UPDATE FACILITY PROFILE"}
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
