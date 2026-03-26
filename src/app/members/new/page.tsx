"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Phone, Mail, Lock, Calendar, CreditCard, Sparkles, ArrowRight, X, ChevronDown, UserPlus, Camera, Zap, LayoutGrid } from 'lucide-react';
import { getDirectImageUrl } from '@/lib/image-utils';

export default function NewMemberPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [plans, setPlans] = useState<any[]>([]);
    const [selectedPlanId, setSelectedPlanId] = useState('');
    const [amount, setAmount] = useState<string>('');
    const [photoUrl, setPhotoUrl] = useState<string>('');
    const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [endDateDisplay, setEndDateDisplay] = useState<string>('');
    const [gymName, setGymName] = useState<string>('');

    useEffect(() => {
        // Fetch Plans
        fetch('/api/v1/plans')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setPlans(data);
            })
            .catch(console.error);

        // Fetch Gym Name
        fetch('/api/v1/admin/gym-hub')
            .then(res => res.json())
            .then(data => {
                if (data.name) setGymName(data.name);
            })
            .catch(console.error);
    }, []);

    useEffect(() => {
        if (selectedPlanId && startDate && plans.length > 0) {
            const plan = plans.find(p => p.id === selectedPlanId);
            if (plan) {
                const end = new Date(startDate);
                end.setDate(end.getDate() + plan.durationDays);
                setEndDateDisplay(end.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }));
            } else {
                setEndDateDisplay('');
            }
        } else {
            setEndDateDisplay('');
        }
    }, [selectedPlanId, startDate, plans]);

    const handlePlanChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const id = e.target.value;
        setSelectedPlanId(id);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData(e.currentTarget);

        try {
            const res = await fetch('/api/v1/members', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phone: formData.get('phone'),
                    email: formData.get('email') || null,
                    name: formData.get('name'),
                    gender: formData.get('gender'),
                    password: formData.get('password'),
                    amount: amount ? Number(amount) : 0,
                    planId: selectedPlanId || null,
                    startDate: new Date(startDate).toISOString(),
                    photoUrl: photoUrl || null
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to create member');

            router.push('/members');
            router.refresh();
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '48px', padding: '40px', background: '#000', minHeight: '100vh', color: '#fff' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
                <div>
                    <div style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', padding: '6px 14px', borderRadius: '12px', fontSize: '0.65rem', fontWeight: 900, letterSpacing: '0.1em', width: 'fit-content', marginBottom: '16px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>REGISTRATION PORTAL</div>
                    <h1 style={{ fontSize: '3.5rem', fontWeight: 950, letterSpacing: '-0.04em', lineHeight: 1, display: 'flex', alignItems: 'center', gap: '16px' }}>
                        Join {gymName || 'PulseFit'} <Sparkles className="text-amber-500" size={48} />
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '16px', fontSize: '1.125rem', fontWeight: 500 }}>Onboard a new athlete into the elite fitness ecosystem.</p>
                </div>
            </header>

            <div className="glass-card-dark" style={{ width: '100%', maxWidth: '800px', margin: '0 auto', padding: '48px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '300px', height: '300px', background: '#f59e0b', opacity: 0.03, filter: 'blur(100px)', borderRadius: '50%' }}></div>
                
                {error && <div style={{ padding: '16px 20px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '16px', border: '1px solid rgba(239, 68, 68, 0.2)', marginBottom: '32px', fontSize: '0.875rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '12px' }}><X size={18} /> {error}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    
                    {/* Identity Section */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <h2 style={{ fontSize: '0.75rem', fontWeight: 900, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <User size={16} className="text-amber-500" /> Identity Details
                        </h2>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>Full Name</label>
                                <div style={{ position: 'relative' }}>
                                    <input name="name" type="text" required placeholder="John Doe" style={{ width: '100%', padding: '18px 20px 18px 48px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', color: '#fff', fontSize: '0.9375rem', fontWeight: 700, outline: 'none' }} className="focus:border-amber-500 transition-all" />
                                    <User size={18} style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', opacity: 0.3 }} />
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>Gender</label>
                                <div style={{ position: 'relative' }}>
                                    <select name="gender" required style={{ width: '100%', padding: '18px 20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', color: '#fff', fontSize: '0.9375rem', fontWeight: 700, outline: 'none', appearance: 'none' }} className="focus:border-amber-500 transition-all">
                                        <option value="" style={{ background: '#000' }}>Select Gender</option>
                                        <option value="MALE" style={{ background: '#000' }}>Male</option>
                                        <option value="FEMALE" style={{ background: '#000' }}>Female</option>
                                        <option value="OTHER" style={{ background: '#000' }}>Other</option>
                                    </select>
                                    <ChevronDown size={18} style={{ position: 'absolute', right: '18px', top: '50%', transform: 'translateY(-50%)', opacity: 0.3, pointerEvents: 'none' }} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact & Security Section */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <h2 style={{ fontSize: '0.75rem', fontWeight: 900, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Lock size={16} className="text-amber-500" /> Contact & Security
                        </h2>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>Phone Number</label>
                                <div style={{ position: 'relative' }}>
                                    <input name="phone" type="tel" required placeholder="+91 9876543210" style={{ width: '100%', padding: '18px 20px 18px 48px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', color: '#fff', fontSize: '0.9375rem', fontWeight: 700, outline: 'none' }} className="focus:border-amber-500 transition-all" />
                                    <Phone size={18} style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', opacity: 0.3 }} />
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>Login Password</label>
                                <div style={{ position: 'relative' }}>
                                    <input name="password" type="password" required placeholder="••••••••" style={{ width: '100%', padding: '18px 20px 18px 48px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', color: '#fff', fontSize: '0.9375rem', fontWeight: 700, outline: 'none' }} className="focus:border-amber-500 transition-all" />
                                    <Lock size={18} style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', opacity: 0.3 }} />
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>Email Address (Optional)</label>
                            <div style={{ position: 'relative' }}>
                                <input name="email" type="email" placeholder="john@example.com" style={{ width: '100%', padding: '18px 20px 18px 48px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', color: '#fff', fontSize: '0.9375rem', fontWeight: 700, outline: 'none' }} className="focus:border-amber-500 transition-all" />
                                <Mail size={18} style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', opacity: 0.3 }} />
                            </div>
                        </div>
                    </div>

                    {/* Media Section */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <h2 style={{ fontSize: '0.75rem', fontWeight: 900, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Camera size={16} className="text-amber-500" /> Profile Media
                        </h2>
                        <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>Photo Google Drive Link</label>
                                <div style={{ position: 'relative' }}>
                                    <input name="photoUrl" type="url" value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} placeholder="https://drive.google.com/..." style={{ width: '100%', padding: '18px 20px 18px 48px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', color: '#fff', fontSize: '0.9375rem', fontWeight: 700, outline: 'none' }} className="focus:border-amber-500 transition-all" />
                                    <Camera size={18} style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', opacity: 0.3 }} />
                                </div>
                            </div>
                            {photoUrl && (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ fontSize: '0.55rem', fontWeight: 900, color: '#f59e0b', textTransform: 'uppercase' }}>Preview</span>
                                    <img src={getDirectImageUrl(photoUrl)} alt="Preview" style={{ width: '84px', height: '84px', objectFit: 'cover', borderRadius: '24px', border: '2px solid #f59e0b', boxShadow: '0 10px 20px rgba(245, 158, 11, 0.2)' }} />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Membership Section */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', padding: '32px', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ fontSize: '0.75rem', fontWeight: 900, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Zap size={16} fill="#f59e0b" /> Subscription Plan
                            </h2>
                            {endDateDisplay && <span style={{ fontSize: '0.7rem', fontWeight: 900, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.05em' }}>VALID UNTIL: {endDateDisplay.toUpperCase()}</span>}
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>Select Duration</label>
                                <div style={{ position: 'relative' }}>
                                    <select name="planId" required value={selectedPlanId} onChange={handlePlanChange} style={{ width: '100%', padding: '18px 20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', color: '#fff', fontSize: '0.9375rem', fontWeight: 700, outline: 'none', appearance: 'none' }} className="focus:border-amber-500 transition-all">
                                        <option value="" style={{ background: '#000' }}>Choose Plan</option>
                                        {plans.map(plan => (
                                            <option key={plan.id} value={plan.id} style={{ background: '#000' }}>{plan.name} ({plan.durationDays} Days)</option>
                                        ))}
                                    </select>
                                    <ChevronDown size={18} style={{ position: 'absolute', right: '18px', top: '50%', transform: 'translateY(-50%)', opacity: 0.3, pointerEvents: 'none' }} />
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>Start Date</label>
                                <div style={{ position: 'relative' }}>
                                    <input type="date" required value={startDate} onChange={(e) => setStartDate(e.target.value)} style={{ width: '100%', padding: '18px 20px 18px 48px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', color: '#fff', fontSize: '0.9375rem', fontWeight: 700, outline: 'none' }} className="focus:border-amber-500 transition-all" />
                                    <Calendar size={18} style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', opacity: 0.3 }} />
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>Total Amount Negotiated (₹)</label>
                            <div style={{ position: 'relative' }}>
                                <input name="amount" type="number" min="0" step="0.01" required value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="3999.00" style={{ width: '100%', padding: '18px 20px 18px 48px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', color: '#f59e0b', fontSize: '1.25rem', fontWeight: 950, outline: 'none' }} className="focus:border-amber-500 transition-all" />
                                <CreditCard size={20} style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', opacity: 0.3 }} />
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: '24px', display: 'flex', gap: '20px' }}>
                        <button type="button" onClick={() => router.back()} style={{ flex: 1, padding: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem', fontWeight: 900, cursor: 'pointer' }} className="scale-hover">DISCARD</button>
                        <button type="submit" disabled={loading} style={{ flex: 2, padding: '20px', background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', border: 'none', borderRadius: '20px', color: '#000', fontSize: '1rem', fontWeight: 950, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }} className="scale-hover">
                            {loading ? 'INITIALIZING...' : <>INITIALIZE MEMBER <ArrowRight size={20} /></>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
