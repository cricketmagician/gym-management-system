'use client';

import React, { useState, useRef } from 'react';
import { Camera, Loader2 } from 'lucide-react';

interface AvatarSectionProps {
  initialPhotoUrl: string | null;
  userName: string;
}

export default function AvatarSection({ initialPhotoUrl, userName }: AvatarSectionProps) {
  const [photoUrl, setPhotoUrl] = useState(initialPhotoUrl);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    // Mocking an upload to a CDN (e.g., Cloudinary or S3)
    // For this demo, we'll use a local FileReader and a mock URL
    const reader = new FileReader();
    reader.onloadend = async () => {
        const base64 = reader.result as string;
        
        // In a real app, you'd upload this to a server and get a URL back.
        // We'll simulate this by using a placeholder that looks unique.
        const mockUrl = `https://ui-avatars.com/api/?name=${userName}&background=random&color=fff&size=256&random=${Math.random()}`;

        try {
            const response = await fetch('/api/v1/members/me/photo', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ photoUrl: mockUrl })
            });

            if (response.ok) {
                setPhotoUrl(mockUrl);
            } else {
                alert("Failed to update profile photo.");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred during upload.");
        } finally {
            setIsUploading(false);
        }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ position: 'relative' }}>
      <div 
        onClick={handleAvatarClick}
        style={{ 
          width: '100px', 
          height: '100px', 
          borderRadius: '50%', 
          background: 'linear-gradient(135deg, #2dd4bf 0%, #0d9488 100%)', 
          padding: '4px',
          cursor: 'pointer',
          position: 'relative'
        }}
      >
        <div style={{ 
          width: '100%', 
          height: '100%', 
          borderRadius: '50%', 
          background: '#fff', 
          overflow: 'hidden', 
          border: '4px solid #fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {isUploading ? (
            <Loader2 className="animate-spin" size={32} color="#2dd4bf" />
          ) : (
            <img 
              src={photoUrl || `https://ui-avatars.com/api/?name=${userName}&background=000&color=fff&size=128`} 
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
            border: '2px solid #fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <Camera size={14} color="#fff" />
        </div>
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        style={{ display: 'none' }} 
      />
    </div>
  );
}
