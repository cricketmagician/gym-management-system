import React from 'react';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Link from 'next/link';
import { ArrowLeft, Award, Dumbbell, Zap, Instagram, MessageSquare } from 'lucide-react';

export default async function TrainerDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session) return <div>Unauthorized</div>;

    const trainer = await prisma.trainer.findUnique({
        where: { id }
    });

    if (!trainer) return <div>Trainer not found</div>;

    const orangeGradient = 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', paddingBottom: '60px' }}>
            {/* Header with Back Button */}
            <div style={{ position: 'relative', height: '300px', margin: '0 -20px', overflow: 'hidden' }}>
                <img 
                    src={trainer.photoUrl || `https://ui-avatars.com/api/?name=${trainer.name}&background=fde68a&color=b45309`} 
                    alt={trainer.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.8) 100%)' }}></div>
                
                <Link href="/member/trainers" style={{ position: 'absolute', top: '20px', left: '20px', color: '#fff', padding: '10px', borderRadius: '14px', background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <ArrowLeft size={24} />
                </Link>

                <div style={{ position: 'absolute', bottom: '32px', left: '32px', right: '32px', color: '#fff' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <Award size={16} color="#f59e0b" />
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Certified Elite Trainer</span>
                    </div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1 }}>{trainer.name}</h1>
                </div>
            </div>

            {/* Specialization & Badges */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ padding: '8px 16px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)', color: '#b45309', fontSize: '0.875rem', fontWeight: 700 }}>
                    {trainer.specialization}
                </div>
                <div style={{ padding: '8px 16px', borderRadius: '12px', background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.1)', color: '#000', fontSize: '0.875rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Zap size={14} /> 5+ Years Exp.
                </div>
            </div>

            {/* Bio Section */}
            <section>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '16px' }}>About Me</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.9375rem', whiteSpace: 'pre-line' }}>
                    {trainer.bio || `${trainer.name} is a dedicated fitness professional specializing in ${trainer.specialization}. With years of experience and a passion for results, they are here to guide you on your fitness journey.`}
                </p>
            </section>

            {/* Quick Actions / Contact */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <button style={{ 
                    padding: '16px', 
                    borderRadius: '18px', 
                    background: '#000', 
                    color: '#fff', 
                    border: 'none', 
                    fontWeight: 700, 
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <MessageSquare size={20} />
                    Contact
                </button>
                <button style={{ 
                    padding: '16px', 
                    borderRadius: '18px', 
                    background: orangeGradient, 
                    color: '#fff', 
                    border: 'none', 
                    fontWeight: 700, 
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'center', 
                    gap: '8px',
                    boxShadow: '0 10px 20px rgba(245, 158, 11, 0.3)'
                }}>
                    <Dumbbell size={20} />
                    Book Session
                </button>
            </div>
        </div>
    );
}
