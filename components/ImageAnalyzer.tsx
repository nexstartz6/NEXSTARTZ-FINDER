import React, { useState, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Upload, X, Scan, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const VISION_MODEL = 'gemini-3-pro-preview';

export const ImageAnalyzer: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setAnalysis(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!image) return;

    setIsLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Extract base64 data (remove prefix)
      const base64Data = image.split(',')[1];

      const response = await ai.models.generateContent({
        model: VISION_MODEL,
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: 'image/jpeg', // Assuming jpeg/png
                data: base64Data
              }
            },
            {
              text: "Analyze this image. If it's a business card, extract name, phone, address, and email. If it's a product, identify it and suggest potential supplier categories. If it's a storefront, describe the business type. Format the output clearly with sections using markdown-like headers (**Header**) and bolded list items (- **Key:** Value)."
            }
          ]
        }
      });

      setAnalysis(response.text);

    } catch (error) {
      console.error("Analysis error", error);
      setAnalysis("Failed to analyze image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const clear = () => {
    setImage(null);
    setAnalysis(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const renderAnalysis = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim() !== '');
    return lines.map((line, index) => {
      // Bold headers
      if (line.startsWith('**') && line.endsWith('**')) {
        // FIX: Replaced `replaceAll` with `replace` using a global regex to support older TypeScript target libraries.
        return <h3 key={index} className="text-lg font-bold text-gold-600 mt-4 mb-2">{line.replace(/\*\*/g, '')}</h3>;
      }
      // Key-value list items
      if (line.match(/^(\s*?)(-|\*)\s*?\*\*(.*?):\*\*/)) {
          const parts = line.replace(/(- |\* )/, '').split(':');
          // FIX: Replaced `replaceAll` with `replace` using a global regex to support older TypeScript target libraries.
          const key = parts[0]?.replace(/\*\*/g, '').trim();
          const value = parts.slice(1).join(':').trim();
          return (
              <div key={index} className="flex flex-col sm:flex-row sm:items-start border-b border-slate-200 py-3">
                  <span className="w-full sm:w-1/3 mb-1 sm:mb-0 text-slate-500 font-medium">{key}</span>
                  <span className="w-full sm:w-2/3 text-slate-800">{value}</span>
              </div>
          );
      }
      // Regular paragraphs
      return <p key={index} className="text-slate-600 mb-2">{line}</p>;
    });
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
       <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/60 border border-slate-200 p-6">
         {!image ? (
           <div 
             onClick={() => fileInputRef.current?.click()}
             className="border-2 border-dashed border-slate-300 rounded-xl p-6 sm:p-12 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100/50 hover:border-gold-500/50 transition-colors group"
           >
             <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-gold-500/10 transition-transform">
                <Upload className="w-8 h-8 text-slate-500 group-hover:text-gold-500" />
             </div>
             <p className="font-medium text-slate-800">Click to upload image</p>
             <p className="text-xs text-slate-500 mt-1">JPG, PNG supported</p>
           </div>
         ) : (
           <div className="relative rounded-xl overflow-hidden bg-slate-100 mb-6 max-h-[400px] flex justify-center border border-slate-200">
             <img src={image} alt="Preview" className="object-contain h-full" />
             <button 
               onClick={clear}
               className="absolute top-2 right-2 bg-white/50 text-slate-800 p-2 rounded-full hover:bg-white/80 transition-colors"
             >
               <X className="w-5 h-5" />
             </button>
           </div>
         )}

         <input 
           type="file" 
           ref={fileInputRef} 
           onChange={handleFileChange} 
           accept="image/*" 
           className="hidden" 
         />

         {image && !analysis && (
           <button
             onClick={analyzeImage}
             disabled={isLoading}
             className="w-full bg-gold-500 text-slate-900 py-4 rounded-xl font-bold hover:bg-gold-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
           >
             {isLoading ? <Loader2 className="animate-spin" /> : <Scan className="w-5 h-5" />}
             {isLoading ? 'Analyzing...' : 'Scan & Analyze'}
           </button>
         )}
       </div>

       {analysis && (
         <div className="mt-8 bg-white p-6 rounded-2xl shadow-lg shadow-slate-200/60 border border-slate-200 animate-fade-in">
           <div className="flex items-center gap-2 mb-4 text-green-600 font-bold">
             <CheckCircle className="w-5 h-5" />
             Analysis Complete
           </div>
           <div>
             {renderAnalysis(analysis)}
           </div>
         </div>
       )}
    </div>
  );
};