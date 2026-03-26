'use client';

import React, { useState } from 'react';
import { Instagram, MessageSquare, ShieldCheck, Heart, LogOut, ArrowUpRight, Zap, Trophy, User, KeyRound } from 'lucide-react';
import { Session } from 'next-auth';
import ChangePasswordModal from './ChangePasswordModal';

interface FooterProps {
    gymName: string;
    session?: Session | null;
}

export default function Footer({ gymName, session }: FooterProps) {
    const amberColor = '#f59e0b'; // Elite Amber
    const isSuperAdmin = session?.user?.role === 'SUPER_ADMIN';
    const displayGymName = isSuperAdmin ? 'PULSEFIT GLOBAL' : gymName;
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    return (
        <footer style={{ 
            marginTop: 'auto',
            width: '100%',
            padding: '80px 40px 40px',
            background: '#000',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            gap: '64px',
            zIndex: 0,
            position: 'relative'
        }}>
            {/* Top Section - Brand & Navigation */}
            <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '48px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{ width: '32px', height: '32px', background: amberColor, borderRadius: '8px', boxShadow: `0 0 20px ${amberColor}30` }}></div>
                        <h3 style={{ fontSize: '1.75rem', fontWeight: 950, letterSpacing: '-0.04em' }}>{displayGymName.toUpperCase()}</h3>
                    </div>
                    <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.4)', fontWeight: 500, lineHeight: 1.6, maxWidth: '300px' }}>
                        Crafting elite fitness ecosystems for the next generation of performance athletes.
                    </p>
                    <div style={{ display: 'flex', gap: '16px' }}>
                        <a href="#" className="footer-icon-link"><Instagram size={20} /></a>
                        <a href="#" className="footer-icon-link"><MessageSquare size={20} /></a>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <h4 style={{ fontSize: '0.7rem', fontWeight: 900, color: amberColor, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Management</h4>
                        <a href="/admin/gym-hub" className="footer-link">Gym Hub</a>
                        <a href="/reports" className="footer-link">Analytics</a>
                        <a href="/members" className="footer-link">Directory</a>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <h4 style={{ fontSize: '0.7rem', fontWeight: 900, color: amberColor, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Elite Status</h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', fontWeight: 600 }}>
                            <Zap size={14} className="text-amber-500" /> Platinum Hub
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', fontWeight: 600 }}>
                            <Trophy size={14} className="text-teal-500" /> Top Performer
                        </div>
                    </div>
                </div>

                {/* Session Context Section */}
                {session ? (
                    <div style={{ 
                        background: 'rgba(255,255,255,0.02)', 
                        padding: '32px', 
                        borderRadius: '24px', 
                        border: '1px solid rgba(255,255,255,0.05)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '24px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ 
                                width: '48px', 
                                height: '48px', 
                                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', 
                                borderRadius: '16px', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                color: '#000',
                                fontWeight: 950,
                                fontSize: '1.125rem',
                                boxShadow: '0 10px 20px rgba(245, 158, 11, 0.2)'
                            }}>
                                {session.user?.name?.[0] || 'U'}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontSize: '1rem', fontWeight: 900 }}>{session.user?.name}</span>
                                <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>{session.user?.email}</span>
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <button 
                                onClick={() => setIsPasswordModalOpen(true)}
                                style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center', 
                                    gap: '10px',
                                    padding: '12px',
                                    background: 'rgba(255,255,255,0.03)',
                                    color: 'rgba(255,255,255,0.6)',
                                    borderRadius: '12px',
                                    fontSize: '0.8125rem',
                                    fontWeight: 700,
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }} className="scale-hover">
                                <KeyRound size={14} /> SECURITY ROTATION
                            </button>
                            <a href="/api/auth/signout" style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                gap: '10px',
                                padding: '14px',
                                background: 'rgba(239, 68, 68, 0.1)',
                                color: '#ef4444',
                                borderRadius: '12px',
                                fontSize: '0.875rem',
                                fontWeight: 800,
                                textDecoration: 'none',
                                border: '1px solid rgba(239, 68, 68, 0.1)',
                                transition: 'all 0.2s ease'
                            }} className="scale-hover">
                                <LogOut size={16} /> END SESSION
                            </a>
                        </div>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                         <h4 style={{ fontSize: '0.7rem', fontWeight: 900, color: amberColor, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Access Control</h4>
                         <a href="/api/auth/signin" style={{ color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            Secure Portal Access <ArrowUpRight size={16} />
                         </a>
                    </div>
                )}
            </div>

            {/* Bottom Bar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1200px', width: '100%', margin: '0 auto' }}>
                <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.05)' }}></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                    <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', fontWeight: 700 }}>
                        © {new Date().getFullYear()} {displayGymName}. GLOBAL OPERATIONS SECURED.
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.7rem', fontWeight: 900, letterSpacing: '0.1em', opacity: 0.5 }}>
                        <ShieldCheck size={14} className="text-amber-500" /> 
                        <span>POWERED BY <span style={{ color: amberColor }}>PULSEFIT ELITE</span></span>
                    </div>
                </div>
            </div>

            <ChangePasswordModal 
                isOpen={isPasswordModalOpen} 
                onClose={() => setIsPasswordModalOpen(false)} 
            />

            <style jsx>{`
                .footer-link {
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: rgba(255,255,255,0.5);
                    text-decoration: none;
                    transition: color 0.2s ease;
                    cursor: pointer;
                    display: block;
                }
                .footer-link:hover { color: #f59e0b; }
                .footer-icon-link {
                    color: rgba(255,255,255,0.4);
                    transition: all 0.2s ease;
                    background: rgba(255,255,255,0.02);
                    padding: 8px;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .footer-icon-link:hover {
                    color: #fff;
                    background: rgba(255,255,255,0.05);
                    transform: translateY(-2px);
                }
            `}</style>
        </footer>
    );
}
