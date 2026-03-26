"use client"

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Clock, Settings } from 'lucide-react';

export default function AdminBottomNav() {
    const pathname = usePathname();

    const navItems = [
        { label: 'Dash', icon: <LayoutDashboard size={20} />, href: '/' },
        { label: 'Members', icon: <Users size={20} />, href: '/members' },
        { label: 'Check-ins', icon: <Clock size={20} />, href: '/attendance' },
        { label: 'Settings', icon: <Settings size={20} />, href: '/settings' },
    ];

    return (
        <nav className="admin-bottom-nav" style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            height: '70px',
            background: '#fff',
            borderTop: '1px solid rgba(0,0,0,0.05)',
            display: 'none', // Shown via CSS media query
            justifyContent: 'space-around',
            alignItems: 'center',
            padding: '0 10px env(safe-area-inset-bottom)',
            zIndex: 1000,
            boxShadow: '0 -10px 30px rgba(0,0,0,0.03)'
        }}>
            {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                return (
                    <Link 
                        key={item.href} 
                        href={item.href} 
                        style={{ 
                            textDecoration: 'none', 
                            color: isActive ? 'var(--brand-primary)' : '#94a3b8',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '8px 12px',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <div style={{
                            padding: '6px',
                            background: isActive ? 'rgba(79, 70, 229, 0.08)' : 'transparent',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            {item.icon}
                        </div>
                        <span style={{ fontSize: '0.625rem', fontWeight: isActive ? 800 : 600, textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                            {item.label}
                        </span>
                    </Link>
                );
            })}
        </nav>
    );
}
