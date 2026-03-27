"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, Users, Building2, TrendingUp, ShieldCheck, Activity, Settings, LogOut, CheckSquare } from 'lucide-react';

export default function SidebarNav({ role }: { role?: string }) {
    const pathname = usePathname();

    const allItems = [
        { name: 'Global Command', href: '/superadmin', roles: ['SUPER_ADMIN'], icon: <LayoutGrid size={18} /> },
        { name: 'Dashboard', href: '/', roles: ['ADMIN', 'STAFF', 'MEMBER'], icon: <LayoutGrid size={18} /> },
        { name: 'Members', href: '/members', roles: ['ADMIN', 'STAFF'], icon: <Users size={18} /> },
        { name: 'Trainers', href: '/members/trainers', roles: ['ADMIN', 'STAFF'], icon: <Users size={18} /> },
        { name: 'Attendance', href: '/attendance', roles: ['ADMIN', 'STAFF'], icon: <CheckSquare size={18} /> },
        { name: 'Reports', href: '/reports', roles: ['ADMIN', 'STAFF'], icon: <TrendingUp size={18} /> },
        { name: 'Gym Hub', href: '/admin/gym-hub', roles: ['ADMIN', 'STAFF'], icon: <Activity size={18} /> },
        { name: 'Settings', href: '/settings', roles: ['ADMIN', 'STAFF'], icon: <Settings size={18} /> },
    ];

    const navItems = allItems.filter(item => !role || item.roles.includes(role));

    return (
        <>
            {/* Desktop Sidebar Nav */}
            <nav className="desktop-nav" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {navItems.map((item) => {
                    const isActive = item.href === '/'
                        ? pathname === '/'
                        : pathname.startsWith(item.href);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            style={{
                                padding: '12px 16px',
                                background: isActive ? 'var(--bg-deep)' : 'transparent',
                                color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
                                borderRadius: '16px',
                                fontWeight: isActive ? 800 : 600,
                                textDecoration: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                transition: 'all 0.3s ease',
                                border: isActive ? '1px solid var(--border-subtle)' : '1px solid transparent',
                                fontSize: '0.875rem',
                                letterSpacing: '0.01em',
                                boxShadow: isActive ? '0 4px 15px rgba(0,0,0,0.04)' : 'none'
                            }}
                            className="nav-link-premium"
                        >
                            <span style={{ color: isActive ? 'var(--text-main)' : 'inherit', opacity: isActive ? 1 : 0.6 }}>{item.icon}</span>
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            {/* Mobile Bottom Nav */}
            <nav className="mobile-nav" style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'var(--surface-color)',
                borderTop: '1px solid var(--border-color)',
                display: 'flex',
                justifyContent: 'space-around',
                padding: '12px 0',
                zIndex: 1000
            }}>
                {navItems.map((item) => {
                    const isActive = item.href === '/'
                        ? pathname === '/'
                        : pathname.startsWith(item.href);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            style={{
                                color: isActive ? 'var(--brand-primary)' : 'var(--text-secondary)',
                                fontWeight: isActive ? 700 : 500,
                                textDecoration: 'none',
                                fontSize: '0.75rem',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '4px'
                            }}
                        >
                            <span style={{ fontSize: '1.2rem' }}>
                                {item.name === 'Dashboard' && '🏠'}
                                {item.name === 'Members' && '👥'}
                                {item.name === 'Trainers' && '👟'}
                                {item.name === 'Attendance' && '✅'}
                                {item.name === 'Reports' && '📊'}
                                {item.name === 'Gym Hub' && '✨'}
                                {item.name === 'Settings' && '⚙️'}
                            </span>
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <style jsx>{`
                @media (min-width: 769px) {
                    .mobile-nav { display: none !important; }
                }
                @media (max-width: 768px) {
                    .desktop-nav { display: none !important; }
                }
                .nav-link-premium:hover {
                    background: var(--surface-highlight) !important;
                    color: var(--text-main) !important;
                    transform: translateX(4px);
                }
                .desktop-nav {
                    font-family: 'Plus Jakarta Sans', sans-serif;
                }
            `}</style>
        </>
    );
}
