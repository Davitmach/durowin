'use client'
'use client'
import { useEffect, useRef, useState } from 'react';
import { useSoundStore } from './store';

type SoundType = 'start' | 'end' | 'noTon' | 'win' | 'winTon' | 'game' |'clickSuccess'|'clickFail'|'winFlame'|'startFlame';

const soundMap: Record<SoundType, string> = {
  start: '/start.mp3',
  end: '/end.mp3',
  noTon: '/noTon.mp3',
  win: '/win.mp3',
  winTon: '/winTon.mp3',
  game: '/prokrut.mp3',
  clickSuccess:'/clickSuccess.mp3',
  clickFail:'/clickFail.mp3',
  winFlame:'/winFlame.mp3',
  startFlame:'/flamesStart.mp3'
};

export const useSoundPlayer = () => {
  const { sound } = useSoundStore();
  const audioContextRef = useRef<AudioContext | null>(null);
  const bufferMapRef = useRef<Map<SoundType, AudioBuffer>>(new Map());

  useEffect(() => {
    audioContextRef.current = new AudioContext();

    const loadSound = async (type: SoundType, url: string) => {
      try {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContextRef.current!.decodeAudioData(arrayBuffer);
        bufferMapRef.current.set(type, audioBuffer);
      } catch (err) {
        console.warn(`Failed to load sound ${type}:`, err);
      }
    };

    // Предзагрузка всех звуков
    Object.entries(soundMap).forEach(([type, url]) => {
      loadSound(type as SoundType, url);
    });

    return () => {
      audioContextRef.current?.close();
    };
  }, []);

  const play = (type: SoundType) => {
    if (!sound) return;
    const context = audioContextRef.current;
    const buffer = bufferMapRef.current.get(type);
    if (!context || !buffer) return;

    const source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);
    source.start();
  };

  return { play };
};





  export const useLoopSound = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioContextRef = useRef<AudioContext | null>(null);
    const bufferRef = useRef<AudioBuffer | null>(null);
    const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  
    useEffect(() => {
      audioContextRef.current = new AudioContext();
  
      // Предзагрузка и декодирование звука
      fetch('/prokrut.mp3')
        .then(res => res.arrayBuffer())
        .then(data => audioContextRef.current!.decodeAudioData(data))
        .then(decoded => {
          bufferRef.current = decoded;
        })
        .catch(err => {
          console.warn('Failed to load loop sound:', err);
        });
  
      return () => {
        stop();
        audioContextRef.current?.close();
      };
    }, []);
  
    const start = () => {
      if (!bufferRef.current || !audioContextRef.current) return;
  
      stop(); // на всякий случай остановим старый источник
  
      const source = audioContextRef.current.createBufferSource();
      source.buffer = bufferRef.current;
      source.loop = true;
      source.connect(audioContextRef.current.destination);
      source.start(0);
  
      sourceRef.current = source;
      setIsPlaying(true);
    };
  
    const stop = () => {
      sourceRef.current?.stop();
      sourceRef.current?.disconnect();
      sourceRef.current = null;
      setIsPlaying(false);
    };
  
    return { isPlaying, start, stop };
  };
  
  