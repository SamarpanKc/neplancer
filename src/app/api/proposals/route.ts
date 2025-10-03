import { NextResponse } from 'next/server';

// POST /api/proposals - Submit a proposal
export async function POST(request: Request) {
  try {
    const body = await request.json();
    // TODO: Implement database insertion
    return NextResponse.json({ success: true, proposal: body });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to submit proposal' },
      { status: 500 }
    );
  }
}
