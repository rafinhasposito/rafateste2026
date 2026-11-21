import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Share2, Download, Check, Instagram, Eye, EyeOff, Image as ImageIcon, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { HOUSE_STORY_METAS } from "@/data/storyHouseMetas";
import { extractShortCityName } from "@/lib/cityCopy";
import { resolveRealCityPhoto } from "@/lib/storyCityPhoto";
import { useIsAffiliate } from "@/hooks/useIsAffiliate";
import { buildAffiliateLink, formatPartnerIdLabel } from "@/lib/affiliates";

export interface StoryShareProps {
  isOpen: boolean;
  onClose: () => void;
  city: string;
  cityImageUrl?: string;
  coords?: string;
  country?: string;
  house: number;
  year: string | number;
  userName?: string;
  sunSign?: string;
  mode?: string;
}

type CardStyle = "city" | "neutral";

function drawImageCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  dx: number,
  dy: number,
  dw: number,
  dh: number
) {
  const imgRatio = img.naturalWidth / Math.max(1, img.naturalHeight);
  const targetRatio = dw / dh;
  let sx = 0;
  let sy = 0;
  let sw = img.naturalWidth;
  let sh = img.naturalHeight;

  if (imgRatio > targetRatio) {
    sw = img.naturalHeight * targetRatio;
    sx = (img.naturalWidth - sw) / 2;
  } else {
    sh = img.naturalWidth / targetRatio;
    sy = (img.naturalHeight - sh) / 2;
  }
  ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
}

function getWrappedLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function fitFontSize(
  ctx: CanvasRenderingContext2D,
  text: string,
  fontFamily: string,
  maxWidth: number,
  maxSize: number,
  minSize: number
): number {
  let size = maxSize;
  while (size > minSize) {
    ctx.font = `800 ${size}px ${fontFamily}`;
    if (ctx.measureText(text).width <= maxWidth) break;
    size -= 4;
  }
  return size;
}

function splitCityTitle(ctx: CanvasRenderingContext2D, cityUpper: string, fontFamily: string): string[] {
  ctx.font = `800 96px ${fontFamily}`;
  if (!cityUpper.includes(" ") || ctx.measureText(cityUpper).width <= 840) {
    return [cityUpper];
  }
  const words = cityUpper.split(" ");
  let bestSplit = 1;
  let bestMax = Infinity;
  for (let s = 1; s < words.length; s++) {
    const l1 = words.slice(0, s).join(" ");
    const l2 = words.slice(s).join(" ");
    const wMax = Math.max(ctx.measureText(l1).width, ctx.measureText(l2).width);
    if (wMax < bestMax) {
      bestMax = wMax;
      bestSplit = s;
    }
  }
  return [words.slice(0, bestSplit).join(" "), words.slice(bestSplit).join(" ")];
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  if (typeof ctx.roundRect === "function") {
    ctx.roundRect(x, y, w, h, r);
  } else {
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }
}

function drawNeutralLuxuryBackground(ctx: CanvasRenderingContext2D, accent: string) {
  // Ultra-clean editorial Apple / Spotify Wrapped dark background — zero esoteric clutter!
  const bg = ctx.createLinearGradient(0, 0, 0, 1920);
  bg.addColorStop(0, "#0A0C14");
  bg.addColorStop(0.5, "#07080E");
  bg.addColorStop(1, "#050508");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 1080, 1920);

  // Soft warm solar glow upper-center
  const g1 = ctx.createRadialGradient(540, 620, 20, 540, 620, 560);
  g1.addColorStop(0, "rgba(245, 176, 65, 0.22)");
  g1.addColorStop(0.45, "rgba(230, 126, 34, 0.08)");
  g1.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = g1;
  ctx.fillRect(0, 0, 1080, 1920);

  // Delicate secondary tint from the House accent color
  const g2 = ctx.createRadialGradient(540, 1180, 10, 540, 1180, 520);
  g2.addColorStop(0, `${accent}1F`);
  g2.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = g2;
  ctx.fillRect(0, 0, 1080, 1920);

  // Clean subtle geometric solar orbit circle (minimalist, modern, high-readability)
  ctx.strokeStyle = "rgba(255, 243, 209, 0.09)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(540, 620, 320, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = "rgba(245, 176, 65, 0.14)";
  ctx.setLineDash([4, 12]);
  ctx.beginPath();
  ctx.arc(540, 620, 395, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
}

