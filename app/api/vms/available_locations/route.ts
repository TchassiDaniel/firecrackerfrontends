import { NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/apiEndpoints';

export async function GET() {
  try {
    const vmClient = getServiceClient('VM_SERVICE');
    const response = await vmClient.get(API_ENDPOINTS.VIRTUAL_MACHINES.endpoints.AVAILABLE_LOCATIONS);
    
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching available locations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch available locations' },
      { status: 500 }
    );
  }
}
