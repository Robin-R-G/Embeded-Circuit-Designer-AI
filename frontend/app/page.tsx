'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import CodeEditor from '@/components/CodeEditor';
import Terminal from '@/components/Terminal';
import AuthModal from '@/components/AuthModal';
import AutoPilot from '@/components/AutoPilot';
import ProjectsModal from '@/components/ProjectsModal';
import { Play, Download, Save, User, FolderOpen, Plus } from 'lucide-react';

export default function Home() {
  const [code, setCode] = useState<string>('// Welcome to Embedded IDE\n// Write your code here\n\nvoid setup() {\n  // put your setup code here, to run once:\n}\n\nvoid loop() {\n  // put your main code here, to run repeatedly:\n}\n');
  const [logs, setLogs] = useState<string[]>([]);
  const [isCompiling, setIsCompiling] = useState(false);
  const [board, setBoard] = useState('esp32');
  const [showAuth, setShowAuth] = useState(false);
  const [showProjects, setShowProjects] = useState(false);
  const [user, setUser] = useState<any>(null);

  // New State for View Mode
  const [viewMode, setViewMode] = useState<'prompt' | 'ide'>('prompt');

  useEffect(() => {
    const savedCode = localStorage.getItem('embedded-ide-code');
    if (savedCode) {
      setCode(savedCode);
    }
  }, []);

  const handleEditorChange = (value: string | undefined) => {
    if (value) setCode(value);
  };

  const handleCompile = () => {
    setIsCompiling(true);
    setLogs((prev) => [...prev, 'Connecting to compiler service...']);

    const ws = new WebSocket('wss://rotten-cloths-know.loca.lt/ws/compile');

    ws.onopen = () => {
      setLogs((prev) => [...prev, `Connected. Sending code for ${board}...`]);
      ws.send(JSON.stringify({ type: 'compile', code, board }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'log') {
          setLogs((prev) => [...prev, data.message]);
        } else if (data.type === 'code_update') {
          setLogs((prev) => [...prev, 'Updating code in editor...']);
          setCode(data.code);
        } else if (data.type === 'success') {
          setLogs((prev) => [...prev, 'Binary ready for download.']);
          setIsCompiling(false);
          ws.close();
        } else if (data.type === 'error') {
          setIsCompiling(false);
          ws.close();
        }
      } catch (e) {
        console.error('Error parsing WS message', e);
      }
    };

    ws.onerror = (error) => {
      setLogs((prev) => [...prev, 'WebSocket Error']);
      setIsCompiling(false);
    };

    ws.onclose = () => {
      // Removed the conditional log for unexpected close as per diff
    };
  };

  const handleLogin = (userData: any) => {
    setUser(userData);
    // Removed setLogs for login as per diff
  };

  const handleSave = async () => {
    localStorage.setItem('embedded-ide-code', code);

    if (user) {
      setLogs((prev) => [...prev, 'Saving to cloud...']);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://rotten-cloths-know.loca.lt/projects', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Fixed template literal
          },
          body: JSON.stringify({ name: 'My Project', code })
        });
        const data = await response.json();
        if (response.ok) {
          setLogs((prev) => [...prev, `Project saved to cloud as "${data.name}"`]);
        } else {
          setLogs((prev) => [...prev, `Cloud save failed: ${data.error}`]);
        }
      } catch (err) {
        setLogs((prev) => [...prev, 'Error saving to cloud']);
      }
    } else {
      setLogs((prev) => [...prev, 'Project saved locally (Login to save to cloud)']);
    }
  };

  const handleAutoPilotPrompt = (prompt: string) => {
    setViewMode('ide');
    setLogs(['> Initializing AI Auto-Pilot...', `> Prompt: ${prompt}`]);
    setCode('// AI is generating code based on your prompt...\n// Please wait...');
    setIsCompiling(true);

    const ws = new WebSocket('wss://rotten-cloths-know.loca.lt/ws/autopilot');

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: 'generate', prompt, board }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'status') {
          setLogs((prev) => [...prev, `AI: ${data.message}`]);
        } else if (data.type === 'code') {
          setCode(data.code);
        } else if (data.type === 'success') {
          setLogs((prev) => [...prev, '✨ AI successfully built your project!']);
          setIsCompiling(false);
          ws.close();
        } else if (data.type === 'error') {
          setLogs((prev) => [...prev, `❌ AI Error: ${data.message}`]);
          setIsCompiling(false);
          ws.close();
        }
      } catch (e) {
        console.error('WS Error', e);
      }
    };

    ws.onerror = () => {
      setLogs((prev) => [...prev, '❌ Connection error']);
      setIsCompiling(false);
    };
  };

  const handleLoadProject = (projectCode: string, projectName: string) => {
    setCode(projectCode);
    setShowProjects(false);
    setViewMode('ide');
    setLogs(prev => [...prev, `Loaded project: ${projectName}`]);
  };

  const handleNewProject = () => {
    setCode('// New Project\n\nvoid setup() {\n}\n\nvoid loop() {\n}\n');
    setViewMode('prompt');
  };

  if (viewMode === 'prompt') {
    return (
      <div className="flex h-screen bg-[#020617] text-white overflow-hidden relative">
        {/* Animated background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none"></div>

        {/* Simple Header for Prompt Mode */}
        <div className="absolute top-6 right-8 flex items-center space-x-2 md:space-x-4 z-10">
          <select
            value={board}
            onChange={(e) => setBoard(e.target.value)}
            className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-full px-4 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all max-w-[100px] md:max-w-none text-slate-300"
          >
            <option value="esp32">ESP32 (V3)</option>
            <option value="esp8266">ESP8266</option>
          </select>
          <button
            onClick={() => setViewMode('ide')}
            className="text-slate-400 hover:text-white text-xs font-medium px-4 py-1.5 rounded-full hover:bg-white/5 transition-all"
          >
            Open <span className="hidden md:inline">Editor</span>
          </button>
        </div>

        <div className="w-full h-full flex flex-col items-center justify-center">
          <AutoPilot onPromptSubmit={handleAutoPilotPrompt} board={board} />
        </div>
        {showProjects && <ProjectsModal onClose={() => setShowProjects(false)} onLoadProject={handleLoadProject} />}
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#020617] text-slate-200 overflow-hidden font-sans">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-950/40 relative">

        {/* Toolbar */}
        <div className="h-16 glass-dark border-b border-white/5 flex items-center px-6 justify-between shrink-0 overflow-x-auto z-10">
          <div className="flex items-center space-x-2 md:space-x-4">
            <div className="flex bg-slate-950/60 border border-white/5 rounded-lg p-1 overflow-hidden">
              <select
                value={board}
                onChange={(e) => setBoard(e.target.value)}
                className="bg-transparent text-slate-400 px-3 py-1.5 text-xs font-bold focus:outline-none appearance-none cursor-pointer hover:text-white transition-colors"
              >
                <option value="esp32">ESP32</option>
                <option value="esp8266">ESP8266</option>
              </select>
            </div>

            <div className="h-6 w-px bg-white/5 hidden md:block mx-1"></div>

            <button
              onClick={handleCompile}
              disabled={isCompiling}
              className={`flex items-center px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${isCompiling
                  ? 'bg-blue-500/20 text-blue-300 animate-pulse cursor-wait border border-blue-500/20'
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 border border-blue-400/20'
                }`}
              title="Compile & Run"
            >
              <Play className={`w-3.5 h-3.5 md:mr-2 ${isCompiling ? 'animate-spin' : ''}`} />
              <span className="hidden md:inline uppercase tracking-wider">{isCompiling ? 'Building...' : 'Flash'}</span>
            </button>

            <button className="flex items-center px-4 py-1.5 bg-slate-800/40 hover:bg-slate-800/60 border border-white/10 rounded-lg text-xs font-bold text-slate-300 transition-all uppercase tracking-wider" title="Download Binary">
              <Download className="w-3.5 h-3.5 md:mr-2" />
              <span className="hidden md:inline">.bin</span>
            </button>
          </div>

          <div className="flex items-center space-x-3 ml-4">
            <button
              onClick={handleNewProject}
              className="flex items-center p-2 bg-slate-800/40 hover:bg-slate-800/60 border border-white/10 rounded-lg text-slate-300 transition-all"
              title="New Project"
            >
              <Plus className="w-4 h-4" />
            </button>

            {user && (
              <button
                onClick={() => setShowProjects(true)}
                className="flex items-center px-4 py-1.5 bg-slate-800/40 hover:bg-slate-800/60 border border-white/10 rounded-lg text-xs font-bold text-slate-300 transition-all uppercase tracking-wider"
                title="Load Project"
              >
                <FolderOpen className="w-3.5 h-3.5 md:mr-2" />
                <span className="hidden md:inline">Browse</span>
              </button>
            )}

            <button
              onClick={handleSave}
              className="flex items-center px-4 py-1.5 bg-slate-800/40 hover:bg-slate-800/60 border border-white/10 rounded-lg text-xs font-bold text-slate-300 transition-all uppercase tracking-wider"
              title="Save to Cloud"
            >
              <Save className="w-3.5 h-3.5 md:mr-2" />
              <span className="hidden md:inline">Save</span>
            </button>

            <div className="h-6 w-px bg-white/5 hidden md:block mx-1"></div>

            {user ? (
              <div className="hidden lg:flex items-center px-4 py-1.5 text-blue-400 border border-blue-500/10 bg-blue-500/5 rounded-lg">
                <User className="w-3.5 h-3.5 mr-2" />
                <span className="text-xs font-bold uppercase tracking-tight">{user.email.split('@')[0]}</span>
              </div>
            ) : (
              <button
                onClick={() => setShowAuth(true)}
                className="flex items-center px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold shadow-lg shadow-indigo-600/20 border border-indigo-400/20 transition-all uppercase tracking-wider"
              >
                <User className="w-3.5 h-3.5 md:mr-2" />
                <span className="hidden md:inline">Login</span>
              </button>
            )}
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 flex flex-col min-h-0 bg-slate-950/20">
          <div className="flex-1 relative border-b border-white/5">
            {/* Subtle editor frame */}
            <div className="absolute inset-0 m-4 rounded-xl border border-white/5 bg-slate-900/30 overflow-hidden shadow-2xl backdrop-blur-sm">
              <CodeEditor code={code} onChange={handleEditorChange} />
            </div>
          </div>

          {/* Terminal / Output */}
          <div className="h-64 min-h-[16rem] bg-black/40 backdrop-blur-md p-1 border-t border-white/5">
            <div className="h-full bg-slate-950/40 rounded-t-xl border-x border-t border-white/10 overflow-hidden">
              <div className="flex items-center px-4 py-2 border-b border-white/5 bg-slate-900/40 justify-between">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 flex items-center">
                  <div className="w-2 h-2 rounded-full bg-green-500/50 mr-2 animate-pulse"></div>
                  Terminal Output
                </span>
                <button onClick={() => setLogs([])} className="text-[10px] text-slate-600 hover:text-slate-200 transition-colors uppercase tracking-widest font-bold">Clear Logs</button>
              </div>
              <Terminal logs={logs} />
            </div>
          </div>
        </div>
      </div>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} onLogin={handleLogin} />}
      {showProjects && <ProjectsModal onClose={() => setShowProjects(false)} onLoadProject={handleLoadProject} />}
    </div>
  );
}
