"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SidebarNav({ role }: { role?: string }) {
    const pathname = usePathname();

    const allItems = [
        { name: 'Global Command', href: '/superadmin', roles: ['SUPER_ADMIN'] },
        { name: 'Dashboard', href: '/', roles: ['ADMIN', 'STAFF', 'MEMBER'] },
        { name: 'Members', href: '/members', roles: ['ADMIN', 'STAFF'] },
        { name: 'Trainers', href: '/members/trainers', roles: ['ADMIN', 'STAFF'] },
        { name: 'Attendance', href: '/attendance', roles: ['ADMIN', 'STAFF'] },
        { name: 'Reports', href: '/reports', roles: ['ADMIN', 'STAFF'] },
        { name: 'Gym Hub', href: '/admin/gym-hub', roles: ['ADMIN', 'STAFF'] },
        { name: 'Settings', href: '/settings', roles: ['ADMIN', 'STAFF'] },
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
                                padding: '8px 12px',
                                background: isActive ? 'rgba(79,70,229,0.1)' : 'transparent',
                                color: isActive ? 'var(--brand-primary)' : 'var(--text-secondary)',
                                borderRadius: '6px',
                                fontWeight: 500,
                                textDecoration: 'none',
                            }}
                        >
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
            `}</style>
        </>
    );
}
