import React from 'react';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Link from 'next/link';
import { ArrowLeft, ChevronRight, Star, Award, Zap } from 'lucide-react';

export default async function MemberTrainersPage() {
    const session = await getServerSession(authOptions);
    if (!session) return <div>Unauthorized</div>;

    const trainers = await prisma.trainer.findMany({
        where: { gymId: session.user.gymId },
        orderBy: { name: 'asc' }
    });

    const orangeGradient = 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Link href="/member/dashboard" style={{ color: '#000', padding: '8px', borderRadius: '12px', background: '#fff', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                    <ArrowLeft size={20} />
                </Link>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 900 }}>Certified Trainers</h1>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Meet the experts dedicated to helping you reach your full potential.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {trainers.map((trainer) => (
                    <Link key={trainer.id} href={`/member/trainers/${trainer.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div className="card" style={{ 
                            padding: '20px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '20px',
                            background: '#fff',
                            borderRadius: '24px',
                            border: '1px solid var(--border-color)',
                            transition: 'all 0.2s ease',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <img 
                                src={trainer.photoUrl || `https://ui-avatars.com/api/?name=${trainer.name}&background=fde68a&color=b45309`} 
                                alt={trainer.name} 
                                style={{ width: '80px', height: '80px', borderRadius: '18px', objectFit: 'cover' }} 
                            />
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                                    <Star size={14} color="#f59e0b" fill="#f59e0b" />
                                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#f59e0b' }}>TOP RATED</span>
                                </div>
                                <h3 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: '2px' }}>{trainer.name}</h3>
                                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    {trainer.specialization}
                                </p>
                            </div>
                            <ChevronRight size={20} color="var(--text-secondary)" />
                        </div>
                    </Link>
                ))}
            </div>

            {trainers.length === 0 && (
                <div style={{ textAlign: 'center', padding: '60px 20px', background: 'rgba(0,0,0,0.02)', borderRadius: '24px', border: '2px dashed var(--border-color)' }}>
                    <Zap size={32} color="var(--text-secondary)" style={{ marginBottom: '12px', opacity: 0.5 }} />
                    <p style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>No trainers found for this gym.</p>
                </div>
            )}
        </div>
    );
}
