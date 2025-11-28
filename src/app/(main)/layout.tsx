import { Header } from '@/widgets/header';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-3.5rem)]">
        {children}
      </main>
    </>
  );
}
