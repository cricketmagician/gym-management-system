'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Scale, Target, Save, Loader2, TrendingDown, Flame, Calendar, Info, Check } from 'lucide-react';

type GoalType = 'lose' | 'maintain' | 'gain';

export default function GoalsPage() {
    const [currentWeight, setCurrentWeight] = useState('');
    const [targetWeight, setTargetWeight] = useState('');
    const [goalType, setGoalType] = useState<GoalType>('lose');
    const [weeklyRate, setWeeklyRate] = useState('0.5'); // kg per week
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchGoals = async () => {
            try {
                const response = await fetch('/api/v1/goals');
                const data = await response.json();
                if (data && !data.error) {
                    if (data.currentWeight) setCurrentWeight(data.currentWeight.toString());
                    if (data.targetWeight) setTargetWeight(data.targetWeight.toString());
                    
                    // Auto-determine goal type
                    if (data.currentWeight && data.targetWeight) {
                        if (data.currentWeight > data.targetWeight) setGoalType('lose');
                        else if (data.currentWeight < data.targetWeight) setGoalType('gain');
                        else setGoalType('maintain');
                    }
                }
            } catch (error) {
                console.error("Error fetching goals:", error);
            } finally {
                setIsFetching(false);
            }
        };
        fetchGoals();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await fetch('/api/v1/goals', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentWeight, targetWeight })
            });

            if (response.ok) {
                router.back();
            } else {
                alert("Failed to update goals.");
            }
        } catch (error) {
            alert("An error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
                <Loader2 className="animate-spin" size={32} color="var(--brand-primary)" />
            </div>
        );
    }

    const cur = parseFloat(currentWeight || '0');
    const tar = parseFloat(targetWeight || '0');
    const diff = Math.abs(cur - tar);
    const weeksToGoal = diff > 0 ? Math.ceil(diff / parseFloat(weeklyRate)) : 0;
    
    // Progress calculation (arbitrary 10kg range if no start weight)
    const progress = diff === 0 ? 100 : Math.min(100, Math.max(0, 100 - (diff / 10 * 100)));

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', minHeight: '100vh', padding: '0 4px' }}>
            {/* Header */}
            <header style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button 
                    onClick={() => router.back()} 
                    style={{ 
                        background: 'rgba(0,0,0,0.03)', 
                        border: 'none', 
                        borderRadius: '50%', 
                        padding: '10px', 
                        cursor: 'pointer',
                        display: 'flex'
                    }}
                >
                    <ChevronLeft size={24} color="var(--text-primary)" />
                </button>
                <div>
                    <h1 className="font-premium" style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)' }}>Fitness Goals</h1>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Tailor your journey to your body.</p>
                </div>
            </header>

            {/* Progress Visualization */}
            <div className="glass-card" style={{ 
                padding: '32px', 
                textAlign: 'center', 
                background: 'linear-gradient(145deg, var(--surface-color) 0%, rgba(245, 158, 11, 0.05) 100%)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
            }}>
                <div style={{ position: 'relative', width: '140px', height: '140px', margin: '0 auto 20px auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg style={{ transform: 'rotate(-90deg)', width: '140px', height: '140px' }}>
                        <circle cx="70" cy="70" r="62" fill="transparent" stroke="var(--border-color)" strokeWidth="10" />
                        <circle 
                            cx="70" cy="70" r="62" 
                            fill="transparent" 
                            stroke="var(--brand-primary)" 
                            strokeWidth="10" 
                            strokeDasharray={389.56} 
                            strokeDashoffset={389.56 * (1 - progress / 100)} 
                            strokeLinecap="round" 
                            style={{ filter: 'drop-shadow(0 0 8px rgba(245, 158, 11, 0.4))' }}
                        />
                    </svg>
                    <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                        <span className="font-premium" style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)' }}>{Math.round(progress)}%</span>
                        <span style={{ fontSize: '0.625rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '1px' }}>Achieved</span>
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', marginBottom: '8px' }}>
                    <div>
                        <span style={{ display: 'block', fontSize: '1.25rem', fontWeight: 900 }}>{currentWeight || '0'}<span style={{ fontSize: '0.75rem', opacity: 0.6 }}> kg</span></span>
                        <span style={{ fontSize: '0.625rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>Current</span>
                    </div>
                    <div>
                        <span style={{ display: 'block', fontSize: '1.25rem', fontWeight: 900 }}>{targetWeight || '0'}<span style={{ fontSize: '0.75rem', opacity: 0.6 }}> kg</span></span>
                        <span style={{ fontSize: '0.625rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>Target</span>
                    </div>
                </div>
                {weeksToGoal > 0 && (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '12px', marginTop: '16px' }}>
                        <Calendar size={14} color="var(--brand-primary)" />
                        <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--brand-primary)' }}>Est. {weeksToGoal} Weeks to Target</span>
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                {/* Goal Type Picker */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <label style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Flame size={18} color="var(--brand-primary)" /> Focus Category
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                        {(['lose', 'maintain', 'gain'] as GoalType[]).map((type) => (
                            <button
                                key={type}
                                type="button"
                                onClick={() => setGoalType(type)}
                                style={{
                                    padding: '16px 8px',
                                    borderRadius: '16px',
                                    border: `2px solid ${goalType === type ? 'var(--brand-primary)' : 'var(--border-color)'}`,
                                    background: goalType === type ? 'rgba(245, 158, 11, 0.05)' : 'transparent',
                                    color: goalType === type ? 'var(--brand-primary)' : 'var(--text-secondary)',
                                    fontSize: '0.8125rem',
                                    fontWeight: 700,
                                    textTransform: 'capitalize',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                {type === 'lose' ? 'Weight Loss' : type === 'gain' ? 'Muscle Gain' : 'Maintain'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Weight Inputs */}
                <div className="glass-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <label style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--text-primary)' }}>Current Weight</label>
                            <span style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--brand-primary)' }}>{currentWeight || '0'} kg</span>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <Scale size={20} color="var(--text-secondary)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
                            <input 
                                type="number" 
                                step="0.1"
                                placeholder="Enter current weight" 
                                value={currentWeight}
                                onChange={(e) => setCurrentWeight(e.target.value)}
                                style={{ 
                                    width: '100%', 
                                    padding: '18px 18px 18px 52px', 
                                    borderRadius: '18px', 
                                    border: '1px solid var(--border-color)', 
                                    background: 'rgba(0,0,0,0.03)', 
                                    outline: 'none', 
                                    fontSize: '1rem', 
                                    fontWeight: 600,
                                    color: 'var(--text-primary)'
                                }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <label style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--text-primary)' }}>Target Weight</label>
                            <span style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--brand-primary)' }}>{targetWeight || '0'} kg</span>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <Target size={20} color="var(--text-secondary)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
                            <input 
                                type="number" 
                                step="0.1"
                                placeholder="Enter target weight" 
                                value={targetWeight}
                                onChange={(e) => setTargetWeight(e.target.value)}
                                style={{ 
                                    width: '100%', 
                                    padding: '18px 18px 18px 52px', 
                                    borderRadius: '18px', 
                                    border: '1px solid var(--border-color)', 
                                    background: 'rgba(0,0,0,0.03)', 
                                    outline: 'none', 
                                    fontSize: '1rem', 
                                    fontWeight: 600,
                                    color: 'var(--text-primary)'
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Weekly Pace */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <label style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <TrendingDown size={18} color="var(--brand-primary)" /> Weekly Pace
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                        {[
                            { label: 'Gentle', val: '0.25' },
                            { label: 'Steady', val: '0.5' },
                            { label: 'Extreme', val: '1.0' }
                        ].map((pace) => (
                            <button
                                key={pace.val}
                                type="button"
                                onClick={() => setWeeklyRate(pace.val)}
                                style={{
                                    padding: '14px',
                                    borderRadius: '14px',
                                    border: 'none',
                                    background: weeklyRate === pace.val ? 'var(--brand-primary)' : 'rgba(0,0,0,0.04)',
                                    color: weeklyRate === pace.val ? '#000' : 'var(--text-secondary)',
                                    fontSize: '0.75rem',
                                    fontWeight: 800,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                {pace.label} ({pace.val}kg)
                            </button>
                        ))}
                    </div>
                </div>

                <button 
                    type="submit" 
                    disabled={isLoading}
                    style={{ 
                        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', 
                        color: '#000', 
                        padding: '20px', 
                        borderRadius: '20px', 
                        border: 'none', 
                        fontSize: '1.0625rem', 
                        fontWeight: 900, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        gap: '12px',
                        cursor: 'pointer',
                        boxShadow: '0 12px 24px rgba(245, 158, 11, 0.3)',
                        opacity: isLoading ? 0.7 : 1,
                        marginBottom: '40px'
                    }}
                >
                    {isLoading ? <Loader2 className="animate-spin" size={24} /> : (
                        <>
                            <Check size={20} strokeWidth={3} /> Save Fitness Goal
                        </>
                    )}
                </button>
            </form>

            {/* Motivation Info */}
            <div style={{ 
                padding: '20px', 
                borderRadius: '24px', 
                background: 'rgba(0,0,0,0.03)', 
                border: '1px solid var(--border-color)',
                display: 'flex',
                gap: '16px',
                alignItems: 'flex-start',
                marginBottom: '40px'
            }}>
                <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.1)' }}>
                    <Info size={18} color="var(--brand-primary)" />
                </div>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 500, lineHeight: '1.5' }}>
                    Consistency is king. By setting a weekly pace, PulseFit tracks your milestones and adjusts your training plan to ensure you reach your goal efficiently and safely.
                </p>
            </div>
        </div>
    );
}
