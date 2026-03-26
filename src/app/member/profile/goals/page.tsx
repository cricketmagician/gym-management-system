'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Scale, Target, Save, Loader2, TrendingDown } from 'lucide-react';

export default function GoalsPage() {
    const [currentWeight, setCurrentWeight] = useState('');
    const [targetWeight, setTargetWeight] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchGoals = async () => {
            try {
                const response = await fetch('/api/v1/goals');
                const data = await response.json();
                if (data && !data.error) {
                    setCurrentWeight(data.currentWeight?.toString() || '');
                    setTargetWeight(data.targetWeight?.toString() || '');
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
                alert("Goals updated successfully!");
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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
                <Loader2 className="animate-spin" size={32} color="#2dd4bf" />
            </div>
        );
    }

    const progress = (currentWeight && targetWeight) ? Math.min(100, Math.max(0, 100 - (Math.abs(parseFloat(currentWeight) - parseFloat(targetWeight)) / 10 * 100))) : 0;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <header style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button onClick={() => router.back()} style={{ background: 'none', border: 'none', padding: '8px', cursor: 'pointer' }}>
                    <ChevronLeft size={24} color="#000" />
                </button>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Weight Goals</h1>
            </header>

            {/* Progress Visualization */}
            <div className="glass-card" style={{ padding: '24px', textAlign: 'center' }}>
                <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 16px auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg style={{ transform: 'rotate(-90deg)', width: '120px', height: '120px' }}>
                        <circle cx="60" cy="60" r="54" fill="transparent" stroke="rgba(0,0,0,0.05)" strokeWidth="8" />
                        <circle cx="60" cy="60" r="54" fill="transparent" stroke="#2dd4bf" strokeWidth="8" strokeDasharray={339.29} strokeDashoffset={339.29 * (1 - progress / 100)} strokeLinecap="round" />
                    </svg>
                    <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <span style={{ fontSize: '1.25rem', fontWeight: 900 }}>{Math.round(progress)}%</span>
                        <span style={{ fontSize: '0.625rem', color: '#888', textTransform: 'uppercase', fontWeight: 700 }}>Progress</span>
                    </div>
                </div>
                <p style={{ fontSize: '0.875rem', color: '#666' }}>You're getting closer to your target!</p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 700, color: '#666' }}>Current Weight (kg)</label>
                        <div style={{ position: 'relative' }}>
                            <Scale size={18} color="#2dd4bf" style={{ position: 'absolute', left: '12px', top: '14px' }} />
                            <input 
                                type="number" 
                                step="0.1"
                                placeholder="0.0" 
                                value={currentWeight}
                                onChange={(e) => setCurrentWeight(e.target.value)}
                                style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)', background: 'rgba(0,0,0,0.02)', outline: 'none', fontSize: '1rem', fontWeight: 600 }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 700, color: '#666' }}>Target Weight (kg)</label>
                        <div style={{ position: 'relative' }}>
                            <Target size={18} color="#fb923c" style={{ position: 'absolute', left: '12px', top: '14px' }} />
                            <input 
                                type="number" 
                                step="0.1"
                                placeholder="0.0" 
                                value={targetWeight}
                                onChange={(e) => setTargetWeight(e.target.value)}
                                style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)', background: 'rgba(0,0,0,0.02)', outline: 'none', fontSize: '1rem', fontWeight: 600 }}
                            />
                        </div>
                    </div>
                </div>

                <button 
                    type="submit" 
                    disabled={isLoading}
                    style={{ 
                        background: '#000', 
                        color: '#fff', 
                        padding: '18px', 
                        borderRadius: '16px', 
                        border: 'none', 
                        fontSize: '1rem', 
                        fontWeight: 800, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        gap: '12px',
                        cursor: 'pointer',
                        opacity: isLoading ? 0.7 : 1
                    }}
                >
                    {isLoading ? <Loader2 className="animate-spin" size={20} /> : (
                        <>
                            <Save size={20} /> Update Weight Goals
                        </>
                    )}
                </button>
            </form>

            <div className="glass-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px', background: 'rgba(45, 212, 191, 0.05)' }}>
                <TrendingDown size={24} color="#2dd4bf" />
                <p style={{ fontSize: '0.8125rem', color: '#666', lineHeight: '1.4' }}>Track your daily journey to see patterns and stay motivated. PulseFit will help you reach your goals faster.</p>
            </div>
        </div>
    );
}
