"use client"

import React, { useState, useMemo } from 'react';
import { Search, ChevronRight, Dumbbell, Zap, Target, Flame, Trophy, Info, X } from 'lucide-react';

const CATEGORIES = [
    { id: 'all', name: 'All', icon: <Trophy size={18} /> },
    { id: 'chest', name: 'Chest', icon: <Zap size={18} /> },
    { id: 'back', name: 'Back', icon: <Target size={18} /> },
    { id: 'legs', name: 'Legs', icon: <Dumbbell size={18} /> },
    { id: 'shoulders', name: 'Shoulders', icon: <Flame size={18} /> },
];

const EXERCISES = [
    { 
        id: 1,
        name: 'Incline Bench Press', 
        category: 'chest', 
        image: '/Users/nihalkumar/.gemini/antigravity/brain/84c8b222-7f07-469d-8238-b883d3f2b978/bench_press_expert_view_1774525146072.png',
        muscles: ['Upper Pectorals', 'Triceps', 'Anterior Deltoids'],
        difficulty: 'Intermediate',
        equipment: 'Barbell / Incline Bench',
        expertTip: 'Keep your shoulder blades retracted and "tucked" into your back pockets for maximum stability and chest engagement.',
        howTo: ['Set bench to 30-45 degrees', 'Grip slightly wider than shoulders', 'Lower slowly to upper chest', 'Drive weight up explosively']
    },
    { 
        id: 2,
        name: 'Sumo Deadlift', 
        category: 'back', 
        image: '/Users/nihalkumar/.gemini/antigravity/brain/84c8b222-7f07-469d-8238-b883d3f2b978/deadlift_expert_view_1774525162778.png',
        muscles: ['Hamstrings', 'Glutes', 'Lower Back', 'Adductors'],
        difficulty: 'Advanced',
        equipment: 'Olympic Barbell',
        expertTip: 'Focus on "pulling the slack out of the bar" before you initiate the lift to keep your spine neutral.',
        howTo: ['Wide stance, toes out', 'Grip inside knees', 'Keep chest high', 'Drive through heels']
    },
    { 
        id: 3,
        name: 'Barbell Back Squat', 
        category: 'legs', 
        image: '/Users/nihalkumar/.gemini/antigravity/brain/84c8b222-7f07-469d-8238-b883d3f2b978/squat_expert_view_1774525180713.png',
        muscles: ['Quads', 'Glutes', 'Core', 'Erector Spinae'],
        difficulty: 'Intermediate',
        equipment: 'Squat Rack / Barbell',
        expertTip: 'Push your knees outward during the descent to Engage your glutes and create a stable "tripod" foot position.',
        howTo: ['Bar on traps', 'Feet shoulder width', 'Hip hinge first', 'Break parallel at bottom']
    },
    { 
        id: 4,
        name: 'Military Overhead Press', 
        category: 'shoulders', 
        image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=400',
        muscles: ['Deltoids', 'Triceps', 'Upper Traps'],
        difficulty: 'Intermediate',
        equipment: 'Barbell',
        expertTip: 'Squeeze your glutes throughout the lift to protect your lower back and create a solid base.',
        howTo: ['Feet together', 'Bar at collarbone', 'Full lockout at top', 'Lower under control']
    }
];

