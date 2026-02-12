'use client';

import React, { useState, useEffect } from 'react';
import { X, Folder, Calendar } from 'lucide-react';

interface Project {
    id: number;
    name: string;
    code: string;
    created_at: string;
}

interface ProjectsModalProps {
    onClose: () => void;
    onLoadProject: (code: string, name: string) => void;
}

export default function ProjectsModal({ onClose, onLoadProject }: ProjectsModalProps) {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('https://rotten-cloths-know.loca.lt/projects', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Failed to fetch projects');

            const data = await response.json();
            setProjects(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 border border-gray-700 p-6 rounded-lg w-full max-w-2xl shadow-xl animate-in fade-in zoom-in duration-300">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white flex items-center">
                        <Folder className="w-5 h-5 mr-2 text-blue-400" />
                        My Projects
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center p-8 text-gray-400">Loading projects...</div>
                ) : error ? (
                    <div className="text-red-400 text-center p-4">Error: {error}</div>
                ) : projects.length === 0 ? (
                    <div className="text-gray-500 text-center p-8">No saved projects found.</div>
                ) : (
                    <div className="grid gap-4 max-h-[60vh] overflow-y-auto pr-2">
                        {projects.map((project) => (
                            <button
                                key={project.id}
                                onClick={() => onLoadProject(project.code, project.name)}
                                className="flex flex-col items-start p-4 bg-gray-800 border border-gray-700 rounded-lg hover:border-blue-500 hover:bg-gray-800/80 transition-all text-left group"
                            >
                                <div className="flex justify-between w-full mb-2">
                                    <h3 className="font-semibold text-white group-hover:text-blue-400">{project.name}</h3>
                                    <span className="text-xs text-gray-500 flex items-center bg-gray-900 px-2 py-1 rounded">
                                        <Calendar className="w-3 h-3 mr-1" />
                                        {new Date(project.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="text-xs text-gray-500 font-mono line-clamp-2 w-full bg-gray-950 p-2 rounded">
                                    {project.code.substring(0, 100)}...
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
