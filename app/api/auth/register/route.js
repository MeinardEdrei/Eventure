// app/api/auth/register/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const body = await request.json();
        console.log('Request body:', body); // Debug log

        // Make sure your backend URL is correct - update this with your actual backend URL and port
        const backendUrl = 'http://localhost:5000/api/Auth/register';
        console.log('Attempting to connect to:', backendUrl); // Debug log

        const response = await fetch(backendUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(body),
        });

        console.log('Backend response status:', response.status); // Debug log
        
        const data = await response.json();
        console.log('Backend response data:', data); // Debug log

        if (!response.ok) {
            return NextResponse.json(
                { message: data.message || 'Registration failed' },
                { status: response.status }
            );
        }

        return NextResponse.json(data);
    } catch (error) {
        // Detailed error logging
        console.error('Registration error:', error);
        console.error('Error details:', {
            message: error.message,
            stack: error.stack
        });

        return NextResponse.json(
            { message: `Registration failed: ${error.message}` },
            { status: 500 }
        );
    }
}