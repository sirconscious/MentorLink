import { useEffect, useRef, useState } from 'react';
import { Terminal } from 'xterm';
import DashboardLayout from './Layouts/DashboardLayout';
const DockerTerminal = () => {
    const terminalRef = useRef(null);
    const [status, setStatus] = useState('Connecting...');
    const [isConnected, setIsConnected] = useState(false);
    const term = useRef(null);
    const ws = useRef(null);

    useEffect(() => {
        // Create terminal
        term.current = new Terminal({
            cursorBlink: true,
            theme: {
                background: '#000000',
                foreground: '#00ff00'
            },
            fontSize: 14,
            fontFamily: 'Courier New, monospace'
        });

        term.current.open(terminalRef.current);
        term.current.writeln('Initializing terminal...');

        // Connect to WebSocket server
        connectWebSocket();

        return () => {
            if (ws.current) {
                ws.current.close();
            }
            if (term.current) {
                term.current.dispose();
            }
        };
    }, []);

    const connectWebSocket = () => {
        ws.current = new WebSocket('ws://localhost:3000');

        ws.current.onopen = () => {
            setStatus('Connected to server');
            setIsConnected(true);
            term.current.writeln('\x1b[32mConnected to server...\x1b[0m');
        };

        ws.current.onmessage = (event) => {
            term.current.write(event.data);
        };

        ws.current.onerror = (error) => {
            setStatus('❌ Connection error');
            setIsConnected(false);
            term.current.writeln('\r\n\x1b[31mError: Could not connect to server\x1b[0m');
            term.current.writeln('\r\nMake sure the server is running: npm start');
        };

        ws.current.onclose = () => {
            setStatus('⚠️ Disconnected from server');
            setIsConnected(false);
            term.current.writeln('\r\n\x1b[33mConnection closed\x1b[0m');
        };

        // Send user input to server
        term.current.onData((data) => {
            if (ws.current.readyState === WebSocket.OPEN) {
                ws.current.send(data);
            }
        });
    };

    return ( 
        <DashboardLayout>

            <div className="min-h-screen p-5 bg-background font-mono">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                {/* <h1 className="text-3xl text-green-400 text-center mb-4">
                    🐳 Docker Terminal
                </h1> */}

                {/* Status */}
                <div
                    className={`text-center mb-4 ${isConnected ? 'text-green-400' : 'text-yellow-400'
                        }`}
                >
                    {status}
                </div>

                {/* Terminal */}
                <div
                    ref={terminalRef}
                    className="w-full h-[600px] bg-black rounded-lg overflow-hidden"
                />
            </div>
        </div> 
        </DashboardLayout>

    );
};

export default DockerTerminal;