import { checkBotId } from 'botid/server';
import { NextRequest, NextResponse } from 'next/server';
 
export async function POST(request: NextRequest) {
  const verification = await checkBotId();
 
  if (verification.isBot) {
    return NextResponse.json({ error: 'Access denied' }, { status: 403 });
  }
 
  const data = await processUserRequest(request);
 
  return NextResponse.json({ data });
}
 
async function processUserRequest(request: NextRequest) {
  // Your business logic here
  const body = await request.json();
  // Process the request...
  return { success: true };
}