import React from 'react';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { User, Shield, CreditCard, Bell, LogOut, ChevronRight, Settings, HelpCircle } from 'lucide-react';

import AvatarSection from './AvatarSection';
import SettingsSection from './SettingsSection';

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);
    if (!session) return <div>Unauthorized</div>;

    const userData = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: {
            memberships: {
                where: { status: 'ACTIVE' },
                include: { plan: true },
                take: 1
            }
        }
    });

    if (!userData) return <div>User not found</div>;

    const activeMembership = userData.memberships[0];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', padding: '20px 20px 40px 20px' }}>
            {/* Profile Header */}
            <header style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                <AvatarSection initialPhotoUrl={userData.photoUrl} userName={userData.name} />
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>{userData.name}</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{userData.phone || userData.email}</p>
                </div>
            </header>

            {/* Digital Membership Card */}
            <section>
                <div className="glass-card" style={{ 
                    background: 'linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(45, 212, 191, 0.2) 100%)', 
                    borderRadius: '24px', 
                    padding: '24px', 
                    color: '#fff', 
                    position: 'relative', 
                    overflow: 'hidden',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                }}>
                    {/* Watermark/Logo */}
                    <div style={{ position: 'absolute', right: '-20px', bottom: '-20px', opacity: 0.1 }}>
                        <Shield size={160} color="#fff" />
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
                        <div>
                            <p style={{ fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.7 }}>Premium Member</p>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{activeMembership?.plan.name || 'Basic Plan'}</h2>
                        </div>
                        <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Shield size={24} color="#2dd4bf" />
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                       <div>
                            <p style={{ fontSize: '0.625rem', textTransform: 'uppercase', opacity: 0.7, marginBottom: '4px' }}>Member ID</p>
                            <p style={{ fontSize: '0.9375rem', fontWeight: 600, letterSpacing: '1px' }}>#{userData.id.slice(-8).toUpperCase()}</p>
                       </div>
                       <div style={{ textAlign: 'right' }}>
                            <p style={{ fontSize: '0.625rem', textTransform: 'uppercase', opacity: 0.7, marginBottom: '4px' }}>Expires</p>
                            <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>{activeMembership ? new Date(activeMembership.endDate).toLocaleDateString() : 'N/A'}</p>
                       </div>
                    </div>
                </div>
            </section>

            {/* Settings Options */}
            <SettingsSection 
                userData={{ 
                    id: userData.id, 
                    name: userData.name, 
                    email: userData.email, 
                    phone: userData.phone, 
                    gender: userData.gender 
                }} 
                membership={activeMembership}
            />

            {/* Logout Button */}
            <section>
                <a href="/api/auth/signout" className="glass-card" style={{ 
                    padding: '20px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: '12px', 
                    color: '#ef4444', 
                    textDecoration: 'none',
                    fontWeight: 700,
                    width: '100%'
                }}>
                    <LogOut size={20} /> Sign Out
                </a>
            </section>
        </div>
    );
}

