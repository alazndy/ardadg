"use client";

import { useState } from 'react';
import LoveFilmPlayer from '@/components/lovefilm-player';

const voiceoverSources = [
  { name: "English", url: "/enses.mp4" },
  { name: "Turkish", url: "/trses.mp4" }
];

const backgroundMusicSources = [
  { name: "Bas Gaza", url: "/basgaza.mp3" },
  { name: "Disfruto", url: "/disfruto.mp3" },
  { name: "Whenever", url: "/whenever.mp3" },
  { name: "None", url: "" }
];

export default function Home() {
  const [videoUrl] = useState<string>("/video.mp4");

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 sm:p-8">
      <div className="w-full max-w-4xl">
        <LoveFilmPlayer
          videoUrl={videoUrl}
          voiceoverSources={voiceoverSources}
          backgroundMusicSources={backgroundMusicSources}
        />
      </div>
    </main>
  );
}
