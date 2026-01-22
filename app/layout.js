import ThemeRegistry from '../frontend/components/ThemeRegistry';
import { AuthProvider } from '../frontend/hooks/useAuth';

export const metadata = {
  title: 'Chat IA',
  description: 'Application de chat avec IA',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <ThemeRegistry>
          <AuthProvider>{children}</AuthProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
