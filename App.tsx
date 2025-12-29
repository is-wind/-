
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { INITIAL_SLIDES } from './constants';
import { SlideData } from './types';
import { EditableText } from './components/EditableText';

const App: React.FC = () => {
  const [slides, setSlides] = useState<SlideData[]>(INITIAL_SLIDES);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalSlides = slides.length;

  const nextSlide = useCallback(() => {
    // If editing, don't flip pages
    if (document.activeElement?.getAttribute('contenteditable') === 'true') return;
    setCurrentIndex((prev) => (prev + 1 < totalSlides ? prev + 1 : prev));
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    if (document.activeElement?.getAttribute('contenteditable') === 'true') return;
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.getAttribute('contenteditable') === 'true') {
        if (e.key === 'Escape') {
          (document.activeElement as HTMLElement).blur();
        }
        return;
      }

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
        case ' ':
        case 'PageDown':
          nextSlide();
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
        case 'PageUp':
          prevSlide();
          break;
        case 'f':
        case 'F':
          toggleFullscreen();
          break;
        default:
          break;
      }
    };

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [nextSlide, prevSlide]);

  const updateSlideContent = (slideId: number, lineIndex: number, newText: string) => {
    setSlides(prev => prev.map(slide => {
      if (slide.id === slideId) {
        const newContent = [...slide.content];
        newContent[lineIndex] = newText;
        return { ...slide, content: newContent };
      }
      return slide;
    }));
  };

  const updateSlideTitle = (slideId: number, newTitle: string) => {
    setSlides(prev => prev.map(slide => {
      if (slide.id === slideId) {
        return { ...slide, title: newTitle };
      }
      return slide;
    }));
  };

  const currentSlide = slides[currentIndex];

  return (
    <div className="min-h-screen w-full bg-neutral-950 flex flex-col items-center justify-center p-4">
      {!isFullscreen && (
        <div className="fixed top-0 left-0 right-0 bg-black/70 backdrop-blur-xl text-white p-3 flex justify-between items-center z-50 border-b border-white/10">
          <div className="flex gap-4 items-center">
            <span className="text-sm font-black bg-gradient-to-r from-red-600 to-amber-500 px-4 py-1 rounded-full uppercase tracking-tighter shadow-lg shadow-red-900/20">
              Slide {currentIndex + 1} / {totalSlides}
            </span>
            <span className="text-xs text-gray-400 font-medium hidden sm:inline">
              空格/方向键翻页 • F 全屏 • 点击文字即刻编辑
            </span>
          </div>
          <div className="flex gap-3">
            <button onClick={prevSlide} className="px-4 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all text-sm">上一页</button>
            <button onClick={nextSlide} className="px-4 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all text-sm">下一页</button>
            <button onClick={toggleFullscreen} className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg transition-all text-sm shadow-lg shadow-amber-500/20">全屏预览</button>
          </div>
        </div>
      )}

      <div 
        ref={containerRef}
        onClick={(e) => {
            // Only advance if not clicking an editable element
            if ((e.target as HTMLElement).getAttribute('contenteditable') !== 'true') {
                nextSlide();
            }
        }}
        className={`relative aspect-4-3 shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-700 ease-in-out ${isFullscreen ? 'w-full h-screen border-none' : 'w-[85vw] max-w-[1100px] border-[12px] border-neutral-800 rounded-xl'}`}
      >
        {/* Festive Background Layers */}
        <div className="absolute inset-0 bg-[#8b0000]"></div>
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20"></div>

        {/* Ornamentals */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none border-[30px] border-double border-amber-600/20 m-2"></div>
        <div className="absolute top-8 left-8 text-amber-500/30 font-serif italic text-2xl select-none">2025</div>
        <div className="absolute top-8 right-8 text-amber-500/30 font-serif italic text-2xl select-none">Happier New Year</div>

        {/* Content Centered Container */}
        <div className="absolute inset-0 flex flex-col items-center pt-16 pb-12 px-16 text-center">
          
          {/* Title Area - Now dynamic for every page */}
          <div className="w-full mb-8 relative">
            <EditableText 
              tag="h2"
              text={currentSlide.title || "元旦晚会"} 
              onChange={(val) => updateSlideTitle(currentSlide.id, val)}
              className={`font-bold text-amber-400 drop-shadow-2xl festive-title leading-tight transition-all duration-500 ${currentSlide.type === 'title' ? 'text-[8vw]' : 'text-[4.5vw]'}`}
            />
            <div className="h-1 w-24 bg-amber-500 mx-auto mt-4 opacity-50 shadow-glow"></div>
          </div>

          {/* Large Live Input Area */}
          <div className="flex-1 w-full flex flex-col justify-center items-center overflow-hidden">
            {currentSlide.content.map((line, idx) => (
              <EditableText
                key={idx}
                text={line}
                onChange={(val) => updateSlideContent(currentSlide.id, idx, val)}
                className={`w-full max-h-full overflow-y-auto whitespace-pre-wrap text-white/90 font-medium tracking-wide transition-all duration-300 ${
                    currentSlide.type === 'credits' ? 'text-[2vw] text-left' : 'text-[5vw]'
                } ${line === "" || line.startsWith("点击此处") ? 'italic opacity-30 text-[3vw]' : 'opacity-100'}`}
              />
            ))}
          </div>

        </div>

        {/* Footer info */}
        <div className="absolute bottom-6 left-0 right-0 text-center pointer-events-none opacity-20">
            <span className="text-[1.2vw] uppercase tracking-[1em] text-amber-200">元旦庆典 • 2025</span>
        </div>
      </div>

      {!isFullscreen && (
        <div className="mt-8 flex gap-2 flex-wrap justify-center max-w-[90vw]">
          {slides.map((s, idx) => (
            <button
              key={idx}
              onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
              className={`group relative w-10 h-2 rounded-full transition-all duration-500 overflow-hidden ${currentIndex === idx ? 'bg-amber-500 w-16' : 'bg-white/10 hover:bg-white/30'}`}
            >
                <span className="absolute inset-0 flex items-center justify-center text-[8px] opacity-0 group-hover:opacity-100 text-white font-bold">{idx + 1}</span>
            </button>
          ))}
        </div>
      )}

      <style>{`
        :fullscreen {
          background: #000 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }
        :fullscreen .aspect-4-3 {
          height: 100vh !important;
          width: calc(100vh * 4 / 3) !important;
          max-width: 100vw !important;
          border: none !important;
          border-radius: 0 !important;
        }
        .shadow-glow {
          box-shadow: 0 0 20px rgba(245, 158, 11, 0.4);
        }
        [contenteditable="true"]:empty:before {
          content: "点击此处输入现场内容...";
          color: rgba(255,255,255,0.2);
          font-style: italic;
        }
        /* Hide scrollbar but keep functionality */
        .overflow-y-auto::-webkit-scrollbar {
          width: 4px;
        }
        .overflow-y-auto::-webkit-scrollbar-track {
          background: transparent;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: rgba(251, 191, 36, 0.2);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default App;
