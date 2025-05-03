'use client'
export const useSoundPlayer = () => {
  const {sound} = useSoundStore()
    const play = (type: 'start' | 'end' | 'noTon' | 'win' | 'winTon'|'game') => {
      if(sound == false)return
      const soundMap: Record<string, string> = {
        start: '/start.mp3',
        end: '/end.mp3',
        noTon: '/noTon.mp3',
        win: '/win.mp3',
        winTon: '/winTon.mp3',
        game:'/prokrut.mp3'
      };
  
      const src = soundMap[type];
      if (!src) return;
  
      const audio = new Audio(src);
      audio.play().catch((e) => {
        console.warn(`Failed to play sound ${type}:`, e);
      });
    };
  
    return { play };
  };


  import { useEffect, useRef, useState } from 'react';
import { useSoundStore } from './store';



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
  
  