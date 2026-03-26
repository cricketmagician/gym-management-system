import React from 'react';
import { Plus, Users, ShieldCheck, Zap } from 'lucide-react';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from 'next/link';
import MembersDirectoryContent from './MembersDirectoryContent';

export default async function MembersPage() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return <div style={{ padding: '48px', textAlign: 'center' }}>Please sign in to view members.</div>;
    }

    // Fetch members with latest membership
    const members = await prisma.user.findMany({
        where: { gymId: session.user.gymId, role: 'MEMBER' },
        include: { 
            memberships: { 
                include: { plan: true },
                orderBy: { endDate: 'desc' }, 
                take: 1 
            } 
        },
        orderBy: { createdAt: 'desc' }
    });

    const activeCount = members.filter(m => m.memberships[0]?.status === 'ACTIVE').length;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '48px', paddingBottom: '60px' }}>
            {/* Unified Premium Header */}
            <header style={{ 
                position: 'relative', 
                padding: '60px 40px', 
                background: '#000', 
                borderRadius: '40px', 
                color: '#fff',
                overflow: 'hidden',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '32px'
            }}>
                {/* Background Glows */}
                <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '300px', height: '300px', background: 'rgba(45, 212, 191, 0.1)', filter: 'blur(80px)', borderRadius: '50%' }}></div>
                <div style={{ position: 'absolute', bottom: '-20%', right: '5%', width: '250px', height: '250px', background: 'rgba(251, 191, 36, 0.1)', filter: 'blur(80px)', borderRadius: '50%' }}></div>

                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <div style={{ padding: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}>
                            <Users size={24} color="#2dd4bf" />
                        </div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.8 }}>Gym Management</span>
                    </div>
                    <h1 style={{ fontSize: '3.5rem', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1, marginBottom: '12px' }}>
                        Members Directory
                    </h1>
                    <div style={{ display: 'flex', gap: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#2dd4bf' }}>{members.length}</span>
                            <span style={{ fontSize: '0.875rem', fontWeight: 600, opacity: 0.6 }}>Total Roster</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#fbbf24' }}>{activeCount}</span>
                            <span style={{ fontSize: '0.875rem', fontWeight: 600, opacity: 0.6 }}>Active Now</span>
                        </div>
                    </div>
                </div>

                <div style={{ position: 'relative', zIndex: 1 }}>
                    <Link 
                        href="/members/new" 
                        style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '12px', 
                            padding: '18px 32px', 
                            background: '#fff', 
                            color: '#000', 
                            borderRadius: '20px', 
                            textDecoration: 'none', 
                            fontWeight: 900, 
                            fontSize: '1rem',
                            boxShadow: '0 10px 30px rgba(255,255,255,0.2)',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        <Plus size={20} />
                        Add New Member
                    </Link>
                </div>
            </header>

            {/* Interactive Grid & Filters */}
            <MembersDirectoryContent initialMembers={members} />
        </div>
    );
}
