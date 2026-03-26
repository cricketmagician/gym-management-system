'use client';

import React, { useState } from 'react';
import { Camera, Loader2, X, Link as LinkIcon, Check } from 'lucide-react';
import { getDirectImageUrl } from '@/lib/image-utils';

interface AvatarSectionProps {
  initialPhotoUrl: string | null;
  userName: string;
}

export default function AvatarSection({ initialPhotoUrl, userName }: AvatarSectionProps) {
  const [photoUrl, setPhotoUrl] = useState(initialPhotoUrl);
  const [isUploading, setIsUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempUrl, setTempUrl] = useState(photoUrl || '');

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
            padding: '8px', 
            border: '2px solid var(--surface-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
        }}>
            <Camera size={14} color="#fff" />
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
                    background: 'rgba(0,0,0,0.8)', 
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)'
                }} 
            />

            {/* Modal Box */}
            <div style={{ 
                position: 'relative',
                width: '100%',
                maxWidth: '400px',
                background: 'var(--surface-color)',
                borderRadius: '32px',
                border: '1px solid var(--border-color)',
                padding: '32px',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
                boxShadow: '0 32px 64px rgba(0,0,0,0.5)',
                animation: 'modalSlideIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h3 className="font-premium" style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '8px' }}>Update Photo</h3>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                            Paste a Google Drive or image link below to update your profile picture.
                        </p>
                    </div>
                    <button 
                        onClick={() => setIsModalOpen(false)}
                        style={{ background: 'rgba(0,0,0,0.05)', border: 'none', borderRadius: '50%', padding: '8px', cursor: 'pointer' }}
                    >
                        <X size={20} color="var(--text-secondary)" />
                    </button>
                </div>

                <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>
                        <LinkIcon size={18} />
                    </div>
                    <input 
                        type="text" 
                        value={tempUrl}
                        onChange={(e) => setTempUrl(e.target.value)}
                        placeholder="https://drive.google.com/..."
                        style={{ 
                            width: '100%', 
                            background: 'rgba(0,0,0,0.03)', 
                            border: '1px solid var(--border-color)', 
                            borderRadius: '16px', 
                            padding: '16px 16px 16px 48px',
                            fontSize: '0.9375rem',
                            fontWeight: 500,
                            color: 'var(--text-primary)',
                            outline: 'none'
                        }}
                    />
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                    <button 
                        onClick={() => setIsModalOpen(false)}
                        style={{ 
                            flex: 1, 
                            padding: '16px', 
                            borderRadius: '16px', 
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
                            padding: '16px', 
                            borderRadius: '16px', 
                            border: 'none', 
                            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                            fontWeight: 800,
                            color: '#000',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            boxShadow: '0 8px 20px rgba(245, 158, 11, 0.3)'
                        }}
                    >
                        <Check size={18} />
                        Update Now
                    </button>
                </div>
            </div>

            <style jsx>{`
                @keyframes modalSlideIn {
                    from { transform: translateY(40px) scale(0.95); opacity: 0; }
                    to { transform: translateY(0) scale(1); opacity: 1; }
                }
            `}</style>
        </div>
      )}
    </div>
  );
}
