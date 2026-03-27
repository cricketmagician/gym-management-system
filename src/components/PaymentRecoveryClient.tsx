"use client"

import React, { useState, useMemo } from 'react';
import { Search, MessageCircle, DollarSign, Calendar, AlertCircle, ArrowLeft, CheckCircle2, X, Plus, Users, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { format, differenceInDays } from 'date-fns';
import { useRouter } from 'next/navigation';

interface Member {
    id: string;
    userId: string;
    endDate: Date | string;
    status: string;
    user: {
        id: string;
        name: string;
        phone: string;
        photoUrl?: string;
    };
    plan: {
        id: string;
        name: string;
        durationDays: number;
    };
}

interface PaymentRecoveryClientProps {
    initialMemberships: Member[];
    gymName: string;
    gymWhatsApp: string;
}

export default function PaymentRecoveryClient({ initialMemberships, gymName, gymWhatsApp }: PaymentRecoveryClientProps) {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [amount, setAmount] = useState('');
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);

    const filteredMemberships = useMemo(() => {
        return initialMemberships.filter(m => 
            m.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.user.phone?.includes(searchQuery)
        );
    }, [initialMemberships, searchQuery]);

    // Estimate Revenue: This is a placeholder since we don't have historical pricing in this view
    // But we can show a summary count
    const expiredCount = initialMemberships.filter(m => new Date(m.endDate) < new Date()).length;
    const expiringCount = initialMemberships.length - expiredCount;

    const getWhatsAppUrl = (member: Member) => {
        const phone = (member.user.phone || '').replace(/\D/g, '');
        if (!phone) return '#';
        
        const isExpired = new Date(member.endDate) < new Date();
        const message = isExpired 
            ? `Hi ${member.user.name}! Your membership at ${gymName} has EXPIRED. To avoid interruption, please renew now.`
            : `Hi ${member.user.name}! Your membership at ${gymName} is expiring soon. Ready to renew and keep crushing your goals?`;
        
        return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    };

    const handleRenew = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedMember) return;
        
        setIsProcessing(true);
        try {
            const res = await fetch(`/api/v1/memberships/${selectedMember.id}/renew`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: Number(amount),
                    startDate: new Date(startDate).toISOString()
                })
            });

            if (!res.ok) throw new Error("Failed to renew");
            
            setSelectedMember(null);
            setAmount('');
            router.refresh();
        } catch (error) {
            console.error(error);
            alert("Error processing payment. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    const getOverdueDays = (date: string | Date) => {
        const diff = differenceInDays(new Date(), new Date(date));
        return diff > 0 ? diff : 0;
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '32px' }}>
                <div>
                    <Link href="/" style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px', 
                        color: 'var(--text-muted)', 
                        textDecoration: 'none', 
                        fontWeight: 700, 
                        fontSize: '0.875rem',
                        marginBottom: '24px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em'
                    }}>
                        <ArrowLeft size={16} /> Dashboard
                    </Link>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <h1 className="revenue-text-hero">Payment Recovery</h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', fontWeight: 700, letterSpacing: '0.05em' }}>
                            {initialMemberships.length } Members / <span style={{ color: 'var(--status-loss)' }}>{expiredCount} Lapsed Account(s)</span>
                        </p>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '16px' }}>
                     <div className="glass-card-premium" style={{ 
                        padding: '24px 32px', 
                        background: 'var(--surface-raised)', 
                        border: '1px solid var(--border-subtle)', 
                        borderRadius: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px'
                    }}>
                        <span style={{ fontSize: '0.65rem', fontWeight: 950, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Total At Risk</span>
                        <span style={{ fontSize: '1.5rem', fontWeight: 950, color: 'var(--status-loss)' }}>{initialMemberships.length} Assets</span>
                    </div>
                </div>
            </header>

            {/* Tactical Filter Bar */}
            <div style={{ 
                background: 'var(--surface-raised)', 
                padding: '12px 24px', 
                borderRadius: '16px', 
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
            }}>
                <Search size={20} color="var(--text-muted)" />
                <input 
                    type="text" 
                    placeholder="Search by name or phone..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ 
                        background: 'transparent', 
                        border: 'none', 
                        outline: 'none', 
                        color: 'var(--text-main)', 
                        fontSize: '1rem', 
                        fontWeight: 600,
                        width: '100%' 
                    }}
                />
            </div>

            {/* Recovery List */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                {filteredMemberships.length > 0 ? filteredMemberships.map((membership) => {
                    const isExpired = new Date(membership.endDate) < new Date();
                    const overdue = getOverdueDays(membership.endDate);
                    
                    return (
                        <div key={membership.id} className="metric-card-premium" style={{ 
                            background: 'var(--surface-raised)', 
                            border: '1px solid var(--border-subtle)', 
                            borderRadius: '24px', 
                            padding: '24px 32px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '24px',
                            transition: 'all 0.3s ease'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', minWidth: '300px' }}>
                                <div style={{ 
                                    width: '60px', 
                                    height: '60px', 
                                    borderRadius: '18px', 
                                    background: isExpired ? 'var(--status-loss)15' : 'var(--status-warning)15', 
                                    color: isExpired ? 'var(--status-loss)' : 'var(--status-warning)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 950,
                                    fontSize: '1.25rem',
                                    border: `1px solid ${isExpired ? 'var(--status-loss)' : 'var(--status-warning)'}20`
                                }}>
                                    {membership.user.name[0]}
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 950, color: 'var(--text-main)', marginBottom: '4px' }}>{membership.user.name}</h3>
                                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                        <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 700 }}>{membership.user.phone}</span>
                                        <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--border-subtle)' }} />
                                        <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 800 }}>{membership.plan.name}</span>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '48px', flexWrap: 'wrap' }}>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontSize: '0.65rem', fontWeight: 950, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>
                                        {isExpired ? 'OVERDUE SINCE' : 'EXPIRES IN'}
                                    </p>
                                    <p style={{ fontWeight: 900, color: isExpired ? 'var(--status-loss)' : 'var(--text-main)', fontSize: '0.9375rem' }}>
                                        {format(new Date(membership.endDate), 'dd MMM yyyy')}
                                        <span style={{ marginLeft: '8px', opacity: 0.6 }}>({isExpired ? `${overdue} days` : 'Soon'})</span>
                                    </p>
                                </div>

                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <a 
                                        href={getWhatsAppUrl(membership)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ 
                                            background: '#25D366', 
                                            color: '#fff', 
                                            padding: '12px 20px', 
                                            borderRadius: '12px', 
                                            fontWeight: 900, 
                                            fontSize: '0.8125rem', 
                                            textDecoration: 'none',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        }}
                                    >
                                        <MessageCircle size={18} fill="#fff" /> SEND ALERT
                                    </a>
                                    <button 
                                        onClick={() => setSelectedMember(membership)}
                                        style={{ 
                                            background: 'var(--text-main)', 
                                            color: '#fff', 
                                            padding: '12px 24px', 
                                            borderRadius: '12px', 
                                            fontWeight: 900, 
                                            fontSize: '0.8125rem',
                                            border: 'none',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        }}
                                    >
                                        COLLECT PAYMENT
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                }) : (
                    <div style={{ textAlign: 'center', padding: '100px 20px', background: 'var(--surface-raised)', borderRadius: '32px', border: '1px solid var(--border-subtle)' }}>
                        <div style={{ background: 'var(--bg-deep)', width: '80px', height: '80px', borderRadius: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: 'var(--status-success)' }}>
                            <CheckCircle2 size={40} />
                        </div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 950, color: 'var(--text-main)', marginBottom: '8px' }}>Revenue Stable</h2>
                        <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>No memberships require immediate recovery attention.</p>
                    </div>
                )}
            </div>

            {/* Renewal Modal */}
            {selectedMember && (
                <div style={{ 
                    position: 'fixed', 
                    inset: 0, 
                    background: 'rgba(15, 23, 42, 0.4)', 
                    backdropFilter: 'blur(12px)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    zIndex: 2000,
                    padding: '24px'
                }}>
                    <div style={{ 
                        background: '#fff', 
                        width: '100%', 
                        maxWidth: '450px', 
                        borderRadius: '32px', 
                        padding: '40px',
                        boxShadow: '0 40px 80px rgba(0,0,0,0.1)',
                        position: 'relative'
                    }}>
                        <button 
                            onClick={() => setSelectedMember(null)}
                            style={{ position: 'absolute', top: '32px', right: '32px', background: 'var(--surface-raised)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '8px', cursor: 'pointer' }}
                        >
                            <X size={20} />
                        </button>

                        <div style={{ marginBottom: '32px' }}>
                            <div style={{ background: 'var(--status-success)15', color: 'var(--status-success)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.65rem', fontWeight: 950, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px', width: 'fit-content' }}>
                                RECOVERY ACTION
                            </div>
                            <h2 style={{ fontSize: '1.75rem', fontWeight: 950, color: 'var(--text-main)', letterSpacing: '-0.03em' }}>Confirm Payment</h2>
                            <p style={{ color: 'var(--text-muted)', fontWeight: 600, marginTop: '4px' }}>Record cash collection for {selectedMember.user.name}</p>
                        </div>

                        <form onSubmit={handleRenew} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: 950, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Effective Date</label>
                                <input 
                                    type="date" 
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    style={{ padding: '16px', borderRadius: '12px', border: '1px solid var(--border-subtle)', background: 'var(--surface-raised)', color: 'var(--text-main)', fontSize: '1rem', fontWeight: 700 }}
                                />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: 950, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Amount Received (₹)</label>
                                <input 
                                    type="number" 
                                    placeholder="Enter amount"
                                    required
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    style={{ padding: '16px', borderRadius: '12px', border: '1px solid var(--border-subtle)', background: 'var(--surface-highlight)', color: 'var(--text-main)', fontSize: '1.25rem', fontWeight: 950 }}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                                <button 
                                    type="button" 
                                    onClick={() => setSelectedMember(null)}
                                    style={{ flex: 1, padding: '16px', borderRadius: '16px', background: 'var(--surface-raised)', border: '1px solid var(--border-subtle)', fontWeight: 800, cursor: 'pointer' }}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={isProcessing}
                                    style={{ flex: 1.5, padding: '16px', borderRadius: '16px', background: 'var(--text-main)', color: '#fff', border: 'none', fontWeight: 900, cursor: isProcessing ? 'not-allowed' : 'pointer', transition: 'opacity 0.2s ease' }}
                                >
                                    {isProcessing ? 'Verifying...' : 'VERIFY & RENEW'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
