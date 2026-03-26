import React from 'react';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Calendar, Dumbbell, Target, Flame, ArrowRight } from 'lucide-react';

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
            }
        }
    });

    if (!user) return <div>User not found</div>;

    const activeMembership = user.memberships[0];
    const daysLeft = activeMembership 
        ? Math.max(0, Math.ceil((new Date(activeMembership.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
        : 0;

    const attendanceCount = user.attendances.length;
    const workoutCount = user.workouts.length || 10; // Mocking 10 if none
    const weightGoal = user.weightGoals[0] || { currentWeight: 75, targetWeight: 70, caloriesBurned: 1250 };

    const trainers = await prisma.trainer.findMany({
        where: { gymId: user.gymId },
        take: 5
    });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Header */}
            <header style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#000', overflow: 'hidden' }}>
                    <img src={`https://ui-avatars.com/api/?name=${user.name}&background=000&color=fff`} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Hello, {user.name.split(' ')[0]}</h1>
            </header>

            {/* Membership Status Card */}
            <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <p style={{ fontSize: '0.875rem', fontWeight: 500, color: '#444' }}>Membership Status</p>
                <div style={{ marginBottom: '8px' }}>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '4px' }}>{daysLeft} Days Left</h2>
                    <p style={{ fontSize: '0.875rem', color: '#666' }}>Plan: {activeMembership?.plan.name || 'No Active Plan'}</p>
                </div>
                <button className="btn-renew" style={{ width: 'fit-content' }}>
                    <ArrowRight size={18} /> Renew Now
                </button>
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '16px' }}>
                <div className="glass-card-dark" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '160px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>Attendance</span>
                        <Calendar size={18} />
                    </div>
                    <h3 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{attendanceCount} Days</h3>
                </div>

                <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '160px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', color: '#444' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Workout Progress</span>
                        <Dumbbell size={18} />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{workoutCount} Sessions</h3>
                    </div>
                </div>
            </div>

            {/* Small Progress Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="glass-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ padding: '8px', background: '#000', borderRadius: '8px', color: '#fff' }}>
                        <Target size={14} />
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Weight Loss Goal</span>
                </div>
                <div className="glass-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ padding: '8px', background: '#FDE68A', borderRadius: '8px', color: '#000' }}>
                        <Flame size={14} />
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Calories Burned</span>
                </div>
            </div>

            {/* Trainers Section */}
            <section>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: '12px' }}>Trainers</h3>
                <div className="horizontal-scroll">
                    {trainers.map((trainer) => (
                        <div key={trainer.id} className="glass-card trainer-card">
                            <img src={trainer.photoUrl || 'https://via.placeholder.com/60'} alt={trainer.name} style={{ width: '48px', height: '48px', borderRadius: '12px', objectFit: 'cover' }} />
                            <div>
                                <p style={{ fontSize: '0.75rem', color: '#666' }}>Name</p>
                                <p style={{ fontSize: '0.875rem', fontWeight: 800 }}>{trainer.name}</p>
                                <p style={{ fontSize: '0.65rem', color: '#888' }}>{trainer.specialization}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
