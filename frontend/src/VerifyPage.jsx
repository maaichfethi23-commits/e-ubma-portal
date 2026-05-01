import React, { useState } from 'react';
import { motion } from 'framer-motion';

const VerifyPage = () => {
    const [fileHash, setFileHash] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleVerify = async () => {
        if (!fileHash) return;
        setLoading(true);
        try {
            const response = await fetch(`/api/documents/verify/${fileHash}`);
            const data = await response.json();
            setResult(data);
        } catch (error) {
            setResult({ status: 'Error', message: 'Connection failed' });
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 flex flex-col items-center">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl w-full glass-panel p-8 text-center"
            >
                <h1 className="text-3xl font-bold mb-6 text-gradient">Vérification de Document PAdES</h1>
                <p className="text-gray-400 mb-8">
                    Saisissez le code de vérification ou le Hash du document pour confirmer son authenticité dans le coffre-fort numérique E-UBMA.
                </p>

                <div className="flex gap-2 mb-8">
                    <input 
                        type="text" 
                        value={fileHash}
                        onChange={(e) => setFileHash(e.target.value)}
                        placeholder="Entrez le Hash du document..."
                        className="flex-1 glass-input p-3"
                    />
                    <button 
                        onClick={handleVerify}
                        disabled={loading}
                        className="premium-button px-6"
                    >
                        {loading ? '...' : 'Vérifier'}
                    </button>
                </div>

                {result && (
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className={`p-6 rounded-2xl border ${
                            result.status === 'Authentic' 
                            ? 'bg-green-500/10 border-green-500/30' 
                            : 'bg-red-500/10 border-red-500/30'
                        }`}
                    >
                        <div className="text-4xl mb-2">
                            {result.status === 'Authentic' ? '✅' : '❌'}
                        </div>
                        <h2 className={`text-xl font-bold mb-2 ${
                            result.status === 'Authentic' ? 'text-green-400' : 'text-red-400'
                        }`}>
                            {result.status === 'Authentic' ? 'Document Authentique' : 'Document Non Reconnu'}
                        </h2>
                        <p className="text-gray-300">{result.message}</p>
                        
                        {result.status === 'Authentic' && (
                            <div className="mt-4 text-left border-t border-white/10 pt-4 space-y-2">
                                <p><span className="text-gray-400">Propriétaire:</span> {result.owner}</p>
                                <p><span className="text-gray-400">Filière:</span> {result.major}</p>
                                <p><span className="text-gray-400">Document:</span> {result.filename}</p>
                            </div>
                        )}
                    </motion.div>
                )}
            </motion.div>
            
            <div className="mt-12 text-sm text-gray-500 max-w-lg text-center">
                Conforme aux normes IMS Global et PAdES (PDF Advanced Electronic Signatures). 
                La vérification est instantanée et accessible à vie (Garantie SLA R15).
            </div>
        </div>
    );
};

export default VerifyPage;
