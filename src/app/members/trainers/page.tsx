"use client"

import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Upload, Check, User } from 'lucide-react';

interface Trainer {
    id: string;
    name: string;
    specialization: string;
    photoUrl: string | null;
    bio: string | null;
}

export default function TrainersManagement() {
    const [trainers, setTrainers] = useState<Trainer[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTrainer, setEditingTrainer] = useState<Trainer | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        specialization: '',
        photoUrl: '',
        bio: ''
    });

    useEffect(() => {
        fetchTrainers();
    }, []);

    const fetchTrainers = async () => {
        try {
            const res = await fetch('/api/v1/trainers');
            const data = await res.json();
            setTrainers(data);
        } catch (error) {
            console.error("Failed to fetch trainers", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (trainer?: Trainer) => {
        if (trainer) {
            setEditingTrainer(trainer);
            setFormData({
                name: trainer.name,
                specialization: trainer.specialization,
                photoUrl: trainer.photoUrl || '',
                bio: trainer.bio || ''
            });
        } else {
            setEditingTrainer(null);
            setFormData({ name: '', specialization: '', photoUrl: '', bio: '' });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = editingTrainer ? `/api/v1/trainers/${editingTrainer.id}` : '/api/v1/trainers';
        const method = editingTrainer ? 'PATCH' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                fetchTrainers();
                setIsModalOpen(false);
            }
        } catch (error) {
            console.error("Failed to save trainer", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this trainer?")) return;
        try {
            const res = await fetch(`/api/v1/trainers/${id}`, { method: 'DELETE' });
            if (res.ok) fetchTrainers();
        } catch (error) {
            console.error("Failed to delete trainer", error);
        }
    };

    return (
        <div style={{ padding: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Trainer Management</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Manage your gym's certified trainers and their profiles.</p>
                </div>
                <button 
                    onClick={() => handleOpenModal()}
                    style={{ 
                        background: '#000', 
                        color: '#fff', 
                        padding: '12px 24px', 
                        borderRadius: '12px', 
                        border: 'none', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px',
                        cursor: 'pointer',
                        fontWeight: 600
                    }}
                >
                    <Plus size={20} /> Add Trainer
                </button>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '100px' }}>Loading trainers...</div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                    {trainers.map((trainer) => (
                        <div key={trainer.id} className="card" style={{ padding: '24px', position: 'relative' }}>
                            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '16px' }}>
                                <img 
                                    src={trainer.photoUrl || `https://ui-avatars.com/api/?name=${trainer.name}&background=fde68a&color=b45309`} 
                                    alt={trainer.name} 
                                    style={{ width: '80px', height: '80px', borderRadius: '16px', objectFit: 'cover' }} 
                                />
                                <div>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{trainer.name}</h3>
                                    <p style={{ color: '#f59e0b', fontWeight: 600, fontSize: '0.875rem' }}>{trainer.specialization}</p>
                                </div>
                            </div>
                            
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '20px', minHeight: '60px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                                {trainer.bio || "No bio provided."}
                            </p>

                            <div style={{ display: 'flex', gap: '12px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                                <button 
                                    onClick={() => handleOpenModal(trainer)}
                                    style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid var(--border-color)', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                                >
                                    <Pencil size={16} /> Edit
                                </button>
                                <button 
                                    onClick={() => handleDelete(trainer.id)}
                                    style={{ padding: '8px', borderRadius: '8px', border: '1px solid #fee2e2', background: '#fff', color: '#dc2626', cursor: 'pointer' }}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div style={{ background: '#fff', padding: '32px', borderRadius: '24px', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{editingTrainer ? 'Edit Trainer' : 'Add New Trainer'}</h2>
                            <button onClick={() => setIsModalOpen(false)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><X /></button>
                        </div>

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '8px' }}>Full Name</label>
                                <input 
                                    type="text" 
                                    required 
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)' }}
                                    placeholder="e.g. John Doe"
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '8px' }}>Specialization</label>
                                <input 
                                    type="text" 
                                    required 
                                    value={formData.specialization}
                                    onChange={e => setFormData({ ...formData, specialization: e.target.value })}
                                    style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)' }}
                                    placeholder="e.g. Strength & Conditioning"
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '8px' }}>Photo URL</label>
                                <input 
                                    type="text" 
                                    value={formData.photoUrl}
                                    onChange={e => setFormData({ ...formData, photoUrl: e.target.value })}
                                    style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)' }}
                                    placeholder="https://example.com/photo.jpg"
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '8px' }}>Bio</label>
                                <textarea 
                                    value={formData.bio}
                                    onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                    style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', minHeight: '120px' }}
                                    placeholder="Tell members about this trainer..."
                                />
                            </div>

                            <button 
                                type="submit"
                                style={{ 
                                    background: '#000', 
                                    color: '#fff', 
                                    padding: '14px', 
                                    borderRadius: '14px', 
                                    border: 'none', 
                                    fontWeight: 700, 
                                    marginTop: '12px',
                                    cursor: 'pointer'
                                }}
                            >
                                {editingTrainer ? 'Update Profile' : 'Add Trainer'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
