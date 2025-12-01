import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatNumber(num: number): string {
  return num.toLocaleString('ko-KR');
}

export function getGitHubAvatarUrl(username: string, size: number = 80): string {
  return `https://github.com/${username}.png?size=${size}`;
}
