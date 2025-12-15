import { createFileRoute, Outlet } from '@tanstack/react-router';
import { Header } from '@/widgets/header';

export const Route = createFileRoute('/(main)')({
  component: MainLayout,
});

function MainLayout() {
  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-3.5rem)]">
        <Outlet />
      </main>
    </>
  );
}
