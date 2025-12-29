"use client";

import { useState, useRef, useEffect } from 'react';
import { Heart, Play, Pause, Volume1, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

type LoveFilmPlayerProps = {
  videoUrl: string;
  audio1Url: string;
  audio2Url: string;
};

export default function LoveFilmPlayer({ videoUrl, audio1Url, audio2Url }: LoveFilmPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audio1Ref = useRef<HTMLAudioElement>(null);
  const audio2Ref = useRef<HTMLAudioElement>(null);
  
  const [selectedAudio, setSelectedAudio] = useState<'audio1' | 'audio2'>('audio1');
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.75);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const audio1 = audio1Ref.current;
    const audio2 = audio2Ref.current;
    if (!video || !audio1 || !audio2) return;

    const audios = { audio1, audio2 };
    const activeAudio = audios[selectedAudio];
    const inactiveAudio = selectedAudio === 'audio1' ? audio2 : audio1;

    const syncAndPlay = () => {
      if (video.currentTime !== activeAudio.currentTime) {
        activeAudio.currentTime = video.currentTime;
      }
      activeAudio.play();
      setIsPlaying(true);
    };

    const syncAndPause = () => {
      activeAudio.pause();
      setIsPlaying(false);
    };

    const handleSeek = () => {
      activeAudio.currentTime = video.currentTime;
    };
    
    inactiveAudio.pause();
    
    if (!video.paused) {
      syncAndPlay();
    }

    video.addEventListener('play', syncAndPlay);
    video.addEventListener('pause', syncAndPause);
    video.addEventListener('seeked', handleSeek);

    const handleTimeUpdate = () => setProgress(video.duration ? (video.currentTime / video.duration) * 100 : 0);
    const handleDurationChange = () => setDuration(video.duration);
    const handleEnded = () => setIsPlaying(false);

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('durationchange', handleDurationChange);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('play', syncAndPlay);
      video.removeEventListener('pause', syncAndPause);
      video.removeEventListener('seeked', handleSeek);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('durationchange', handleDurationChange);
      video.removeEventListener('ended', handleEnded);
    };
  }, [selectedAudio]);

  useEffect(() => {
      const allAudioElements = [audio1Ref.current, audio2Ref.current];
      allAudioElements.forEach(audio => {
          if (audio) {
              audio.volume = isMuted ? 0 : volume;
          }
      });
  }, [volume, isMuted]);

  const handlePlayPause = () => {
      if (videoRef.current) {
          videoRef.current.paused ? videoRef.current.play() : videoRef.current.pause();
      }
  };

  const handleSliderSeek = (value: number[]) => {
    if (videoRef.current && duration) {
      videoRef.current.currentTime = (value[0] / 100) * duration;
    }
  };

  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds) || timeInSeconds === 0) return '00:00';
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };
  
  const VolumeIcon = isMuted || volume === 0 ? VolumeX : volume > 0.5 ? Volume2 : Volume1;

  return (
    <Card className="w-full overflow-hidden shadow-2xl shadow-primary/20">
      <CardContent className="p-0">
        <div className="relative aspect-video bg-black group">
          <video ref={videoRef} src={videoUrl} className="w-full h-full" onClick={handlePlayPause} />
          <audio ref={audio1Ref} src={audio1Url} />
          <audio ref={audio2Ref} src={audio2Url} />
          
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
             <Button variant="ghost" size="icon" className="w-20 h-20 rounded-full bg-background/50 text-foreground pointer-events-auto" onClick={handlePlayPause}>
                {isPlaying ? <Pause className="w-10 h-10" /> : <Play className="w-10 h-10" />}
             </Button>
          </div>
        </div>

        <div className="p-4 space-y-4 bg-card/80 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <span className="text-sm font-mono text-muted-foreground w-12 text-center">{formatTime(progress * duration / 100)}</span>
            <Slider
              value={[progress]}
              onValueChange={handleSliderSeek}
              className="w-full"
            />
            <span className="text-sm font-mono text-muted-foreground w-12 text-center">{formatTime(duration)}</span>
          </div>

          <div className="flex justify-between items-center">
             <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={handlePlayPause}>
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </Button>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <VolumeIcon className="w-5 h-5" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-40 p-2">
                     <Slider
                        defaultValue={[75]}
                        value={[isMuted ? 0 : volume * 100]}
                        onValueChange={(v) => {
                            setVolume(v[0] / 100);
                            setIsMuted(v[0] === 0);
                        }}
                    />
                  </PopoverContent>
                </Popover>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={selectedAudio === 'audio1' ? 'default' : 'outline'}
                onClick={() => setSelectedAudio('audio1')}
                className="transition-all"
              >
                <Heart className={cn("mr-2 h-4 w-4", selectedAudio === 'audio1' && "fill-current")} />
                Narration 1
              </Button>
              <Button
                variant={selectedAudio === 'audio2' ? 'default' : 'outline'}
                onClick={() => setSelectedAudio('audio2')}
                className="transition-all"
              >
                <Heart className={cn("mr-2 h-4 w-4", selectedAudio === 'audio2' && "fill-current")} />
                Narration 2
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
