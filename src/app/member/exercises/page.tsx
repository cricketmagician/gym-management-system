import React from 'react';
import { Search, ChevronRight, Dumbbell, Zap, Target } from 'lucide-react';

const CATEGORIES = [
  { name: 'Chest', count: 12, icon: <Zap className="text-teal-400" size={20} /> },
  { name: 'Back', count: 15, icon: <Target className="text-orange-400" size={20} /> },
  { name: 'Legs', count: 20, icon: <ChevronRight className="text-teal-400" size={20} /> },
  { name: 'Shoulders', count: 10, icon: <Dumbbell className="text-teal-400" size={20} /> },
];

const EXERCISES = [
  { name: 'Bench Press', category: 'Chest', image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=200' },
  { name: 'Deadlift', category: 'Back', image: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&q=80&w=200' },
  { name: 'Squats', category: 'Legs', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=200' },
  { name: 'Military Press', category: 'Shoulders', image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=200' },
];

export default function ExercisesPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <header>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '8px' }}>Exercises</h1>
        <p style={{ color: '#666', fontSize: '0.9375rem' }}>Find the perfect workout for your goals.</p>
      </header>

      {/* Search Bar */}
      <div className="glass-card" style={{ padding: '4px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Search size={20} color="#888" />
        <input 
          type="text" 
          placeholder="Search exercises..." 
          style={{ width: '100%', border: 'none', background: 'transparent', padding: '12px 0', fontSize: '0.9375rem', outline: 'none' }} 
        />
      </div>

      {/* Categories Horizontal Scroll */}
      <section>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px' }}>Categories</h2>
        <div className="horizontal-scroll" style={{ gap: '12px' }}>
          {CATEGORIES.map((cat) => (
            <div key={cat.name} className="glass-card" style={{ padding: '16px', minWidth: '120px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <div style={{ padding: '10px', background: 'rgba(45, 212, 191, 0.1)', borderRadius: '12px' }}>
                {cat.icon}
              </div>
              <p style={{ fontSize: '0.875rem', fontWeight: 700 }}>{cat.name}</p>
              <p style={{ fontSize: '0.75rem', color: '#888' }}>{cat.count} items</p>
            </div>
          ))}
        </div>
      </section>

      {/* Exercise List */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Recommended</h2>
        {EXERCISES.map((ex) => (
          <div key={ex.name} className="glass-card" style={{ display: 'flex', gap: '16px', padding: '12px', alignItems: 'center' }}>
            <img src={ex.image} alt={ex.name} style={{ width: '80px', height: '80px', borderRadius: '16px', objectFit: 'cover' }} />
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '4px' }}>{ex.name}</p>
              <p style={{ fontSize: '0.75rem', color: '#888' }}>Category: <span style={{ color: '#2dd4bf', fontWeight: 600 }}>{ex.category}</span></p>
            </div>
            <button style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid #ddd', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent' }}>
              <ChevronRight size={18} color="#888" />
            </button>
          </div>
        ))}
      </section>
    </div>
  );
}
