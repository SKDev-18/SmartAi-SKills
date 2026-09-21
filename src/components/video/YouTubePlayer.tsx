"use client";

import React, { useState } from "react";
import { Play, Volume2, AlertCircle, Maximize2 } from "lucide-react";

interface YouTubePlayerProps {
  youtubeUrlOrId: string;
  title?: string;
  onEnded?: () => void;
}

export function extractYouTubeId(urlOrId: string): string {
  if (!urlOrId) return "";
  // If it's already an 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(urlOrId)) {
    return urlOrId;
  }

  // Handle standard watch URLs
  const watchMatch = urlOrId.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch && watchMatch[1]) {
    return watchMatch[1];
  }

  // Handle youtu.be short URLs
  const shortMatch = urlOrId.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch && shortMatch[1]) {
    return shortMatch[1];
  }

  // Handle embed URLs
  const embedMatch = urlOrId.match(/embed\/([a-zA-Z0-9_-]{11})/);
  if (embedMatch && embedMatch[1]) {
    return embedMatch[1];
  }

  return urlOrId;
}

export default function YouTubePlayer({ youtubeUrlOrId, title = "Educational Video" }: YouTubePlayerProps) {
  const [hasStarted, setHasStarted] = useState(false);
  const videoId = extractYouTubeId(youtubeUrlOrId);

  if (!videoId) {
    return (
      <div className="w-full aspect-video rounded-2xl bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="w-10 h-10 text-amber-400 mb-2" />
        <p className="text-sm font-semibold">Video preview currently unavailable</p>
        <p className="text-xs text-slate-400 mt-1">Check back shortly or proceed to topic notes.</p>
      </div>
    );
  }

  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&enablejsapi=1&autoplay=${hasStarted ? 1 : 0}`;

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl">
      <div className="relative aspect-video w-full">
        {!hasStarted ? (
          <div
            onClick={() => setHasStarted(true)}
            className="absolute inset-0 bg-cover bg-center cursor-pointer group flex items-center justify-center"
            style={{
              backgroundImage: `linear-gradient(to top, rgba(15, 23, 42, 0.85), rgba(15, 23, 42, 0.4)), url('https://img.youtube.com/vi/${videoId}/hqdefault.jpg')`,
            }}
          >
            {/* Play Button Overlay */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-600 group-hover:bg-red-700 text-white flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110">
              <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-white translate-x-0.5" />
            </div>

            <div className="absolute bottom-4 left-4 right-4 text-left">
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-black/70 text-white text-[11px] font-semibold mb-1">
                <Volume2 className="w-3.5 h-3.5" />
                <span>Play Inside Platform</span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white line-clamp-1 drop-shadow-md">
                {title}
              </h3>
            </div>
          </div>
        ) : (
          <iframe
            src={embedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full absolute inset-0 border-0"
          />
        )}
      </div>
    </div>
  );
}
