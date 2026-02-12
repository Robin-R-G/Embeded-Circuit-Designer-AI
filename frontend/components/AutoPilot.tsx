'use client';

import React, { useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface AutoPilotProps {
    onPromptSubmit: (prompt: string) => void;
    board: string;
}

export default function AutoPilot({ onPromptSubmit }: AutoPilotProps) {
    const [prompt, setPrompt] = useState('');

    const handleGenerate = () => {
        if (!prompt.trim()) return;
        onPromptSubmit(prompt);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-full w-full max-w-3xl mx-auto p-8 relative">
            <div className="w-full space-y-10 animate-in fade-in zoom-in duration-1000">
                <div className="text-center space-y-6">
                    <div className="relative inline-flex mb-2">
                        <div className="absolute -inset-4 bg-blue-500/20 blur-2xl rounded-full animate-pulse"></div>
                        <div className="relative p-4 bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
                            <Sparkles className="w-10 h-10 text-blue-400" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-6xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-500 px-4">
                            What are we <span className="text-blue-500">building?</span>
                        </h1>
                        <p className="text-slate-500 text-xl font-medium max-w-md mx-auto leading-relaxed">
                            Describe your hardware logic. Our AI handles the code and compilation.
                        </p>
                    </div>
                </div>

                <div className="relative group">
                    {/* Glowing border effect */}
                    <div className="absolute -inset-px bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>

                    <div className="relative bg-slate-900/80 backdrop-blur-2xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="e.g. 'Blink an LED on pin 2 and monitor serial input...'"
                            className="w-full h-40 bg-transparent p-6 text-white placeholder-slate-600 focus:outline-none resize-none text-xl font-medium leading-relaxed"
                        />

                        <div className="px-6 py-4 flex items-center justify-between border-t border-white/5 bg-white/5">
                            <div className="flex items-center space-x-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                <span>GPT-4o Engine</span>
                            </div>

                            <button
                                onClick={handleGenerate}
                                disabled={!prompt.trim()}
                                className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl font-bold flex items-center transition-all hover:scale-105 active:scale-95 shadow-xl shadow-blue-600/20 disabled:opacity-30 disabled:hover:scale-100 disabled:shadow-none"
                            >
                                <span className="mr-2">BUILD SYSTEM</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-center space-x-8 text-[11px] font-bold text-slate-600 uppercase tracking-[0.2em]">
                    <span className="hover:text-slate-400 transition-colors cursor-default">Real-time Compiler</span>
                    <div className="w-1 h-1 rounded-full bg-white/10"></div>
                    <span className="hover:text-slate-400 transition-colors cursor-default">Error Self-Correction</span>
                    <div className="w-1 h-1 rounded-full bg-white/10"></div>
                    <span className="hover:text-slate-400 transition-colors cursor-default">ESP32 & 8266 Support</span>
                </div>
            </div>
        </div>
    );
}
