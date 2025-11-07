import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';

export default function Progress() {
    const [progressValue, setProgressValue] = useState(0);

    useEffect(() => {
        // Listen to the progress channel
        const channel = window.Echo.channel('progress');

        channel.listen('ChangeProgressValue', (e) => {
            console.log('Received progress:', e.value);
            setProgressValue(e.value);
        });

        // Cleanup on unmount
        return () => {
            window.Echo.leaveChannel('progress');
        };
    }, []);

    return (
        <>
            <Head title="Progress Tracker" />

            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                    <h1 className="text-2xl font-bold mb-4">Progress Tracker</h1>

                    <div className="mb-4">
                        <div className="text-lg font-semibold mb-2">
                            Current Progress: {progressValue}%
                        </div>

                        <div className="w-full bg-gray-200 rounded-full h-4">
                            <div
                                className="bg-blue-600 h-4 rounded-full transition-all duration-300"
                                style={{ width: `${progressValue}%` }}
                            ></div>
                        </div>
                    </div>

                    <p className="text-gray-600 text-sm">
                        Listening for real-time updates...
                    </p>
                </div>
            </div>
        </>
    );
}