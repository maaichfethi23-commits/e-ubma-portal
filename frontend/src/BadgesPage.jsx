import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function BadgesPage({ events, t }) {
    const [badges, setBadges] = useState([
        { 
            id: 1, 
            name: "Expert Cloud Computing", 
            issuer: "Lab GNU - UBMA", 
            date: "2024", 
            type: "Expertise",
            status: "Validé (N3)",
            color: "from-blue-500 to-cyan-400",
            icon: "☁️",
            ims_compliant: true
        },
        { 
            id: 2, 
            name: "Innovation & Design", 
            issuer: "Faculté des Sciences", 
            date: "2023", 
            type: "Soft Skill",
            status: "Validé (N2)",
            color: "from-purple-500 to-pink-400",
            icon: "💡",
            ims_compliant: true
        },
        { 
            id: 3, 
            name: "Fullstack Developer", 
            issuer: "Centre de Calcul", 
            date: "2024", 
            type: "Technique",
            status: "En attente (N1)",
            color: "from-orange-500 to-yellow-400",
            icon: "💻",
            ims_compliant: true
        }
    ]);

    const addToLinkedIn = (badgeName) => {
        const url = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(badgeName)}&organizationName=Université%20Badji%20Mokhtar&issueYear=2024&issueMonth=5`;
        window.open(url, '_blank');
    };

    const addToEuropass = (badgeName) => {
        alert(`Exportation de "${badgeName}" vers Europass (XML/PDF PAdES) en cours...`);
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 md:px-8">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-6xl mx-auto"
            >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl font-bold mb-2 text-gradient">Mes Badges Numériques</h1>
                        <p className="text-gray-400">Open Badges IMS Global certifiés par le Guichet Numérique Unique (GNU).</p>
                    </div>
                    <div className="glass-panel p-4 flex gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-green-500"></span>
                            <span>N3: Validateur</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                            <span>N2: Enseignant</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {badges.map((badge) => (
                        <motion.div
                            key={badge.id}
                            whileHover={{ y: -10 }}
                            className="glass-panel overflow-hidden group relative"
                        >
                            {/* Badge Visual */}
                            <div className={`h-48 bg-gradient-to-br ${badge.color} flex items-center justify-center text-7xl group-hover:scale-110 transition-transform duration-500`}>
                                {badge.icon}
                                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                    {badge.status}
                                </div>
                            </div>

                            {/* Details */}
                            <div className="p-6">
                                <div className="text-xs text-blue-400 font-bold uppercase tracking-widest mb-1">{badge.type}</div>
                                <h3 className="text-xl font-bold mb-1">{badge.name}</h3>
                                <p className="text-gray-400 text-sm mb-4">Délivré par: {badge.issuer} • {badge.date}</p>
                                
                                <div className="flex flex-col gap-2">
                                    <button 
                                        onClick={() => addToLinkedIn(badge.name)}
                                        className="w-full py-2 bg-[#0077b5] hover:bg-[#005a87] text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors"
                                    >
                                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                                        Ajouter à LinkedIn
                                    </button>
                                    <button 
                                        onClick={() => addToEuropass(badge.name)}
                                        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors"
                                    >
                                        🌐 Exporter Europass
                                    </button>
                                </div>
                            </div>
                            
                            {badge.ims_compliant && (
                                <div className="absolute bottom-2 right-2 text-[10px] text-white/30 italic">
                                    IMS Global Compliant
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
