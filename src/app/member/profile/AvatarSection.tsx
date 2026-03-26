'use client';

import React, { useState, useRef } from 'react';
import { Camera, Loader2, Link as LinkIcon } from 'lucide-react';
import { getDirectImageUrl } from '@/lib/image-utils';

interface AvatarSectionProps {
  initialPhotoUrl: string | null;
  userName: string;
}

export default function AvatarSection({ initialPhotoUrl, userName }: AvatarSectionProps) {
  const [photoUrl, setPhotoUrl] = useState(initialPhotoUrl);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = async () => {
    const newUrl = window.prompt("Enter Photo URL (Google Drive links supported):", photoUrl || "");
    if (newUrl === null || newUrl === photoUrl) return;

    setIsUploading(true);

    try {
        const response = await fetch('/api/v1/members/me/photo', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ photoUrl: newUrl })
        });

        if (response.ok) {
            setPhotoUrl(newUrl);
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
      <div 
        onClick={handleAvatarClick}
        style={{ 
          width: '100px', 
          height: '100px', 
          borderRadius: '50%', 
          background: 'linear-gradient(135deg, var(--brand-primary) 0%, #0d9488 100%)', 
          padding: '4px',
          cursor: 'pointer',
          position: 'relative',
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
        }}
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
              src={getDirectImageUrl(photoUrl) || `https://ui-avatars.com/api/?name=${userName}&background=333&color=fff&size=128`} 
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
            background: '#000', 
            borderRadius: '50%', 
            padding: '8px', 
            border: '2px solid var(--surface-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
        }}>
            <Camera size={14} color="#fff" />
        </div>
      </div>
    </div>
  );
}
