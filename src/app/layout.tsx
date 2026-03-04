import './globals.css'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import SidebarNav from '@/components/SidebarNav';
import { headers } from 'next/headers';

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

    if (isLoginPage) {
        return (
            <html lang="en">
                <body>
                    <main>{children}</main>
                </body>
            </html>
        );
    }

    return (
        <html lang="en">
            <body>
                <div className="layout-wrapper">
                    <aside className="sidebar">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
                            <div style={{ width: '32px', height: '32px', background: 'var(--brand-primary)', borderRadius: '8px' }}></div>
                            <h2 style={{ fontSize: '1.125rem', fontWeight: 700 }}>PulseFit</h2>
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
                                <a href="/api/auth/signin" style={{ padding: '10px 12px', textAlign: 'center', background: 'var(--brand-primary)', color: 'white', borderRadius: '6px', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none' }}>Sign In to PulseFit</a>
                            )}
                        </div>
                    </aside>
                    <main className="main-content">
                        {children}
                    </main>
                </div>
            </body>
        </html>
    )
}
