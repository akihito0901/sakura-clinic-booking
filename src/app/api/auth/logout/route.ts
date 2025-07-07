import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { AuthSession } from '@/types/booking';

const SESSIONS_FILE = path.join(process.cwd(), 'data', 'sessions.json');

export async function POST(request: NextRequest) {
  try {
    const sessionId = request.cookies.get('sessionId')?.value;
    
    if (sessionId) {
      try {
        // セッションファイルからセッションを削除
        const sessionContent = await fs.readFile(SESSIONS_FILE, 'utf8');
        const sessionsData = JSON.parse(sessionContent);
        sessionsData.sessions = sessionsData.sessions.filter((s: AuthSession & { id: string }) => s.id !== sessionId);
        await fs.writeFile(SESSIONS_FILE, JSON.stringify(sessionsData, null, 2));
      } catch (error) {
        console.error('Failed to update sessions file:', error);
        // エラーが発生してもログアウトは続行
      }
    }
    
    const response = NextResponse.json({ success: true });
    
    // Cookieを削除
    response.cookies.set('sessionId', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0
    });
    
    return response;
    
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'ログアウト中にエラーが発生しました' },
      { status: 500 }
    );
  }
}