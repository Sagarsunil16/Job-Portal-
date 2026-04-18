import { Poppins } from 'next/font/google';
import './globals.css';
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
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
