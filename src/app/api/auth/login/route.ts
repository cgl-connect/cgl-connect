import { NextRequest, NextResponse } from 'next/server';
import { LoginFormValues } from '@/types/forms/login-form.types';

export async function POST(req: NextRequest) {
  try {
    // TODO: api mockada
    const body: LoginFormValues = await req.json();
    
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    if (body.email === 'cgl' && body.password === 'password123') {
      return NextResponse.json({
        success: true,
        data: {
          user: {
            id: '1',
            email: body.email,
            name: 'Test User',
            role: 'user',
            token: 'mock-jwt-token',
          },
          token: 'mock-jwt-token',
        },
        message: 'Login successful',
        status: 200,
      });
    }
    
    return NextResponse.json(
      {
        success: false,
        message: 'Invalid email or password',
        status: 401,
      }, 
      { status: 401 }
    );
    
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'An error occurred during login',
        status: 500,
      },
      { status: 500 }
    );
  }
}
