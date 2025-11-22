import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Search, Navigation, Phone, Star, MapPin, Loader2, AlertCircle, ShieldCheck, Mail, Award, Calendar, Globe, CheckCircle2, Building2, Mic, Share2, Box, Image as ImageIcon, Linkedin, Twitter, Facebook, Instagram, MessageCircle } from 'lucide-react';
import { SearchResult } from '../types';
import { ContactModal } from './ContactModal';

// --- Constants ---
const GEMINI_MAPS_MODEL = 'gemini-2.5-flash';

// --- Components ---
const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 animate-pulse h-full flex flex-col relative overflow-hidden">
    {/* Shimmer Effect */}
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-slate-200/50 to-transparent"></div>
    
    <div className="flex justify-between items-start gap-4 mb-6 relative">
      <div className="h-8 bg-slate-200 rounded-lg w-3/4"></div>
      <div className="h-10 w-10 bg-slate-200 rounded-lg"></div>
    </div>
    <div className="space-y-3 flex-1 relative">
      <div className="h-4 bg-slate-200 rounded w-1/3"></div>
      <div className="h-24 bg-slate-100 rounded-xl w-full mt-4 border border-slate-200"></div>
      <div className="grid grid-cols-3 gap-2 mt-4">
         <div className="aspect-square bg-slate-200 rounded-lg"></div>
         <div className="aspect-square bg-slate-200 rounded-lg"></div>
         <div className="aspect-square bg-slate-200 rounded-lg"></div>
      </div>
    </div>
    <div className="mt-6 pt-4 border-t border-slate-200 grid grid-cols-2 gap-2 relative">
       <div className="h-10 bg-slate-200 rounded-xl"></div>
       <div className="h-10 bg-slate-200 rounded-xl"></div>
    </div>
  </div>
);

