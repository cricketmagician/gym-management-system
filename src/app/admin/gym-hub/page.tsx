"use client"

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Zap, Trophy, Timer, Star, CheckCircle, X, Loader2, Sparkles, MessageSquare, AlertCircle, Save, Dumbbell } from 'lucide-react';

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

    if (loading) return <div className="p-8 text-center text-gray-500 font-bold"><Loader2 className="animate-spin mx-auto mb-2" /> Initializing Hub...</div>;

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-12 pb-24">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black mb-2 flex items-center gap-3">
                        <Sparkles size={32} className="text-amber-500" /> Gym Hub Manager
                    </h1>
                    <p className="text-gray-500 font-medium tracking-tight">Manage the "Gym Hub" section of the member app.</p>
                </div>
            </header>

            {/* Offers Section */}
            <section className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-black bg-amber-50 text-amber-600 px-4 py-1 rounded-lg border border-amber-100 uppercase tracking-tighter text-sm flex items-center gap-2">
                        <Zap size={16} /> LIVE OFFERS & DEALS
                    </h2>
                    <button 
                        onClick={() => setIsOfferModalOpen(true)}
                        className="bg-black text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-gray-800 transition-all"
                    >
                        <Plus size={18} /> Add New Offer
                    </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {offers.map((offer) => (
                        <div key={offer.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 rounded-2xl" style={{ backgroundColor: `${offer.color}15`, color: offer.color }}>
                                    <Zap size={24} />
                                </div>
                                <button 
                                    onClick={() => handleDelete('offer', offer.id)}
                                    className="p-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                            <h3 className="text-lg font-black mb-1">{offer.title}</h3>
                            <p className="text-gray-500 text-sm mb-4 line-clamp-2">{offer.description}</p>
                            {offer.code && (
                                <div className="inline-block px-3 py-1 bg-gray-50 border border-dashed border-gray-200 rounded-lg text-xs font-black text-gray-600">
                                    CODE: {offer.code}
                                </div>
                            )}
                        </div>
                    ))}
                    {offers.length === 0 && (
                        <div className="col-span-full py-12 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                            <p className="text-gray-400 font-bold">No active offers. Start your first promotion!</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Services Section */}
            <section className="space-y-6">
                <h2 className="text-xl font-black bg-teal-50 text-teal-600 px-4 py-1 rounded-lg border border-teal-100 uppercase tracking-tighter text-sm flex items-center gap-2 w-fit">
                    <Trophy size={16} /> FACILITY SERVICES
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {services.map((service) => (
                        <div key={service.id} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5">
                            <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-amber-500">
                                <Dumbbell size={28} />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-1">
                                    <h3 className="font-bold text-lg">{service.name}</h3>
                                    <span className="text-xs font-black text-amber-500">{service.priceLabel}</span>
                                </div>
                                <p className="text-xs text-gray-400 font-medium">{service.description}</p>
                            </div>
                            <button 
                                onClick={() => handleDelete('service', service.id)}
                                className="p-2 text-gray-200 hover:text-red-500 transition-colors"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Timings Section */}
            <section className="space-y-6">
                <h2 className="text-xl font-black bg-gray-100 text-gray-600 px-4 py-1 rounded-lg border border-gray-200 uppercase tracking-tighter text-sm flex items-center gap-2 w-fit">
                    <Timer size={16} /> GYM TIMINGS
                </h2>
                <div className="bg-white overflow-hidden rounded-3xl border border-gray-100 shadow-sm">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Day Range</th>
                                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Time Range</th>
                                <th className="px-6 py-4 text-right"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {timings.map((timing) => (
                                <tr key={timing.id} className="hover:bg-gray-50/30 transition-colors">
                                    <td className="px-6 py-4 font-bold text-gray-700">{timing.dayRange}</td>
                                    <td className="px-6 py-4 font-black text-amber-500">{timing.timeRange}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button 
                                            onClick={() => handleDelete('timing', timing.id)}
                                            className="text-gray-200 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Simple Add Offer Modal Overlay */}
            {isOfferModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
                    <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl animate-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-2xl font-black">Add Promotion</h3>
                            <button onClick={() => setIsOfferModalOpen(false)} className="bg-gray-100 p-2 rounded-full"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleAddOffer} className="space-y-5">
                            <div>
                                <label className="text-xs font-black text-gray-400 uppercase block mb-1">Title</label>
                                <input 
                                    required
                                    type="text" 
                                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
                                    placeholder="Summer Shred 50%"
                                    value={newOffer.title}
                                    onChange={e => setNewOffer({...newOffer, title: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-black text-gray-400 uppercase block mb-1">Description</label>
                                <textarea 
                                    required
                                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
                                    placeholder="Get 50% discount on first month..."
                                    value={newOffer.description}
                                    onChange={e => setNewOffer({...newOffer, description: e.target.value})}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-black text-gray-400 uppercase block mb-1">Promo Code</label>
                                    <input 
                                        type="text" 
                                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
                                        placeholder="GYM50"
                                        value={newOffer.code}
                                        onChange={e => setNewOffer({...newOffer, code: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-black text-gray-400 uppercase block mb-1">Color Theme</label>
                                    <select 
                                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
                                        value={newOffer.color}
                                        onChange={e => setNewOffer({...newOffer, color: e.target.value})}
                                    >
                                        <option value="#f59e0b">Amber Orange</option>
                                        <option value="#2dd4bf">Teal Green</option>
                                        <option value="#3b82f6">Power Blue</option>
                                        <option value="#ec4899">Hot Pink</option>
                                    </select>
                                </div>
                            </div>
                            <button type="submit" className="w-full bg-black text-white p-5 rounded-2xl font-black mt-4 hover:bg-gray-900 shadow-xl shadow-black/10">Launch Promotion</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