export default function ExercisesPage() {
    const [search, setSearch] = useState('');
    const [selectedCat, setSelectedCat] = useState('all');
    const [selectedEx, setSelectedEx] = useState<any>(null);

    const filteredExercises = useMemo(() => {
        return EXERCISES.filter(ex => {
            const matchesSearch = ex.name.toLowerCase().includes(search.toLowerCase());
            const matchesCat = selectedCat === 'all' || ex.category === selectedCat;
            return matchesSearch && matchesCat;
        });
    }, [search, selectedCat]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', paddingBottom: '100px' }}>
            <header>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <div style={{ padding: '6px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '8px' }}>
                        <Trophy size={16} color="#f59e0b" />
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pro Series</span>
                </div>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '4px' }}>Expert Guides</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', fontWeight: 500 }}>Highly researched training protocols.</p>
            </header>

            {/* Premium Search & Filter Bar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="card" style={{ padding: '4px 16px', display: 'flex', alignItems: 'center', gap: '12px', background: '#fff', border: '1px solid var(--border-color)' }}>
                    <Search size={20} color="#f59e0b" />
                    <input 
                        type="text" 
                        placeholder="Search specific movements..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ width: '100%', border: 'none', background: 'transparent', padding: '14px 0', fontSize: '0.9375rem', fontWeight: 600, outline: 'none' }} 
                    />
                    {search && (
                        <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}>
                            <X size={16} />
                        </button>
                    )}
                </div>

                <div className="horizontal-scroll" style={{ gap: '10px' }}>
                    {CATEGORIES.map((cat) => (
                        <button 
                            key={cat.id}
                            onClick={() => setSelectedCat(cat.id)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '10px 16px',
                                background: selectedCat === cat.id ? '#000' : '#fff',
                                color: selectedCat === cat.id ? '#fff' : '#000',
                                border: '1px solid var(--border-color)',
                                borderRadius: '14px',
                                fontSize: '0.85rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            <span style={{ opacity: selectedCat === cat.id ? 1 : 0.6 }}>{cat.icon}</span>
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Dynamic Exercise Grid */}
            <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '1.125rem', fontWeight: 900 }}>{selectedCat === 'all' ? 'Featured Movements' : `${CATEGORIES.find(c => c.id === selectedCat)?.name} Exercises`}</h2>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{filteredExercises.length} Found</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
                    {filteredExercises.map((ex) => (
                        <div 
                            key={ex.id} 
                            onClick={() => setSelectedEx(ex)}
                            className="card" 
                            style={{ 
                                display: 'flex', 
                                gap: '20px', 
                                padding: '16px', 
                                cursor: 'pointer', 
                                position: 'relative',
                                background: '#fff',
                                overflow: 'hidden'
                            }}
                        >
                            <div style={{ position: 'relative', minWidth: '110px', height: '110px' }}>
                                <img src={ex.image} alt={ex.name} style={{ width: '100%', height: '100%', borderRadius: '16px', objectFit: 'cover' }} />
                                <div style={{ position: 'absolute', top: '8px', right: '8px', background: '#f59e0b', color: '#fff', padding: '2px 6px', borderRadius: '4px', fontSize: '0.6rem', fontWeight: 900 }}>{ex.difficulty.toUpperCase()}</div>
                            </div>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <p style={{ fontSize: '1.05rem', fontWeight: 900, marginBottom: '6px' }}>{ex.name}</p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
                                    {ex.muscles.slice(0, 2).map((m, i) => (
                                        <span key={i} style={{ fontSize: '0.65rem', fontWeight: 700, background: 'rgba(0,0,0,0.03)', padding: '3px 8px', borderRadius: '6px', color: 'var(--text-secondary)' }}>{m}</span>
                                    ))}
                                    {ex.muscles.length > 2 && <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#f59e0b' }}>+{ex.muscles.length - 2} More</span>}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#2dd4bf' }}>
                                        <Dumbbell size={12} />
                                        <span style={{ fontSize: '0.7rem', fontWeight: 800 }}>PRO GUIDE</span>
                                    </div>
                                    <ArrowIndicator />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Detailed View Modal (Slide up) */}
            {selectedEx && (
                <div style={{ 
                    position: 'fixed', 
                    top: 0, 
                    left: 0, 
                    right: 0, 
                    bottom: 0, 
                    background: 'rgba(0,0,0,0.8)', 
                    zIndex: 2000, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'flex-end',
                    backdropFilter: 'blur(8px)'
                }}>
                    <div style={{ 
                        background: '#fff', 
                        borderTopLeftRadius: '32px', 
                        borderTopRightRadius: '32px', 
                        padding: '32px', 
                        maxHeight: '90vh', 
                        overflowY: 'auto' 
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                            <div>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '4px' }}>{selectedEx.name}</h3>
                                <p style={{ color: '#f59e0b', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Expert Protocol • {selectedEx.difficulty}</p>
                            </div>
                            <button onClick={() => setSelectedEx(null)} style={{ padding: '8px', background: 'rgba(0,0,0,0.05)', borderRadius: '50%', border: 'none', cursor: 'pointer' }}>
                                <X size={20} />
                            </button>
                        </div>

                        <img src={selectedEx.image} alt={selectedEx.name} style={{ width: '100%', borderRadius: '24px', height: '240px', objectFit: 'cover', marginBottom: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} />

                        <div className="card" style={{ padding: '20px', background: 'rgba(245, 158, 11, 0.05)', border: '1px dashed #f59e0b', borderRadius: '16px', marginBottom: '24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                <Zap size={18} color="#f59e0b" />
                                <h4 style={{ fontSize: '0.9rem', fontWeight: 800 }}>Expert Tip</h4>
                            </div>
                            <p style={{ fontSize: '0.875rem', color: '#444', lineHeight: 1.5, fontWeight: 500 }}>{selectedEx.expertTip}</p>
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <h4 style={{ fontSize: '1rem', fontWeight: 900, marginBottom: '12px' }}>Muscle Activation</h4>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                {selectedEx.muscles.map((m: string, i: number) => (
                                    <div key={i} style={{ padding: '8px 16px', background: '#000', color: '#fff', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700 }}>{m}</div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h4 style={{ fontSize: '1rem', fontWeight: 900, marginBottom: '12px' }}>Execution Steps</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {selectedEx.howTo.map((step: string, i: number) => (
                                    <div key={i} style={{ display: 'flex', gap: '14px' }}>
                                        <div style={{ minWidth: '24px', height: '24px', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 900 }}>{i + 1}</div>
                                        <p style={{ fontSize: '0.9rem', color: '#555', fontWeight: 500, lineHeight: 1.4 }}>{step}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button 
                            onClick={() => setSelectedEx(null)}
                            style={{ width: '100%', padding: '18px', background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: '#fff', border: 'none', borderRadius: '16px', fontWeight: 800, fontSize: '1rem', marginTop: '32px', cursor: 'pointer' }}
                        >
                            Got it, Let's go!
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

function ArrowIndicator() {
    return (
        <div style={{ marginLeft: 'auto', background: 'rgba(0,0,0,0.03)', padding: '6px', borderRadius: '50%' }}>
            <ChevronRight size={16} color="#888" />
        </div>
    );
}
