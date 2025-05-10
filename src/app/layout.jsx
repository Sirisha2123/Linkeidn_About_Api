import './globals.css';

export const metadata = {
  title: 'LinkedIn Integration',
  description: 'A Next.js application that integrates with LinkedIn',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <main className="min-h-screen bg-gray-100">
          {children}
        </main>
      </body>
    </html>
  );
} 