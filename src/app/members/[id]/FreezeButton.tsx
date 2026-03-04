"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function FreezeButton({ membershipId, currentStatus }: { membershipId: string, currentStatus: string }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const isFrozen = currentStatus === 'FROZEN';

    const handleToggle = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/v1/memberships/${membershipId}/freeze`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: isFrozen ? 'UNFREEZE' : 'FREEZE' })
            });

            if (!res.ok) throw new Error("Failed to process request");
            router.refresh(); // Refresh page data
        } catch (error) {
            console.error(error);
            alert("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    if (currentStatus === 'EXPIRED') return null;

    return (
        <button
            onClick={handleToggle}
            disabled={loading}
            className="btn"
            style={{
                background: isFrozen ? 'var(--brand-primary)' : 'var(--status-expired-bg)',
                color: isFrozen ? 'white' : 'var(--status-expired-text)',
                border: 'none',
                fontWeight: 600
            }}
        >
            {loading ? 'Updating...' : (isFrozen ? 'Unfreeze Membership' : 'Freeze Membership')}
        </button>
    );
}
