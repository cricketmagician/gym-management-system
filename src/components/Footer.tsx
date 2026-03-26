'use client';

import React from 'react';
import { Instagram, MessageSquare, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
    gymName: string;
}

export default function Footer({ gymName }: FooterProps) {
    const peachColor = '#FF8B7A'; // Premium Dark Peach

    return (
        <footer style={{ 
            marginTop: 'auto',
            width: '100%',
            padding: '40px 20px',
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(16px)',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px',
            zIndex: 10
        }}>
            <div style={{ maxWidth: '1100px', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '32px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '24px', height: '24px', background: peachColor, borderRadius: '6px' }}></div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 900, letterSpacing: '-0.02em' }}>{gymName.toUpperCase()}</h3>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>Premium Fitness Management Experience</p>
                </div>

                <div style={{ display: 'flex', gap: '24px' }}>
                    <a href="#" style={{ color: 'rgba(255,255,255,0.6)', transition: 'color 0.2s ease' }} onMouseOver={e => e.currentTarget.style.color = peachColor} onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>
                        <Instagram size={20} />
                    </a>
                    <a href="#" style={{ color: 'rgba(255,255,255,0.6)', transition: 'color 0.2s ease' }} onMouseOver={e => e.currentTarget.style.color = peachColor} onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>
                        <MessageSquare size={20} />
                    </a>
                </div>
            </div>

            <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.05)', maxWidth: '1100px' }}></div>

            <div style={{ maxWidth: '1100px', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', opacity: 0.6, fontSize: '0.75rem', fontWeight: 600 }}>
                <p>© {new Date().getFullYear()} {gymName}. All rights reserved.</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ShieldCheck size={14} color={peachColor} />
                    <span>Powered by <span style={{ color: peachColor, fontWeight: 800 }}>PulseFit</span></span>
                </div>
            </div>
        </footer>
    );
}
