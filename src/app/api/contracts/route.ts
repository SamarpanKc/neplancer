import { NextResponse } from 'next/server';
import { demoApi } from '@/lib/demoApi';

// GET /api/contracts - Get all contracts
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    let contracts;
    if (userId) {
      contracts = await demoApi.getContractsByUserId(userId);
    } else {
      contracts = await demoApi.getAllContracts();
    }

    return NextResponse.json({ contracts });
  } catch (error) {
    console.error('Error fetching contracts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contracts' },
      { status: 500 }
    );
  }
}

// POST /api/contracts - Create a new contract
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newContract = await demoApi.createContract(body);
    return NextResponse.json({ success: true, contract: newContract });
  } catch (error) {
    console.error('Error creating contract:', error);
    return NextResponse.json(
      { error: 'Failed to create contract' },
      { status: 500 }
    );
  }
}
