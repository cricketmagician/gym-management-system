"use client"
import React, { useState } from 'react';
import QRCode from "react-qr-code";
import { Download, Share2 } from 'lucide-react';

export default function SettingsPage() {
    // In a real app, this would be the Gym's unique ID for their tenant
    const GYM_STATIC_QR_VALUE = JSON.stringify({ action: 'check-in', gymId: 'gym_01_pulsefit' });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <header>
                <h1 style={{ fontSize: '1.875rem', fontWeight: 700, letterSpacing: '-0.025em' }}>Gym Settings & Assets</h1>
                <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Configure your facility and download printables.</p>
            </header>

            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                <div className="card" style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', padding: '48px', border: '2px dashed var(--brand-primary)' }}>
                    <div style={{ textAlign: 'center' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Front Desk QR Code</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '8px' }}>Print and display this QR code at your entrance. Members will scan this using their app to mark attendance.</p>
                    </div>

                    <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                        <QRCode value={GYM_STATIC_QR_VALUE} size={250} />
                    </div>

                    <div style={{ display: 'flex', gap: '12px', width: '100%', justifyContent: 'center' }}>
                        <button className="btn btn-primary" style={{ flex: 1, maxWidth: '200px', display: 'flex', gap: '8px', justifyContent: 'center' }}>
                            <Download size={18} /> Download PDF
                        </button>
                    </div>
                </div>

                <div className="card" style={{ flex: '1 1 300px', padding: '32px' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '24px' }}>General Configuration</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>Other gym settings will go here (business hours, address, branding options, API webhooks, etc).</p>
                    <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '24px 0' }} />
                    <p style={{ color: 'var(--text-secondary)' }}>You are currently configuring: <strong>PulseFit Downtown</strong></p>
                </div>
            </div>
        </div>
    );
}
