'use client';

import React, { useState } from 'react';
import { User, Bell, CreditCard, Settings, HelpCircle, ChevronRight } from 'lucide-react';
import SettingsModal from './SettingsModals';

interface SettingsSectionProps {
    userData: any;
    membership?: any;
}

export default function SettingsSection({ userData, membership }: SettingsSectionProps) {
    const [activeModal, setActiveModal] = useState<'personal' | 'notifications' | 'billing' | 'preferences' | 'help' | null>(null);

    return (
        <>
            <section style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, paddingLeft: '8px', marginBottom: '8px', color: 'var(--text-primary)' }}>App Settings</h3>
                
                <div className="glass-card" style={{ padding: '0 16px' }}>
                    <ProfileOption 
                        icon={<User size={18} />} 
                        label="Personal Information" 
                        onClick={() => setActiveModal('personal')} 
                    />
                    <ProfileOption 
                        icon={<Bell size={18} />} 
                        label="Notifications" 
                        onClick={() => setActiveModal('notifications')} 
                    />
                    <ProfileOption 
                        icon={<CreditCard size={18} />} 
                        label="Billing Details" 
                        onClick={() => setActiveModal('billing')} 
                    />
                    <ProfileOption 
                        icon={<Settings size={18} />} 
                        label="App Preferences" 
                        onClick={() => setActiveModal('preferences')} 
                    />
                    <ProfileOption 
                        icon={<HelpCircle size={18} />} 
                        label="Help & Support" 
                        onClick={() => setActiveModal('help')} 
                        last 
                    />
                </div>
            </section>

            <SettingsModal 
                isOpen={!!activeModal} 
                onClose={() => setActiveModal(null)} 
                type={activeModal}
                userData={userData}
                membership={membership}
            />
        </>
    );
}

function ProfileOption({ icon, label, onClick, last }: { icon: React.ReactNode, label: string, onClick: () => void, last?: boolean }) {
    return (
        <div 
            onClick={onClick}
            style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '16px', 
                padding: '20px 0', 
                borderBottom: last ? 'none' : '1px solid var(--border-color)',
                cursor: 'pointer'
            }}
            className="scale-hover"
        >
            <div style={{ color: '#2dd4bf' }}>{icon}</div>
            <span style={{ flex: 1, fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)' }}>{label}</span>
            <ChevronRight size={18} color="var(--text-secondary)" />
        </div>
    );
}
