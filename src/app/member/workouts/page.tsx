import React from 'react';
import { Calendar, Activity, Timer, Zap, CheckCircle2 } from 'lucide-react';

const WORKOUT_HISTORY = [
  { day: 'Today', name: 'Upper Body Power', time: '10:30 AM', duration: '45m', status: 'Completed', color: '#2dd4bf' },
  { day: 'Yesterday', name: 'Lower Body Strength', time: '05:15 PM', duration: '60m', status: 'Completed', color: '#fb923c' },
  { day: '24 Mar', name: 'Core & Cardio', time: '08:00 AM', duration: '30m', status: 'Completed', color: '#818cf8' },
];

export default function WorkoutsPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <header>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '8px' }}>Your Activity</h1>
        <p style={{ color: '#666', fontSize: '0.9375rem' }}>Tracking your consistency and growth.</p>
      </header>

      {/* Summary Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#2dd4bf' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Weekly Hours</span>
            <Timer size={18} />
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>4.5h</h3>
        </div>
        <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fb923c' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Avg Calories</span>
            <Activity size={18} />
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>450</h3>
        </div>
      </div>

      {/* Activity Timeline */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Workout History</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative', paddingLeft: '24px' }}>
          {/* Vertical Line */}
          <div style={{ position: 'absolute', left: '7px', top: '10px', bottom: '10px', width: '2px', background: 'rgba(0,0,0,0.05)' }}></div>

          {WORKOUT_HISTORY.map((item, idx) => (
            <div key={idx} style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {/* Timeline Dot */}
              <div style={{ position: 'absolute', left: '-20px', top: '6px', width: '8px', height: '8px', borderRadius: '50%', background: item.color, boxShadow: `0 0 10px ${item.color}80` }}></div>
              
              <div className="glass-card" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <p style={{ fontSize: '0.75rem', color: '#888', fontWeight: 600 }}>{item.day}</p>
                    <span style={{ padding: '2px 8px', borderRadius: '20px', background: 'rgba(45, 212, 191, 0.1)', color: '#2dd4bf', fontSize: '0.625rem', fontWeight: 800 }}>{item.status}</span>
                  </div>
                  <p style={{ fontSize: '1rem', fontWeight: 800 }}>{item.name}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px', opacity: 0.6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={12} /> <span style={{ fontSize: '0.7rem' }}>{item.time}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Timer size={12} /> <span style={{ fontSize: '0.7rem' }}>{item.duration}</span>
                    </div>
                  </div>
                </div>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle2 size={20} color="#2dd4bf" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
