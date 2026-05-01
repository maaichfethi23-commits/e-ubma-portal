import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const FormsPage = ({ t }) => {
    const [forms, setForms] = useState([
        { id: 1, title: "Demande de Relevé de Notes", icon: "📄", status: "Prêt" },
        { id: 2, title: "Certificat de Scolarité", icon: "🎓", status: "Prêt" },
        { id: 3, title: "Demande d'Hébergement", icon: "🏠", status: "Nouveau" }
    ]);

    const [selectedForm, setSelectedForm] = useState(null);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        matricule: "",
        year: "2023/2024"
    });

    // Simulate pre-filling from chatbot context or user profile
    const simulatePreFill = () => {
        setFormData({
            firstName: "Fethi",
            lastName: "Maaich",
            matricule: "202334056122",
            year: "2023/2024"
        });
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 md:px-8">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-6xl mx-auto"
            >
                <h1 className="text-4xl font-bold mb-2 text-gradient">Guichet Numérique Unique (GNU)</h1>
                <p className="text-gray-400 mb-12">Accédez à tous vos services administratifs avec pré-remplissage intelligent.</p>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Forms List */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold mb-4">Services Disponibles</h2>
                        {forms.map(form => (
                            <button 
                                key={form.id}
                                onClick={() => setSelectedForm(form)}
                                className={`w-full glass-panel p-4 flex items-center gap-4 hover:border-blue-500/50 transition-all ${selectedForm?.id === form.id ? 'border-blue-500 bg-blue-500/10' : ''}`}
                            >
                                <span className="text-2xl">{form.icon}</span>
                                <span className="font-medium">{form.title}</span>
                            </button>
                        ))}
                    </div>

                    {/* Form Interface */}
                    <div className="lg:col-span-2">
                        {selectedForm ? (
                            <motion.div 
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="glass-panel p-8"
                            >
                                <div className="flex justify-between items-center mb-8">
                                    <h2 className="text-2xl font-bold">{selectedForm.title}</h2>
                                    <button 
                                        onClick={simulatePreFill}
                                        className="text-xs bg-blue-500/20 text-blue-400 px-4 py-2 rounded-full border border-blue-500/30 hover:bg-blue-500/40"
                                    >
                                        ✨ Remplissage Automatique (NLP)
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">Nom</label>
                                        <input type="text" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="glass-input w-full p-3" />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">Prénom</label>
                                        <input type="text" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="glass-input w-full p-3" />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">Matricule</label>
                                        <input type="text" value={formData.matricule} onChange={e => setFormData({...formData, matricule: e.target.value})} className="glass-input w-full p-3" />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">Année Universitaire</label>
                                        <select className="glass-input w-full p-3 bg-slate-900">
                                            <option>2023/2024</option>
                                            <option>2022/2023</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="mt-12 flex gap-4">
                                    <button className="premium-button px-8 py-3">Soumettre la demande</button>
                                    <button className="px-8 py-3 glass-panel hover:bg-white/5">Enregistrer en brouillon</button>
                                </div>
                                
                                <p className="mt-8 text-xs text-gray-500 italic">
                                    * Ce formulaire sera signé numériquement (PAdES) et versé automatiquement dans votre coffre-fort après validation.
                                </p>
                            </motion.div>
                        ) : (
                            <div className="h-full glass-panel flex flex-col items-center justify-center p-12 text-center text-gray-500 border-dashed">
                                <div className="text-6xl mb-4">📑</div>
                                <p>Sélectionnez un service dans la liste pour commencer.</p>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default FormsPage;
