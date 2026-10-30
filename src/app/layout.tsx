import './globals.css';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { LanguageProvider } from '@/lib/language-context';
import { AudioProvider } from '@/lib/audio-context';
import { AudioPlayerBar } from '@/components/AudioPlayerBar';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: 'default' },
  });

  const artistName = settings?.artistName || 'Singer Munna Kumar Nirala';
  const tagline = settings?.tagline || 'Renowned Devotional & Cultural Vocalist | Shree Sundarkand Path, Mata Jagran, Khatu Shyam Sandhya';

  return {
    title: {
      default: `${artistName} | Official Website`,
      template: `%s | ${artistName}`,
    },
    description: tagline,
    keywords: [
      'Singer Munna Kumar Nirala',
      'मुन्ना कुमार निराला',
      'Sundarkand Path',
      'Mata Ka Jagran',
      'Khatu Shyam Sandhya',
      'Sai Sandhya',
      'Akhand Ashtayam',
      'Devotional Singer Delhi NCR',
      'Bhajan Singer Bihar',
      'Cultural Musical Events',
    ],
    authors: [{ name: artistName }],
    openGraph: {
      title: `${artistName} - Official Singer Website`,
      description: tagline,
      images: [
        {
          url: settings?.heroImage || '/images/munna_nirala_hero.jpg',
          width: 1200,
          height: 630,
          alt: artistName,
        },
      ],
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hi" className="dark">
      <body className="min-h-screen flex flex-col bg-[#151B2B] text-[#FBF7EF] antialiased">
        <LanguageProvider>
          <AudioProvider>
            {children}
            <AudioPlayerBar />
          </AudioProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}

