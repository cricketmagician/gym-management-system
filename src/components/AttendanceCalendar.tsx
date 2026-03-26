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
        <div style={{ padding: '28px', background: '#000', borderRadius: '32px', color: '#fff', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 900, letterSpacing: '-0.02em' }}>{format(currentMonth, 'MMMM yyyy')}</h2>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={prevMonth} style={{ padding: '10px', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer', color: '#fff' }}>
                        <ChevronLeft size={20} />
                    </button>
                    <button onClick={nextMonth} style={{ padding: '10px', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer', color: '#fff' }}>
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '12px', textAlign: 'center' }}>
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                    <div key={day} style={{ fontSize: '0.75rem', fontWeight: 900, color: '#555', marginBottom: '12px', textTransform: 'uppercase' }}>{day}</div>
                ))}
                
                {calendarDays.map((day, idx) => {
                    const isAttended = attendanceDates.some(d => isSameDay(d, day));
                    const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
                    const isTodayDate = isToday(day);
                    
                    return (
                        <div key={idx} style={{ 
                            aspectRatio: '1/1', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            position: 'relative',
                            borderRadius: '14px',
                            fontSize: '0.9375rem',
                            fontWeight: isTodayDate ? 900 : 600,
                            color: isCurrentMonth ? (isAttended ? '#fbbf24' : '#fff') : '#333',
                            background: isAttended ? 'rgba(251, 191, 36, 0.15)' : 'transparent',
                            border: isTodayDate ? '2px solid #555' : 'none',
                            transition: 'all 0.2s ease'
                        }}>
                            {format(day, 'd')}
                            {isAttended && (
                                <div style={{ 
                                    position: 'absolute', 
                                    bottom: '6px', 
                                    width: '5px', 
                                    height: '5px', 
                                    borderRadius: '50%', 
                                    background: '#fbbf24',
                                    boxShadow: '0 0 10px #fbbf24'
                                }}></div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div style={{ marginTop: '32px', display: 'flex', alignItems: 'center', gap: '20px', fontSize: '0.8125rem', color: '#888' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#fbbf24' }}></div>
                    <span style={{ fontWeight: 600 }}>Attended</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '3px', border: '2px solid #555' }}></div>
                    <span style={{ fontWeight: 600 }}>Today</span>
                </div>
            </div>
        </div>
    );
}
