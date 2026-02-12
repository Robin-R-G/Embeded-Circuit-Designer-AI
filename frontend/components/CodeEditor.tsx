'use client';

import React from 'react';
import Editor, { OnMount } from '@monaco-editor/react';

interface CodeEditorProps {
    code: string;
    onChange: (value: string | undefined) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ code, onChange }) => {
    const handleEditorDidMount: OnMount = (editor, monaco) => {
        // Customize editor here if needed
        editor.focus();
    };

    return (
        <div className="h-full w-full">
            <Editor
                height="100%"
                defaultLanguage="cpp"
                defaultValue="// Write your code here"
                value={code}
                onChange={onChange}
                theme="vs-dark"
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                }}
                onMount={handleEditorDidMount}
            />
        </div>
    );
};

export default CodeEditor;
