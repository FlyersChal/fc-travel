"use client";

import { useState } from "react";
import { Share2, Copy, Check } from "lucide-react";
import { useLocale } from "@/lib/i18n";

interface ShareButtonsProps {
  url: string;
  title: string;
}

export function ShareButtons({ url, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const { t } = useLocale();

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback for HTTP or unsupported browsers
      try {
        const textarea = document.createElement("textarea");
        textarea.value = url;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // last resort: show URL in prompt
        window.prompt(t("share.copyPrompt"), url);
      }
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // user cancelled
      }
    }
  };

  const shareToTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const shareToFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const supportsNativeShare = typeof navigator !== "undefined" && "share" in navigator;

  return (
    <div className="flex items-center gap-1.5">
      {supportsNativeShare && (
        <button
          onClick={handleNativeShare}
          className="inline-flex items-center justify-center min-w-[44px] min-h-[44px] rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label={t("share.share")}
        >
          <Share2 className="w-4 h-4" />
        </button>
      )}
      {!supportsNativeShare && (
        <>
          <button
            onClick={shareToTwitter}
            className="inline-flex items-center justify-center min-w-[44px] min-h-[44px] rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label={t("share.twitter")}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </button>
          <button
            onClick={shareToFacebook}
            className="inline-flex items-center justify-center min-w-[44px] min-h-[44px] rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label={t("share.facebook")}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 1.09.044 1.613.115v3.146c-.427-.044-.72-.065-.95-.065-1.35 0-1.872.513-1.872 1.846v2.516h3.332l-.468 3.667h-2.864v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
            </svg>
          </button>
        </>
      )}
      <button
        onClick={handleCopyUrl}
        className="inline-flex items-center gap-1.5 min-h-[44px] px-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200"
        aria-label={t("share.copyUrl")}
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 text-green-500" />
            <span className="text-xs font-medium text-green-500">{t("post.copied")}</span>
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" />
            <span className="text-xs">{t("post.copyLink")}</span>
          </>
        )}
      </button>
    </div>
  );
}
