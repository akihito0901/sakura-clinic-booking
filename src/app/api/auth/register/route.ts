import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { User } from '@/types/booking';
import bcrypt from 'bcryptjs';

const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');

// ファイルが存在しない場合は作成
async function ensureUsersFile() {
  try {
    await fs.access(USERS_FILE);
  } catch {
    await fs.mkdir(path.dirname(USERS_FILE), { recursive: true });
    await fs.writeFile(USERS_FILE, JSON.stringify({ users: [] }, null, 2));
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureUsersFile();
    
    const { email, password, name, phone } = await request.json();
    
    // バリデーション
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'メールアドレス、パスワード、お名前は必須です' },
        { status: 400 }
      );
    }
    
    // パスワードの形式チェック（半角英数字4-8文字）
    if (!/^[a-zA-Z0-9]{4,8}$/.test(password)) {
      return NextResponse.json(
        { error: 'パスワードは半角英数字4-8文字で入力してください' },
        { status: 400 }
      );
    }
    
    // メールアドレスの形式チェック
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: '正しいメールアドレスを入力してください' },
        { status: 400 }
      );
    }
    
    // 既存ユーザーファイルを読み込み
    const usersData = JSON.parse(await fs.readFile(USERS_FILE, 'utf8'));
    
    // 重複チェック
    const existingUser = usersData.users.find((user: User) => user.email === email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'このメールアドレスは既に登録されています' },
        { status: 409 }
      );
    }
    
    // パスワードをハッシュ化
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // 新しいユーザーを作成
    const newUser: User & { password: string } = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email,
      password: hashedPassword,
      name,
      phone: phone || undefined,
      isFirstTime: true,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    };
    
    // ユーザーを追加
    usersData.users.push(newUser);
    await fs.writeFile(USERS_FILE, JSON.stringify(usersData, null, 2));
    
    // パスワードを除いてレスポンス
    const { password: _, ...userResponse } = newUser;
    
    return NextResponse.json({
      success: true,
      user: userResponse
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: '登録中にエラーが発生しました' },
      { status: 500 }
    );
  }
}