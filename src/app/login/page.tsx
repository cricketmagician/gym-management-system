'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

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
      <div className="login-background">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      <div className="login-card">
        <div className="login-header">
          <div className="logo-icon"></div>
          <h1>PulseFit</h1>
          <p>Elevate your fitness management</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="identifier">Email or Phone</label>
            <input
              id="identifier"
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="admin@pulsefit.com"
              required
            />
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label htmlFor="password">Password</label>
              <a href="#" style={{ fontSize: '0.75rem', color: 'var(--brand-primary)', textDecoration: 'none', fontWeight: 600 }}>Forgot password?</a>
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="login-footer">
          <p>© 2026 PulseFit Systems. All rights reserved.</p>
        </div>
      </div>

      <style jsx>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--bg-color);
          position: relative;
          overflow: hidden;
          padding: 20px;
        }

        .login-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 0;
        }

        .blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.4;
          z-index: 0;
          animation: float 20s infinite alternate;
        }

        .blob-1 {
          width: 400px;
          height: 400px;
          background: var(--brand-primary);
          top: -100px;
          right: -100px;
        }

        .blob-2 {
          width: 350px;
          height: 350px;
          background: #8B5CF6;
          bottom: -50px;
          left: -50px;
          animation-delay: -5s;
        }

        .blob-3 {
          width: 300px;
          height: 300px;
          background: #EC4899;
          top: 40%;
          left: 20%;
          animation-delay: -10s;
        }

        @keyframes float {
          0% { transform: translate(0, 0) rotate(0deg) scale(1); }
          33% { transform: translate(30px, 50px) rotate(10deg) scale(1.1); }
          66% { transform: translate(-20px, 20px) rotate(-10deg) scale(0.9); }
          100% { transform: translate(0, 0) rotate(0deg) scale(1); }
        }

        .login-card {
          width: 100%;
          max-width: 420px;
          background: var(--glass-bg);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid var(--glass-border);
          border-radius: 24px;
          padding: 40px;
          box-shadow: var(--shadow-premium);
          z-index: 10;
          position: relative;
        }

        .login-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .logo-icon {
          width: 48px;
          height: 48px;
          background: var(--brand-primary);
          border-radius: 12px;
          margin: 0 auto 16px;
          box-shadow: 0 8px 16px -4px rgba(79, 70, 229, 0.4);
        }

        h1 {
          font-size: 1.75rem;
          font-weight: 800;
          margin-bottom: 8px;
          letter-spacing: -0.025em;
        }

        .login-header p {
          color: var(--text-secondary);
          font-size: 0.9375rem;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .error-message {
          padding: 12px;
          background-color: var(--status-expired-bg);
          color: var(--status-expired-text);
          border-radius: 8px;
          font-size: 0.875rem;
          text-align: center;
          font-weight: 500;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        label {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        input {
          padding: 12px 16px;
          border-radius: 10px;
          border: 1px solid var(--border-color);
          background: var(--surface-color);
          color: var(--text-primary);
          font-size: 0.9375rem;
          transition: all 0.2s ease;
        }

        input:focus {
          outline: none;
          border-color: var(--brand-primary);
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
        }

        .login-button {
          margin-top: 8px;
          padding: 12px;
          background-color: var(--brand-primary);
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);
        }

        .login-button:hover:not(:disabled) {
          background-color: var(--brand-primary-hover);
          transform: translateY(-1px);
          box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.3);
        }

        .login-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .login-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .login-footer {
          margin-top: 32px;
          text-align: center;
        }

        .login-footer p {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        @media (max-width: 480px) {
          .login-card {
            padding: 32px 24px;
          }
        }
      `}</style>
    </div>
  );
}
