import React from 'react';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Link from 'next/link';
import { Calendar, Dumbbell, Target, Flame, ArrowRight, Zap, Trophy, TrendingUp, QrCode } from 'lucide-react';
import { startOfWeek, endOfWeek, isWithinInterval, format } from 'date-fns';

export default async function MemberDashboard() {
    const session = await getServerSession(authOptions);
    if (!session) return <div>Unauthorized</div>;

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: {
            memberships: {
                where: { status: 'ACTIVE' },
                include: { plan: true },
                orderBy: { endDate: 'desc' },
                take: 1
            },
            attendances: true,
            workouts: {
                orderBy: { date: 'desc' },
                take: 5
            },
            weightGoals: {
                orderBy: { updatedAt: 'desc' },
                take: 1
            },
            gym: true
        }
    });

    if (!user) return <div>User not found</div>;

    const activeMembership = user.memberships[0];
    const daysLeft = activeMembership 
        ? Math.max(0, Math.ceil((new Date(activeMembership.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
        : 0;

    const attendanceDates = user.attendances.map(a => new Date(a.date));
    const now = new Date();
    const thisWeekAttendance = attendanceDates.filter(d => isWithinInterval(d, { start: startOfWeek(now), end: endOfWeek(now) })).length;
    
    const workoutCount = user.workouts.length || 0;

    const trainers = await prisma.trainer.findMany({
        where: { gymId: user.gymId },
        take: 5
    });

    // Premium Amber Orange Palette
    const orangeGradient = 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
    const darkPeach = '#FF8B7A';

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', padding: '20px 0' }}>
            {/* Header / Hero Banner (Mini) */}
            <header style={{ 
                padding: '24px 32px', 
                background: '#000', 
                borderRadius: '20px', 
                color: '#fff', 
                position: 'relative', 
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                minHeight: '130px'
            }}>
                <div style={{ position: 'absolute', top: '-40%', right: '-10%', width: '250px', height: '250px', background: 'rgba(245, 158, 11, 0.12)', filter: 'blur(70px)', borderRadius: '50%' }}></div>
                
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <div style={{ padding: '4px 12px', background: '#f59e0b', borderRadius: '100px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Zap size={10} color="#000" fill="#000" />
                            <span style={{ fontSize: '0.6rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#000' }}>Priority Pass</span>
                        </div>
                    </div>
                    <h1 style={{ fontSize: '2.25rem', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1 }}>
                        Hi {user.name.split(' ')[0].toUpperCase()},
                    </h1>
                    <p style={{ marginTop: '6px', color: 'rgba(255,255,255,0.4)', fontWeight: 500, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        Ready to crush it today? <span style={{ fontSize: '1rem' }}>🚀</span>
                    </p>
                </div>
            </header>

            {/* Quick QR Check-in Card */}
            <Link href="/member/checkin" style={{ textDecoration: 'none' }}>
                <div className="card" style={{ 
                    padding: '24px', 
                    background: 'linear-gradient(135deg, #111 0%, #000 100%)', 
                    borderRadius: '24px', 
                    border: '1px solid rgba(45, 212, 191, 0.2)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: '0 15px 30px rgba(0,0,0,0.2)'
                }}>
                    <div style={{ position: 'absolute', top: '-50%', left: '-10%', width: '120px', height: '120px', background: 'rgba(45, 212, 191, 0.08)', filter: 'blur(40px)', borderRadius: '50%' }}></div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', position: 'relative' }}>
                        <div style={{ 
                            padding: '12px', 
                            background: 'rgba(45, 212, 191, 0.15)', 
                            borderRadius: '16px', 
                            color: '#2dd4bf',
                            boxShadow: '0 8px 16px rgba(45, 212, 191, 0.1)'
                        }}>
                            <QrCode size={28} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: 900, color: '#fff', marginBottom: '2px' }}>Check-in Now</h3>
                            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)' }}>Scan QR to mark attendance</p>
                        </div>
                    </div>
                    
                    <div style={{ 
                        width: '40px', 
                        height: '40px', 
                        borderRadius: '50%', 
                        background: 'rgba(255,255,255,0.05)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        color: 'rgba(255,255,255,0.3)'
                    }}>
                        <ArrowRight size={20} />
                    </div>
                </div>
            </Link>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                {/* Membership Card - Premium Amber Orange */}
                <div className="card" style={{ 
                    padding: '32px', 
                    background: orangeGradient, 
                    color: '#fff', 
                    borderRadius: '24px', 
                    border: 'none',
                    boxShadow: '0 20px 40px rgba(245, 158, 11, 0.15)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '24px'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Trophy size={20} /> Membership Status
                        </h3>
                        <span style={{ padding: '4px 12px', background: 'rgba(255,255,255,0.2)', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 800 }}>ACTIVE</span>
                    </div>
                    
                    <div>
                        <h2 style={{ fontSize: '3.5rem', fontWeight: 900, letterSpacing: '-0.05em', lineHeight: 0.9 }}>{daysLeft}</h2>
                        <p style={{ fontSize: '1rem', fontWeight: 700, opacity: 0.9 }}>DAYS REMAINING</p>
                    </div>

                    <div style={{ paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.2)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                            <p style={{ fontSize: '0.6rem', fontWeight: 700, opacity: 0.6, textTransform: 'uppercase' }}>Current Plan</p>
                            <p style={{ fontSize: '0.85rem', fontWeight: 800 }}>{activeMembership?.plan.name || 'No Active Plan'}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ fontSize: '0.6rem', fontWeight: 700, opacity: 0.6, textTransform: 'uppercase' }}>Valid Until</p>
                            <p style={{ fontSize: '0.85rem', fontWeight: 800 }}>{activeMembership ? format(new Date(activeMembership.endDate), 'dd MMM yyyy') : '--'}</p>
                        </div>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.1)', padding: '12px 20px', borderRadius: '16px', margin: '0 -12px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <p style={{ fontSize: '0.55rem', fontWeight: 700, opacity: 0.5 }}>JOINED ON</p>
                            <p style={{ fontSize: '0.75rem', fontWeight: 700 }}>{activeMembership ? format(new Date(activeMembership.startDate), 'dd MMM yyyy') : '--'}</p>
                        </div>
                        <Link href="/member/attendance" style={{ background: '#fff', color: '#000', padding: '8px 16px', borderRadius: '12px', textDecoration: 'none', fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                            View All <ArrowRight size={14} />
                        </Link>
                    </div>
                </div>

                {/* Quick Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <Link href="/member/attendance" style={{ textDecoration: 'none' }}>
                        <div className="card" style={{ padding: '24px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#000', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px' }}>
                            <div style={{ padding: '8px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '12px', width: 'fit-content' }}>
                                <Calendar size={20} color="#f59e0b" />
                            </div>
                            <div>
                                <h4 style={{ fontSize: '2rem', fontWeight: 900 }}>{thisWeekAttendance}</h4>
                                <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)' }}>Attendance This Week</p>
                            </div>
                        </div>
                    </Link>

                    <Link href="/member/workouts" style={{ textDecoration: 'none' }}>
                        <div className="card" style={{ padding: '24px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '24px' }}>
                            <div style={{ padding: '8px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '12px', width: 'fit-content' }}>
                                <Dumbbell size={20} color="#f59e0b" />
                            </div>
                            <div>
                                <h4 style={{ fontSize: '2rem', fontWeight: 900 }}>{workoutCount}</h4>
                                <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Workout Sessions</p>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Motivation Section */}
            <div style={{ 
                padding: '24px', 
                background: 'rgba(245, 158, 11, 0.05)', 
                border: '1px dashed #f59e0b', 
                borderRadius: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '20px'
            }}>
                <div style={{ padding: '12px', background: '#fff', borderRadius: '16px', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}>
                    <TrendingUp size={24} color="#f59e0b" />
                </div>
                <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 800 }}>Consistency is Key!</h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>You've been active for {thisWeekAttendance} {thisWeekAttendance === 1 ? 'day' : 'days'} this week. Keep hitting those goals!</p>
                </div>
            </div>

            {/* Trainers Section */}
            <section>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 900 }}>Certified Trainers</h3>
                    <Link href="/member/trainers" style={{ fontSize: '0.875rem', fontWeight: 700, color: '#f59e0b', textDecoration: 'none' }}>View All</Link>
                </div>
                <div className="horizontal-scroll" style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '12px' }}>
                    {trainers.map((trainer) => (
                        <Link key={trainer.id} href={`/member/trainers/${trainer.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <div style={{ 
                                minWidth: '240px', 
                                padding: '20px', 
                                background: 'var(--surface-color)', 
                                border: '1px solid var(--border-color)', 
                                borderRadius: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '16px'
                            }}>
                                <img src={trainer.photoUrl || `https://ui-avatars.com/api/?name=${trainer.name}&background=fde68a&color=b45309`} alt={trainer.name} style={{ width: '56px', height: '56px', borderRadius: '14px', objectFit: 'cover' }} />
                                <div>
                                    <p style={{ fontSize: '0.9375rem', fontWeight: 800, marginBottom: '2px' }}>{trainer.name}</p>
                                    <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>{trainer.specialization}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
}
