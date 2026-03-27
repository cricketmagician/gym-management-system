"use client"

import React, { useState, useEffect } from 'react';
import QRCode from "react-qr-code";
import { Download, Save, Instagram, Phone, MapPin, Globe, Loader2, CheckCircle2, Building, QrCode as QrIcon, Wifi, Eye, Layout, Palette, Type, Image as ImageIcon, X } from 'lucide-react';
import { getDirectImageUrl } from '@/lib/image-utils';
import UPIQRCode from '@/components/UPIQRCode';
import LoginPreview from '@/components/LoginPreview';

export default function SettingsPage() {
    const [gym, setGym] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState<any>(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

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

                        <div style={{ padding: '24px', background: 'rgba(0,0,0,0.02)', borderRadius: '24px', border: '1px solid var(--border-color)', marginTop: '8px' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: 900, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Palette size={18} color="var(--brand-primary)" /> Branding & Login Customization
                            </h3>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>Primary Brand Color</label>
                                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                        <input 
                                            type="color" 
                                            value={gym.primaryColor || '#2dd4bf'}
                                            onChange={(e) => setGym({...gym, primaryColor: e.target.value})}
                                            style={{ width: '50px', height: '50px', padding: '4px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', cursor: 'pointer' }}
                                        />
                                        <input 
                                            type="text" 
                                            value={gym.primaryColor || '#2dd4bf'}
                                            onChange={(e) => setGym({...gym, primaryColor: e.target.value})}
                                            style={{ flex: 1, padding: '14px 18px', borderRadius: '14px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)', fontWeight: 600 }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>Logo URL</label>
                                    <input 
                                        type="url" 
                                        value={gym.logoUrl || ''}
                                        onChange={(e) => setGym({...gym, logoUrl: e.target.value})}
                                        placeholder="https://your-site.com/logo.png"
                                        style={{ width: '100%', padding: '14px 18px', borderRadius: '14px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)', fontWeight: 600 }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>Login Background image URL</label>
                                    <input 
                                        type="url" 
                                        value={gym.loginBackgroundUrl || ''}
                                        onChange={(e) => setGym({...gym, loginBackgroundUrl: e.target.value})}
                                        placeholder="https://images.unsplash.com/gym-hero"
                                        style={{ width: '100%', padding: '14px 18px', borderRadius: '14px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)', fontWeight: 600 }}
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>Welcome Title</label>
                                        <input 
                                            type="text" 
                                            value={gym.welcomeTitle || ''}
                                            onChange={(e) => setGym({...gym, welcomeTitle: e.target.value})}
                                            placeholder="Empower Your Strength"
                                            style={{ width: '100%', padding: '14px 18px', borderRadius: '14px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)', fontWeight: 600 }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>Welcome Subtitle</label>
                                        <input 
                                            type="text" 
                                            value={gym.welcomeSubtitle || ''}
                                            onChange={(e) => setGym({...gym, welcomeSubtitle: e.target.value})}
                                            placeholder="Welcome back! Sign in to continue..."
                                            style={{ width: '100%', padding: '14px 18px', borderRadius: '14px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)', fontWeight: 600 }}
                                        />
                                    </div>
                                </div>

                                <button 
                                    type="button"
                                    onClick={() => setIsPreviewOpen(true)}
                                    style={{ 
                                        background: 'rgba(0,0,0,0.05)', 
                                        color: 'var(--text-primary)', 
                                        padding: '14px', 
                                        borderRadius: '14px', 
                                        border: '1px solid var(--border-color)', 
                                        fontWeight: 800, 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center', 
                                        gap: '10px', 
                                        cursor: 'pointer',
                                        width: '100%',
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    <Eye size={18} /> LIVE LOGIN PREVIEW
                                </button>
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

            {/* Live Preview Modal */}
            {isPreviewOpen && (
                <div style={{ 
                    position: 'fixed', 
                    top: 0, 
                    left: 0, 
                    right: 0, 
                    bottom: 0, 
                    background: 'rgba(0,0,0,0.8)', 
                    backdropFilter: 'blur(20px)',
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    zIndex: 2000,
                    padding: '40px'
                }} onClick={() => setIsPreviewOpen(false)}>
                    <div style={{ 
                        width: '100%', 
                        maxWidth: '900px', 
                        height: '700px',
                        background: 'var(--surface-color)', 
                        borderRadius: '32px', 
                        overflow: 'hidden', 
                        display: 'flex',
                        flexDirection: 'column',
                        boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
                        border: '1px solid var(--border-color)'
                    }} onClick={e => e.stopPropagation()}>
                        <header style={{ padding: '20px 32px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)' }}>Live Branding Preview</h3>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>This is exactly how your members will see your login page.</p>
                            </div>
                            <button onClick={() => setIsPreviewOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                                <X size={24} />
                            </button>
                        </header>
                        <div style={{ flex: 1, padding: '32px', overflowY: 'auto', background: 'rgba(0,0,0,0.05)' }}>
                            <LoginPreview config={gym} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
