"use client"

import React from 'react';
import { Clock, Star, Zap, MapPin, Phone, Instagram, Globe, Sparkles, Trophy, Dumbbell, Activity, Calendar } from 'lucide-react';

const OFFERS = [
    { id: 1, title: 'Summer Shred 50%', desc: 'Get 50% off on all annual memberships. Valid till April 15.', code: 'SUMMER50', color: '#f59e0b' },
    { id: 2, title: 'Student Special', desc: 'Flat ₹500 discount for college students. Bring your ID!', code: 'STUDENT500', color: '#2dd4bf' },
];

const SERVICES = [
    { name: 'Personal Training', icon: <Trophy size={20} />, price: '₹4999/mo', desc: '1-on-1 expert coaching tailored to your fitness goals.' },
    { name: 'Zumba & Dance', icon: <Activity size={20} />, price: 'Included', desc: 'High-energy cardio dance sessions every evening.' },
    { name: 'Yoga & Pilates', icon: <Sparkles size={20} />, price: '₹1499/mo', desc: 'Focus on flexibility, core strength, and mental peace.' },
    { name: 'Strength Training', icon: <Dumbbell size={20} />, price: 'Included', desc: 'State-of-the-art heavy lifting area and equipment.' },
];

const TIMINGS = [
    { day: 'Mon - Fri', time: '05:30 AM - 10:30 PM' },
    { day: 'Saturday', time: '06:00 AM - 09:00 PM' },
    { day: 'Sunday', time: '07:00 AM - 01:00 PM' },
];

export default function GymHubPage() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', paddingBottom: '110px' }}>
            <header>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <div style={{ padding: '6px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '8px' }}>
                        <Zap size={16} color="#f59e0b" />
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Gym Hub</span>
                </div>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '4px' }}>Services & Offers</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', fontWeight: 500 }}>Exclusive deals and premium facility details.</p>
            </header>

            {/* Live Offers Section */}
            <section>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h2 style={{ fontSize: '1.125rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Sparkles size={20} color="#f59e0b" /> Live Offers
                    </h2>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#f59e0b' }}>LIMITED TIME</span>
                </div>
                <div className="horizontal-scroll" style={{ gap: '16px' }}>
                    {OFFERS.map((offer) => (
                        <div key={offer.id} style={{ 
                            minWidth: '280px', 
                            padding: '24px', 
                            background: offer.color === '#f59e0b' ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : 'linear-gradient(135deg, #2dd4bf 0%, #0d9488 100%)', 
                            borderRadius: '24px', 
                            color: '#fff',
                            position: 'relative',
                            overflow: 'hidden',
                            boxShadow: `0 15px 30px ${offer.color}30`
                        }}>
                            <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '120px', height: '120px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}></div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '8px', position: 'relative' }}>{offer.title}</h3>
                            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)', marginBottom: '20px', fontWeight: 500, lineHeight: 1.4, position: 'relative' }}>{offer.desc}</p>
                            <div style={{ display: 'inline-block', padding: '8px 16px', background: 'rgba(255,255,255,0.2)', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 900, border: '1px dashed rgba(255,255,255,0.4)', position: 'relative' }}>
                                CODE: {offer.code}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Timings Section */}
            <section className="card" style={{ padding: '24px', background: '#000', color: '#fff', border: 'none' }}>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 900, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Clock size={20} color="#f59e0b" /> Operational Hours
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {TIMINGS.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: idx === TIMINGS.length -1 ? 0 : '16px', borderBottom: idx === TIMINGS.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.1)' }}>
                            <span style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{item.day}</span>
                            <span style={{ color: '#f59e0b', fontWeight: 800, fontSize: '0.9375rem' }}>{item.time}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Our Services Section */}
            <section>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 900, marginBottom: '16px' }}>Premium Services</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                    {SERVICES.map((service, idx) => (
                        <div key={idx} className="card" style={{ padding: '20px', display: 'flex', gap: '16px', alignItems: 'flex-start', background: '#fff' }}>
                            <div style={{ padding: '12px', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', borderRadius: '16px' }}>
                                {service.icon}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                    <h3 style={{ fontSize: '1rem', fontWeight: 900 }}>{service.name}</h3>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#f59e0b' }}>{service.price}</span>
                                </div>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, fontWeight: 500 }}>{service.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Contact & Location */}
            <section className="card" style={{ padding: '24px', background: 'var(--surface-color)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 900 }}>Reach Us</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <MapPin size={18} color="#f59e0b" />
                        <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Prime Fitness Hub, Sector 18, NOIDA, UP</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Phone size={18} color="#f59e0b" />
                        <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>+91-98765-43210</span>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                    <button style={{ flex: 1, padding: '12px', background: '#000', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <Instagram size={16} /> Instagram
                    </button>
                    <button style={{ flex: 1, padding: '12px', background: '#000', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <MapPin size={16} /> Get Directions
                    </button>
                </div>
            </section>
        </div>
    );
}
