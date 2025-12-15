import { createFileRoute } from '@tanstack/react-router';
import { SettingsContent } from '@/features/user-settings';

export const Route = createFileRoute('/(main)/settings')({
  component: SettingsPage,
});

function SettingsPage() {
  return <SettingsContent />;
}
