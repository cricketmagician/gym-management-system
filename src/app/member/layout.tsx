"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Home, Dumbbell, Activity, User, Plus, X, QrCode, ClipboardList, TrendingUp, Sparkles, Sun, Moon } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function MemberLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
        if (savedTheme) {
            setTheme(savedTheme);
            document.documentElement.classList.toggle('dark', savedTheme === 'dark');
            document.documentElement.classList.toggle('light', savedTheme === 'light');
        } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setTheme('dark');
            document.documentElement.classList.add('dark');
            document.documentElement.classList.remove('light');
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        
        if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
            document.documentElement.classList.remove('light');
        } else {
            document.documentElement.classList.add('light');
            document.documentElement.classList.remove('dark');
        }
    };

    return (
        <div className={`member-bg ${theme}`} style={{ minHeight: '100vh', position: 'relative', overflowX: 'hidden' }}>
            {/* Minimalist Aesthetic Watermark */}
            <div className="watermark-text">
                PULSE FIT<br /><br /><br />
                GO GYM<br /><br /><br />
                PULSE FIT<br /><br /><br />
                GO GYM
            </div>
            
            <main style={{ position: 'relative', zIndex: 10, padding: '0 0 100px 0', maxWidth: '500px', margin: '0 auto' }}>
                {/* Theme Toggle Button - Floating Top Right */}
                <div style={{ position: 'absolute', top: '24px', right: '24px', zIndex: 50 }}>
                    <button 
                        onClick={toggleTheme}
                        style={{ 
                            width: '40px', 
                            height: '40px', 
                            borderRadius: '12px', 
                            background: 'var(--surface-color)', 
                            border: '1px solid var(--border-color)', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            cursor: 'pointer',
                            boxShadow: 'var(--shadow-soft)',
                            color: theme === 'dark' ? '#fb923c' : 'var(--brand-primary)',
                            backdropFilter: 'blur(8px)',
                            WebkitBackdropFilter: 'blur(8px)',
                            transition: 'all 0.3s ease'
                        }}
                        aria-label="Toggle Theme"
                    >
                        {theme === 'dark' ? <Moon size={20} fill="#fb923c" /> : <Sun size={20} />}
                    </button>
                </div>
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
                    <span className="nav-label">Gym Hub</span>
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
                    bottom: 0;
                    left: 0;
                    right: 0;
                    height: 72px;
                    background: var(--surface-color);
                    backdrop-filter: blur(24px);
                    -webkit-backdrop-filter: blur(24px);
                    border-top: 1px solid var(--border-color);
                    display: flex;
                    justify-content: space-around;
                    align-items: center;
                    padding: 0 12px;
                    z-index: 1000;
                    box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.05);
                }
                .nav-item {
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 4px;
                    color: var(--text-secondary);
                    text-decoration: none;
                    transition: all 0.3s ease;
                    flex: 1;
                    height: 100%;
                    justify-content: center;
                }
                .nav-item.active {
                    color: var(--text-primary);
                }
                .active-glow {
                    position: absolute;
                    bottom: 8px;
                    width: 4px;
                    height: 4px;
                    background: #f59e0b;
                    border-radius: 50%;
                    box-shadow: 0 0 10px #f59e0b;
                }
                .fab-container {
                    position: relative;
                    top: -24px;
                }
                .fab {
                    width: 60px;
                    height: 60px;
                    background: #f59e0b;
                    border-radius: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #000;
                    box-shadow: 0 12px 24px rgba(245, 158, 11, 0.3);
                    border: 4px solid var(--surface-color);
                    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    cursor: pointer;
                }
                .fab.open {
                    transform: rotate(90deg) scale(0.9);
                    background: #FF8B7A;
                }
                .nav-label {
                    font-size: 8px;
                    font-weight: 800;
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
                borderBottom: last ? 'none' : '1px solid var(--border-color)',
                cursor: 'pointer'
            }}>
                <div style={{ color: '#2dd4bf' }}>{icon}</div>
                <span style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)' }}>{label}</span>
            </div>
        </Link>
    );
}
