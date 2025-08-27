// app/layout.js
import './globals.css';
import { AuthProvider } from '../contexts/AuthContext'; // 确保路径正确

export const metadata = {
  title: 'Roblox Order Tracker',
  description: 'Track your Roblox orders',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}