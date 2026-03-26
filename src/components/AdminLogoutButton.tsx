"use client"

import React, { useState } from 'react';
import { LogOut, X } from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function AdminLogoutButton() {
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        signOut({ callbackUrl: '/login' });
    };

    return (
        <>
            <button 
                onClick={() => setIsOpen(true)}
                style={{ 
                    background: 'rgba(0,0,0,0.05)', 
                    border: 'none', 
                    padding: '10px 16px', 
                    borderRadius: '12px', 
                    color: '#111', 
                    fontWeight: 700, 
                    fontSize: '0.8125rem', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                }}
                className="admin-logout-btn"
            >
                <LogOut size={16} /> LOG OUT
            </button>

            {isOpen && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div 
                        onClick={() => setIsOpen(false)} 
                        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)' }} 
                    />
                    <div style={{ 
                        position: 'relative', 
                        width: '100%', 
                        maxWidth: '400px', 
                        background: '#fff', 
                        borderRadius: '32px', 
                        padding: '32px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '24px',
                        animation: 'popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        color: '#000'
                    }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '16px' }}>
                            <div style={{ width: '64px', height: '64px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <LogOut size={32} />
                            </div>
                            <div>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-0.02em' }}>Admin Log Out</h2>
                                <p style={{ color: '#666', fontSize: '0.9375rem', marginTop: '4px', fontWeight: 500 }}>Are you sure you want to end your administration session?</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <button 
                                onClick={handleLogout}
                                style={{ width: '100%', padding: '16px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '16px', fontWeight: 800, fontSize: '0.9375rem', cursor: 'pointer', boxShadow: '0 10px 20px rgba(239, 68, 68, 0.1)' }}
                            >
                                YES, LOG OUT
                            </button>
                            <button 
                                onClick={() => setIsOpen(false)}
                                style={{ width: '100%', padding: '16px', background: 'transparent', color: '#64748b', border: 'none', borderRadius: '16px', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer' }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes popIn {
                    from { opacity: 0; transform: scale(0.9) translateY(20px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
                .admin-logout-btn:hover {
                    background: rgba(239, 68, 68, 0.1);
                    color: #ef4444;
                }
            `}</style>
        </>
    );
}
