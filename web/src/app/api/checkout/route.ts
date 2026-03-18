import { NextRequest } from 'next/server';

// TODO: replace with Stripe checkout session creation
export async function POST(req: NextRequest) {
  const { email } = await req.json();

  // Stub: return a placeholder URL so the frontend doesn't 404 during development
  console.log(`Checkout requested for: ${email}`);

  return Response.json({ url: '#' }, { status: 200 });
}
