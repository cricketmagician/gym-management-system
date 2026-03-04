"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ActivateButton({ membershipId, currentStatus }: { membershipId: string, currentStatus: string }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    if (currentStatus === 'ACTIVE') return null;

    const handleActivate = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/v1/memberships/${membershipId}/activate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!res.ok) throw new Error("Failed to activate membership");
            router.refresh(); // Refresh page data
        } catch (error) {
            console.error(error);
            alert("An error occurred while activating");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleActivate}
            disabled={loading}
            className="btn btn-primary"
            style={{
                fontWeight: 600
            }}
        >
            {loading ? 'Activating...' : 'Activate Membership'}
        </button>
    );
}
