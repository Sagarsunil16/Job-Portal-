import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { StoreProvider } from '@/store/StoreProvider';

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'Job Pilot',
  description: 'Employer Job Portal',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} font-poppins antialiased`}
      >
        <StoreProvider>
          {children}
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                fontFamily: 'var(--font-poppins)',
                borderRadius: '12px',
                padding: '16px',
              },
            }}
          />
        </StoreProvider>
      </body>
    </html>
  );
}
