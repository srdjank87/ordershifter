import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        merchant: true,
        warehouse: true,
      },
    });

    return NextResponse.json(orders);
  } catch (err: unknown) {
    console.error('Error in /api/example:', err);

    let message = 'Unknown error';

    if (err instanceof Error) {
      message = err.message;
    } else if (typeof err === 'string') {
      message = err;
    }

    return NextResponse.json(
      { error: 'Internal error', details: message },
      { status: 500 },
    );
  }
}
