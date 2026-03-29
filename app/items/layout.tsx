import Navbar from '@/presentation/components/layout/Navbar';
import Footer from '@/presentation/components/layout/Footer';

export default function ItemsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
