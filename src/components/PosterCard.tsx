import { useRef, useState } from 'react';
import type { ParallelPersonality } from '@/types';
import { Share2, Download, Copy, Check, Sparkles } from 'lucide-react';

interface Props {
  personality: ParallelPersonality;
}

export default function PosterCard({ personality }: Props) {
  const posterRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const poster = personality.lifeTimeline.poster;
  const timeline = personality.lifeTimeline;

  const shareText = `${poster.title}\n${poster.tagline}\n\n「${personality.codeName}」${poster.subtitle}\n\n${poster.goldenQuote}\n\n—— ${poster.worldlineName}\n\n生成你的平行人生时间线`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: poster.title,
          text: shareText
        });
      } catch (err) {
        handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      if (posterRef.current) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (ctx) {
          canvas.width = 1080;
          canvas.height = 1620;

          const gradient = ctx.createLinearGradient(0, 0, 1080, 1620);
          gradient.addColorStop(0, '#0f172a');
          gradient.addColorStop(0.5, personality.accentColor + '22');
          gradient.addColorStop(1, '#0f172a');
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, 1080, 1620);

          ctx.fillStyle = personality.accentColor + '33';
          for (let i = 0; i < 50; i++) {
            const x = Math.random() * 1080;
            const y = Math.random() * 1620;
            const radius = Math.random() * 3 + 1;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 64px serif';
          ctx.textAlign = 'center';
          ctx.fillText(poster.title, 540, 200);

          ctx.fillStyle = personality.accentColor;
          ctx.font = '32px sans-serif';
          ctx.fillText(poster.tagline, 540, 270);

          ctx.fillStyle = '#94a3b8';
          ctx.font = '28px monospace';
          ctx.fillText(poster.subtitle, 540, 350);

          ctx.strokeStyle = personality.accentColor + '44';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(200, 400);
          ctx.lineTo(880, 400);
          ctx.stroke();

          ctx.fillStyle = personality.accentColor;
          ctx.font = 'bold 28px sans-serif';
          ctx.fillText('「' + poster.worldlineName + '」', 540, 480);

          const quoteX = 140;
          const quoteWidth = 800;
          ctx.fillStyle = '#f1f5f9';
          ctx.font = 'italic 40px serif';
          ctx.textAlign = 'left';
          
          const words = poster.goldenQuote.split('');
          let line = '';
          let y = 620;
          const lineHeight = 60;
          
          for (let i = 0; i < words.length; i++) {
            const testLine = line + words[i];
            const metrics = ctx.measureText(testLine);
            if (metrics.width > quoteWidth && i > 0) {
              ctx.fillText(line, quoteX, y);
              line = words[i];
              y += lineHeight;
            } else {
              line = testLine;
            }
          }
          ctx.fillText(line, quoteX, y);

          y += 120;
          ctx.textAlign = 'center';
          ctx.fillStyle = '#94a3b8';
          ctx.font = '24px monospace';
          ctx.fillText('—— 20 → 30 → 40 ——', 540, y);

          y += 80;
          const stageX = [180, 540, 900];
          const ages = ['20岁', '30岁', '40岁'];
          poster.characterLines.forEach((lineText, i) => {
            ctx.fillStyle = i === 1 ? personality.accentColor : '#64748b';
            ctx.beginPath();
            ctx.arc(stageX[i], y, 32, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 24px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(ages[i], stageX[i], y + 8);

            if (i < 2) {
              ctx.strokeStyle = personality.accentColor + '44';
              ctx.lineWidth = 2;
              ctx.setLineDash([8, 8]);
              ctx.beginPath();
              ctx.moveTo(stageX[i] + 40, y);
              ctx.lineTo(stageX[i + 1] - 40, y);
              ctx.stroke();
              ctx.setLineDash([]);
            }
          });

          y += 80;
          poster.characterLines.forEach((lineText, i) => {
            ctx.fillStyle = i === 1 ? '#f1f5f9' : '#94a3b8';
            ctx.font = 'italic 26px serif';
            ctx.textAlign = 'center';
            const metrics = ctx.measureText(lineText);
            const startX = stageX[i];
            const chars = lineText.split('');
            let currentLine = '';
            let lineY = y;
            
            for (let j = 0; j < chars.length; j++) {
              const test = currentLine + chars[j];
              if (ctx.measureText(test).width > 260) {
                ctx.fillText(currentLine, startX, lineY);
                currentLine = chars[j];
                lineY += 40;
              } else {
                currentLine = test;
              }
            }
            ctx.fillText(currentLine, startX, lineY);
          });

          ctx.fillStyle = '#64748b';
          ctx.font = '22px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(poster.visualTheme, 540, 1500);

          ctx.fillStyle = personality.accentColor;
          ctx.font = 'bold 28px serif';
          ctx.fillText('人格平行宇宙模拟器', 540, 1560);

          const dataUrl = canvas.toDataURL('image/png');
          const link = document.createElement('a');
          link.download = `${poster.worldlineName}_平行人生海报.png`;
          link.href = dataUrl;
          link.click();
        }
      }
    } catch (err) {
      console.error('Failed to generate poster:', err);
      alert('海报生成失败，请尝试复制文本分享');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div
        ref={posterRef}
        className="relative w-full max-w-md mx-auto aspect-[2/3] rounded-2xl overflow-hidden"
        style={{
          background: `linear-gradient(180deg, #0f172a 0%, ${personality.accentColor}22 50%, #0f172a 100%)`
        }}
      >
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(${personality.accentColor}44 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
          }}
        />

        <div className="relative h-full flex flex-col p-8">
          <div className="text-center pt-4">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Sparkles size={20} style={{ color: personality.accentColor }} />
              <span
                className="text-xs font-mono uppercase tracking-widest"
                style={{ color: personality.accentColor }}
              >
                平行人生海报
              </span>
            </div>
            <h2 className="font-serif text-3xl font-bold text-white mb-2 leading-tight">
              {poster.title}
            </h2>
            <p className="text-sm" style={{ color: personality.accentColor }}>
              {poster.tagline}
            </p>
            <p className="text-xs text-mist-400 mt-2 font-mono">
              {poster.subtitle}
            </p>
          </div>

          <div
            className="w-full my-6 h-px"
            style={{ background: `linear-gradient(90deg, transparent, ${personality.accentColor}44, transparent)` }}
          />

          <div className="text-center mb-6">
            <span
              className="inline-block px-4 py-1.5 rounded-full text-xs font-medium"
              style={{
                backgroundColor: personality.accentColor + '22',
                color: personality.accentColor,
                border: `1px solid ${personality.accentColor}44`
              }}
            >
              「{poster.worldlineName}」
            </span>
          </div>

          <div className="flex-1 flex items-center justify-center px-4">
            <div className="text-center">
              <div className="text-5xl mb-4 opacity-30" style={{ color: personality.accentColor }}>"</div>
              <p className="font-serif text-xl italic text-white leading-relaxed mb-4">
                {poster.goldenQuote}
              </p>
              <div className="text-5xl opacity-30 text-right" style={{ color: personality.accentColor }}>"</div>
            </div>
          </div>

          <div className="mb-6">
            <div className="text-center text-xs font-mono text-mist-400 mb-4">
              —— 20 → 30 → 40 ——
            </div>
            <div className="flex items-center justify-between relative">
              {[20, 30, 40].map((age, i) => (
                <div key={age} className="flex flex-col items-center flex-1 relative z-10">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold mb-2"
                    style={{
                      backgroundColor: i === 1 ? personality.accentColor : '#1e293b',
                      color: '#fff',
                      boxShadow: i === 1 ? `0 0 12px ${personality.accentColor}66` : 'none'
                    }}
                  >
                    {age}
                  </div>
                  <p className="text-[10px] text-center text-mist-500 leading-snug px-1 max-w-[80px] italic">
                    {poster.characterLines[i]}
                  </p>
                </div>
              ))}
              <div
                className="absolute left-[16%] right-[16%] top-5 h-px"
                style={{
                  background: `linear-gradient(90deg, ${personality.accentColor}44, ${personality.accentColor}, ${personality.accentColor}44)`,
                  opacity: 0.5
                }}
              />
            </div>
          </div>

          <div className="text-center mt-auto pb-2">
            <p className="text-[10px] text-mist-400 leading-relaxed mb-3 px-4">
              {poster.visualTheme}
            </p>
            <div
              className="text-xs font-serif font-bold"
              style={{ color: personality.accentColor }}
            >
              人格平行宇宙模拟器
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={handleShare}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all"
          style={{
            backgroundColor: personality.accentColor,
            color: '#fff',
            boxShadow: `0 4px 14px ${personality.accentColor}44`
          }}
        >
          <Share2 size={15} />
          分享到社交平台
        </button>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all bg-mist-50 text-mist-400 hover:text-white hover:bg-mist-100"
        >
          {copied ? <Check size={15} className="text-emerald" /> : <Copy size={15} />}
          {copied ? '已复制文案' : '复制分享文案'}
        </button>
        <button
          onClick={handleDownload}
          disabled={isGenerating}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all border border-mist-100 text-mist-400 hover:text-white hover:border-mist-200 disabled:opacity-50"
        >
          <Download size={15} />
          {isGenerating ? '生成中...' : '下载海报图片'}
        </button>
      </div>
    </div>
  );
}
