"use client";

import { useState, useEffect } from "react";
import ImageUploader from "@/components/ImageUploader";

type AnalysisResult = {
  season: string;
  undertone: string;
  description: string;
  colors: string[];
  jewelry: string;
  makeup: string;
  hairColor: string;
  shoppingUrls: { brand: string, url: string }[];
  faceShape: string;
  makeupTips: { contour: string, blush: string, concealer: string, extra?: string };
  makeupInspoImg: string;
};

const MOCK_RESULTS: AnalysisResult[] = [
  {
    season: "True Autumn",
    undertone: "Warm",
    description: "You have warm, rich undertones with low contrast. Earthy, muted tones like olive, rust, and mustard enhance your natural glow!",
    colors: ["#8B4513", "#D2691E", "#CD853F", "#DAA520", "#556B2F", "#800000"],
    jewelry: "Gold & Bronze",
    makeup: "Terracotta blush, warm brown eyeliner, and brick-red lipstick.",
    hairColor: "Warm auburn, rich chestnut, or golden brown.",
    shoppingUrls: [
      { brand: "Madewell", url: "https://www.madewell.com" },
      { brand: "Free People", url: "https://www.freepeople.com" }
    ],
    faceShape: "Oval",
    makeupTips: {
      contour: "Light contour under cheekbones. Very soft contour on temples. Slight contour under jawline.",
      blush: "Apply on the apples of the cheeks and blend slightly upward toward temples.",
      concealer: "Under eyes in a triangle shape, center of forehead, bridge of nose, and chin.",
      extra: "Tip: Avoid heavy contour — oval faces are already balanced."
    },
    makeupInspoImg: "https://images.unsplash.com/photo-1512496015851-a1dc8a4755ee?q=80&w=400&auto=format&fit=crop"
  },
  {
    season: "True Winter",
    undertone: "Cool",
    description: "You have cool undertones with high contrast. Bold, cool tones like icy blue, emerald green, and true red make your features pop!",
    colors: ["#000080", "#DC143C", "#00FFFF", "#FF00FF", "#008000", "#000000"],
    jewelry: "Silver & Platinum",
    makeup: "Cool berry lipstick, sharp black eyeliner, and a soft pink blush.",
    hairColor: "Jet black, cool dark ash brown, or platinum blonde.",
    shoppingUrls: [
      { brand: "Aritzia", url: "https://www.aritzia.com" },
      { brand: "Zara", url: "https://www.zara.com" }
    ],
    faceShape: "Round",
    makeupTips: {
      contour: "Temples, under cheekbones (angled downward slightly), and jawline. Optional: sides of forehead.",
      blush: "Place higher and further back. Blend toward temples instead of the apples.",
      concealer: "Center forehead, under eyes, bridge of nose, and chin.",
      extra: "This vertical highlight helps elongate the face."
    },
    makeupInspoImg: "https://images.unsplash.com/photo-1596704017254-9b121068fb31?q=80&w=400&auto=format&fit=crop"
  },
  {
    season: "Light Spring",
    undertone: "Warm",
    description: "You have warm, delicate undertones with light coloring. Fresh, clear colors like peach, mint, and warm pastel pink bring out your radiance!",
    colors: ["#FFDAB9", "#98FB98", "#FFB6C1", "#F0E68C", "#87CEFA", "#FFA07A"],
    jewelry: "Light Gold & Rose Gold",
    makeup: "Peach blush, champagne highlighter, and coral lip gloss.",
    hairColor: "Strawberry blonde, golden blonde, or light caramel brown.",
    shoppingUrls: [
      { brand: "Reformation", url: "https://www.thereformation.com" },
      { brand: "Anthropologie", url: "https://www.anthropologie.com" }
    ],
    faceShape: "Square",
    makeupTips: {
      contour: "Corners of the forehead, jawline edges, and a light contour under cheekbones.",
      blush: "Apply on apples and blend softly upward. Avoid placing too far back.",
      concealer: "Under eyes, center of forehead, chin, and bridge of nose.",
      extra: "This adds softness to the structure."
    },
    makeupInspoImg: "https://images.unsplash.com/photo-1515688594390-b649af70d282?q=80&w=400&auto=format&fit=crop"
  },
  {
    season: "Soft Summer",
    undertone: "Cool",
    description: "You have cool, muted undertones with low contrast. Soft, dusty colors like mauve, sage green, and slate blue harmonize beautifully with your coloring!",
    colors: ["#B0C4DE", "#D8BFD8", "#778899", "#8FBC8F", "#DB7093", "#4682B4"],
    jewelry: "Silver & White Gold",
    makeup: "Dusty rose lipstick, slate grey eyeliner, and soft mauve blush.",
    hairColor: "Ash blonde, soft mushroom brown, or cool bronde.",
    shoppingUrls: [
      { brand: "Everlane", url: "https://www.everlane.com" },
      { brand: "Uniqlo", url: "https://www.uniqlo.com" }
    ],
    faceShape: "Heart",
    makeupTips: {
      contour: "Temples, sides of forehead, and very light contour under cheekbones.",
      blush: "Slightly lower on cheeks. Blend outward but not too high.",
      concealer: "Under eyes, chin (to bring attention to lower face), and center forehead.",
      extra: "This balances the top-heavy structure."
    },
    makeupInspoImg: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=400&auto=format&fit=crop"
  },
  {
    season: "Deep Autumn",
    undertone: "Warm/Neutral",
    description: "You have extremely rich, deep coloring. Highly saturated jewel tones and dark warm neutrals look incredibly elegant on you.",
    colors: ["#5C4033", "#800020", "#228B22", "#D2691E", "#00008B", "#4A0404"],
    jewelry: "Vintage Gold",
    makeup: "Deep plum lipstick, espresso eyeliner, and burnt orange blush.",
    hairColor: "Dark chocolate brown or warm black.",
    shoppingUrls: [
      { brand: "Zara", url: "https://www.zara.com" },
      { brand: "Banana Republic", url: "https://bananarepublic.com" }
    ],
    faceShape: "Diamond",
    makeupTips: {
      contour: "Under cheekbones, slight contour on temples, and a light contour at the chin.",
      blush: "Apply closer to apples. Blend slightly outward (not too high).",
      concealer: "Under eyes, center forehead, chin, and bridge of nose.",
      extra: "Avoid blush too high on cheekbones — it exaggerates width."
    },
    makeupInspoImg: "https://images.unsplash.com/photo-1549471013-3364d7220b75?q=80&w=400&auto=format&fit=crop"
  },
  {
    season: "Cool Winter",
    undertone: "Cool",
    description: "You have strikingly cool features. Icy brights and vivid, high-saturation cool shades create a stunning contrast.",
    colors: ["#FF00FF", "#0000CD", "#00FFFF", "#DC143C", "#9400D3", "#FFFFFF"],
    jewelry: "Silver",
    makeup: "Fuchsia pink lips, cool pink blush, and sharp graphic liner.",
    hairColor: "Ash black or icy blonde.",
    shoppingUrls: [
      { brand: "Aritzia", url: "https://www.aritzia.com" },
      { brand: "H&M", url: "https://www.hm.com" }
    ],
    faceShape: "Oblong",
    makeupTips: {
      contour: "Hairline (top of forehead), chin, and light contour under cheekbones.",
      blush: "Apply horizontally across cheeks. Focus on apples instead of temples.",
      concealer: "Under eyes, center of cheeks, slightly less on forehead and chin.",
      extra: "Horizontal blush placement helps visually shorten the face."
    },
    makeupInspoImg: "https://images.unsplash.com/photo-1596704017254-9b121068fb31?q=80&w=400&auto=format&fit=crop"
  }
];

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    if (selectedImage) {
      const url = URL.createObjectURL(selectedImage);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [selectedImage]);

  const handleAnalyze = () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);

    // Simulate AI network request delay
    setTimeout(() => {
      // Pick a random mock result for now
      const randomResult = MOCK_RESULTS[Math.floor(Math.random() * MOCK_RESULTS.length)];
      setResult(randomResult);
      setIsAnalyzing(false);
    }, 2500);
  };

  const handleStartOver = () => {
    setSelectedImage(null);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans transition-colors duration-500 selection:bg-indigo-100 selection:text-indigo-900">
      <header className="w-full py-6 px-8 border-b border-slate-200/50 bg-white/50 backdrop-blur-md sticky top-0 z-10 transition-colors duration-500">
        <div className="max-w-5xl mx-auto flex items-center justify-center sm:justify-start">
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={result ? handleStartOver : undefined}
          >
            <div
              className="w-10 h-10 rounded-xl shadow-lg shadow-slate-900/10 transition-all duration-500 group-hover:scale-110 group-hover:rotate-45 flex items-center justify-center"
              style={{
                background: "conic-gradient(from 0deg, #ef4444, #f97316, #eab308, #22c55e, #06b6d4, #3b82f6, #8b5cf6, #d946ef, #ef4444)"
              }}
            >
              {/* Center hole of the color wheel */}
              <div className="w-3.5 h-3.5 bg-white/90 backdrop-blur-sm rounded-full shadow-inner"></div>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-slate-700 transition-colors">
              AI Color Analysis
            </h1>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto p-6 sm:p-12 flex flex-col items-center justify-center">
        {!isAnalyzing && !result && (
          <div className="w-full flex flex-col items-center animate-in fade-in zoom-in duration-500">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900">
                Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">Best Colors</span>
              </h2>
              <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto font-medium">
                Upload a selfie or use your  camera to capture a photo to discover your color season and find the shades that make you glow.
              </p>
            </div>

            <div className="w-full max-w-2xl bg-white p-6 sm:p-10 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-100">
              <ImageUploader onImageSelected={setSelectedImage} />

              <div className="mt-10 flex justify-center">
                <button
                  onClick={handleAnalyze}
                  disabled={!selectedImage}
                  className={`
                    px-10 py-4 rounded-full font-bold text-lg transition-all duration-300 ease-out shadow-lg flex items-center gap-2
                    ${!selectedImage
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                      : "bg-slate-900 hover:bg-slate-800 text-white hover:shadow-xl hover:-translate-y-1 active:scale-95"
                    }
                  `}
                >
                  Analyze My Colors
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform duration-300 ${selectedImage ? 'translate-x-1' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {isAnalyzing && (
          <div className="w-full max-w-md flex flex-col items-center justify-center space-y-8 animate-in fade-in zoom-in duration-500">
            <div className="relative w-32 h-32">
              <div className="absolute inset-0 rounded-full border-[4px] border-slate-100"></div>
              <div className="absolute inset-0 rounded-full border-[4px] border-indigo-500 border-t-transparent animate-spin"></div>
              {previewUrl && (
                <div className="absolute inset-2 rounded-full overflow-hidden opacity-50">
                  <img src={previewUrl} alt="Analyzing preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold text-slate-900">Analyzing your features...</h3>
              <p className="text-slate-500 font-medium">Detecting undertones, contrast, and hue matching.</p>
            </div>
          </div>
        )}

        {result && previewUrl && !isAnalyzing && (
          <div className="w-full max-w-4xl animate-in slide-in-from-bottom-8 fade-in duration-700 ease-out">
            <button
              onClick={handleStartOver}
              className="group mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors"
            >
              <div className="p-2 rounded-full bg-slate-100 group-hover:bg-slate-200 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
                </svg>
              </div>
              Start Over
            </button>

            <div className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-100 overflow-hidden flex flex-col md:flex-row">
              {/* Left Side: Photo */}
              <div className="w-full md:w-2/5 h-64 md:h-auto relative bg-slate-100">
                <img
                  src={previewUrl}
                  alt="Your uploaded photo"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-6">
                  <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white font-medium text-sm flex items-center gap-2 border border-white/30">
                    <span className="w-2 h-2 rounded-full bg-green-400"></span>
                    Analyzed Successfully
                  </div>
                </div>
              </div>

              {/* Right Side: Results */}
              <div className="w-full md:w-3/5 p-8 sm:p-12 flex flex-col justify-center bg-gradient-to-br from-white to-slate-50">
                <div className="inline-flex items-center gap-2 mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase
                    ${result.undertone === 'Warm' ? 'bg-orange-100 text-orange-700' :
                      result.undertone === 'Cool' ? 'bg-blue-100 text-blue-700' :
                        'bg-slate-200 text-slate-700'}
                  `}>
                    {result.undertone} Undertone
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-amber-100 text-amber-800">
                    {result.jewelry}
                  </span>
                </div>

                <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
                  {result.season}
                </h2>

                <p className="text-lg text-slate-600 mb-10 leading-relaxed font-medium">
                  {result.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Your Best Colors</h4>
                    <div className="flex flex-wrap gap-3 mb-6">
                      {result.colors.map((color, i) => (
                        <div
                          key={i}
                          className="w-10 h-10 rounded-2xl shadow-sm ring-1 ring-black/5 hover:scale-110 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>

                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Makeup & Hair</h4>
                    <div className="space-y-3 mb-6">
                      <div>
                        <span className="text-xs font-semibold px-2 py-1 bg-pink-100 text-pink-700 rounded-md mr-2">Makeup</span>
                        <span className="text-sm text-slate-600 font-medium">{result.makeup}</span>
                      </div>
                      <div>
                        <span className="text-xs font-semibold px-2 py-1 bg-amber-100 text-amber-700 rounded-md mr-2">Hair</span>
                        <span className="text-sm text-slate-600 font-medium">{result.hairColor}</span>
                      </div>
                    </div>


                  </div>

                  <div className="flex flex-col gap-6">
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                      <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Top Shopping Matches</h4>
                      <div className="space-y-3">
                        {result.shoppingUrls.map((shop, i) => (
                          <a
                            key={i}
                            href={shop.url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm hover:shadow-md border border-slate-100 hover:border-indigo-200 transition-all group"
                          >
                            <span className="font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">{shop.brand}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-300 group-hover:text-indigo-500 transition-colors" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </a>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>

                <div className="mt-8">
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Facial Structure</h4>
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                    <div className="flex items-center gap-2 mb-5">
                      <span className="text-xs font-bold px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg">Face Detected: {result.faceShape}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="flex flex-col gap-2">
                        <span className="text-[10px] uppercase font-bold text-slate-500 bg-white border border-slate-200 px-2 py-1 rounded w-max">Contour</span>
                        <p className="text-sm text-slate-600 font-medium leading-relaxed">{result.makeupTips.contour}</p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <span className="text-[10px] uppercase font-bold text-pink-500 bg-white border border-pink-100 px-2 py-1 rounded w-max">Blush</span>
                        <p className="text-sm text-slate-600 font-medium leading-relaxed">{result.makeupTips.blush}</p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <span className="text-[10px] uppercase font-bold text-amber-500 bg-white border border-amber-100 px-2 py-1 rounded w-max">Concealer</span>
                        <p className="text-sm text-slate-600 font-medium leading-relaxed">{result.makeupTips.concealer}</p>
                      </div>
                    </div>
                    {result.makeupTips.extra && (
                      <div className="mt-5 pt-4 border-t border-slate-200/60">
                        <p className="text-xs text-indigo-500 font-semibold italic flex items-center gap-1.5">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" /></svg>
                          {result.makeupTips.extra}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="w-full py-8 text-center text-sm font-medium text-slate-400 mt-auto">
        <p>© {new Date().getFullYear()} AI Color Analysis. All rights reserved.</p>
      </footer>
    </div>
  );
}
