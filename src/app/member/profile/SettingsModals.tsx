'use client';

import React from 'react';
import { X, User, Bell, CreditCard, Settings, HelpCircle, Shield, Mail, MessageSquare } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'personal' | 'notifications' | 'billing' | 'preferences' | 'help' | null;
  userData: any;
  membership?: any;
}

export default function SettingsModal({ isOpen, onClose, type, userData, membership }: SettingsModalProps) {
  if (!isOpen || !type) return null;

  const renderContent = () => {
    switch (type) {
      case 'personal':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Full Name</label>
              <div style={inputStyle}>{userData.name}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Phone Number</label>
              <div style={inputStyle}>{userData.phone || 'Not provided'}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Email Address</label>
              <div style={inputStyle}>{userData.email || 'Not provided'}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Gender Identifier</label>
              <div style={inputStyle}>{userData.gender || 'Not specified'}</div>
            </div>
          </div>
        );
      case 'notifications':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <ToggleItem icon={<Shield size={20} />} label="WhatsApp Reminders" description="Receive renewal and plan updates via WhatsApp." defaultChecked />
            <ToggleItem icon={<Bell size={20} />} label="In-App Push" description="Get notified about gym announcements and offers." defaultChecked />
            <ToggleItem icon={<Shield size={20} />} label="SMS Alerts" description="Backup notification channel for critical alerts." />
          </div>
        );
      case 'billing':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="glass-card" style={{ padding: '24px', background: 'rgba(45, 212, 191, 0.05)', borderColor: 'rgba(45, 212, 191, 0.2)' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 800, color: '#2dd4bf', textTransform: 'uppercase', marginBottom: '12px' }}>Active Subscription</p>
              <h4 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '4px' }}>{membership?.plan?.name || 'No Active Plan'}</h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Valid until {membership ? new Date(membership.endDate).toLocaleDateString() : 'N/A'}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button style={listButtonStyle}><CreditCard size={18} /> View Payment History</button>
              <button style={listButtonStyle}><CreditCard size={18} /> Download Last Invoice</button>
            </div>
          </div>
        );
      case 'preferences':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)' }}>
              <div>
                <p style={{ fontWeight: 700 }}>Appearance Mode</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Follow system theme settings.</p>
              </div>
              <div style={{ display: 'flex', gap: '4px', background: 'rgba(0,0,0,0.1)', padding: '4px', borderRadius: '8px' }}>
                <span style={{ padding: '4px 8px', background: 'var(--brand-primary)', color: '#000', borderRadius: '6px', fontSize: '0.625rem', fontWeight: 900 }}>AUTO</span>
                <span style={{ padding: '4px 8px', opacity: 0.5, fontSize: '0.625rem', fontWeight: 900 }}>DARK</span>
              </div>
            </div>
          </div>
        );
      case 'help':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>Need assistance with your membership or the app? Our team is available 24/7 for premium support.</p>
            <a href="https://wa.me/919999999999" target="_blank" style={{ ...listButtonStyle, background: '#22c55e', color: '#fff', border: 'none', textDecoration: 'none' }}>
              <MessageSquare size={18} /> Chat on WhatsApp
            </a>
            <button style={listButtonStyle}><Mail size={18} /> Email Support Console</button>
            <div style={{ padding: '24px', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid var(--border-color)' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '12px' }}>Frequently Asked</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <details style={{ cursor: 'pointer' }}>
                  <summary style={{ fontWeight: 600, fontSize: '0.875rem' }}>How do I freeze my plan?</summary>
                  <p style={{ fontSize: '0.8125rem', marginTop: '8px', opacity: 0.7 }}>A plan can be frozen once per cycle for up to 7 days. Contact management to activate.</p>
                </details>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const titles = {
    personal: 'Personal Information',
    notifications: 'Notifications',
    billing: 'Billing Details',
    preferences: 'App Preferences',
    help: 'Help & Support'
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '40px 20px', overflowY: 'auto' }}>
      <div 
        onClick={onClose}
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(20px)' }} 
      />
      <div style={{ 
        position: 'relative',
        width: '100%',
        maxWidth: '440px',
        background: 'var(--surface-color)',
        borderRadius: '32px',
        border: '1px solid var(--border-color)',
        padding: '36px',
        boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
        animation: 'modalEntrance 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        marginTop: 'auto',
        marginBottom: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-0.02em' }}>{titles[type as keyof typeof titles]}</h3>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.03)', border: 'none', borderRadius: '50%', padding: '10px', cursor: 'pointer' }}>
            <X size={20} color="var(--text-secondary)" />
          </button>
        </div>

        {renderContent()}

        <button 
          onClick={onClose}
          style={{ width: '100%', padding: '18px', borderRadius: '18px', background: 'var(--brand-primary)', color: '#000', fontWeight: 800, border: 'none', marginTop: '32px', cursor: 'pointer' }}
        >
          Close Session
        </button>
      </div>

      <style jsx>{`
        @keyframes modalEntrance {
          from { transform: translateY(30px) scale(0.95); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  background: 'rgba(0,0,0,0.1)',
  border: '1px solid var(--border-color)',
  borderRadius: '16px',
  padding: '16px',
  fontSize: '0.9375rem',
  fontWeight: 600,
  color: 'var(--text-primary)',
  opacity: 0.8
};

const listButtonStyle: React.CSSProperties = {
  width: '100%',
  padding: '16px 20px',
  borderRadius: '16px',
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid var(--border-color)',
  color: 'var(--text-primary)',
  fontSize: '0.875rem',
  fontWeight: 700,
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  textAlign: 'left',
  cursor: 'pointer'
};

function ToggleItem({ icon, label, description, defaultChecked }: { icon: any, label: string, description: string, defaultChecked?: boolean }) {
  const [checked, setChecked] = React.useState(defaultChecked);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', borderRadius: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)' }}>
      <div style={{ color: checked ? '#2dd4bf' : 'var(--text-secondary)' }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <p style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{label}</p>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{description}</p>
      </div>
      <div 
        onClick={() => setChecked(!checked)}
        style={{ width: '48px', height: '24px', background: checked ? '#2dd4bf' : 'rgba(255,255,255,0.1)', borderRadius: '12px', position: 'relative', cursor: 'pointer', transition: 'all 0.3s ease' }}
      >
        <div style={{ position: 'absolute', top: '3px', left: checked ? '27px' : '3px', width: '18px', height: '18px', background: checked ? '#000' : '#fff', borderRadius: '50%', transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }} />
      </div>
    </div>
  );
}
