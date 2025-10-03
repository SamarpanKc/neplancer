// Authentication utilities
import { User } from '@/types';

export function getStoredUser(): User | null {
  if (typeof window === 'undefined') return null;
  
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
}

export function setStoredUser(user: User): void {
  localStorage.setItem('user', JSON.stringify(user));
}

export function removeStoredUser(): void {
  localStorage.removeItem('user');
}

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('authToken');
}

export function setAuthToken(token: string): void {
  localStorage.setItem('authToken', token);
}

export function removeAuthToken(): void {
  localStorage.removeItem('authToken');
}
