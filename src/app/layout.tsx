import './globals.css'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import SidebarNav from '@/components/SidebarNav';
import Footer from '@/components/Footer';
import AdminBottomNav from '@/components/AdminBottomNav';
import { headers } from 'next/headers';
import prisma from "@/lib/prisma";

export const metadata: Metadata = {
    title: 'Gym Management Dashboard',
    description: 'A modern, clean SaaS platform for gym owners.',
}

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await getServerSession(authOptions);
    const headersList = await headers();
    const pathname = headersList.get('x-pathname') || '';
    const isLoginPage = pathname === '/login';

    // Fetch gym branding if available
    let branding = {
        primaryColor: '#4F46E5',
        secondaryColor: '#8B5CF6',
        fontFamily: "'Inter', sans-serif",
        name: 'PulseFit',
        logoUrl: null as string | null,
        instagramLink: null as string | null,
        whatsappNumber: null as string | null,
        wifiSsid: null as string | null,
        wifiPassword: null as string | null
    };

    if (session?.user?.gymId) {
        try {
            const gym = await prisma.gym.findUnique({
                where: { id: session.user.gymId },
                select: {
                    name: true,
                    primaryColor: true,
                    secondaryColor: true,
                    fontFamily: true,
                    logoUrl: true,
                    instagramLink: true,
                    whatsappNumber: true,
                    wifiSsid: true,
                    wifiPassword: true
                }
            });

            if (gym) {
                branding = {
                    primaryColor: gym.primaryColor || branding.primaryColor,
                    secondaryColor: gym.secondaryColor || branding.secondaryColor,
                    fontFamily: gym.fontFamily || branding.fontFamily,
                    name: gym.name,
                    logoUrl: gym.logoUrl,
                    instagramLink: gym.instagramLink,
                    whatsappNumber: gym.whatsappNumber,
                    wifiSsid: gym.wifiSsid,
                    wifiPassword: gym.wifiPassword
                };
            }
        } catch (dbError) {
            console.error("Layout branding fetch failed:", dbError);
            // Fallback to default branding already initialized
        }
    }

    const dynamicStyles = `
        :root {
            --brand-primary: ${branding.primaryColor};
            --brand-primary-hover: ${branding.primaryColor}E6; /* Approx 90% opacity for hover */
            --brand-secondary: ${branding.secondaryColor};
            --font-family-base: ${branding.fontFamily};
        }
        body {
            font-family: var(--font-family-base), sans-serif;
        }
    `;

    const isNoSidebarPage = isLoginPage || (pathname === '/' && !session) || pathname === '/member' || pathname.startsWith('/member/');

    if (isNoSidebarPage) {
        return (
            <html lang="en">
                <head>
                    <style dangerouslySetInnerHTML={{ __html: dynamicStyles }} />
                </head>
                <body>
                    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                        {children}
                        <Footer 
                            gymName={branding.name} 
                            session={session} 
                            instagramLink={branding.instagramLink}
                            whatsappNumber={branding.whatsappNumber}
                        />
                    </main>
                </body>
            </html>
        );
    }

    return (
        <html lang="en">
            <head>
                <link rel="manifest" href="/manifest.json" />
                <meta name="theme-color" content="#f59e0b" />
                <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
                <script dangerouslySetInnerHTML={{ __html: `
                  if ('serviceWorker' in navigator) {
                    window.addEventListener('load', function() {
                      navigator.serviceWorker.register('/sw.js');
                    });
                  }
                ` }} />
                <style dangerouslySetInnerHTML={{ __html: dynamicStyles }} />
            </head>
            <body>
                <div className="layout-wrapper">
                    <aside className="sidebar">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
                            {branding.logoUrl && session?.user?.role !== 'SUPER_ADMIN' ? (
                                <img src={branding.logoUrl} alt={branding.name} style={{ width: '32px', height: '32px', borderRadius: '8px', objectFit: 'cover' }} />
                            ) : (
                                <div style={{ 
                                    width: '32px', 
                                    height: '32px', 
                                    background: session?.user?.role === 'SUPER_ADMIN' ? '#f59e0b' : 'var(--brand-primary)', 
                                    borderRadius: '8px',
                                    boxShadow: session?.user?.role === 'SUPER_ADMIN' ? '0 0 15px rgba(245, 158, 11, 0.3)' : 'none'
                                }}></div>
                            )}
                            <h2 style={{ fontSize: '1.125rem', fontWeight: 900, letterSpacing: '-0.02em' }}>
                                {session?.user?.role === 'SUPER_ADMIN' ? 'PULSEFIT GLOBAL' : branding.name}
                            </h2>
                        </div>
                        <SidebarNav role={session?.user?.role} />
                    </aside>
                     <main className="main-content" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                        <div style={{ flex: 1 }}>
                            {children}
                        </div>
                        {(session?.user?.role === 'ADMIN' || session?.user?.role === 'STAFF') && <AdminBottomNav />}
                        <Footer 
                            gymName={branding.name} 
                            session={session} 
                            instagramLink={branding.instagramLink}
                            whatsappNumber={branding.whatsappNumber}
                        />
                    </main>
                </div>
            </body>
        </html>
    )
}
