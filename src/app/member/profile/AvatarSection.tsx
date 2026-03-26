'use client';

import React, { useState } from 'react';
import { Camera, Loader2, X, Link as LinkIcon, Check, User, Users } from 'lucide-react';
import { getDirectImageUrl } from '@/lib/image-utils';

interface AvatarSectionProps {
  initialPhotoUrl: string | null;
  userName: string;
}

const AVATARS = {
    boys: [
        { id: 'b1', url: '/avatars/boy1.png' },
        { id: 'b2', url: '/avatars/boy2.png' }
    ],
    girls: [
        { id: 'g1', url: '/avatars/girl1.png' },
        { id: 'g2', url: '/avatars/girl2.png' }
    ]
};

export default function AvatarSection({ initialPhotoUrl, userName }: AvatarSectionProps) {
  const [photoUrl, setPhotoUrl] = useState(initialPhotoUrl);
  const [isUploading, setIsUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempUrl, setTempUrl] = useState(photoUrl || '');
  const [activeGender, setActiveGender] = useState<'boys' | 'girls'>('boys');

  const handleUpdatePhoto = async () => {
    if (tempUrl === photoUrl) {
        setIsModalOpen(false);
        return;
    }

    setIsUploading(true);
    setIsModalOpen(false);

    try {
        const response = await fetch('/api/v1/members/me/photo', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ photoUrl: tempUrl })
        });

        if (response.ok) {
            setPhotoUrl(tempUrl);
        } else {
            alert("Failed to update profile photo.");
        }
    } catch (error) {
        console.error(error);
        alert("An error occurred during update.");
    } finally {
        setIsUploading(false);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Avatar Display */}
      <div 
        onClick={() => setIsModalOpen(true)}
        style={{ 
          width: '100px', 
          height: '100px', 
          borderRadius: '50%', 
          background: 'linear-gradient(135deg, var(--brand-primary) 0%, #0d9488 100%)', 
          padding: '4px',
          cursor: 'pointer',
          position: 'relative',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          transition: 'transform 0.3s ease'
        }}
        className="scale-hover"
      >
        <div style={{ 
          width: '100%', 
          height: '100%', 
          borderRadius: '50%', 
          background: 'var(--surface-color)', 
          overflow: 'hidden', 
          border: '4px solid var(--surface-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {isUploading ? (
            <Loader2 className="animate-spin" size={32} color="var(--brand-primary)" />
          ) : (
            <img 
              src={getDirectImageUrl(photoUrl) || `https://ui-avatars.com/api/?name=${userName}&background=333&color=fff&size=256`} 
              alt={userName} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          )}
        </div>
        
        {/* Camera Icon Overlay */}
        <div style={{ 
            position: 'absolute', 
            bottom: '0', 
            right: '0', 
            background: 'var(--brand-primary)', 
            borderRadius: '50%', 
            padding: '10px', 
            border: '2px solid var(--surface-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
        }}>
            <Camera size={16} color="#000" />
        </div>
      </div>

      {/* Premium App-Style Modal */}
      {isModalOpen && (
        <div style={{ 
            position: 'fixed', 
            inset: 0, 
            zIndex: 9999, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            padding: '20px'
        }}>
            {/* Backdrop */}
            <div 
                onClick={() => setIsModalOpen(false)}
                style={{ 
                    position: 'absolute', 
                    inset: 0, 
                    background: 'rgba(0,0,0,0.85)', 
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)'
                }} 
            />

            {/* Modal Box */}
            <div style={{ 
                position: 'relative',
                width: '100%',
                maxWidth: '440px',
                background: 'var(--surface-color)',
                borderRadius: '36px',
                border: '1px solid var(--border-color)',
                padding: '36px',
                display: 'flex',
                flexDirection: 'column',
                gap: '28px',
                boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
                animation: 'modalSlideIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h3 className="font-premium" style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '8px' }}>Update Photo</h3>
                        <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                            Choose a premium avatar or paste a link.
                        </p>
                    </div>
                    <button 
                        onClick={() => setIsModalOpen(false)}
                        style={{ background: 'rgba(0,0,0,0.05)', border: 'none', borderRadius: '50%', padding: '10px', cursor: 'pointer' }}
                    >
                        <X size={22} color="var(--text-secondary)" />
                    </button>
                </div>

                {/* Avatar Grid Section */}
                <div>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', background: 'rgba(0,0,0,0.03)', padding: '6px', borderRadius: '14px', width: 'fit-content' }}>
                        <button 
                            onClick={() => setActiveGender('boys')}
                            style={{ 
                                padding: '8px 20px', 
                                borderRadius: '10px', 
                                border: 'none', 
                                background: activeGender === 'boys' ? 'var(--brand-primary)' : 'transparent',
                                color: activeGender === 'boys' ? '#000' : 'var(--text-secondary)',
                                fontWeight: 700,
                                fontSize: '0.8125rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}
                        >
                            <User size={14} /> Boys
                        </button>
                        <button 
                            onClick={() => setActiveGender('girls')}
                            style={{ 
                                padding: '8px 20px', 
                                borderRadius: '10px', 
                                border: 'none', 
                                background: activeGender === 'girls' ? 'var(--brand-primary)' : 'transparent',
                                color: activeGender === 'girls' ? '#000' : 'var(--text-secondary)',
                                fontWeight: 700,
                                fontSize: '0.8125rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}
                        >
                            <Users size={14} /> Girls
                        </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                        {[...AVATARS.boys, ...AVATARS.girls].filter(a => activeGender === 'boys' ? a.id.startsWith('b') : a.id.startsWith('g')).map(avatar => (
                            <div 
                                key={avatar.id}
                                onClick={() => setTempUrl(avatar.url)}
                                style={{ 
                                    aspectRatio: '1',
                                    borderRadius: '20px',
                                    background: tempUrl === avatar.url ? 'rgba(245, 158, 11, 0.1)' : 'rgba(0,0,0,0.03)',
                                    border: `2px solid ${tempUrl === avatar.url ? 'var(--brand-primary)' : 'transparent'}`,
                                    padding: '8px',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    position: 'relative'
                                }}
                            >
                                <img src={avatar.url} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} />
                                {tempUrl === avatar.url && (
                                    <div style={{ position: 'absolute', top: '-6px', right: '-6px', background: 'var(--brand-primary)', borderRadius: '50%', padding: '4px', border: '2px solid var(--surface-color)' }}>
                                        <Check size={10} color="#000" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ height: '1px', flex: 1, background: 'var(--border-color)', opacity: 0.5 }}></div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Or Paste URL</span>
                    <div style={{ height: '1px', flex: 1, background: 'var(--border-color)', opacity: 0.5 }}></div>
                </div>

                <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>
                        <LinkIcon size={18} />
                    </div>
                    <input 
                        type="text" 
                        value={tempUrl}
                        onChange={(e) => setTempUrl(e.target.value)}
                        placeholder="Paste Google Drive or Image link..."
                        style={{ 
                            width: '100%', 
                            background: 'rgba(0,0,0,0.03)', 
                            border: '1px solid var(--border-color)', 
                            borderRadius: '18px', 
                            padding: '18px 18px 18px 48px',
                            fontSize: '0.9375rem',
                            fontWeight: 500,
                            color: 'var(--text-primary)',
                            outline: 'none'
                        }}
                    />
                </div>

                <div style={{ display: 'flex', gap: '14px' }}>
                    <button 
                        onClick={() => setIsModalOpen(false)}
                        style={{ 
                            flex: 1, 
                            padding: '18px', 
                            borderRadius: '18px', 
                            border: '1px solid var(--border-color)', 
                            background: 'transparent',
                            fontWeight: 700,
                            color: 'var(--text-secondary)',
                            cursor: 'pointer'
                        }}
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleUpdatePhoto}
                        style={{ 
                            flex: 1.5, 
                            padding: '18px', 
                            borderRadius: '18px', 
                            border: 'none', 
                            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                            fontWeight: 800,
                            color: '#000',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                            boxShadow: '0 12px 24px rgba(245, 158, 11, 0.25)'
                        }}
                    >
                        <Check size={18} strokeWidth={3} />
                        Update Profile
                    </button>
                </div>
            </div>

            <style jsx>{`
                @keyframes modalSlideIn {
                    from { transform: translateY(60px) scale(0.9); opacity: 0; }
                    to { transform: translateY(0) scale(1); opacity: 1; }
                }
            `}</style>
        </div>
      )}
    </div>
  );
}
