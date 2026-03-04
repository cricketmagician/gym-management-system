"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SidebarNav({ role }: { role?: string }) {
    const pathname = usePathname();

    const allItems = [
        { name: 'Dashboard', href: '/', roles: ['ADMIN', 'STAFF', 'MEMBER'] },
        { name: 'Members', href: '/members', roles: ['ADMIN', 'STAFF'] },
        { name: 'Attendance', href: '/attendance', roles: ['ADMIN', 'STAFF'] },
        { name: 'Reports', href: '/reports', roles: ['ADMIN', 'STAFF'] },
        { name: 'Settings', href: '/settings', roles: ['ADMIN', 'STAFF'] },
    ];

    const navItems = allItems.filter(item => !role || item.roles.includes(role));

    return (
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {navItems.map((item) => {
                // For nested routes like /members/[id], we still want /members to be active
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
    );
}
