"use client";

import { useState, useRef, useEffect } from 'react';
import { Heart, Play, Pause, Volume1, Volume2, VolumeX, Music, Maximize, Minimize } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Label } from './ui/label';

type AudioSource = {
  name: string;
  url: string;
};

type LoveFilmPlayerProps = {
  videoUrl: string;
  voiceoverSources: AudioSource[];
  backgroundMusicSources: AudioSource[];
};

export default function LoveFilmPlayer({ videoUrl, voiceoverSources, backgroundMusicSources }: LoveFilmPlayerProps) {
  const playerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const voiceoverAudioRefs = useRef<(HTMLAudioElement | null)[]>([]);
  const backgroundMusicAudioRefs = useRef<(HTMLAudioElement | null)[]>([]);
  
  const [selectedVoiceoverIndex, setSelectedVoiceoverIndex] = useState(1);
  const [selectedBackgroundMusicIndex, setSelectedBackgroundMusicIndex] = useState(1);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const [voiceoverVolume, setVoiceoverVolume] = useState(0.9);
  const [backgroundMusicVolume, setBackgroundMusicVolume] = useState(0.03);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    voiceoverAudioRefs.current = voiceoverAudioRefs.current.slice(0, voiceoverSources.length);
    backgroundMusicAudioRefs.current = backgroundMusicAudioRefs.current.slice(0, backgroundMusicSources.length);
  }, [voiceoverSources, backgroundMusicSources]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const activeVoiceover = voiceoverAudioRefs.current[selectedVoiceoverIndex];
    const activeBackgroundMusic = backgroundMusicAudioRefs.current[selectedBackgroundMusicIndex];

    voiceoverAudioRefs.current.forEach((audio, index) => {
      if (index !== selectedVoiceoverIndex && audio) audio.pause();
    });

    backgroundMusicAudioRefs.current.forEach((audio, index) => {
        if (index !== selectedBackgroundMusicIndex && audio) audio.pause();
    });

    const syncAndPlay = () => {
      if (activeVoiceover) {
        if (video.currentTime !== activeVoiceover.currentTime) {
          activeVoiceover.currentTime = video.currentTime;
        }
        activeVoiceover.play();
      }
      if (activeBackgroundMusic && activeBackgroundMusic.src) {
        if (video.currentTime !== activeBackgroundMusic.currentTime) {
            activeBackgroundMusic.currentTime = video.currentTime;
        }
        activeBackgroundMusic.play();
      }
      setIsPlaying(true);
    };

    const syncAndPause = () => {
      activeVoiceover?.pause();
      activeBackgroundMusic?.pause();
      setIsPlaying(false);
    };

    const handleSeek = () => {
      const currentTime = video.currentTime;
      if (activeVoiceover) activeVoiceover.currentTime = currentTime;
      if (activeBackgroundMusic) activeBackgroundMusic.currentTime = currentTime;
    };
    
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
  }, [selectedVoiceoverIndex, selectedBackgroundMusicIndex]);

  useEffect(() => {
      voiceoverAudioRefs.current.forEach(audio => {
          if (audio) audio.volume = isMuted ? 0 : voiceoverVolume;
      });
  }, [voiceoverVolume, isMuted]);

  useEffect(() => {
    backgroundMusicAudioRefs.current.forEach(audio => {
        if (audio) audio.volume = isMuted ? 0 : backgroundMusicVolume;
    });
}, [backgroundMusicVolume, isMuted]);


  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handlePlayPause = () => {
      if (videoRef.current) {
          videoRef.current.paused ? videoRef.current.play() : videoRef.current.pause();
      }
  };

  const handleSliderSeek = (value: number[]) => {
    if (videoRef.current && duration) {
        const seekTime = (value[0] / 100) * duration;
        videoRef.current.currentTime = seekTime;
        
        const activeVoiceover = voiceoverAudioRefs.current[selectedVoiceoverIndex];
        const activeBackgroundMusic = backgroundMusicAudioRefs.current[selectedBackgroundMusicIndex];
        if (activeVoiceover) activeVoiceover.currentTime = seekTime;
        if (activeBackgroundMusic) activeBackgroundMusic.currentTime = seekTime;
        
        setProgress(value[0]);
      }
  };

  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds) || timeInSeconds === 0) return '00:00';
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };
  
  const toggleFullscreen = () => {
    if (!playerRef.current) return;
    if (!document.fullscreenElement) {
      playerRef.current.requestFullscreen().catch(err => alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`));
    } else {
      document.exitFullscreen();
    }
  };

  const VolumeIcon = isMuted || (voiceoverVolume === 0 && backgroundMusicVolume === 0) ? VolumeX : voiceoverVolume > 0.5 || backgroundMusicVolume > 0.5 ? Volume2 : Volume1;

  return (
    <Card ref={playerRef} className="w-full overflow-hidden shadow-2xl shadow-primary/20 bg-card">
      <CardContent className="p-0">
        <div className="relative aspect-video bg-black group">
          <video ref={videoRef} src={videoUrl} className="w-full h-full" onClick={handlePlayPause} muted />
          {voiceoverSources.map((source, index) => (
            source.url ? <audio key={`vo-${index}`} ref={el => {voiceoverAudioRefs.current[index] = el}} src={source.url} /> : null
          ))}
          {backgroundMusicSources.map((source, index) => (
            source.url ? <audio key={`bgm-${index}`} ref={el => {backgroundMusicAudioRefs.current[index] = el}} src={source.url} loop /> : null
          ))}
          
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

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
             <div className="flex items-center self-start gap-4">
                <Button variant="ghost" size="icon" onClick={handlePlayPause}>
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </Button>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <VolumeIcon className="w-5 h-5" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56 p-4 space-y-4">
                    <div className='space-y-2'>
                        <Label htmlFor="voiceover-volume">Voiceover</Label>
                        <Slider
                            id="voiceover-volume"
                            value={[isMuted ? 0 : voiceoverVolume * 100]}
                            onValueChange={(v) => {
                                setVoiceoverVolume(v[0] / 100);
                                if (v[0] > 0 && isMuted) setIsMuted(false);
                            }}
                        />
                    </div>
                     <div className='space-y-2'>
                        <Label htmlFor="bgm-volume">Background Music</Label>
                        <Slider
                            id="bgm-volume"
                            value={[isMuted ? 0 : backgroundMusicVolume * 100]}
                            onValueChange={(v) => {
                                setBackgroundMusicVolume(v[0] / 100);
                                if (v[0] > 0 && isMuted) setIsMuted(false);
                            }}
                        />
                     </div>
                     <Button variant="outline" size="sm" className="w-full" onClick={() => setIsMuted(!isMuted)}>
                        {isMuted ? "Unmute All" : "Mute All"}
                     </Button>
                  </PopoverContent>
                </Popover>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-2">
              <div className="flex flex-wrap justify-center items-center gap-1 border p-1 rounded-md">
                {voiceoverSources.map((source, index) => (
                  <Button
                    key={index}
                    variant={selectedVoiceoverIndex === index ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setSelectedVoiceoverIndex(index)}
                    className="transition-all"
                  >
                    <Heart className={cn("mr-2 h-4 w-4", selectedVoiceoverIndex === index && "fill-current")} />
                    {source.name}
                  </Button>
                ))}
              </div>
               <div className="flex flex-wrap justify-center items-center gap-1 border p-1 rounded-md">
                {backgroundMusicSources.map((source, index) => (
                  <Button
                    key={index}
                    variant={selectedBackgroundMusicIndex === index ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setSelectedBackgroundMusicIndex(index)}
                    className="transition-all"
                  >
                    <Music className={cn("mr-2 h-4 w-4", selectedBackgroundMusicIndex === index && "fill-current")} />
                    {source.name}
                  </Button>
                ))}\
              </div>
            </div>

            <div className="flex items-center self-start sm:self-center">
                <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
                    {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
