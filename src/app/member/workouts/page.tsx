"use client"

import React, { useState, useEffect } from 'react';
import { Calendar, Activity, Timer, Zap, CheckCircle2, ChevronRight, Plus, X, Trash2, AlertCircle, Clock, MapPin, Phone } from 'lucide-react';
import { format, isToday, isYesterday } from 'date-fns';

const WORKOUT_TYPES = [
    { id: 'chest', label: 'Chest', icon: '💪' },
    { id: 'back', label: 'Back', icon: '🦅' },
    { id: 'legs', label: 'Legs', icon: '🦵' },
    { id: 'shoulders', label: 'Shoulders', icon: '🛡️' },
    { id: 'biceps', label: 'Biceps', icon: '🔥' },
    { id: 'triceps', label: 'Triceps', icon: '⚡' },
    { id: 'cardio', label: 'Cardio', icon: '🏃' },
    { id: 'abs', label: 'Abs', icon: '💎' },
];

type SavingStage = 'idle' | 'confirming' | 'saving';

export default function WorkoutsPage() {
    const [workouts, setWorkouts] = useState<any[]>([]);
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [savingStage, setSavingStage] = useState<SavingStage>('idle');
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

    useEffect(() => {
        fetchWorkouts();
    }, []);

    const fetchWorkouts = async () => {
        try {
            const res = await fetch('/api/v1/workouts');
            const data = await res.json();
            setWorkouts(data);
        } catch (error) {
            console.error("Failed to fetch workouts", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleType = (id: string) => {
        if (savingStage !== 'idle') setSavingStage('idle');
        setSelectedTypes(prev => 
            prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
        );
    };

    const handleAction = async () => {
        if (selectedTypes.length === 0) return;

        if (savingStage === 'idle') {
            setSavingStage('confirming');
            return;
        }

        if (savingStage === 'confirming') {
            await handleSaveWorkout();
        }
    };

    const handleSaveWorkout = async () => {
        setSavingStage('saving');
        
        const title = selectedTypes.map(id => WORKOUT_TYPES.find(t => t.id === id)?.label).join(' + ');

        try {
            const res = await fetch('/api/v1/workouts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    title,
                    duration: 60,
                    calories: selectedTypes.length * 150
                })
            });

            if (res.ok) {
                setSelectedTypes([]);
                setSavingStage('idle');
                fetchWorkouts();
            }
        } catch (error) {
            console.error("Failed to save workout", error);
            setSavingStage('idle');
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`/api/v1/workouts/${id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                setConfirmDeleteId(null);
                fetchWorkouts();
            }
        } catch (error) {
            console.error("Failed to delete workout", error);
        }
    };

    const formatDateHeader = (dateStr: string) => {
        const date = new Date(dateStr);
        if (isToday(date)) return 'Today';
        if (isYesterday(date)) return 'Yesterday';
        return format(date, 'dd MMM');
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', padding: '20px 20px 110px 20px' }}>
            <header>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '8px' }}>Your Activity</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', fontWeight: 500 }}>Tracking your consistency and growth.</p>
            </header>

            {/* Quick Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px', background: '#000', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#2dd4bf' }}>
                        <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Weekly Hours</span>
                        <Timer size={18} />
                    </div>
                    <h3 style={{ fontSize: '1.75rem', fontWeight: 900 }}>4.5h</h3>
                </div>
                <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px', background: '#000', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fb923c' }}>
                        <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Calories burned</span>
                        <Activity size={18} />
                    </div>
                    <h3 style={{ fontSize: '1.75rem', fontWeight: 900, letterSpacing: '-0.02em' }}>2,450</h3>
                </div>
            </div>

            {/* Workout Logger Section */}
            <section className="card" style={{ padding: '32px', background: '#000', color: '#fff', border: 'none', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-50%', right: '-20%', width: '200px', height: '200px', background: 'rgba(245, 158, 11, 0.15)', filter: 'blur(60px)', borderRadius: '50%' }}></div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', position: 'relative' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Today's Workout</h2>
                    {selectedTypes.length > 0 && (
                        <button onClick={() => {setSelectedTypes([]); setSavingStage('idle');}} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>
                            <X size={20} />
                        </button>
                    )}
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px', position: 'relative' }}>
                    {WORKOUT_TYPES.map((type) => {
                        const isSelected = selectedTypes.includes(type.id);
                        return (
                            <button
                                key={type.id}
                                onClick={() => toggleType(type.id)}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '12px 8px',
                                    background: isSelected ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255,255,255,0.05)',
                                    border: isSelected ? '1px solid #f59e0b' : '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '16px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    color: isSelected ? '#f59e0b' : '#fff'
                                }}
                            >
                                <span style={{ fontSize: '1.25rem' }}>{type.icon}</span>
                                <span style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase' }}>{type.label}</span>
                            </button>
                        );
                    })}
                </div>

                <button 
                    onClick={handleAction}
                    disabled={selectedTypes.length === 0 || savingStage === 'saving'}
                    style={{ 
                        width: '100%', 
                        padding: '16px', 
                        background: selectedTypes.length > 0 
                            ? (savingStage === 'confirming' ? '#fb923c' : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)') 
                            : 'rgba(255,255,255,0.1)', 
                        color: selectedTypes.length > 0 ? '#fff' : 'rgba(255,255,255,0.3)', 
                        border: 'none', 
                        borderRadius: '16px', 
                        fontWeight: 800, 
                        fontSize: '1rem',
                        cursor: selectedTypes.length > 0 ? 'pointer' : 'default',
                        transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                        boxShadow: selectedTypes.length > 0 ? '0 10px 25px rgba(245, 158, 11, 0.3)' : 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        transform: savingStage === 'confirming' ? 'scale(1.02)' : 'scale(1)'
                    }}
                >
                    {savingStage === 'saving' ? 'Processing...' : 
                     savingStage === 'confirming' ? <>Confirm Session? <AlertCircle size={18} /></> : 
                     'Log Workout'}
                </button>
            </section>

            {/* Activity Timeline */}
            <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Workout History</h2>
                
                {loading ? (
                    <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '40px' }}>Loading history...</p>
                ) : workouts.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px 20px', background: 'rgba(0,0,0,0.4)', borderRadius: '24px', border: '2px dashed rgba(255,255,255,0.1)' }}>
                        <Zap size={32} color="#f59e0b" style={{ marginBottom: '12px', opacity: 0.5 }} />
                        <p style={{ fontWeight: 600, color: 'rgba(255,255,255,0.5)' }}>No workouts logged yet. Start today!</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative', paddingLeft: '24px' }}>
                        <div style={{ position: 'absolute', left: '7px', top: '10px', bottom: '10px', width: '2px', background: 'rgba(0,0,0,0.05)' }}></div>

                        {workouts.map((item, idx) => (
                            <div key={item.id} style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div style={{ position: 'absolute', left: '-20px', top: '10px', width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b', boxShadow: '0 0 10px rgba(245, 158, 11, 0.5)', zIndex: 2 }}></div>
                                
                                <div className="card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#000', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px' }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                            <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{formatDateHeader(item.date)}</p>
                                            <span style={{ padding: '3px 10px', borderRadius: '20px', background: 'rgba(45, 212, 191, 0.1)', color: '#2dd4bf', fontSize: '0.55rem', fontWeight: 900, letterSpacing: '0.05em' }}>COMPLETED</span>
                                        </div>
                                        <p style={{ fontSize: '1.125rem', fontWeight: 900 }}>{item.title}</p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '12px', opacity: 0.5 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <Calendar size={12} color="#f59e0b" /> <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{format(new Date(item.date), 'hh:mm a')}</span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <Timer size={12} color="#f59e0b" /> <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{item.duration}m</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <button 
                                            onClick={() => setConfirmDeleteId(item.id)}
                                            style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(220, 38, 38, 0.1)', color: '#ef4444', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(45, 212, 191, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <CheckCircle2 size={20} color="#2dd4bf" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Custom Delete Confirmation Modal */}
            {confirmDeleteId && (
                <div style={{ 
                    position: 'fixed', 
                    top: 0, 
                    left: 0, 
                    right: 0, 
                    bottom: 0, 
                    background: 'rgba(0,0,0,0.6)', 
                    backdropFilter: 'blur(10px)',
                    zIndex: 3000, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    padding: '24px'
                }}>
                    <div className="card" style={{ padding: '32px', maxWidth: '400px', width: '100%', textAlign: 'center', background: '#000', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}>
                        <div style={{ width: '64px', height: '64px', background: 'rgba(220, 38, 38, 0.1)', color: '#dc2626', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                            <Trash2 size={32} />
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '12px' }}>Delete Session?</h3>
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9375rem', marginBottom: '32px', lineHeight: 1.5 }}>
                            This will permanently remove this workout from your activity history. This action cannot be undone.
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <button 
                                onClick={() => setConfirmDeleteId(null)}
                                style={{ padding: '16px', borderRadius: '16px', background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', fontWeight: 700, cursor: 'pointer' }}
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={() => handleDelete(confirmDeleteId)}
                                style={{ padding: '16px', borderRadius: '16px', background: '#dc2626', border: 'none', color: '#fff', fontWeight: 700, cursor: 'pointer' }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
