import React from 'react';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Link from 'next/link';
import { ArrowLeft, Star, Award, Zap } from 'lucide-react';
import { getDirectImageUrl } from "@/lib/image-utils";

export default async function MemberTrainersPage() {
    const session = await getServerSession(authOptions);
    if (!session) return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>Unauthorized</div>;

    const trainers = await prisma.trainer.findMany({
        where: { gymId: session.user.gymId },
        orderBy: { name: 'asc' }
    });

    return (
        <div style={{ padding: '0 20px 100px 20px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Premium Header */}
            <div style={{ paddingTop: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                    <Link href="/member/dashboard" style={{ 
                        color: 'var(--text-primary)', 
                        width: '44px', 
                        height: '44px', 
                        borderRadius: '14px', 
                        background: 'var(--surface-color)', 
                        border: '1px solid var(--border-color)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: 'var(--shadow-soft)',
                        backdropFilter: 'blur(8px)',
                        textDecoration: 'none'
                    }}>
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="font-premium" style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                        Certified Trainers
                    </h1>
                </div>
                <p style={{ 
                    fontSize: '0.9375rem', 
                    color: 'var(--text-secondary)', 
                    fontWeight: 500, 
                    lineHeight: 1.6,
                    paddingLeft: '4px',
                    opacity: 0.8
                }}>
                    Our world-class experts are here to guide your fitness journey with precision and passion.
                </p>
            </div>

            {/* Trainer Cards Grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {trainers.map((trainer, index) => (
                    <Link key={trainer.id} href={`/member/trainers/${trainer.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div className="card scale-hover" style={{ 
                            height: '320px',
                            position: 'relative',
                            borderRadius: '28px',
                            overflow: 'hidden',
                            background: '#000',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                        }}>
                            {/* Full-Bleed Background Image */}
                            <img 
                                src={getDirectImageUrl(trainer.photoUrl) || `https://ui-avatars.com/api/?name=${trainer.name}&background=fde68a&color=b45309&size=512`} 
                                alt={trainer.name} 
                                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }} 
                            />

                            {/* Elegant Cinematic Overlay */}
                            <div style={{ 
                                position: 'absolute', 
                                inset: 0, 
                                background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 40%, transparent 100%)' 
                            }} />

                            {/* Trainer Profile Content */}
                            <div style={{ 
                                position: 'absolute', 
                                bottom: 0, 
                                left: 0, 
                                right: 0, 
                                padding: '32px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '8px'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: '4px', 
                                        background: 'rgba(245, 158, 11, 0.15)', 
                                        padding: '4px 10px', 
                                        borderRadius: '8px',
                                        backdropFilter: 'blur(8px)',
                                        border: '1px solid rgba(245, 158, 11, 0.2)'
                                    }}>
                                        <Star size={12} color="#f59e0b" fill="#f59e0b" />
                                        <span style={{ fontSize: '0.65rem', fontWeight: 900, color: '#f59e0b', letterSpacing: '0.05em' }}>CERTIFIED EXPERT</span>
                                    </div>
                                </div>
                                
                                <h3 className="font-premium" style={{ 
                                    fontSize: '1.75rem', 
                                    fontWeight: 900, 
                                    color: '#fff', 
                                    letterSpacing: '-0.03em', 
                                    lineHeight: 1.1 
                                }}>
                                    {trainer.name}
                                </h3>
                                
                                <p style={{ 
                                    fontSize: '0.8125rem', 
                                    color: 'rgba(255,255,255,0.7)', 
                                    fontWeight: 600, 
                                    textTransform: 'uppercase', 
                                    letterSpacing: '0.1em' 
                                }}>
                                    {trainer.specialization}
                                </p>
                            </div>

                            {/* Decorative Icon */}
                            <div style={{ position: 'absolute', top: '24px', right: '24px', opacity: 0.4 }}>
                                <Award size={24} color="#fff" strokeWidth={1.5} />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {trainers.length === 0 && (
                <div style={{ textAlign: 'center', padding: '80px 40px', background: 'var(--surface-color)', borderRadius: '32px', border: '2px dashed var(--border-color)' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                        <Zap size={32} color="var(--text-secondary)" style={{ opacity: 0.5 }} />
                    </div>
                    <p style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1.125rem' }}>No Professionals Yet</p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '4px' }}>Stay tuned, experts are coming soon.</p>
                </div>
            )}
        </div>
    );
}
