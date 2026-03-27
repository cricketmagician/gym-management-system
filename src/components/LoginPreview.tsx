'use client';

import React from 'react';
import { Smartphone, Lock, ArrowRight } from 'lucide-react';
import { getDirectImageUrl } from '@/lib/image-utils';

interface LoginPreviewProps {
  config: {
    name: string;
    logoUrl?: string;
    loginBackgroundUrl?: string;
    primaryColor?: string;
    welcomeTitle?: string;
    welcomeSubtitle?: string;
  };
}

export default function LoginPreview({ config }: LoginPreviewProps) {
  const primaryColor = config.primaryColor || '#2dd4bf';
  
  return (
    <div className="preview-container">
      {/* Background Image with Overlay */}
      <div className="preview-hero-bg" style={{ 
        backgroundImage: config.loginBackgroundUrl 
          ? `url('${getDirectImageUrl(config.loginBackgroundUrl)}')` 
          : "url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=2070')" 
      }}>
        <div className="preview-overlay"></div>
      </div>

      <div className="preview-content">
        <div className="preview-card glass-panel">
          <div className="preview-header">
            {config.logoUrl ? (
              <img 
                src={getDirectImageUrl(config.logoUrl)} 
                alt={config.name} 
                className="preview-logo"
              />
            ) : (
              <div className="preview-brand-badge" style={{ background: primaryColor }}>
                {config.name || 'PULSEFIT'}
              </div>
            )}
            <h1>{config.welcomeTitle || 'Empower Your Strength'}</h1>
            <p>{config.welcomeSubtitle || 'Welcome back! Sign in to continue your journey.'}</p>
          </div>

          <form className="preview-form" onSubmit={(e) => e.preventDefault()}>
            <div className="preview-input-field">
              <label>Email or Phone</label>
              <div className="preview-input-wrapper">
                <Smartphone className="preview-input-icon" size={18} />
                <input type="text" placeholder="name@email.com or 9876..." disabled />
              </div>
            </div>

            <div className="preview-input-field">
              <label>Password</label>
              <div className="preview-input-wrapper">
                <Lock className="preview-input-icon" size={18} />
                <input type="password" placeholder="••••••••" disabled />
              </div>
            </div>

            <button className="preview-submit-btn" style={{ background: primaryColor }}>
              Access Dashboard <ArrowRight size={18} />
            </button>
          </form>

          <footer className="preview-footer">
            <p>© 2026 PulseFit Systems. Premium Fitness Management.</p>
          </footer>
        </div>
      </div>

      <style jsx>{`
        .preview-container {
          height: 600px;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          background: #000;
          overflow: hidden;
          border-radius: 20px;
          font-family: 'Inter', sans-serif;
        }
        .preview-hero-bg {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          z-index: 0;
        }
        .preview-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.8) 100%);
        }
        .preview-content {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 320px;
          padding: 16px;
          transform: scale(0.9);
        }
        .preview-card {
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 24px;
          padding: 24px;
          text-align: center;
        }
        .preview-logo {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          object-fit: cover;
          margin: 0 auto 16px;
          display: block;
        }
        .preview-brand-badge {
          padding: 3px 10px;
          border-radius: 12px;
          font-size: 0.65rem;
          font-weight: 800;
          width: fit-content;
          margin: 0 auto 16px;
          color: #fff;
        }
        h1 {
          color: #fff;
          font-size: 1.25rem;
          font-weight: 800;
          margin-bottom: 8px;
          letter-spacing: -0.01em;
        }
        p {
          color: rgba(255,255,255,0.6);
          font-size: 0.75rem;
          line-height: 1.4;
          margin-bottom: 24px;
        }
        .preview-form {
          display: flex;
          flex-direction: column;
          gap: 14px;
          text-align: left;
        }
        label {
          color: rgba(255,255,255,0.8);
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          margin-bottom: 4px;
          display: block;
        }
        .preview-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        .preview-input-icon {
          position: absolute;
          left: 12px;
          color: rgba(255,255,255,0.3);
        }
        input {
          width: 100%;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 10px 12px 10px 40px;
          border-radius: 10px;
          color: #fff;
          font-size: 0.8rem;
        }
        .preview-submit-btn {
          margin-top: 8px;
          color: #fff;
          border: none;
          padding: 12px;
          border-radius: 12px;
          font-size: 0.9rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
        }
        .preview-footer {
          margin-top: 20px;
        }
        .preview-footer p {
          font-size: 0.65rem;
          color: rgba(255,255,255,0.4);
          margin-bottom: 0;
        }
      `}</style>
    </div>
  );
}
