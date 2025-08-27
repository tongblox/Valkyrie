// app/login/page.js
'use client';

import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext'; // 确保路径正确
import { useRouter } from 'next/navigation';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../../lib/supabaseClient';

export default function Login() {
  const { user, signIn, signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  // 如果用户已登录，重定向到主页或仪表盘
  if (user) {
    router.push('/'); // 或 '/dashboard'
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      let res;
      if (isSignUp) {
        res = await signUp(email, password);
         if (res.error) throw res.error;
         setMessage('注册成功，请检查邮箱进行确认。');
      } else {
        res = await signIn(email, password);
        if (res.error) throw res.error;
        // 成功登录后，AuthProvider 的 useEffect 会处理状态更新和重定向
      }
    } catch (error) {
      console.error('认证错误:', error);
      setMessage('认证失败: ' + error.message);
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          {isSignUp ? '注册账户' : '登录到您的账户'}
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        {/* 使用 Supabase Auth UI 组件 */}
        <div className="mb-6">
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            theme="default"
            providers={[]} // 可以添加第三方登录提供商，如 ['google', 'github']
            redirectTo={`${window.location.origin}/auth/callback`} // 登录成功后的回调地址
          />
        </div>

        <hr className="my-6 border-gray-300" />

        {/* 或者使用自定义表单 */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
              邮箱地址
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                密码
              </label>
              {/* <div className="text-sm">
                <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                  忘记密码?
                </a>
              </div> */}
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {isSignUp ? '注册' : '登录'}
            </button>
          </div>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          {isSignUp ? '已有账户? ' : '新用户? '}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >
            {isSignUp ? '登录' : '立即注册'}
          </button>
        </p>

        {message && (
          <div className={`mt-4 p-2 text-center text-sm ${message.includes('失败') ? 'text-red-500' : 'text-green-500'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}