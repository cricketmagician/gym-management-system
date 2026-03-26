'use client';

import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, startOfWeek, endOfWeek } from 'date-fns';
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';

interface AttendanceCalendarProps {
    attendanceDates: Date[];
}

export default function AttendanceCalendar({ attendanceDates }: AttendanceCalendarProps) {
    const [currentMonth, setCurrentMonth] = React.useState(new Date());

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

    const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

    return (
        <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 800 }}>{format(currentMonth, 'MMMM yyyy')}</h2>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={prevMonth} style={{ padding: '8px', borderRadius: '10px', background: 'rgba(0,0,0,0.03)', border: 'none', cursor: 'pointer' }}>
                        <ChevronLeft size={18} />
                    </button>
                    <button onClick={nextMonth} style={{ padding: '8px', borderRadius: '10px', background: 'rgba(0,0,0,0.03)', border: 'none', cursor: 'pointer' }}>
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', textAlign: 'center' }}>
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                    <div key={day} style={{ fontSize: '0.75rem', fontWeight: 800, color: '#888', marginBottom: '8px' }}>{day}</div>
                ))}
                
                {calendarDays.map((day, idx) => {
                    const isAttended = attendanceDates.some(d => isSameDay(d, day));
                    const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
                    
                    return (
                        <div key={idx} style={{ 
                            aspectRatio: '1/1', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            position: 'relative',
                            borderRadius: '12px',
                            fontSize: '0.875rem',
                            fontWeight: isToday(day) ? 900 : 600,
                            color: isCurrentMonth ? (isAttended ? '#2dd4bf' : '#000') : '#ccc',
                            background: isAttended ? 'rgba(45, 212, 191, 0.1)' : 'transparent',
                            border: isToday(day) ? '2px solid #2dd4bf' : 'none'
                        }}>
                            {format(day, 'd')}
                            {isAttended && (
                                <div style={{ position: 'absolute', bottom: '4px', width: '4px', height: '4px', borderRadius: '50%', background: '#2dd4bf' }}></div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.75rem', color: '#666' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: 'rgba(45, 212, 191, 0.2)' }}></div>
                    <span>Attended</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '2px', border: '1px solid #2dd4bf' }}></div>
                    <span>Today</span>
                </div>
            </div>
        </div>
    );
}
