'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  avatar: string;
  bio?: string | null;
  styleTags: string;
  instagram?: string | null;
}

interface AuthContextType {
  currentUser: User | null;
  users: User[];
  setCurrentUser: (user: User | null) => void;
  switchUser: (userId: string) => void;
  refreshUsers: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  users: [],
  setCurrentUser: () => {},
  switchUser: () => {},
  refreshUsers: async () => {},
  isLoading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
        if (!currentUser && data.length > 0) {
          const savedUserId = localStorage.getItem('active_user_id');
          const matched = data.find((u: User) => u.id === savedUserId) || data[0];
          setCurrentUser(matched);
        }
      }
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const switchUser = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('active_user_id', user.id);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        setCurrentUser: (user) => {
          setCurrentUser(user);
          if (user) localStorage.setItem('active_user_id', user.id);
        },
        switchUser,
        refreshUsers: fetchUsers,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
