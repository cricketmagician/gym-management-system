"use client"

import React from 'react';
import Link from 'next/link';
import { Home, Dumbbell, Activity, User, Plus } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function MemberLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname();

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
                    <button className="fab">
                        <Plus size={32} />
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
        </div>
    );
}
