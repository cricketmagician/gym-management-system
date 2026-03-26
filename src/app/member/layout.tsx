"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { Home, Dumbbell, Activity, User, Plus, X, QrCode, ClipboardList, TrendingUp } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function MemberLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <div className="member-bg">
            <div className="watermark-text">
                STAY STRONG{"\n"}
                BE BETTER{"\n"}
                TOGETHER{"\n"}
                PULSEFIT{"\n"}
                FOCUS
            </div>
            
            <main style={{ position: 'relative', zIndex: 1, padding: '20px 20px 100px 20px', maxWidth: '500px', margin: '0 auto' }}>
                {children}
            </main>

            {/* Quick Actions Overlay */}
            {isMenuOpen && (
                <div 
                    style={{ 
                        position: 'fixed', 
                        inset: 0, 
                        background: 'rgba(0,0,0,0.6)', 
                        backdropFilter: 'blur(10px)', 
                        zIndex: 100, 
                        display: 'flex', 
                        flexDirection: 'column', 
                        justifyContent: 'flex-end', 
                        padding: '24px',
                        paddingBottom: '120px',
                        gap: '16px'
                    }}
                    onClick={toggleMenu}
                >
                    <div className="glass-card animate-fade-in" style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }} onClick={e => e.stopPropagation()}>
                        <QuickActionItem icon={<QrCode size={20} />} label="Scan QR (Check-in)" href="/member/checkin" onClick={toggleMenu} />
                        <QuickActionItem icon={<ClipboardList size={20} />} label="Log New Workout" href="/member/workouts/new" onClick={toggleMenu} />
                        <QuickActionItem icon={<TrendingUp size={20} />} label="Update Weight Goal" href="/member/profile/goals" onClick={toggleMenu} />
                        <QuickActionItem icon={<User size={20} />} label="Manage Profile" href="/member/profile" onClick={toggleMenu} last />
                    </div>
                </div>
            )}

            <nav className="bottom-nav">
                <Link href="/member/dashboard" className={`nav-item ${pathname === '/member/dashboard' ? 'active' : ''}`}>
                    <Home size={24} />
                    <span>Home</span>
                </Link>
                <Link href="/member/exercises" className={`nav-item ${pathname === '/member/exercises' ? 'active' : ''}`}>
                    <Dumbbell size={24} />
                    <span>Dumbbell</span>
                </Link>
                
                <div className="fab-container">
                    <button 
                        className={`fab ${isMenuOpen ? 'open' : ''}`} 
                        onClick={toggleMenu}
                        style={{ border: 'none', transition: 'transform 0.3s ease' }}
                    >
                        {isMenuOpen ? <X size={32} /> : <Plus size={32} />}
                    </button>
                </div>

                <Link href="/member/workouts" className={`nav-item ${pathname === '/member/workouts' ? 'active' : ''}`}>
                    <Activity size={24} />
                    <span>Workout</span>
                </Link>
                <Link href="/member/profile" className={`nav-item ${pathname === '/member/profile' ? 'active' : ''}`}>
                    <User size={24} />
                    <span>Profile</span>
                </Link>
            </nav>

            <style jsx>{`
                .fab.open {
                    transform: rotate(90deg);
                    background: #2dd4bf !important;
                    color: #000 !important;
                }
                .animate-fade-in {
                    animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}

function QuickActionItem({ icon, label, last, href, onClick }: { icon: React.ReactNode, label: string, last?: boolean, href: string, onClick: () => void }) {
    return (
        <Link href={href} onClick={onClick} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '16px', 
                padding: '16px', 
                borderBottom: last ? 'none' : '1px solid rgba(0,0,0,0.05)',
                cursor: 'pointer'
            }}>
                <div style={{ color: '#2dd4bf' }}>{icon}</div>
                <span style={{ fontSize: '0.9375rem', fontWeight: 600 }}>{label}</span>
            </div>
        </Link>
    );
}
