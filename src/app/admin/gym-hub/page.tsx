"use client"

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Zap, Trophy, Timer, Sparkles, X, Loader2, Dumbbell, ArrowUpRight, Megaphone, LayoutGrid } from 'lucide-react';

export default function AdminGymHubPage() {
    const [offers, setOffers] = useState<any[]>([]);
    const [services, setServices] = useState<any[]>([]);
    const [timings, setTimings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
    const [newOffer, setNewOffer] = useState<any>({ title: '', description: '', code: '', color: '#f59e0b' });

    useEffect(() => {
        fetchHubData();
    }, []);

    const fetchHubData = async () => {
        try {
            const res = await fetch('/api/v1/admin/gym-hub');
            const data = await res.json();
            setOffers(data.offers || []);
            setServices(data.services || []);
            setTimings(data.timings || []);
        } catch (error) {
            console.error("Failed to fetch hub data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddOffer = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/v1/admin/gym-hub?type=offer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newOffer)
            });
            if (res.ok) {
                setIsOfferModalOpen(false);
                setNewOffer({ title: '', description: '', code: '', color: '#f59e0b' });
                fetchHubData();
            }
        } catch (err) { console.error(err); }
    };

    const handleDelete = async (type: string, id: string) => {
        if (!confirm(`Delete this ${type}?`)) return;
        try {
            const res = await fetch(`/api/v1/admin/gym-hub?type=${type}&id=${id}`, {
                method: 'DELETE'
            });
            if (res.ok) fetchHubData();
        } catch (err) { console.error(err); }
    };

    if (loading) return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: '16px', color: 'rgba(255,255,255,0.4)' }}>
            <Loader2 className="animate-spin" size={40} />
            <p style={{ fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.75rem' }}>Initializing Elite Hub...</p>
        </div>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '48px', padding: '40px', background: '#000', minHeight: '100vh', color: '#fff' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <div style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', padding: '6px 14px', borderRadius: '12px', fontSize: '0.65rem', fontWeight: 900, letterSpacing: '0.1em', width: 'fit-content', marginBottom: '16px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>BOUTIQUE MANAGEMENT</div>
                    <h1 style={{ fontSize: '3.5rem', fontWeight: 950, letterSpacing: '-0.04em', lineHeight: 1, display: 'flex', alignItems: 'center', gap: '16px' }}>
                        Gym Hub <Sparkles className="text-amber-500" size={48} />
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '16px', fontSize: '1.125rem', fontWeight: 500 }}>Orchestrate your member experience with premium offers and facility insights.</p>
                </div>
                <button 
                    onClick={() => setIsOfferModalOpen(true)}
                    style={{ background: '#fff', color: '#000', padding: '14px 28px', borderRadius: '18px', border: 'none', fontWeight: 900, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', transition: 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}
                    className="scale-hover"
                >
                    <Plus size={18} /> Add New Promotion
                </button>
            </header>

            {/* Layout Sections */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '40px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
                    {/* Offers Section */}
                    <section style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <h2 style={{ fontSize: '0.75rem', fontWeight: 900, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Zap size={16} className="text-amber-500" /> Live Promotions & Deals
                        </h2>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                            {offers.map((offer) => (
                                <div key={offer.id} className="glass-card-dark" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
                                    <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '60px', height: '60px', background: offer.color || '#f59e0b', opacity: 0.1, filter: 'blur(30px)', borderRadius: '50%' }}></div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                        <div style={{ width: '40px', height: '40px', background: `${offer.color}20` || 'rgba(245, 158, 11, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: offer.color || '#f59e0b' }}>
                                            <Megaphone size={20} />
                                        </div>
                                        <button 
                                            onClick={() => handleDelete('offer', offer.id)}
                                            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.2)', cursor: 'pointer', transition: 'color 0.2s' }}
                                            onMouseOver={(e) => e.currentTarget.style.color = '#ef4444'}
                                            onMouseOut={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.2)'}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '8px' }}>{offer.title}</h3>
                                    <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5, marginBottom: '24px' }}>{offer.description}</p>
                                    {offer.code && (
                                        <div style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', width: 'fit-content', border: '1px solid rgba(255,255,255,0.1)' }}>
                                            <span style={{ fontSize: '0.625rem', fontWeight: 800, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginRight: '8px' }}>CODE:</span>
                                            <span style={{ fontSize: '0.875rem', fontWeight: 900, color: offer.color || '#f59e0b' }}>{offer.code}</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                            {offers.length === 0 && (
                                <div style={{ gridColumn: '1/-1', padding: '60px', background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '32px', textAlign: 'center' }}>
                                    <LayoutGrid size={40} style={{ color: 'rgba(255,255,255,0.1)', marginBottom: '16px' }} />
                                    <p style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 700 }}>No active promotions. Start your first push!</p>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Services Section */}
                    <section style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <h2 style={{ fontSize: '0.75rem', fontWeight: 900, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Trophy size={16} className="text-teal-500" /> Facility Services & Perks
                        </h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
                            {services.map((service) => (
                                <div key={service.id} className="glass-card-dark" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                                    <div style={{ width: '64px', height: '64px', background: 'rgba(255,255,255,0.03)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b' }}>
                                        <Dumbbell size={28} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                            <h3 style={{ fontWeight: 800, fontSize: '1.125rem' }}>{service.name}</h3>
                                            <span style={{ fontSize: '0.75rem', fontWeight: 900, color: '#f59e0b' }}>{service.priceLabel}</span>
                                        </div>
                                        <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>{service.description}</p>
                                    </div>
                                    <button 
                                        onClick={() => handleDelete('service', service.id)}
                                        style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.1)', cursor: 'pointer' }}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                    {/* Timings Section */}
                    <section style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <h2 style={{ fontSize: '0.75rem', fontWeight: 900, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Timer size={16} className="text-gray-400" /> Gym Standard Timings
                        </h2>
                        <div className="glass-card-dark" style={{ padding: '24px', overflow: 'hidden' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <tbody>
                                    {timings.map((timing) => (
                                        <tr key={timing.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                            <td style={{ padding: '16px 0', fontWeight: 700, fontSize: '0.875rem' }}>{timing.dayRange}</td>
                                            <td style={{ padding: '16px 0', textAlign: 'right', fontWeight: 900, color: '#f59e0b', fontSize: '0.875rem' }}>{timing.timeRange}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* Quick Insight Card */}
                    <div style={{ padding: '32px', background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', borderRadius: '32px', color: '#000' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                            <Zap size={32} strokeWidth={2.5} />
                            <ArrowUpRight size={24} />
                        </div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 900, lineHeight: 1.1, marginBottom: '12px' }}>Promotion Intelligence</h3>
                        <p style={{ fontSize: '0.875rem', fontWeight: 700, opacity: 0.8 }}>Active promos are broadcasted instantly to every member's dashboard.</p>
                    </div>
                </div>
            </div>

            {/* Elite Add Promotion Modal */}
            {isOfferModalOpen && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(20px)' }} onClick={() => setIsOfferModalOpen(false)}></div>
                    <div className="glass-card-dark" style={{ 
                        position: 'relative', 
                        width: '100%', 
                        maxWidth: '520px', 
                        padding: '48px', 
                        animation: 'landingFadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                            <h3 style={{ fontSize: '2rem', fontWeight: 950, letterSpacing: '-0.03em' }}>New Promotion</h3>
                            <button onClick={() => setIsOfferModalOpen(false)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', padding: '10px', borderRadius: '50%', cursor: 'pointer' }}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleAddOffer} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>Promotion Title</label>
                                <input 
                                    required
                                    type="text" 
                                    style={{ width: '100%', padding: '18px 24px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '18px', color: '#fff', fontWeight: 700, fontSize: '1rem', outline: 'none' }}
                                    className="focus:border-amber-500 transition-all"
                                    placeholder="e.g. Summer Shred 50%"
                                    value={newOffer.title}
                                    onChange={e => setNewOffer({...newOffer, title: e.target.value})}
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>Description</label>
                                <textarea 
                                    required
                                    style={{ width: '100%', padding: '18px 24px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '18px', color: '#fff', fontWeight: 700, fontSize: '1rem', height: '120px', outline: 'none', resize: 'none' }}
                                    className="focus:border-amber-500 transition-all"
                                    placeholder="Write a compelling copy..."
                                    value={newOffer.description}
                                    onChange={e => setNewOffer({...newOffer, description: e.target.value})}
                                />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>Promo Code</label>
                                    <input 
                                        type="text" 
                                        style={{ width: '100%', padding: '18px 24px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '18px', color: '#fff', fontWeight: 700, fontSize: '1rem', outline: 'none' }}
                                        className="focus:border-amber-500 transition-all"
                                        placeholder="GYM50"
                                        value={newOffer.code}
                                        onChange={e => setNewOffer({...newOffer, code: e.target.value})}
                                    />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>Visual Theme</label>
                                    <select 
                                        style={{ width: '100%', padding: '18px 24px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '18px', color: '#fff', fontWeight: 700, fontSize: '1rem', outline: 'none', appearance: 'none' }}
                                        className="focus:border-amber-500 transition-all"
                                        value={newOffer.color}
                                        onChange={e => setNewOffer({...newOffer, color: e.target.value})}
                                    >
                                        <option value="#f59e0b" style={{ background: '#000' }}>Amber Orange</option>
                                        <option value="#2dd4bf" style={{ background: '#000' }}>Teal Green</option>
                                        <option value="#3b82f6" style={{ background: '#000' }}>Power Blue</option>
                                        <option value="#ec4899" style={{ background: '#000' }}>Hot Pink</option>
                                    </select>
                                </div>
                            </div>
                            <button type="submit" style={{ width: '100%', padding: '22px', background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', border: 'none', borderRadius: '24px', color: '#000', fontSize: '1.125rem', fontWeight: 950, cursor: 'pointer', marginTop: '16px', boxShadow: '0 20px 40px rgba(245, 158, 11, 0.25)' }} className="scale-hover">Launch Transformation</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
