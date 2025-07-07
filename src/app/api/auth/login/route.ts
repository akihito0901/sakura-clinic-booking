import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { User, AuthSession } from '@/types/booking';
import bcrypt from 'bcryptjs';

const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');
const SESSIONS_FILE = path.join(process.cwd(), 'data', 'sessions.json');

async function ensureSessionsFile() {
  try {
    await fs.access(SESSIONS_FILE);
  } catch {
    await fs.mkdir(path.dirname(SESSIONS_FILE), { recursive: true });
    await fs.writeFile(SESSIONS_FILE, JSON.stringify({ sessions: [] }, null, 2));
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'メールアドレスとパスワードを入力してください' },
        { status: 400 }
      );
    }
    
    // ユーザーファイルを読み込み
    const usersData = JSON.parse(await fs.readFile(USERS_FILE, 'utf8'));
    const user = usersData.users.find((u: User & { password: string }) => u.email === email);
    
    if (!user) {
      return NextResponse.json(
        { error: 'メールアドレスまたはパスワードが正しくありません' },
        { status: 401 }
      );
    }
    
    // パスワード確認
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: 'メールアドレスまたはパスワードが正しくありません' },
        { status: 401 }
      );
    }
    
    // セッションを作成（2ヶ月間有効）
    await ensureSessionsFile();
    const sessionsData = JSON.parse(await fs.readFile(SESSIONS_FILE, 'utf8'));
    
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 2); // 2ヶ月後
    
    const session: AuthSession = {
      userId: user.id,
      expiresAt: expiresAt.toISOString()
    };
    
    // 既存の期限切れセッションを削除
    sessionsData.sessions = sessionsData.sessions.filter((s: AuthSession & { id: string }) => 
      new Date(s.expiresAt) > new Date()
    );
    
    // 新しいセッションを追加
    sessionsData.sessions.push({ id: sessionId, ...session });
    await fs.writeFile(SESSIONS_FILE, JSON.stringify(sessionsData, null, 2));
    
    // ユーザーの最終ログイン時刻を更新
    user.lastLoginAt = new Date().toISOString();
    await fs.writeFile(USERS_FILE, JSON.stringify(usersData, null, 2));
    
    // レスポンスにセッションIDをCookieとして設定
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        isFirstTime: user.isFirstTime
      }
    });
    
    response.cookies.set('sessionId', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 60 // 60日
    });
    
    return response;
    
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'ログイン中にエラーが発生しました' },
      { status: 500 }
    );
  }
}