export const BusinessFinder: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [businessType, setBusinessType] = useState('Supplier');
  
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<{title: string} | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.warn("Geolocation permission denied or error", error);
          setLocationError("Location access needed for nearby results.");
        }
      );
    }
  }, []);

  const handleOpenContactModal = (place: {title: string}) => {
    setSelectedBusiness(place);
    setIsContactModalOpen(true);
  };

  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      alert("Voice input is not supported in this browser.");
    }
  };

  const handleShare = async (title: string, uri: string) => {
    const shareData = {
      title: `Nexstartz Finder: ${title}`,
      text: `Check out this verified ${businessType}: ${title}`,
      url: uri
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share canceled', err);
      }
    } else {
      navigator.clipboard.writeText(`${title} - ${uri}`);
      alert("Link copied to clipboard!");
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setResult(null);
    setSearchError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      let prompt = `Act as a B2B supply chain expert generating leads. Find trustworthy, high-quality ${businessType}s for "${query}". For each business found, try to also find their official website URL and a publicly available contact email and include it in your summary text.`;
      if (location) {
        prompt += ` My current location is latitude ${location.lat}, longitude ${location.lng}. Prioritize verified businesses that are physically close to this location.`;
      } else {
        prompt += ` Since location is unavailable, prioritize businesses with the highest ratings and most positive online presence.`;
      }
      prompt += ` Your primary goal is to identify credible partners. Use the available tools to find businesses with strong trust signals like a verifiable physical address and positive customer reviews. Only return businesses that meet a high standard of trust and relevance.`;


      const config: any = {
        tools: [{ googleMaps: {} }],
      };

      if (location) {
        config.toolConfig = {
          retrievalConfig: {
            latLng: {
              latitude: location.lat,
              longitude: location.lng
            }
          }
        };
      }

      const response = await ai.models.generateContent({
        model: GEMINI_MAPS_MODEL,
        contents: prompt,
        config: config
      });

      const text = response.text;
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;

      setResult({ text, groundingChunks });

    } catch (error) {
      console.error("Search failed", error);
      setSearchError("An error occurred while searching. Please try again.");
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
    <div className="p-4 md:p-8 max-w-7xl mx-auto flex flex-col">
      <form onSubmit={handleSearch} className="bg-white p-4 sm:p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 mb-10">
        <div className="flex flex-col gap-6">
            
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide">
             {['Manufacturer', 'Distributor', 'Wholesale', 'Retail', 'Supplier', 'Buyer'].map((type) => (
               <button
                 key={type}
                 type="button"
                 onClick={() => setBusinessType(type)}
                 className={`px-6 py-3 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300
                   ${businessType === type 
                     ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-slate-900 shadow-lg shadow-gold-500/20 scale-105' 
                     : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800'}`}
               >
                 {type}
               </button>
             ))}
          </div>

          <div className="relative group">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={isListening ? "Listening..." : "Search for leads"}
              className={`w-full pl-14 pr-14 py-5 bg-slate-100 border-2 rounded-2xl focus:outline-none transition-all placeholder-slate-400 text-lg font-medium text-slate-900
                ${isListening 
                  ? 'border-gold-400 ring-4 ring-gold-500/20 animate-pulse' 
                  : 'border-slate-200 shadow-inner shadow-slate-200/50 focus:border-gold-400 focus:ring-4 focus:ring-gold-500/10 group-hover:border-gold-500/50'}`}
            />
            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-slate-400 w-6 h-6 group-hover:text-gold-400 transition-colors" />
            
            <button
              type="button"
              onClick={handleVoiceInput}
              className={`absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-xl transition-all
                ${isListening 
                  ? 'bg-gold-500 text-white shadow-lg shadow-gold-500/20 scale-110' 
                  : 'text-slate-500 hover:bg-slate-200 hover:text-gold-400'}`}
            >
              <Mic className={`w-5 h-5 ${isListening ? 'animate-bounce' : ''}`} />
            </button>
          </div>

          {locationError && (
            <div className="flex items-center gap-2 text-amber-700 text-sm bg-amber-100 p-4 rounded-xl border border-amber-200">
              <AlertCircle className="w-4 h-4" />
              <span>{locationError}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="w-full bg-gradient-to-r from-gold-600 to-gold-500 text-slate-900 font-bold py-4 rounded-2xl hover:shadow-xl hover:shadow-gold-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 text-lg active:scale-[0.99]"
          >
            {isLoading ? (
                <>
                    <Loader2 className="animate-spin w-6 h-6" />
                    Generating Leads...
                </>
            ) : (
                <>
                    <CheckCircle2 className="w-6 h-6" />
                    Generate Real-time Leads
                </>
            )}
          </button>
        </div>
      </form>

      {searchError && (
        <div className="p-4 bg-red-100 text-red-700 border border-red-200 rounded-xl flex items-center gap-2 mb-8 animate-fade-in">
          <AlertCircle className="w-5 h-5" />
          <span>{searchError}</span>
        </div>
      )}

      {isLoading ? (
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 animate-fade-in">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
         </div>
      ) : (
        result && (
          <div className="space-y-8 animate-fade-in flex-1">
            {result.groundingChunks && result.groundingChunks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {result.groundingChunks.map((chunk, idx) => {
                  if (!chunk.maps) return null;
                  const place = chunk.maps;
                  const hasReviews = place.placeAnswerSources && place.placeAnswerSources.length > 0 && place.placeAnswerSources[0].reviewSnippets && place.placeAnswerSources[0].reviewSnippets.length > 0;

                  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
                  let emailVerified = false;
                  if (result && result.text) {
                      const escapedTitle = place.title.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
                      const placeNameRegex = new RegExp(escapedTitle, 'i');
                      const paragraphs = result.text.split(/\n\s*\n/);
                      for (const paragraph of paragraphs) {
                          if (placeNameRegex.test(paragraph) && emailRegex.test(paragraph)) {
                              emailVerified = true;
                              break;
                          }
                      }
                  }

                  const websiteRegex = /(https?:\/\/[^\s]+)/;
                  let websiteUrl: string | null = null;
                  if (result && result.text) {
                      const escapedTitle = place.title.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
                      const placeNameRegex = new RegExp(escapedTitle, 'i');
                      const paragraphs = result.text.split(/\n\s*\n/);
                      for (const paragraph of paragraphs) {
                          if (placeNameRegex.test(paragraph)) {
                              const match = paragraph.match(websiteRegex);
                              if (match) {
                                  websiteUrl = match[0];
                                  // Clean up trailing characters if any
                                  const lastChar = websiteUrl.charAt(websiteUrl.length - 1);
                                  if (['.', ',', ')'].includes(lastChar)) {
                                      websiteUrl = websiteUrl.slice(0, -1);
                                  }
                                  break;
                              }
                          }
                      }
                  }
                  
                   const trustFactors = [
                    { label: 'Direct Location Verified', verified: true, action: null, tooltip: null, showActionWhenVerified: false },
                    { label: 'Official Website', verified: !!websiteUrl, action: websiteUrl || `https://www.google.com/search?q=${encodeURIComponent(place.title + " official website")}`, actionLabel: websiteUrl ? 'Visit' : 'Search', tooltip: 'An official website is a strong trust signal.', showActionWhenVerified: true },
                    { label: 'Customer Reviews Found', verified: hasReviews, action: null, tooltip: null, showActionWhenVerified: false },
                    { label: 'Email Contact', verified: emailVerified, action: `https://www.google.com/search?q=${encodeURIComponent(place.title + " contact email")}`, tooltip: 'Search for a verified contact email on their official website.', showActionWhenVerified: false },
                    { label: 'Social Media Presence', verified: false, action: `https://www.google.com/search?q=${encodeURIComponent(place.title + " social media profiles")}`, tooltip: 'A strong social media presence can be a positive trust signal.', showActionWhenVerified: false },
                    { label: 'Certifications', verified: false, action: `https://www.google.com/search?q=${encodeURIComponent(place.title + " business registration license ISO certification")}`, tooltip: 'Check for industry-standard certifications or licenses.', showActionWhenVerified: false },
                    { label: 'Years in Business', verified: false, action: `https://www.google.com/search?q=${encodeURIComponent(place.title + " founded date years in business")}`, tooltip: 'Established businesses often have a longer track record.', showActionWhenVerified: false },
                ];

                  return (
                    <div key={idx} className="bg-white rounded-2xl border border-slate-200 shadow-lg shadow-slate-200/40 hover:shadow-xl hover:shadow-gold-500/5 transition-all duration-300 flex flex-col h-full group overflow-hidden hover:border-gold-500/30">
                      {/* Card Header */}
                      <div className="p-6 border-b border-slate-200 bg-white">
                        <div className="flex justify-between items-start gap-4">
                          <h3 className="font-bold text-xl text-slate-800 leading-tight group-hover:text-gold-600 transition-colors">{place.title}</h3>
                          <div className="flex flex-col gap-2">
                             <div className="bg-slate-100 p-2 rounded-lg shadow-sm border border-slate-200 self-end">
                                  <Building2 className="w-5 h-5 text-gold-500" />
                             </div>
                             <button 
                               onClick={() => handleShare(place.title, place.uri)}
                               className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-gold-500 transition-colors"
                               title="Share Lead"
                             >
                                <Share2 className="w-4 h-4" />
                             </button>
                          </div>
                        </div>
                      </div>

                      {/* Body Content */}
                      <div className="p-6 flex-1">
                        <div className="mb-6">
                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Digital Showroom</h4>
                            <div className="grid grid-cols-3 gap-3">
                                <div className="aspect-square bg-slate-50 rounded-xl border border-slate-200 flex flex-col items-center justify-center text-slate-500 p-2 text-center">
                                    <Box className="w-5 h-5 mb-1.5" />
                                    <span className="text-[9px] font-medium leading-tight">Main<br/>Product</span>
                                </div>
                                <div className="aspect-square bg-slate-50 rounded-xl border border-slate-200 flex flex-col items-center justify-center text-slate-500 p-2 text-center">
                                     <Box className="w-5 h-5 mb-1.5" />
                                    <span className="text-[9px] font-medium leading-tight">Catalog<br/>Item</span>
                                </div>
                                <a href={`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(place.title + " products portfolio")}`} target="_blank" rel="noreferrer" className="aspect-square bg-gradient-to-br from-gold-500/10 to-white rounded-xl border border-gold-500/20 flex flex-col items-center justify-center text-gold-500 hover:shadow-md hover:scale-105 transition-all cursor-pointer group/item relative overflow-hidden hover:border-gold-500/50">
                                    <div className="absolute inset-0 bg-gold-500 opacity-0 group-hover/item:opacity-10 transition-opacity"></div>
                                    <ImageIcon className="w-5 h-5 mb-1.5" />
                                    <span className="text-[9px] font-bold">View<br/>Gallery</span>
                                </a>
                            </div>
                        </div>

                        {hasReviews && place.placeAnswerSources?.[0]?.reviewSnippets?.[0] ? (
                          <div className="bg-slate-100 p-4 rounded-xl border-l-4 border-gold-400 mb-2">
                            <div className="flex items-center gap-1 mb-2 text-gold-600 text-[10px] font-bold uppercase tracking-wide">
                                <Star className="w-3 h-3 fill-current" />
                                Customer Insight
                            </div>
                            <p className="text-sm text-slate-600 italic line-clamp-3 leading-relaxed">
                              "{place.placeAnswerSources[0].reviewSnippets[0].reviewText}"
                            </p>
                          </div>
                        ) : (
                          <div className="text-slate-400 text-sm italic py-2 border-t border-slate-200 pt-4">No review highlights available.</div>
                        )}
                      </div>
                      
                      <div className="mt-auto bg-slate-50 p-5 border-t border-slate-200">
                         <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 mb-4">
                            <ShieldCheck className="w-4 h-4 text-gold-500" />
                            Trust &amp; Verification
                        </h4>
                        <div className="space-y-3 text-sm">
                            {trustFactors.map((factor: any, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2.5" title={!factor.verified && factor.tooltip ? factor.tooltip : undefined}>
                                        {factor.verified ? (
                                            <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                                        ) : (
                                            <div className="w-4 h-4 flex items-center justify-center shrink-0">
                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                                            </div>
                                        )}
                                        <span className={factor.verified ? 'text-slate-800 font-medium' : 'text-slate-500'}>
                                            {factor.label}
                                        </span>
                                    </div>
                                    {factor.action && (!!factor.showActionWhenVerified || !factor.verified) && (
                                        <a href={factor.action} target="_blank" rel="noreferrer" className="text-xs font-bold text-gold-600 hover:text-gold-700 hover:underline transition-colors">
                                            {factor.actionLabel || 'Verify'}
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                        
                        <div className="flex gap-3 mt-6">
                            <a href={place.uri} target="_blank" rel="noreferrer" className="flex-1 bg-slate-800 text-white py-3 px-4 rounded-xl text-sm font-bold text-center hover:bg-slate-900 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-black/20">
                              <Navigation className="w-4 h-4" /> Navigate
                            </a>
                            <button onClick={() => handleOpenContactModal(place)} className="flex-1 border-2 border-gold-500 text-gold-600 bg-gold-500/10 py-3 px-4 rounded-xl text-sm font-bold hover:bg-gold-500/20 hover:border-gold-500/50 transition-all flex items-center justify-center gap-2">
                              <Mail className="w-4 h-4" /> Contact Now
                            </button>
                         </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
               <div className="text-center p-8 sm:p-12 bg-white rounded-3xl border border-slate-200">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
                      <Search className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">No verified leads found nearby</h3>
                  <p className="text-slate-500 mt-2">Try adjusting your search term or checking a wider area.</p>
               </div>
            )}
          </div>
        )
      )}
    </div>
    {selectedBusiness && <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} businessName={selectedBusiness.title} />}
    </>
  );
};
