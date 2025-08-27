// contexts/AuthContext.js
'use client'; // 这很重要，因为我们要在客户端组件中使用它

import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { supabase } from '../lib/supabaseClient'; // 确保路径正确
import { useRouter } from 'next/navigation';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const {  authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth State Change:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user || null);
        setLoading(false);

        // 可选：根据认证状态重定向
        // if (event === 'SIGNED_IN') router.push('/dashboard');
        // if (event === 'SIGNED_OUT') router.push('/login');
      }
    );

    // 获取当前会话
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setUser(data.session?.user || null);
      setLoading(false);
    };
    getSession();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  const value = useMemo(
    () => ({
      session,
      user,
      signIn: (email, password) => supabase.auth.signInWithPassword({ email, password }),
      signUp: (email, password) => supabase.auth.signUp({ email, password }),
      signOut: () => supabase.auth.signOut(),
    }),
    [session, user]
  );

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};