"use client"

import React from 'react';
import { MessageCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface Member {
    id: string;
    name: string;
    phone?: string;
    memberships: {
        status: string;
        endDate: Date | string;
        plan: {
            name: string;
        };
    }[];
}

interface AdminActionListProps {
    expiredMembers: Member[];
    gymName: string;
}

export default function AdminActionList({ expiredMembers, gymName }: AdminActionListProps) {
    if (expiredMembers.length === 0) return null;

    const getWhatsAppUrl = (member: Member) => {
        const phone = (member.phone || '').replace(/\D/g, '');
        if (!phone) return '#';
        const message = `Hi ${member.name}! Your membership at ${gymName} has EXPIRED. To avoid interruption, please renew now.`;
        return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    };

    return (
        <section style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 950, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ color: '#ef4444' }}>🚨</span> ACTION REQUIRED
                </h2>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    {expiredMembers.length} RECOVERIES PENDING
                </span>
            </div>

            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr', 
                gap: '12px',
                background: 'rgba(239, 68, 68, 0.05)',
                padding: '24px',
                borderRadius: '16px',
                border: '1px solid rgba(239, 68, 68, 0.1)'
            }}>
                {expiredMembers.slice(0, 3).map((member) => (
                    <div key={member.id} style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        padding: '16px',
                        background: 'var(--bg-deep)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '12px',
                        transition: 'all 0.2s ease'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--text-main)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 950, fontSize: '0.75rem' }}>
                                {member.name[0]}
                            </div>
                            <div>
                                <h4 style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--text-main)' }}>{member.name}</h4>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Expired recently</p>
                            </div>
                        </div>
                        
                        <a 
                            href={getWhatsAppUrl(member)}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ 
                                background: '#25D366', 
                                color: '#fff', 
                                padding: '10px 20px', 
                                borderRadius: '8px', 
                                fontSize: '0.75rem', 
                                fontWeight: 950, 
                                textDecoration: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                boxShadow: '0 4px 12px rgba(37, 211, 102, 0.2)'
                            }}
                        >
                            <MessageCircle size={14} fill="#fff" /> SEND ALERT
                        </a>
                    </div>
                ))}
            </div>
        </section>
    );
}