export const StoryShareModal: React.FC<StoryShareProps> = ({
  isOpen,
  onClose,
  city,
  cityImageUrl,
  coords,
  country = "",
  house,
  year,
  userName = "",
  sunSign = "",
  mode = "futuro",
}) => {
  const [cardStyle, setCardStyle] = useState<CardStyle>("city");
  const [showIdentity, setShowIdentity] = useState(false);
  const [rendering, setRendering] = useState(false);
  const [photoUnavailable, setPhotoUnavailable] = useState(false);
  const [readyBlob, setReadyBlob] = useState<Blob | null>(null);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { isAffiliate, affiliateCode } = useIsAffiliate();

  const cleanCity = extractShortCityName(city) || "Roma";
  const cleanCountry =
    country || (city.includes(",") ? city.split(",").slice(1).join(",").trim() : "");
  const currentHouse = house >= 1 && house <= 12 ? house : 5;
  const meta = HOUSE_STORY_METAS[currentHouse] || HOUSE_STORY_METAS[5];

  const drawStoryToCanvas = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setRendering(true);
    setReadyBlob(null);
    try {
      if (document.fonts) {
        await Promise.allSettled([
          document.fonts.load("800 96px 'Syne'"),
          document.fonts.load("700 44px 'Syne'"),
          document.fonts.load("700 22px 'JetBrains Mono'"),
          document.fonts.load("600 28px 'Inter'"),
          document.fonts.load("500 28px 'Inter'"),
          document.fonts.ready,
        ]);
      }

      const loadImageSafe = (src?: string) =>
        new Promise<HTMLImageElement | null>((resolve) => {
          if (!src) return resolve(null);
          const img = new Image();
          img.crossOrigin = "anonymous";
          const timeout = window.setTimeout(() => resolve(null), 5000);
          img.onload = () => {
            window.clearTimeout(timeout);
            resolve(img);
          };
          img.onerror = () => {
            window.clearTimeout(timeout);
            resolve(null);
          };
          // Ensure Unsplash URLs have portrait-friendly high resolution
          const finalSrc = src.includes("images.unsplash.com")
            ? src.replace(/w=\d+/g, "w=1400").replace(/q=\d+/g, "q=85")
            : src;
          img.src = finalSrc;
        });

      let bgImg: HTMLImageElement | null = null;
      if (cardStyle === "city") {
        const resolvedUrl = await resolveRealCityPhoto(city, cityImageUrl);
        if (resolvedUrl) {
          const candidate = await loadImageSafe(resolvedUrl);
          if (candidate && candidate.naturalWidth >= 400 && candidate.naturalHeight >= 300) {
            bgImg = candidate;
          }
        }
      }
      setPhotoUnavailable(cardStyle === "city" && !bgImg);

      // 1. BACKGROUND — Either Real Aspirational City Photo OR Clean Neutral Minimalist
      ctx.clearRect(0, 0, 1080, 1920);
      const usingCityPhoto = cardStyle === "city" && Boolean(bgImg);

      if (usingCityPhoto && bgImg) {
        drawImageCover(ctx, bgImg, 0, 0, 1080, 1920);

        // Editorial travel gradient: lets the real city shine in upper-middle, guarantees 100% crisp reading top & bottom!
        const scrim = ctx.createLinearGradient(0, 0, 0, 1920);
        scrim.addColorStop(0, "rgba(5, 6, 10, 0.84)");
        scrim.addColorStop(0.22, "rgba(5, 6, 10, 0.36)");
        scrim.addColorStop(0.44, "rgba(5, 6, 10, 0.08)");
        scrim.addColorStop(0.58, "rgba(5, 6, 10, 0.45)");
        scrim.addColorStop(0.74, "rgba(5, 6, 10, 0.88)");
        scrim.addColorStop(0.9, "rgba(5, 6, 10, 0.96)");
        scrim.addColorStop(1, "#05060A");
        ctx.fillStyle = scrim;
        ctx.fillRect(0, 0, 1080, 1920);
      } else {
        drawNeutralLuxuryBackground(ctx, meta.accent);
      }

      // Clean subtle hairline frame
      ctx.strokeStyle = "rgba(255, 255, 255, 0.14)";
      ctx.lineWidth = 2;
      drawRoundedRect(ctx, 36, 36, 1008, 1848, 44);
      ctx.stroke();

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // 2. TOP HOOK — Natural, relatable Instagram trend opener
      const topPill = `ANIVERSÁRIO ${year}  •  REVOLUÇÃO SOLAR`;
      ctx.font = "700 20px 'JetBrains Mono', monospace";
      const pillW = Math.max(460, ctx.measureText(topPill).width + 76);
      ctx.fillStyle = "rgba(5, 6, 10, 0.58)";
      ctx.strokeStyle = "rgba(255, 255, 255, 0.22)";
      ctx.lineWidth = 1.5;
      drawRoundedRect(ctx, 540 - pillW / 2, 102, pillW, 52, 26);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#F5B041";
      ctx.beginPath();
      ctx.arc(540 - pillW / 2 + 30, 128, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "rgba(255, 255, 255, 0.92)";
      ctx.fillText(topPill, 540 + 10, 129);

      // Human hook headline (reads instantly in 0.5s!)
      const normalizedMode = (mode || "futuro").toLowerCase();
      const hookLine1 =
        normalizedMode === "passado"
          ? `Meu aniversário de ${year}`
          : normalizedMode === "presente"
            ? "A energia do meu ano atual"
            : "Meu próximo aniversário";
      const hookLine2 =
        normalizedMode === "passado"
          ? "ativou minha virada em..."
          : normalizedMode === "presente"
            ? "foi ativada em..."
            : "deveria ser em...";

      ctx.font = "700 44px 'Syne', 'Inter', sans-serif";
      ctx.fillStyle = "#FFFFFF";
      ctx.shadowColor = "rgba(0, 0, 0, 0.72)";
      ctx.shadowBlur = 22;
      ctx.fillText(hookLine1, 540, 214);
      ctx.fillText(hookLine2, 540, 270);
      ctx.shadowBlur = 0;

      if (showIdentity && (userName || sunSign)) {
        const idParts = [userName?.trim(), sunSign ? `Sol em ${sunSign}` : ""].filter(Boolean);
        ctx.font = "500 21px 'JetBrains Mono', monospace";
        ctx.fillStyle = "rgba(255, 243, 209, 0.85)";
        ctx.fillText(idParts.join("  •  ").toUpperCase(), 540, 328);
      }

      // 3. HERO CITY + CLEAR ENERGY PILL
      // In City Photo mode, anchor lower so the real photo shines cleanly above!
      // In Neutral mode, center elegantly in the optical middle!
      const cityUpper = cleanCity.toUpperCase();
      const cityFontFamily = "'Syne', 'Inter', sans-serif";
      const cityLines = splitCityTitle(ctx, cityUpper, cityFontFamily);
      const longestCityLine = cityLines.reduce((a, b) => (a.length >= b.length ? a : b), "");
      const cityFontSize = fitFontSize(
        ctx,
        longestCityLine,
        cityFontFamily,
        880,
        cityLines.length > 1 ? 94 : 132,
        42
      );
      const cityLineH = Math.round(cityFontSize * 1.05);

      const cityStartY = usingCityPhoto
        ? cityLines.length > 1 ? 995 : 1055
        : cityLines.length > 1 ? 740 : 800;

      // In Neutral mode, place a crisp circular "CASA X" emblem above the city
      if (!usingCityPhoto) {
        const emblemY = cityStartY - 195;
        ctx.fillStyle = "rgba(245, 176, 65, 0.12)";
        ctx.strokeStyle = "rgba(245, 176, 65, 0.55)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(540, emblemY, 68, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.font = "700 18px 'JetBrains Mono', monospace";
        ctx.fillStyle = "rgba(255, 243, 209, 0.72)";
        ctx.fillText("CASA", 540, emblemY - 26);

        ctx.font = "700 58px 'Cinzel', 'Inter', serif";
        ctx.fillStyle = "#F5B041";
        ctx.fillText(String(currentHouse), 540, emblemY + 20);
      }

      // Monumental City Name
      ctx.font = `800 ${cityFontSize}px ${cityFontFamily}`;
      ctx.fillStyle = "#FFFFFF";
      ctx.shadowColor = "rgba(0, 0, 0, 0.85)";
      ctx.shadowBlur = 36;
      cityLines.forEach((line, idx) => {
        ctx.fillText(line, 540, cityStartY + idx * cityLineH);
      });
      ctx.shadowBlur = 0;

      // Country + Coordinates label
      let cursorY = cityStartY + (cityLines.length - 1) * cityLineH + Math.round(cityFontSize * 0.6);
      const subParts = [cleanCountry ? cleanCountry.toUpperCase() : "", coords ? coords.toUpperCase() : ""].filter(Boolean);
      if (subParts.length > 0) {
        ctx.font = "600 22px 'JetBrains Mono', monospace";
        ctx.fillStyle = "rgba(255, 255, 255, 0.78)";
        ctx.fillText(subParts.join("  •  "), 540, cursorY);
        cursorY += 62;
      } else {
        cursorY += 26;
      }

      // Crystal-clear House + Energy Pill ("CASA 5  •  AMOR & PAIXÃO")
      const housePillText = `CASA ${currentHouse}  •  ${meta.shortTheme}`;
      ctx.font = "700 25px 'JetBrains Mono', monospace";
      const housePillW = Math.min(910, Math.max(460, ctx.measureText(housePillText).width + 78));
      const housePillH = 62;
      ctx.fillStyle = "rgba(245, 176, 65, 0.18)";
      ctx.strokeStyle = "rgba(245, 176, 65, 0.75)";
      ctx.lineWidth = 2;
      drawRoundedRect(ctx, 540 - housePillW / 2, cursorY - housePillH / 2, housePillW, housePillH, 31);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#FFF3D1";
      ctx.fillText(housePillText, 540, cursorY + 1);
      cursorY += 86;

      // Short, effortless 2-line human summary (zero clutter!)
      ctx.font = "500 31px 'Inter', sans-serif";
      ctx.fillStyle = "rgba(241, 245, 249, 0.92)";
      const quoteLines = getWrappedLines(ctx, meta.quote, 820).slice(0, 3);
      quoteLines.forEach((line, idx) => {
        ctx.fillText(line, 540, cursorY + idx * 45);
      });
      cursorY += quoteLines.length * 45 + 42;

      // Clean interactive prompt for Instagram Direct / Poll sticker
      const promptY = Math.min(Math.max(cursorY, 1445), 1525);
      ctx.fillStyle = "rgba(255, 255, 255, 0.06)";
      ctx.strokeStyle = "rgba(255, 255, 255, 0.24)";
      ctx.lineWidth = 2;
      ctx.setLineDash([10, 10]);
      drawRoundedRect(ctx, 130, promptY, 820, 104, 24);
      ctx.fill();
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.font = "700 30px 'Inter', sans-serif";
      ctx.fillStyle = "#FFFFFF";
      ctx.fillText(meta.pollPrompt, 540, promptY + 53);

      // 4. CLEAN VIRAL FOOTER — Curiosity + Clear Site URL
      const footerLineY = 1676;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.14)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(110, footerLineY);
      ctx.lineTo(970, footerLineY);
      ctx.stroke();

      ctx.font = "500 25px 'Inter', sans-serif";
      ctx.fillStyle = "rgba(255, 255, 255, 0.84)";
      ctx.fillText("Descubra a cidade ideal para o seu aniversário", 540, footerLineY + 52);

      const ctaW = 510;
      const ctaY = footerLineY + 90;
      const ctaGrad = ctx.createLinearGradient(540 - ctaW / 2, ctaY, 540 + ctaW / 2, ctaY + 64);
      ctaGrad.addColorStop(0, "#F5B041");
      ctaGrad.addColorStop(1, "#E67E22");
      ctx.fillStyle = ctaGrad;
      drawRoundedRect(ctx, 540 - ctaW / 2, ctaY, ctaW, 64, 32);
      ctx.fill();

      ctx.font = "700 24px 'JetBrains Mono', monospace";
      ctx.fillStyle = "#050507";
      ctx.fillText("PROTOCOLOSOLAR.COM.BR", 540, ctaY + 33);

      // Export PNG immediately (falls back cleanly to Neutral if external photo ever triggers SecurityError)
      try {
        canvas.toBlob((blob) => {
          setReadyBlob(blob);
        }, "image/png");
      } catch {
        // Rare CORS taint fallback: redraw in clean neutral mode so export ALWAYS works
        if (usingCityPhoto) {
          setCardStyle("neutral");
        }
      }
    } finally {
      setRendering(false);
    }
  }, [cardStyle, city, cityImageUrl, cleanCity, cleanCountry, coords, currentHouse, meta, mode, showIdentity, sunSign, userName, year]);

  useEffect(() => {
    if (isOpen) {
      drawStoryToCanvas();
    }
  }, [isOpen, drawStoryToCanvas]);

  const downloadBlob = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const slug = cleanCity
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-");
    a.href = url;
    a.download = `aniversario-${slug}-casa-${currentHouse}-${year}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getBlobNow = async (): Promise<Blob | null> => {
    if (readyBlob) return readyBlob;
    const canvas = canvasRef.current;
    if (!canvas) return null;
    try {
      return await new Promise((resolve) => canvas.toBlob((b) => resolve(b), "image/png"));
    } catch {
      return null;
    }
  };

  const handleNativeShare = async () => {
    try {
      const blob = await getBlobNow();
      if (!blob) {
        toast.error("Aguarde um segundo enquanto a imagem carrega.");
        return;
      }

      const file = new File(
        [blob],
        `aniversario-${currentHouse}-${year}.png`,
        { type: "image/png" }
      );

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `Meu próximo aniversário em ${cleanCity}`,
          text: `Descobri que meu próximo aniversário deveria ser em ${cleanCity} (Casa ${currentHouse} — ${meta.shortTheme}). Descubra a sua cidade em protocolosolar.com.br`,
        });
        toast.success("Pronto para postar nos seus Stories!");
      } else {
        downloadBlob(blob);
        toast.success("Imagem 9:16 salva! Agora é só subir nos Stories do Instagram.");
      }
    } catch (err: any) {
      if (err?.name !== "AbortError") {
        const blob = await getBlobNow();
        if (blob) {
          downloadBlob(blob);
          toast.success("Imagem 9:16 salva no seu aparelho para postar nos Stories!");
        } else {
          toast.error("Não foi possível exportar a imagem agora.");
        }
      }
    }
  };

  const handleDownload = async () => {
    const blob = await getBlobNow();
    if (!blob) {
      toast.error("Erro ao gerar a imagem.");
      return;
    }
    downloadBlob(blob);
    toast.success("Imagem dos Stories (1080×1920) salva com sucesso!");
  };

  const handleCopyLink = () => {
    const shareUrl =
      isAffiliate && affiliateCode
        ? buildAffiliateLink(affiliateCode, "https://protocolosolar.com.br")
        : "https://protocolosolar.com.br/";
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success(
      isAffiliate && affiliateCode
        ? `Seu link de parceiro (${formatPartnerIdLabel(affiliateCode)}) foi copiado!`
        : "Link protocolosolar.com.br copiado!"
    );
    setTimeout(() => setCopied(false), 2200);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 18 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-lg max-h-[94dvh] overflow-y-auto bg-[#07080D] border border-[#F5B041]/30 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col gap-4"
        >
          <button
            type="button"
            aria-label="Fechar modal de compartilhamento"
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 text-white/75 hover:text-white hover:bg-white/20 transition-colors flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-left pr-10">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#F5B041] font-bold">
              Instagram Stories • 9:16
            </span>
            <h2 className="font-ps-display text-xl sm:text-2xl font-bold text-white mt-1">
              Compartilhar meu destino
            </h2>
            <p className="text-xs text-white/60 mt-0.5">
              Escolha entre a foto real de {cleanCity} ou o cartão minimalista neutro.
            </p>
          </div>

          {/* Seletor: Foto da Cidade vs Neutro Minimalista + Privacidade */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="inline-flex p-1 rounded-xl bg-white/[0.04] border border-white/10">
              <button
                type="button"
                onClick={() => setCardStyle("city")}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all flex items-center gap-1.5 ${
                  cardStyle === "city"
                    ? "bg-[#F5B041] text-[#050507]"
                    : "text-white/65 hover:text-white"
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Foto da Cidade</span>
              </button>
              <button
                type="button"
                onClick={() => setCardStyle("neutral")}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all flex items-center gap-1.5 ${
                  cardStyle === "neutral"
                    ? "bg-[#F5B041] text-[#050507]"
                    : "text-white/65 hover:text-white"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Minimalista Neutro</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowIdentity((v) => !v)}
              className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-[11px] text-white/75 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              {showIdentity ? <Eye className="w-3.5 h-3.5 text-[#F5B041]" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>{showIdentity ? "Com nome" : "Sem nome"}</span>
            </button>
          </div>

          {photoUnavailable && cardStyle === "city" && (
            <p className="text-[11px] text-amber-200/85 bg-amber-500/10 border border-amber-400/20 rounded-xl px-3 py-2">
              Sem foto verificada para {cleanCity} — exibindo o cartão minimalista com suas coordenadas exatas.
            </p>
          )}

          {/* Live 1:1 WYSIWYG Canvas Preview */}
          <div className="relative w-full max-w-[270px] sm:max-w-[290px] aspect-[9/16] mx-auto rounded-2xl overflow-hidden border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.85)] bg-[#050507]">
            <canvas
              ref={canvasRef}
              width={1080}
              height={1920}
              className="w-full h-full block"
            />
            {rendering && (
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-[#F5B041]/30 border-t-[#F5B041] rounded-full animate-spin" />
              </div>
            )}
          </div>

          {/* Botões de Ação */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            <button
              type="button"
              onClick={handleNativeShare}
              disabled={rendering}
              className="min-h-[48px] py-3 px-4 rounded-xl font-ps-display text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#F5B041] to-[#E67E22] text-[#050507] flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_6px_24px_rgba(245,176,65,0.35)] disabled:opacity-50"
            >
              <Instagram className="w-4 h-4" />
              <span>Postar nos Stories</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              disabled={rendering}
              className="min-h-[48px] py-3 px-4 rounded-xl font-ps-display text-xs font-bold uppercase tracking-wider bg-white/10 hover:bg-white/15 text-white border border-white/15 flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>Salvar PNG (9:16)</span>
            </button>
          </div>

          <div className="space-y-2 pt-2 border-t border-white/10">
            <div className="flex items-center justify-between gap-2 text-[11px] text-white/55">
              <span>
                {isAffiliate && affiliateCode
                  ? `Sticker de link com sua comissão (${formatPartnerIdLabel(affiliateCode)})`
                  : "Cole também o sticker de link nos Stories"}
              </span>
              <button
                type="button"
                onClick={handleCopyLink}
                className="text-[#F5B041] hover:underline flex items-center gap-1 font-semibold shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>
                  {copied
                    ? "Link copiado!"
                    : isAffiliate && affiliateCode
                      ? "Copiar meu link (20%)"
                      : "Copiar site"}
                </span>
              </button>
            </div>
            {!isAffiliate && (
              <p className="text-[11px] text-[#E8D59B]/85 flex items-center justify-between gap-2">
                <span>Quer ganhar 20% no Pix por cada amigo que clicar no seu Story?</span>
                <a
                  href="/afiliado"
                  className="font-semibold text-[#F5DE98] underline underline-offset-2 shrink-0"
                >
                  Ativar link →
                </a>
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
