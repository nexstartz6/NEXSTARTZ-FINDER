import React, { useEffect, useRef, useState } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { Mic, MicOff, Activity, AlertCircle } from 'lucide-react';
import { decode, decodeAudioData, createPcmBlob } from '../utils/audioUtils';

const LIVE_MODEL = 'gemini-2.5-flash-native-audio-preview-09-2025';

export const LiveAssistant: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState<string>('Ready to connect');
  const [volume, setVolume] = useState(0);
  
  // Refs for cleanup and state management inside callbacks
  const sessionRef = useRef<Promise<any> | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const stopSession = () => {
    setStatus('Disconnecting...');
    
    // Clean up audio sources
    sourcesRef.current.forEach(source => {
      try { source.stop(); } catch (e) {}
    });
    sourcesRef.current.clear();

    // Stop Microphone
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    
    // Close Contexts
    if (inputContextRef.current) {
      inputContextRef.current.close().catch(console.error);
      inputContextRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(console.error);
      audioContextRef.current = null;
    }

    sessionRef.current = null;
    setIsActive(false);
    setStatus('Ready to connect');
    setVolume(0);
  };

  const startSession = async () => {
    if (!navigator.onLine) {
      setStatus("No internet connection");
      return;
    }

    try {
      setStatus('Initializing audio...');
      
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      
      await outputCtx.resume();
      await inputCtx.resume();

      inputContextRef.current = inputCtx;
      audioContextRef.current = outputCtx;
      nextStartTimeRef.current = 0;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      setStatus('Connecting...');

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const sessionPromise = ai.live.connect({
        model: LIVE_MODEL,
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
          },
          systemInstruction: "You are an expert supply chain consultant. Help the user find manufacturers, distributors, and suppliers. Be professional, concise, and helpful. If asked about location, assume the user is looking for local businesses.",
        },
        callbacks: {
          onopen: () => {
            setStatus('Listening...');
            
            const source = inputCtx.createMediaStreamSource(stream);
            const processor = inputCtx.createScriptProcessor(4096, 1, 1);
            
            sourceRef.current = source;
            processorRef.current = processor;

            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              
              let sum = 0;
              for(let i = 0; i < inputData.length; i++) sum += inputData[i] * inputData[i];
              setVolume(Math.sqrt(sum / inputData.length) * 100); 

              const pcmBlob = createPcmBlob(inputData);
              
              if (sessionRef.current) {
                sessionRef.current.then(session => {
                   session.sendRealtimeInput({ media: pcmBlob });
                }).catch(err => {});
              }
            };

            source.connect(processor);
            processor.connect(inputCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            const outputCtx = audioContextRef.current;
            if (!outputCtx) return;

            const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            
            if (base64Audio) {
               try {
                 nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);

                 const audioBuffer = await decodeAudioData(
                   decode(base64Audio),
                   outputCtx,
                   24000,
                   1
                 );

                 const source = outputCtx.createBufferSource();
                 source.buffer = audioBuffer;
                 source.connect(outputCtx.destination);
                 
                 source.addEventListener('ended', () => {
                   sourcesRef.current.delete(source);
                 });

                 source.start(nextStartTimeRef.current);
                 nextStartTimeRef.current += audioBuffer.duration;
                 sourcesRef.current.add(source);
               } catch (err) {
                 console.error("Error decoding audio", err);
               }
            }

            if (message.serverContent?.interrupted) {
               sourcesRef.current.forEach(s => {
                 try { s.stop(); } catch(e) {}
               });
               sourcesRef.current.clear();
               nextStartTimeRef.current = outputCtx.currentTime;
            }
          },
          onclose: () => {
             if (isActive) {
                setStatus('Disconnected');
                stopSession();
             }
          },
          onerror: (e) => {
             console.error("Live API Error", e);
             setStatus('Connection error. Please try again.');
             stopSession();
          }
        }
      });

      sessionRef.current = sessionPromise;
      setIsActive(true);

    } catch (error) {
      console.error("Failed to start session", error);
      setStatus('Failed to connect. Check network/permissions.');
      stopSession();
    }
  };

  useEffect(() => {
    return () => {
      if (isActive) {
        stopSession();
      }
    };
  }, [isActive]);

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <div className="mb-6 sm:mb-8">
        <div className={`relative w-40 h-40 sm:w-48 sm:h-48 rounded-full flex items-center justify-center transition-all duration-500 ${isActive ? 'bg-gold-500/10 border-4 border-gold-500/20 shadow-[0_0_60px_rgba(250,204,21,0.2)]' : 'bg-slate-100 border-4 border-slate-200'}`}>
           {isActive ? (
             <div className="absolute inset-0 rounded-full border-4 border-gold-400 opacity-50 animate-ping"></div>
           ) : null}
           
           <Activity className={`w-16 h-16 sm:w-20 sm:h-20 ${isActive ? 'text-gold-500' : 'text-slate-400'}`} 
             style={{ 
               transform: isActive ? `scale(${1 + Math.min(volume / 50, 0.5)})` : 'scale(1)',
               transition: 'transform 0.1s ease-out'
             }} 
           />
        </div>
      </div>

      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
        {isActive ? 'Live Assistant Active' : 'Start Voice Conversation'}
      </h2>
      <p className="text-slate-500 mb-8 sm:mb-12 h-6 flex items-center justify-center gap-2">
         {status === 'Connection error. Please try again.' && <AlertCircle className="w-4 h-4 text-red-500" />}
         {status}
      </p>

      <button
        onClick={isActive ? stopSession : startSession}
        className={`
          group relative px-8 py-4 rounded-full font-bold text-lg flex items-center gap-3 transition-all duration-300 shadow-lg
          ${isActive 
            ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/30' 
            : 'bg-gradient-to-r from-gold-600 to-gold-500 text-slate-900 hover:shadow-gold-500/20 hover:-translate-y-1'}
        `}
      >
        {isActive ? (
          <>
            <MicOff className="w-6 h-6" /> End Session
          </>
        ) : (
          <>
            <Mic className="w-6 h-6 group-hover:animate-bounce" /> Start Voice Chat
          </>
        )}
      </button>
    </div>
  );
};