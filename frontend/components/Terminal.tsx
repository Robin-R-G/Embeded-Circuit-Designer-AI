'use client';

import React, { useEffect, useRef } from 'react';
import { Terminal as TerminalIcon } from 'lucide-react';

interface TerminalProps {
    logs: string[];
}

const Terminal: React.FC<TerminalProps> = ({ logs }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    return (
        <div className="flex flex-col h-full bg-transparent text-slate-300 font-mono text-sm">
            <div
                ref={scrollRef}
                className="flex-1 p-5 overflow-y-auto whitespace-pre-wrap leading-relaxed"
            >
                {logs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full opacity-20 select-none">
                        <TerminalIcon className="w-12 h-12 mb-4" />
                        <span className="text-xs uppercase tracking-[0.3em] font-bold">System Ready</span>
                    </div>
                ) : (
                    <div className="space-y-1.5">
                        {logs.map((log, index) => (
                            <div key={index} className={`flex ${log.startsWith('AI:') ? 'text-blue-400' : log.includes('Error') ? 'text-red-400' : 'text-slate-400'}`}>
                                <span className="opacity-30 mr-3 select-none">[{index + 1}]</span>
                                <span>{log}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Terminal;
