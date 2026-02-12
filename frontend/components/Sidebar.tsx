'use client';

import React from 'react';
import { Folder, FileCode, Settings, Cpu } from 'lucide-react';

const Sidebar = () => {
    return (
        <div className="w-16 md:w-64 glass border-r bg-slate-950/20 border-white/5 flex flex-col h-full text-slate-400 transition-all duration-300">
            <div className="p-4 py-5 border-b border-white/5 flex items-center justify-center md:justify-start">
                <div className="relative">
                    <Cpu className="w-6 h-6 md:w-5 md:h-5 md:mr-3 text-blue-500" />
                    <div className="absolute -inset-1 bg-blue-500/20 blur-lg rounded-full"></div>
                </div>
                <span className="font-bold text-slate-200 hidden md:block tracking-tight">CIRCUIT<span className="text-blue-500">AI</span></span>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-4">
                <div className="hidden md:block">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 px-2">Explorer</div>

                    <div className="space-y-1">
                        <div className="px-3 py-2 flex items-center hover:bg-white/5 rounded-lg cursor-pointer text-blue-400 group transition-all" title="Project">
                            <Folder className="w-4 h-4 mr-3 opacity-70 group-hover:opacity-100" />
                            <span className="text-sm font-medium">Project</span>
                        </div>

                        <div className="ml-2 pl-2 border-l border-white/5 space-y-1">
                            <div className="px-3 py-2 flex items-center bg-blue-500/10 border border-blue-500/20 rounded-lg cursor-pointer text-slate-100 shadow-lg shadow-blue-500/5 transition-all" title="main.cpp">
                                <FileCode className="w-4 h-4 mr-3 text-blue-400" />
                                <span className="text-sm font-semibold">main.cpp</span>
                            </div>

                            <div className="px-3 py-2 flex items-center hover:bg-white/5 rounded-lg cursor-pointer text-slate-400 group transition-all" title="utils.h">
                                <FileCode className="w-4 h-4 mr-3 opacity-50 group-hover:opacity-100" />
                                <span className="text-sm font-medium">utils.h</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile View / Icon Only */}
                <div className="md:hidden flex flex-col items-center space-y-6 pt-4">
                    <Folder className="w-6 h-6 text-blue-400 opacity-70 cursor-pointer" />
                    <FileCode className="w-6 h-6 text-white cursor-pointer bg-blue-500/20 p-1 rounded-md" />
                    <FileCode className="w-6 h-6 text-slate-500 cursor-pointer" />
                </div>
            </div>

            <div className="p-4 border-t border-white/5 flex justify-center md:justify-start">
                <div className="flex items-center hover:text-white cursor-pointer text-slate-500 group transition-all" title="Settings">
                    <Settings className="w-6 h-6 md:w-4 md:h-4 md:mr-3 group-hover:rotate-45 transition-transform duration-500" />
                    <span className="text-sm font-medium hidden md:block">Settings</span>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
