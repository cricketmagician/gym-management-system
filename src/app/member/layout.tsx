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
                    <Home size={22} className="nav-icon" />
                    <span className="nav-label">Home</span>
                    {pathname === '/member/dashboard' && <div className="active-glow" />}
                </Link>
                <Link href="/member/exercises" className={`nav-item ${pathname === '/member/exercises' ? 'active' : ''}`}>
                    <Dumbbell size={22} className="nav-icon" />
                    <span className="nav-label">Exercises</span>
                    {pathname === '/member/exercises' && <div className="active-glow" />}
                </Link>
                
                <div className="fab-container">
                    <button 
                        className={`fab ${isMenuOpen ? 'open' : ''}`} 
                        onClick={toggleMenu}
                    >
                        {isMenuOpen ? <X size={28} /> : <Plus size={28} />}
                    </button>
                </div>

                <Link href="/member/workouts" className={`nav-item ${pathname === '/member/workouts' ? 'active' : ''}`}>
                    <Activity size={22} className="nav-icon" />
                    <span className="nav-label">Workout</span>
                    {pathname === '/member/workouts' && <div className="active-glow" />}
                </Link>
                <Link href="/member/profile" className={`nav-item ${pathname === '/member/profile' ? 'active' : ''}`}>
                    <User size={22} className="nav-icon" />
                    <span className="nav-label">Profile</span>
                    {pathname === '/member/profile' && <div className="active-glow" />}
                </Link>
            </nav>

            <style jsx>{`
                .bottom-nav {
                    position: fixed;
                    bottom: 24px;
                    left: 20px;
                    right: 20px;
                    height: 72px;
                    background: rgba(0, 0, 0, 0.7);
                    backdrop-filter: blur(24px);
                    -webkit-backdrop-filter: blur(24px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 24px;
                    display: flex;
                    justify-content: space-around;
                    align-items: center;
                    padding: 0 12px;
                    z-index: 1000;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                }
                .nav-item {
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 4px;
                    color: rgba(255, 255, 255, 0.4);
                    text-decoration: none;
                    font-size: 10px;
                    font-weight: 700;
                    transition: all 0.3s ease;
                    flex: 1;
                    height: 100%;
                    justify-content: center;
                }
                .nav-item.active {
                    color: #fff;
                }
                .active-glow {
                    position: absolute;
                    bottom: 8px;
                    width: 4px;
                    height: 4px;
                    background: #2dd4bf;
                    border-radius: 50%;
                    box-shadow: 0 0 10px #2dd4bf, 0 0 20px #2dd4bf;
                }
                .fab-container {
                    position: relative;
                    top: -24px;
                }
                .fab {
                    width: 56px;
                    height: 56px;
                    background: #2dd4bf;
                    border-radius: 18px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #000;
                    box-shadow: 0 10px 25px rgba(45, 212, 191, 0.4);
                    border: 4px solid #000;
                    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    cursor: pointer;
                }
                .fab.open {
                    transform: rotate(90deg) scale(0.9);
                    background: #FF8B7A; /* Peach Highlight */
                }
                .animate-fade-in {
                    animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .nav-label {
                    font-size: 9px;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
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
