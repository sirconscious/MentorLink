// resources/js/Pages/Courses/Show.jsx
import React from 'react';
import { Link } from '@inertiajs/react';
import DashboardLayout from '../Layouts/DashboardLayout';
export default function Show({ filename }) {
    const proxyUrl = `/courses/proxy/${encodeURIComponent(filename)}`;
    const downloadUrl = `/courses/download/${encodeURIComponent(filename)}`;

    return ( 
        <DashboardLayout>

        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">
                {filename.replace('.pdf', '')}
            </h1>

            <div className="w-full" style={{ height: 'calc(100vh - 200px)' }}>
                <iframe
                    src={proxyUrl}
                    className="w-full h-full border rounded"
                    title={filename}
                    />
            </div>

            <div className="mt-4 flex gap-2">
                <a
                    href={downloadUrl}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                    Download PDF
                </a>

                <Link
                    href="/courses"
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                    Back to Courses
                </Link>
            </div>
        </div>
                    </DashboardLayout>
    );
}