"use client"

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Zap, Trophy, Timer, Sparkles, X, Loader2, Dumbbell, ArrowUpRight, Megaphone, LayoutGrid, Clock, ShieldCheck } from 'lucide-react';

export default function AdminGymHubPage() {
    const [offers, setOffers] = useState<any[]>([]);
    const [services, setServices] = useState<any[]>([]);
    const [timings, setTimings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
    const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
    const [isTimingModalOpen, setIsTimingModalOpen] = useState(false);

    const [newOffer, setNewOffer] = useState<any>({ title: '', description: '', code: '', color: '#f59e0b' });
    const [newService, setNewService] = useState<any>({ name: '', description: '', priceLabel: '' });
    const [newTiming, setNewTiming] = useState<any>({ dayRange: '', timeRange: '' });

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

    const handleAdd = async (type: string, payload: any) => {
        try {
            const res = await fetch(`/api/v1/admin/gym-hub?type=${type}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                if (type === 'offer') {
                    setIsOfferModalOpen(false);
                    setNewOffer({ title: '', description: '', code: '', color: '#f59e0b' });
                } else if (type === 'service') {
                    setIsServiceModalOpen(false);
                    setNewService({ name: '', description: '', priceLabel: '' });
                } else if (type === 'timing') {
                    setIsTimingModalOpen(false);
                    setNewTiming({ dayRange: '', timeRange: '' });
                }
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
                    <div style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', padding: '6px 14px', borderRadius: '12px', fontSize: '0.65rem', fontWeight: 900, letterSpacing: '0.1em', width: 'fit-content', marginBottom: '16px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>HUB MANAGEMENT</div>
                    <h1 style={{ fontSize: '3.5rem', fontWeight: 950, letterSpacing: '-0.04em', lineHeight: 1, display: 'flex', alignItems: 'center', gap: '16px' }}>
                        Gym Hub <Sparkles className="text-amber-500" size={48} />
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '16px', fontSize: '1.125rem', fontWeight: 500 }}>Orchestrate your member experience with premium offers and facility insights.</p>
                </div>
            </header>

            {/* Layout Sections */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '40px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
                    {/* Offers Section */}
                    <section style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ fontSize: '0.75rem', fontWeight: 900, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Zap size={16} className="text-amber-500" /> Live Promotions & Deals
                            </h2>
                            <button onClick={() => setIsOfferModalOpen(true)} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '6px 12px', borderRadius: '10px', fontSize: '0.65rem', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }} className="scale-hover"><Plus size={14} /> ADD OFFER</button>
                        </div>
                        
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
                                            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.2)', cursor: 'pointer' }}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '8px' }}>{offer.title}</h3>
                                    <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5, marginBottom: '24px' }}>{offer.description}</p>
                                    {offer.code && (
                                        <div style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', width: 'fit-content', border: '1px solid rgba(255,255,255,0.1)' }}>
                                            <span style={{ fontSize: '0.875rem', fontWeight: 900, color: offer.color || '#f59e0b' }}>{offer.code}</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Services Section */}
                    <section style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ fontSize: '0.75rem', fontWeight: 900, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Trophy size={16} className="text-teal-500" /> Facility Services & Perks
                            </h2>
                            <button onClick={() => setIsServiceModalOpen(true)} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '6px 12px', borderRadius: '10px', fontSize: '0.65rem', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }} className="scale-hover"><Plus size={14} /> ADD SERVICE</button>
                        </div>
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
                                    <button onClick={() => handleDelete('service', service.id)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.1)', cursor: 'pointer' }}><Trash2 size={18} /></button>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                    {/* Timings Section */}
                    <section style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ fontSize: '0.75rem', fontWeight: 900, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Timer size={16} className="text-gray-400" /> Gym Standard Timings
                            </h2>
                            <button onClick={() => setIsTimingModalOpen(true)} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '6px 12px', borderRadius: '10px', fontSize: '0.65rem', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }} className="scale-hover"><Plus size={14} /> ADD TIMING</button>
                        </div>
                        <div className="glass-card-dark" style={{ padding: '24px' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <tbody>
                                    {timings.map((timing) => (
                                        <tr key={timing.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                            <td style={{ padding: '16px 0', fontWeight: 700, fontSize: '0.875rem' }}>{timing.dayRange}</td>
                                            <td style={{ padding: '16px 0', textAlign: 'right', fontWeight: 900, color: '#f59e0b', fontSize: '0.875rem' }}>{timing.timeRange}</td>
                                            <td style={{ padding: '16px 0', textAlign: 'right' }}>
                                                <button onClick={() => handleDelete('timing', timing.id)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.1)', cursor: 'pointer' }}><Trash2 size={16} /></button>
                                            </td>
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

            {/* Modals - Offer, Service, Timing */}
            {isOfferModalOpen && (
                <HubModal title="New Promotion" icon={<Megaphone size={24} />} onClose={() => setIsOfferModalOpen(false)} onSubmit={(e) => handleAdd('offer', newOffer)}>
                    <HubInput label="Title" value={newOffer.title} onChange={v => setNewOffer({...newOffer, title: v})} placeholder="e.g. Summer Shred 50%" />
                    <HubTextarea label="Description" value={newOffer.description} onChange={v => setNewOffer({...newOffer, description: v})} placeholder="Write a compelling copy..." />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <HubInput label="Promo Code" value={newOffer.code} onChange={v => setNewOffer({...newOffer, code: v})} placeholder="GYM50" />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>Theme</label>
                            <select style={{ width: '100%', padding: '16px 20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', color: '#fff', fontWeight: 700, fontSize: '0.875rem', appearance: 'none' }} value={newOffer.color} onChange={e => setNewOffer({...newOffer, color: e.target.value})}>
                                <option value="#f59e0b" style={{ background: '#000' }}>Amber</option>
                                <option value="#2dd4bf" style={{ background: '#000' }}>Teal</option>
                                <option value="#3b82f6" style={{ background: '#000' }}>Power Blue</option>
                            </select>
                        </div>
                    </div>
                </HubModal>
            )}

            {isServiceModalOpen && (
                <HubModal title="Add Facility Perk" icon={<Plus size={24} />} onClose={() => setIsServiceModalOpen(false)} onSubmit={(e) => handleAdd('service', newService)}>
                    <HubInput label="Service Name" value={newService.name} onChange={v => setNewService({...newService, name: v})} placeholder="e.g. Personal Training" />
                    <HubTextarea label="Service Description" value={newService.description} onChange={v => setNewService({...newService, description: v})} placeholder="Detailed description..." />
                    <HubInput label="Price / Label" value={newService.priceLabel} onChange={v => setNewService({...newService, priceLabel: v})} placeholder="e.g. $49.00 / session" />
                </HubModal>
            )}

            {isTimingModalOpen && (
                <HubModal title="Manage Timings" icon={<Clock size={24} />} onClose={() => setIsTimingModalOpen(false)} onSubmit={(e) => handleAdd('timing', newTiming)}>
                    <HubInput label="Day Range" value={newTiming.dayRange} onChange={v => setNewTiming({...newTiming, dayRange: v})} placeholder="e.g. Mon - Fri" />
                    <HubInput label="Time Range" value={newTiming.timeRange} onChange={v => setNewTiming({...newTiming, timeRange: v})} placeholder="e.g. 6AM - 10PM" />
                </HubModal>
            )}
        </div>
    );
}

function HubModal({ title, icon, onClose, onSubmit, children }: any) {
    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(20px)' }} onClick={onClose}></div>
            <div className="glass-card-dark" style={{ position: 'relative', width: '100%', maxWidth: '480px', padding: '40px', animation: 'landingFadeIn 0.3s ease-out' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b' }}>{icon}</div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 900 }}>{title}</h3>
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer' }}><X size={20} /></button>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {children}
                    <button type="submit" style={{ width: '100%', padding: '18px', background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', border: 'none', borderRadius: '18px', color: '#000', fontSize: '1rem', fontWeight: 950, cursor: 'pointer', marginTop: '12px' }} className="scale-hover">Save Configuration</button>
                </form>
            </div>
            <style jsx>{`
                @keyframes landingFadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );
}

function HubInput({ label, value, onChange, placeholder }: any) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>{label}</label>
            <input required type="text" style={{ width: '100%', padding: '16px 20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', color: '#fff', fontWeight: 700, fontSize: '0.875rem', outline: 'none' }} className="focus:border-amber-500 transition-all" placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} />
        </div>
    );
}

function HubTextarea({ label, value, onChange, placeholder }: any) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>{label}</label>
            <textarea required style={{ width: '100%', padding: '16px 20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', color: '#fff', fontWeight: 700, fontSize: '0.875rem', height: '100px', outline: 'none', resize: 'none' }} className="focus:border-amber-500 transition-all" placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} />
        </div>
    );
}
