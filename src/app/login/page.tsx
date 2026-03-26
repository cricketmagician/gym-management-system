'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Smartphone, Mail, Lock, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        identifier,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid credentials. Please try again.');
      } else {
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Background Image with Overlay */}
      <div className="login-hero-bg">
        <div className="overlay"></div>
      </div>

      <div className="login-content">
        <div className="login-card glass-panel animate-fade-in">
          <div className="login-header">
            <div className="brand-badge">PULSEFIT</div>
            <h1>Empower Your Strength</h1>
            <p>Welcome back! Sign in to continue your journey.</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {error && <div className="error-alert">{error}</div>}

            <div className="input-field">
              <label>Email or Phone</label>
              <div className="input-wrapper">
                <Smartphone className="input-icon" size={20} />
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="name@email.com or 9876..."
                  required
                />
              </div>
            </div>

            <div className="input-field">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <label>Password</label>
                <a href="#" className="forgot-link">Forgot?</a>
              </div>
              <div className="input-wrapper">
                <Lock className="input-icon" size={20} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? 'Processing...' : 'Access Dashboard'}
              {!isLoading && <ArrowRight size={20} />}
            </button>
          </form>

          <footer className="card-footer">
            <p>© 2026 PulseFit Systems. Premium Fitness Management.</p>
          </footer>
        </div>
      </div>

      <style jsx>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          background: #000;
          overflow: hidden;
          font-family: 'Inter', sans-serif;
        }

        .login-hero-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=2070') center/cover no-repeat;
          z-index: 0;
        }

        .overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.8) 100%);
        }

        .login-content {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 440px;
          padding: 24px;
        }

        .glass-panel {
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(25px);
          -webkit-backdrop-filter: blur(25px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 32px;
          padding: 40px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }

        .login-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .brand-badge {
          background: #2dd4bf;
          color: #000;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          width: fit-content;
          margin: 0 auto 20px;
        }

        h1 {
          color: #fff;
          font-size: 1.75rem;
          font-weight: 800;
          margin-bottom: 12px;
          letter-spacing: -0.02em;
        }

        p {
          color: rgba(255,255,255,0.6);
          font-size: 0.9375rem;
          line-height: 1.5;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .error-alert {
          background: rgba(239, 68, 68, 0.2);
          color: #fca5a5;
          padding: 12px;
          border-radius: 12px;
          font-size: 0.875rem;
          text-align: center;
          border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .input-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        label {
          color: rgba(255,255,255,0.8);
          font-size: 0.8125rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .forgot-link {
          color: #2dd4bf;
          font-size: 0.75rem;
          text-decoration: none;
          font-weight: 600;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 16px;
          color: rgba(255,255,255,0.4);
        }

        input {
          width: 100%;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 14px 16px 14px 48px;
          border-radius: 14px;
          color: #fff;
          font-size: 1rem;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        input:focus {
          outline: none;
          background: rgba(255, 255, 255, 0.08);
          border-color: #2dd4bf;
          box-shadow: 0 0 0 4px rgba(45, 212, 191, 0.1);
        }

        .submit-btn {
          margin-top: 8px;
          background: #fff;
          color: #000;
          border: none;
          padding: 16px;
          border-radius: 14px;
          font-size: 1rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .submit-btn:hover:not(:disabled) {
          background: #2dd4bf;
          transform: translateY(-2px);
          box-shadow: 0 10px 20px -10px rgba(45, 212, 191, 0.5);
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .card-footer {
          margin-top: 32px;
          text-align: center;
        }

        .card-footer p {
          font-size: 0.75rem;
          color: rgba(255,255,255,0.4);
        }

        .animate-fade-in {
          animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 480px) {
          .glass-panel {
            padding: 32px 24px;
          }
        }
      `}</style>
    </div>
  );
}
