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
        logoUrl: null as string | null
    };

    if (session?.user?.gymId) {
        const gym = await prisma.gym.findUnique({
            where: { id: session.user.gymId },
            select: {
                name: true,
                primaryColor: true,
                secondaryColor: true,
                fontFamily: true,
                logoUrl: true
            }
        });

        if (gym) {
            branding = {
                primaryColor: gym.primaryColor || branding.primaryColor,
                secondaryColor: gym.secondaryColor || branding.secondaryColor,
                fontFamily: gym.fontFamily || branding.fontFamily,
                name: gym.name,
                logoUrl: gym.logoUrl
            };
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
                        <Footer gymName={branding.name} />
                    </main>
                </body>
            </html>
        );
    }

    return (
        <html lang="en">
            <head>
                <style dangerouslySetInnerHTML={{ __html: dynamicStyles }} />
            </head>
            <body>
                <div className="layout-wrapper">
                    <aside className="sidebar">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
                            {branding.logoUrl ? (
                                <img src={branding.logoUrl} alt={branding.name} style={{ width: '32px', height: '32px', borderRadius: '8px', objectFit: 'cover' }} />
                            ) : (
                                <div style={{ width: '32px', height: '32px', background: 'var(--brand-primary)', borderRadius: '8px' }}></div>
                            )}
                            <h2 style={{ fontSize: '1.125rem', fontWeight: 700 }}>{branding.name}</h2>
                        </div>
                        <SidebarNav role={session?.user?.role} />
                        <div style={{ marginTop: 'auto', paddingTop: '24px', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {session ? (
                                <>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '40px', height: '40px', background: 'var(--brand-primary)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                            {session.user?.name?.[0] || 'U'}
                                        </div>
                                        <div style={{ overflow: 'hidden' }}>
                                            <p style={{ fontSize: '0.875rem', fontWeight: 600, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{session.user?.name}</p>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{session.user?.email}</p>
                                        </div>
                                    </div>
                                    <a href="/api/auth/signout" style={{ padding: '8px 12px', textAlign: 'center', background: 'var(--status-expired-bg)', color: 'var(--status-expired-text)', borderRadius: '6px', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none' }}>Sign Out</a>
                                </>
                            ) : (
                                <a href="/api/auth/signin" style={{ padding: '10px 12px', textAlign: 'center', background: 'var(--brand-primary)', color: 'white', borderRadius: '6px', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none' }}>Sign In to {branding.name}</a>
                            )}
                        </div>
                    </aside>
                     <main className="main-content" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                        <div style={{ flex: 1 }}>
                            {children}
                        </div>
                        {(session?.user?.role === 'ADMIN' || session?.user?.role === 'STAFF') && <AdminBottomNav />}
                        <Footer gymName={branding.name} />
                    </main>
                </div>
            </body>
        </html>
    )
}
