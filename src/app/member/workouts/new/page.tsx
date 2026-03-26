'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Zap, Timer, Flame, CheckCircle2, Loader2 } from 'lucide-react';

export default function NewWorkoutPage() {
    const [title, setTitle] = useState('');
    const [duration, setDuration] = useState('');
    const [calories, setCalories] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title) return;

        setIsLoading(true);
        try {
            const response = await fetch('/api/v1/workouts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, duration, calories })
            });

            if (response.ok) {
                setIsSuccess(true);
                setTimeout(() => router.push('/member/workouts'), 2000);
            } else {
                alert("Failed to log workout.");
            }
        } catch (error) {
            alert("An error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh', textAlign: 'center', gap: '20px' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(45, 212, 191, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle2 size={40} color="#2dd4bf" className="animate-pulse" />
                </div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Workout Logged!</h1>
                <p style={{ color: '#666' }}>Keep crushing those goals. Redirecting...</p>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <header style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button onClick={() => router.back()} style={{ background: 'none', border: 'none', padding: '8px', cursor: 'pointer' }}>
                    <ChevronLeft size={24} color="#000" />
                </button>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Log Workout</h1>
            </header>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 700, color: '#666' }}>Workout Title</label>
                        <div style={{ position: 'relative' }}>
                            <Zap size={18} color="#2dd4bf" style={{ position: 'absolute', left: '12px', top: '14px' }} />
                            <input 
                                type="text" 
                                placeholder="e.g. Morning Cardio" 
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)', background: 'rgba(0,0,0,0.02)', outline: 'none', fontSize: '1rem', fontWeight: 600 }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: 700, color: '#666' }}>Duration (min)</label>
                            <div style={{ position: 'relative' }}>
                                <Timer size={18} color="#fb923c" style={{ position: 'absolute', left: '12px', top: '14px' }} />
                                <input 
                                    type="number" 
                                    placeholder="0" 
                                    value={duration}
                                    onChange={(e) => setDuration(e.target.value)}
                                    style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)', background: 'rgba(0,0,0,0.02)', outline: 'none', fontSize: '1rem', fontWeight: 600 }}
                                />
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: 700, color: '#666' }}>Calories</label>
                            <div style={{ position: 'relative' }}>
                                <Flame size={18} color="#ef4444" style={{ position: 'absolute', left: '12px', top: '14px' }} />
                                <input 
                                    type="number" 
                                    placeholder="0" 
                                    value={calories}
                                    onChange={(e) => setCalories(e.target.value)}
                                    style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)', background: 'rgba(0,0,0,0.02)', outline: 'none', fontSize: '1rem', fontWeight: 600 }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <button 
                    type="submit" 
                    disabled={isLoading || !title}
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
                        opacity: (isLoading || !title) ? 0.7 : 1
                    }}
                >
                    {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Log Workout Session"}
                </button>
            </form>

            <div className="glass-card" style={{ padding: '24px', textAlign: 'center' }}>
                <p style={{ fontSize: '0.8125rem', color: '#888', fontStyle: 'italic' }}>"Consistency is the key to all results."</p>
            </div>
        </div>
    );
}
