import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { User, AuthSession } from '@/types/booking';

const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');
const SESSIONS_FILE = path.join(process.cwd(), 'data', 'sessions.json');

export async function POST(request: NextRequest) {
  try {
    const sessionId = request.cookies.get('sessionId')?.value;
    
    if (!sessionId) {
      return NextResponse.json(
        { error: 'ログインが必要です' },
        { status: 401 }
      );
    }
    
    // セッションを確認
    let sessionsData;
    try {
      const sessionContent = await fs.readFile(SESSIONS_FILE, 'utf8');
      sessionsData = JSON.parse(sessionContent);
    } catch (error) {
      console.error('Failed to read sessions file:', error);
      return NextResponse.json(
        { error: 'セッションデータの読み込みに失敗しました' },
        { status: 500 }
      );
    }
    const session = sessionsData.sessions.find((s: AuthSession & { id: string }) => s.id === sessionId);
    
    if (!session || new Date(session.expiresAt) <= new Date()) {
      return NextResponse.json(
        { error: 'セッションが期限切れです' },
        { status: 401 }
      );
    }
    
    // ユーザー情報を更新
    let usersData;
    try {
      const userContent = await fs.readFile(USERS_FILE, 'utf8');
      usersData = JSON.parse(userContent);
    } catch (error) {
      console.error('Failed to read users file:', error);
      return NextResponse.json(
        { error: 'ユーザーデータの読み込みに失敗しました' },
        { status: 500 }
      );
    }
    const userIndex = usersData.users.findIndex((u: User) => u.id === session.userId);
    
    if (userIndex === -1) {
      return NextResponse.json(
        { error: 'ユーザーが見つかりません' },
        { status: 404 }
      );
    }
    
    // isFirstTimeをfalseに更新
    usersData.users[userIndex].isFirstTime = false;
    await fs.writeFile(USERS_FILE, JSON.stringify(usersData, null, 2));
    
    return NextResponse.json({
      success: true,
      user: {
        id: usersData.users[userIndex].id,
        email: usersData.users[userIndex].email,
        name: usersData.users[userIndex].name,
        phone: usersData.users[userIndex].phone,
        isFirstTime: false
      }
    });
    
  } catch (error) {
    console.error('Update first time error:', error);
    return NextResponse.json(
      { error: '更新中にエラーが発生しました' },
      { status: 500 }
    );
  }
}