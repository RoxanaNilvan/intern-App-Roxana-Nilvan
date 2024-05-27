// src/pages/home.js
import React, { useState } from 'react';
import './Home.scss';

interface Card {
    id: number;
    title: string;
    description: string;
}

const Home: React.FC = () => {
    const [cards, setCards] = useState<Card[]>([]);
    const [newCard, setNewCard] = useState<Omit<Card, 'id'>>({ title: '', description: '' });
    const [editingCard, setEditingCard] = useState<number | null>(null);

    const addCard = () => {
        if (editingCard !== null) {
            setCards(cards.map(card => (card.id === editingCard ? { ...newCard, id: editingCard } : card)));
            setEditingCard(null);
        } else {
            setCards([...cards, { ...newCard, id: Date.now() }]);
        }
        setNewCard({ title: '', description: '' });
    };

    const editCard = (id: number) => {
        const card = cards.find(card => card.id === id);
        if (card) {
            setNewCard({ title: card.title, description: card.description });
            setEditingCard(id);
        }
    };

    const deleteCard = (id: number) => {
        setCards(cards.filter(card => card.id !== id));
    };

    return (
        <div className="home-container">
            <h1>Card Manager</h1>
            <div className="input-container">
                <input
                    type="text"
                    placeholder="Title"
                    value={newCard.title}
                    onChange={(e) => setNewCard({ ...newCard, title: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Description"
                    value={newCard.description}
                    onChange={(e) => setNewCard({ ...newCard, description: e.target.value })}
                />
                <button onClick={addCard}>{editingCard !== null ? 'Update Card' : 'Add Card'}</button>
            </div>
            <div className="card-list">
                {cards.map(card => (
                    <div key={card.id} className="card">
                        <h3>{card.title}</h3>
                        <p>{card.description}</p>
                        <button onClick={() => editCard(card.id)}>Edit</button>
                        <button onClick={() => deleteCard(card.id)}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;
