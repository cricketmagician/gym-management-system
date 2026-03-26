"use client"

import React, { useState, useEffect } from 'react';
import { Clock, Star, Zap, MapPin, Phone, Instagram, Globe, Sparkles, Trophy, Dumbbell, Activity, Calendar, MessageSquare } from 'lucide-react';

export default function GymHubPage() {
    const [gym, setGym] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchGymData();
    }, []);

    const fetchGymData = async () => {
        try {
            const res = await fetch('/api/v1/gym-hub');
            const data = await res.json();
            setGym(data);
        } catch (error) {
            console.error("Failed to fetch gym data", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>Loading Gym Hub...</div>;

    const offers = gym?.offers || [];
    const services = gym?.services || [];
    const timings = gym?.timings || [];

    const handleWhatsApp = () => {
        if (!gym?.whatsappNumber) return;
        const phone = gym.whatsappNumber.replace(/\D/g, ''); // Remove non-digits
        const finalPhone = phone.startsWith('91') ? phone : `91${phone}`;
        window.open(`https://wa.me/${finalPhone}`, '_blank');
    };

    const handleInstagram = () => {
        if (!gym?.instagramLink) return;
        window.open(gym.instagramLink, '_blank');
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', paddingBottom: '110px' }}>
            <header>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <div style={{ padding: '6px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '8px' }}>
                        <Dumbbell size={16} color="#f59e0b" />
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Gym Hub</span>
                </div>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '4px' }}>Services & Offers</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', fontWeight: 500 }}>Exclusive deals and facility details for {gym?.name || 'our members'}.</p>
            </header>

            {/* Live Offers Section */}
            {offers.length > 0 && (
                <section>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h2 style={{ fontSize: '1.125rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Sparkles size={20} color="#f59e0b" /> Live Offers
                        </h2>
                        <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#f59e0b' }}>LIMITED TIME</span>
                    </div>
                    <div className="horizontal-scroll" style={{ gap: '16px' }}>
                        {offers.map((offer: any) => (
                            <div key={offer.id} style={{ 
                                minWidth: '280px', 
                                padding: '24px', 
                                background: offer.color || 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', 
                                borderRadius: '24px', 
                                color: '#fff',
                                position: 'relative',
                                overflow: 'hidden',
                                boxShadow: `0 15px 30px ${offer.color || '#f59e0b'}30`
                            }}>
                                <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '120px', height: '120px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}></div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '8px', position: 'relative' }}>{offer.title}</h3>
                                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)', marginBottom: '20px', fontWeight: 500, lineHeight: 1.4, position: 'relative' }}>{offer.description}</p>
                                {offer.code && (
                                    <div style={{ display: 'inline-block', padding: '8px 16px', background: 'rgba(255,255,255,0.2)', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 900, border: '1px dashed rgba(255,255,255,0.4)', position: 'relative' }}>
                                        CODE: {offer.code}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Timings Section */}
            {timings.length > 0 && (
                <section className="card" style={{ padding: '24px', background: '#000', color: '#fff', border: 'none' }}>
                    <h2 style={{ fontSize: '1.125rem', fontWeight: 900, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Clock size={20} color="#f59e0b" /> Operational Hours
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {timings.map((item: any, idx: number) => (
                            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: idx === timings.length -1 ? 0 : '16px', borderBottom: idx === timings.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.1)' }}>
                                <span style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{item.dayRange}</span>
                                <span style={{ color: '#f59e0b', fontWeight: 800, fontSize: '0.9375rem' }}>{item.timeRange}</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Our Services Section */}
            {services.length > 0 && (
                <section>
                    <h2 style={{ fontSize: '1.125rem', fontWeight: 900, marginBottom: '16px' }}>Premium Services</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                        {services.map((service: any, idx: number) => (
                            <div key={service.id} className="card" style={{ padding: '20px', display: 'flex', gap: '16px', alignItems: 'center', background: '#fff' }}>
                                <div style={{ padding: '12px', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', borderRadius: '16px' }}>
                                    <ServiceIcon name={service.iconName} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                        <h3 style={{ fontSize: '1rem', fontWeight: 900 }}>{service.name}</h3>
                                        {service.priceLabel && <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#f59e0b' }}>{service.priceLabel}</span>}
                                    </div>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, fontWeight: 500 }}>{service.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Contact & Location */}
            <section className="card" style={{ padding: '24px', background: 'var(--surface-color)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 900 }}>Reach Us</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <MapPin size={18} color="#f59e0b" />
                        <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{gym?.locationDesc || 'Prime Fitness Hub, NOIDA, UP'}</span>
                    </div>
                    {gym?.whatsappNumber && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Phone size={18} color="#f59e0b" />
                            <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{gym.whatsappNumber}</span>
                        </div>
                    )}
                </div>
                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                    {gym?.whatsappNumber && (
                        <button 
                            onClick={handleWhatsApp}
                            style={{ flex: 1, padding: '12px', background: '#25D366', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}
                        >
                            <MessageSquare size={16} /> WhatsApp
                        </button>
                    )}
                    {gym?.instagramLink && (
                        <button 
                            onClick={handleInstagram}
                            style={{ flex: 1, padding: '12px', background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}
                        >
                            <Instagram size={16} /> Instagram
                        </button>
                    )}
                </div>
            </section>
        </div>
    );
}

function ServiceIcon({ name }: { name: string }) {
    switch (name) {
        case 'Trophy': return <Trophy size={20} />;
        case 'Activity': return <Activity size={20} />;
        case 'Sparkles': return <Sparkles size={20} />;
        case 'Dumbbell': return <Dumbbell size={20} />;
        case 'Zap': return <Zap size={20} />;
        case 'Star': return <Star size={20} />;
        case 'Calendar': return <Calendar size={20} />;
        default: return <Dumbbell size={20} />;
    }
}
