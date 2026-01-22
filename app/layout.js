import ThemeRegistry from '../frontend/components/ThemeRegistry';

export const metadata = {
  title: 'Chat IA',
  description: 'Application de chat avec IA',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
