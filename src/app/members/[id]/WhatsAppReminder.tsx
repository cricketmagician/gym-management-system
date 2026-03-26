'use client';

import React from 'react';
import { MessageSquare, ExternalLink } from 'lucide-react';

interface WhatsAppReminderProps {
    memberPhone: string;
    memberName: string;
    gymName: string;
    expiryDate: string;
    upiId: string;
    upiNumber: string;
}

export default function WhatsAppReminder({ 
    memberPhone, 
    memberName, 
    gymName, 
    expiryDate, 
    upiId, 
    upiNumber 
}: WhatsAppReminderProps) {
    
    const generateMessage = () => {
        const upiLink = upiId ? `upi://pay?pa=${upiId}&pn=${encodeURIComponent(gymName)}&cu=INR` : '';
        const message = `Hi ${memberName}! 👋\n\nYour membership at *${gymName}* is expiring soon on *${expiryDate}*. \n\nTo continue your fitness journey without interruption, please renew your membership. You can pay via UPI:\n\n📍 *UPI ID:* ${upiId || 'Not Set'}\n📞 *Phone:* ${upiNumber || 'Not Set'}\n\n${upiLink ? `🔗 *Pay Now:* ${upiLink}\n\n` : ''}Thank you!\nTeam PulseFit 🚀`;
        return encodeURIComponent(message);
    };

    const whatsappLink = `https://wa.me/${memberPhone.replace(/\D/g, '')}?text=${generateMessage()}`;

    return (
        <a 
            href={whatsappLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn-whatsapp"
            style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                padding: '12px 20px', 
                background: '#25D366', 
                color: '#fff', 
                borderRadius: '12px', 
                textDecoration: 'none', 
                fontWeight: 700, 
                fontSize: '0.875rem',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 12px rgba(37, 211, 102, 0.2)'
            }}
        >
            <MessageSquare size={18} />
            Send Renewal Reminder
        </a>
    );
}
