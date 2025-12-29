"use client";

import { useState, type ChangeEvent, useEffect } from 'react';
import { Heart, Film, Music } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import LoveFilmPlayer from '@/components/lovefilm-player';

export default function Home() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [audio1Url, setAudio1Url] = useState<string | null>(null);
  const [audio2Url, setAudio2Url] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, setter: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      setter(URL.createObjectURL(file));
    }
  };

  const allFilesUploaded = videoUrl && audio1Url && audio2Url;

  const resetFiles = () => {
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    if (audio1Url) URL.revokeObjectURL(audio1Url);
    if (audio2Url) URL.revokeObjectURL(audio2Url);
    setVideoUrl(null);
    setAudio1Url(null);
    setAudio2Url(null);
  }
  
  useEffect(() => {
    // ComponentWillUnmount cleanup
    return () => {
      if (videoUrl) URL.revokeObjectURL(videoUrl);
      if (audio1Url) URL.revokeObjectURL(audio1Url);
      if (audio2Url) URL.revokeObjectURL(audio2Url);
    }
  }, [videoUrl, audio1Url, audio2Url]);


  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 sm:p-8">
      <div className="w-full max-w-4xl">
        <div className="flex flex-col items-center text-center mb-8">
          <Heart className="w-16 h-16 text-primary mb-4" />
          <h1 className="text-4xl sm:text-5xl font-bold font-headline text-foreground">LoveFilm</h1>
          <p className="text-lg text-muted-foreground mt-2">Create a special video gift for your beloved.</p>
        </div>

        {!allFilesUploaded ? (
          <Card className="w-full shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline">Let's Prepare Your Gift</CardTitle>
              <CardDescription>Upload one video and two audio narrations.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="video-upload" className="flex items-center gap-2 cursor-pointer">
                  <Film className="w-4 h-4" />
                  Your Video
                </Label>
                <Input id="video-upload" type="file" accept="video/*" onChange={(e) => handleFileChange(e, setVideoUrl)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="audio1-upload" className="flex items-center gap-2 cursor-pointer">
                  <Music className="w-4 h-4" />
                  First Narration
                </Label>
                <Input id="audio1-upload" type="file" accept="audio/*" onChange={(e) => handleFileChange(e, setAudio1Url)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="audio2-upload" className="flex items-center gap-2 cursor-pointer">
                  <Music className="w-4 h-4" />
                  Second Narration
                </Label>
                <Input id="audio2-upload" type="file" accept="audio/*" onChange={(e) => handleFileChange(e, setAudio2Url)} />
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col items-center gap-4 w-full">
            <LoveFilmPlayer
              videoUrl={videoUrl}
              audio1Url={audio1Url}
              audio2Url={audio2Url}
            />
            <Button variant="outline" onClick={resetFiles}>
              Upload Different Files
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
