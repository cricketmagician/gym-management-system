import React from 'react';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, isWithinInterval } from 'date-fns';
import { Calendar, TrendingUp, Award, Zap } from 'lucide-react';
import AttendanceCalendar from '@/components/AttendanceCalendar';

export default async function MemberAttendancePage() {
    const session = await getServerSession(authOptions);
    if (!session) return <div>Unauthorized</div>;

    const attendances = await prisma.attendance.findMany({
        where: { userId: session.user.id },
        orderBy: { date: 'desc' }
    });

    const attendanceDates = attendances.map(a => new Date(a.date));
    const now = new Date();

    // Stats Calculation
    const thisWeek = attendanceDates.filter(d => isWithinInterval(d, { start: startOfWeek(now), end: endOfWeek(now) })).length;
    const thisMonth = attendanceDates.filter(d => isWithinInterval(d, { start: startOfMonth(now), end: endOfMonth(now) })).length;
    const thisYear = attendanceDates.filter(d => isWithinInterval(d, { start: startOfYear(now), end: endOfYear(now) })).length;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', paddingBottom: '40px' }}>
            <header>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '8px' }}>Attendance</h1>
                <p style={{ color: '#666', fontSize: '0.9375rem' }}>Consistency is the foundation of greatness.</p>
            </header>

            {/* Frequency Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <StatCard title="This Week" value={thisWeek} icon={<Zap size={18} />} color="#2dd4bf" />
                <StatCard title="This Month" value={thisMonth} icon={<Calendar size={18} />} color="#fb923c" />
                <StatCard title="Total Year" value={thisYear} icon={<TrendingUp size={18} />} color="#818cf8" span />
            </div>

            {/* Interactive Calendar */}
            <AttendanceCalendar attendanceDates={attendanceDates} />

            {/* Achievement Badge */}
            <div className="glass-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px', background: 'linear-gradient(135deg, rgba(45,212,191,0.1) 0%, rgba(13,148,136,0.1) 100%)' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: '#000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Award size={28} color="#2dd4bf" />
                </div>
                <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '2px' }}>Consistency King</h3>
                    <p style={{ fontSize: '0.8125rem', color: '#666' }}>You've attended {thisMonth} days this month. Keep it up!</p>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, color, span }: { title: string, value: number, icon: React.ReactNode, color: string, span?: boolean }) {
    return (
        <div className="glass-card" style={{ padding: '20px', gridColumn: span ? 'span 2' : 'span 1', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: color }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</span>
                {icon}
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 900 }}>{value} Days</h3>
        </div>
    );
}
