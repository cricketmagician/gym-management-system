import React from 'react';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Users, CreditCard, Activity, TrendingUp, DollarSign, ArrowUpRight, ArrowDownRight, Sparkles, Zap, Timer, LayoutGrid } from 'lucide-react';

export default async function ReportsPage() {
    const session = await getServerSession(authOptions);
    if (!session) return <div style={{ padding: '48px', textAlign: 'center', color: '#fff' }}>Unauthorized</div>;

    const gymId = session.user.gymId;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    // 1. Financial Intelligence
    const currentMonthPayments = await prisma.payment.aggregate({
        where: { gymId, status: 'SUCCESS', date: { gte: startOfMonth } },
        _sum: { amount: true }
    });
    const lastMonthPayments = await prisma.payment.aggregate({
        where: { gymId, status: 'SUCCESS', date: { gte: lastMonthStart, lte: lastMonthEnd } },
        _sum: { amount: true }
    });

    const monthlyRevenue = currentMonthPayments._sum.amount?.toNumber() || 0;
    const lastMonthlyRevenue = lastMonthPayments._sum.amount?.toNumber() || 0;
    const revenueGrowth = lastMonthlyRevenue > 0 ? ((monthlyRevenue - lastMonthlyRevenue) / lastMonthlyRevenue * 100).toFixed(1) : '0';

    // 2. Member High-Density Stats
    const totalMembers = await prisma.user.count({ where: { gymId, role: 'MEMBER' } });
    const activeMembers = await prisma.membership.count({ where: { gymId, status: 'ACTIVE' } });
    const newSignups = await prisma.user.count({ where: { gymId, role: 'MEMBER', createdAt: { gte: startOfMonth } } });

    // 3. Attendance Pulse
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todaysCheckins = await prisma.attendance.count({ where: { gymId, timestamp: { gte: startOfDay } } });
    
    // 4. Recent Transactions
    const recentPayments = await prisma.payment.findMany({
        where: { gymId, status: 'SUCCESS' },
        orderBy: { date: 'desc' },
        take: 6,
        include: { user: true }
    });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '48px', padding: '40px', background: '#000', minHeight: '100vh', color: '#fff' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <div style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', padding: '6px 14px', borderRadius: '12px', fontSize: '0.65rem', fontWeight: 900, letterSpacing: '0.1em', width: 'fit-content', marginBottom: '16px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>ANALYTICS COMMAND</div>
                    <h1 style={{ fontSize: '3.5rem', fontWeight: 950, letterSpacing: '-0.04em', lineHeight: 1, display: 'flex', alignItems: 'center', gap: '16px' }}>
                        Intelligence <Sparkles className="text-amber-500" size={48} />
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '16px', fontSize: '1.125rem', fontWeight: 500 }}>Professional-grade oversight for your boutique fitness ecosystem.</p>
                </div>
            </header>

            {/* Metric Cluster */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                <EliteMetric title="Revenue Flow" value={`₹${monthlyRevenue.toLocaleString()}`} trend={revenueGrowth} icon={DollarSign} color="#f59e0b" />
                <EliteMetric title="Active Pulse" value={activeMembers} trend={`+${newSignups}`} icon={Users} color="#2dd4bf" />
                <EliteMetric title="Total Assets" value={totalMembers} icon={LayoutGrid} color="rgba(255,255,255,0.5)" />
                <EliteMetric title="Peak Presence" value={todaysCheckins} unit="Today" icon={Activity} color="#ef4444" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '40px' }}>
                {/* Visual Trends Section */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
                    <section className="glass-card-dark" style={{ padding: '32px', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <TrendingUp size={24} className="text-amber-500" /> Revenue Visualization
                            </h2>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <span style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', padding: '4px 12px', borderRadius: '100px', fontSize: '0.6rem', fontWeight: 900 }}>MONTHLY</span>
                            </div>
                        </div>
                        
                        {/* CSS-based Sparkline Placeholder */}
                        <div style={{ height: '300px', width: '100%', position: 'relative', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', paddingBottom: '40px' }}>
                            {[40, 60, 45, 90, 75, 100, 85].map((h, i) => (
                                <div key={i} style={{ width: '12%', height: `${h}%`, background: `linear-gradient(to top, rgba(245, 158, 11, ${0.1 + (i*0.05)}), rgba(245, 158, 11, 0.8))`, borderRadius: '12px 12px 4px 4px', transition: 'height 1s ease-out' }}></div>
                            ))}
                            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px', background: 'rgba(255,255,255,0.05)' }}></div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(255,255,255,0.2)', fontSize: '0.65rem', fontWeight: 800 }}>
                            <span>WEEK 1</span>
                            <span>WEEK 2</span>
                            <span>WEEK 3</span>
                            <span>WEEK 4</span>
                        </div>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '0.75rem', fontWeight: 900, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Zap size={16} className="text-amber-500" /> Operational Insights
                        </h2>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                            <div className="glass-card-dark" style={{ padding: '24px', display: 'flex', gap: '20px', alignItems: 'center' }}>
                                <div style={{ width: '48px', height: '48px', background: 'rgba(45, 212, 191, 0.1)', color: '#2dd4bf', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Timer size={24} /></div>
                                <div>
                                    <p style={{ fontSize: '0.6rem', fontWeight: 900, color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>AVG STAY</p>
                                    <h4 style={{ fontSize: '1.25rem', fontWeight: 900 }}>82 Mins</h4>
                                </div>
                            </div>
                            <div className="glass-card-dark" style={{ padding: '24px', display: 'flex', gap: '20px', alignItems: 'center' }}>
                                <div style={{ width: '48px', height: '48px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Sparkles size={24} /></div>
                                <div>
                                    <p style={{ fontSize: '0.6rem', fontWeight: 900, color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>LOYALTY RANK</p>
                                    <h4 style={{ fontSize: '1.25rem', fontWeight: 900 }}>Top 5%</h4>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Right Column: Transaction Stream */}
                <section style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <h2 style={{ fontSize: '0.75rem', fontWeight: 900, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <CreditCard size={16} className="text-teal-500" /> Revenue Stream
                    </h2>
                    <div className="glass-card-dark" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {recentPayments.length > 0 ? (
                            recentPayments.map((payment) => (
                                <div key={payment.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem' }}>{payment.user.name[0]}</div>
                                        <div>
                                            <p style={{ fontWeight: 800, fontSize: '0.875rem' }}>{payment.user.name}</p>
                                            <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>{payment.date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <p style={{ fontWeight: 900, color: '#f59e0b', fontSize: '0.875rem' }}>+₹{payment.amount.toNumber().toLocaleString()}</p>
                                        <span style={{ fontSize: '0.55rem', fontWeight: 900, color: '#2dd4bf', textTransform: 'uppercase' }}>SUCCESS</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div style={{ textAlign: 'center', padding: '40px 0', color: 'rgba(255,255,255,0.2)' }}>
                                <CreditCard size={40} style={{ marginBottom: '16px', opacity: 0.2 }} />
                                <p style={{ fontSize: '0.875rem', fontWeight: 700 }}>No recent transactions.</p>
                            </div>
                        )}
                        <button style={{ width: '100%', padding: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', color: '#fff', fontSize: '0.75rem', fontWeight: 900, cursor: 'pointer' }} className="scale-hover">VIEW ALL TRANSACTIONS</button>
                    </div>

                    {/* Pro Tip Card */}
                    <div style={{ padding: '32px', background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', borderRadius: '32px', color: '#000', marginTop: '24px' }}>
                        <Zap size={32} strokeWidth={2.5} style={{ marginBottom: '24px' }} />
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 950, lineHeight: 1.1, marginBottom: '12px' }}>Pulse Intelligence</h3>
                        <p style={{ fontSize: '0.875rem', fontWeight: 700, opacity: 0.8 }}>Your revenue flow has grown by {revenueGrowth}% compared to last month. Consider a seasonal promotion to boost retention.</p>
                    </div>
                </section>
            </div>
        </div>
    );
}

function EliteMetric({ title, value, unit, trend, icon: Icon, color }: any) {
    const isPositive = trend?.startsWith('+') || parseFloat(trend) > 0;
    return (
        <div className="glass-card-dark" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px', overflow: 'hidden', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '60px', height: '60px', background: color, opacity: 0.05, filter: 'blur(30px)', borderRadius: '50%' }}></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em' }}>{title}</p>
                <div style={{ color: color }}>
                    <Icon size={20} />
                </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                <h3 style={{ fontSize: '2.5rem', fontWeight: 950, letterSpacing: '-0.04em', lineHeight: 1 }}>{value}</h3>
                {unit && <span style={{ fontSize: '0.875rem', fontWeight: 800, color: 'rgba(255,255,255,0.3)' }}>{unit}</span>}
                {trend && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: isPositive ? '#2dd4bf' : '#ef4444', marginBottom: '4px' }}>
                        {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        <span style={{ fontSize: '0.75rem', fontWeight: 900 }}>{trend}{typeof trend === 'string' && trend.includes('%') ? '' : '%'}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
