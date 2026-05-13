import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/src/context/CartContext';
import Navbar from '@/src/components/Navbar';
import CartSidebar from '@/src/components/CartSidebar';
import Footer from '@/src/components/Footer';
export const metadata: Metadata = {
  title: 'Aura — Jewellery & Gifts',
  description: 'Handcrafted jewellery, toys, and accessories',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Navbar />
          <CartSidebar />
          <main>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}