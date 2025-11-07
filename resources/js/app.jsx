import './bootstrap';
import { createInertiaApp } from '@inertiajs/react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from './Pages/contexts/ThemeContext';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Configure Echo
window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST,
    wsPort: import.meta.env.VITE_REVERB_PORT ?? 80,
    wssPort: import.meta.env.VITE_REVERB_PORT ?? 443,
    forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
    enabledTransports: ['ws', 'wss'],
});

createInertiaApp({
    resolve: name => {
        const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true })
        return pages[`./Pages/${name}.jsx`]
    },
    setup({ el, App, props }) {
        createRoot(el).render(
            <ThemeProvider>
                <App {...props} />
            </ThemeProvider>
        )
    },
})