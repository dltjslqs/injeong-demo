"use client";

import {
  useEffect,
  useRef,
  useState,
  ReactNode,
  TouchEvent,
  WheelEvent,
} from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface ScrollExpandMediaProps {
  mediaType?: "video" | "image";
  mediaSrc: string;
  posterSrc?: string;
  bgImageSrc: string;
  /** Split into the two sliding lines at "|" (or at the first space when there is none). */
  title?: string;
  date?: string;
  scrollToExpand?: string;
  textBlend?: boolean;
  children?: ReactNode;
}

const KEYS_FORWARD = ["ArrowDown", "PageDown", " ", "End"];
const KEYS_BACK = ["ArrowUp", "PageUp", "Home"];

const ScrollExpandMedia = ({
  mediaType = "video",
  mediaSrc,
  posterSrc,
  bgImageSrc,
  title,
  date,
  scrollToExpand,
  textBlend,
  children,
}: ScrollExpandMediaProps) => {
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [showContent, setShowContent] = useState<boolean>(false);
  const [mediaFullyExpanded, setMediaFullyExpanded] = useState<boolean>(false);
  const [touchStartY, setTouchStartY] = useState<number>(0);
  const [isMobileState, setIsMobileState] = useState<boolean>(false);

  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Visitors who ask for less motion, or who land below the top (a #link, a reload), get the expanded state at once.
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const expandNow = reduce || window.scrollY > 5 || window.location.hash.length > 1;
    setScrollProgress(expandNow ? 1 : 0);
    setShowContent(expandNow);
    setMediaFullyExpanded(expandNow);
  }, [mediaType]);

  useEffect(() => {
    const apply = (next: number) => {
      const newProgress = Math.min(Math.max(next, 0), 1);
      setScrollProgress(newProgress);
      if (newProgress >= 1) {
        setMediaFullyExpanded(true);
        setShowContent(true);
      } else if (newProgress < 0.75) {
        setShowContent(false);
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (mediaFullyExpanded && e.deltaY < 0 && window.scrollY <= 5) {
        setMediaFullyExpanded(false);
        e.preventDefault();
      } else if (!mediaFullyExpanded) {
        e.preventDefault();
        apply(scrollProgress + e.deltaY * 0.0009);
      }
    };

    const handleKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && target.closest("input, textarea, select, button, a, [contenteditable]")) return;
      if (!mediaFullyExpanded && KEYS_FORWARD.includes(e.key)) {
        e.preventDefault();
        apply(e.key === "End" ? 1 : scrollProgress + 0.25);
      } else if (mediaFullyExpanded && KEYS_BACK.includes(e.key) && window.scrollY <= 5) {
        e.preventDefault();
        setMediaFullyExpanded(false);
        apply(0.75);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      setTouchStartY(e.touches[0].clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartY) return;

      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY;

      if (mediaFullyExpanded && deltaY < -20 && window.scrollY <= 5) {
        setMediaFullyExpanded(false);
        e.preventDefault();
      } else if (!mediaFullyExpanded) {
        e.preventDefault();
        // Higher sensitivity when scrolling back on touch screens
        const scrollFactor = deltaY < 0 ? 0.008 : 0.005;
        apply(scrollProgress + deltaY * scrollFactor);
        setTouchStartY(touchY);
      }
    };

    const handleTouchEnd = (): void => {
      setTouchStartY(0);
    };

    // Scrolling that did not come from the wheel or touch (menu #links, scrollbar drag, find-in-page)
    // must not be pulled back to the top: finish the expansion and let the page move.
    const handleScroll = (): void => {
      if (!mediaFullyExpanded && window.scrollY > 5) apply(1);
    };

    window.addEventListener("wheel", handleWheel as unknown as EventListener, { passive: false });
    window.addEventListener("keydown", handleKey);
    window.addEventListener("scroll", handleScroll as EventListener, { passive: true });
    window.addEventListener("touchstart", handleTouchStart as unknown as EventListener, { passive: false });
    window.addEventListener("touchmove", handleTouchMove as unknown as EventListener, { passive: false });
    window.addEventListener("touchend", handleTouchEnd as EventListener);

    return () => {
      window.removeEventListener("wheel", handleWheel as unknown as EventListener);
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("scroll", handleScroll as EventListener);
      window.removeEventListener("touchstart", handleTouchStart as unknown as EventListener);
      window.removeEventListener("touchmove", handleTouchMove as unknown as EventListener);
      window.removeEventListener("touchend", handleTouchEnd as EventListener);
    };
  }, [scrollProgress, mediaFullyExpanded, touchStartY]);

  useEffect(() => {
    const checkIfMobile = (): void => {
      setIsMobileState(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const mediaWidth = 300 + scrollProgress * (isMobileState ? 650 : 1250);
  const mediaHeight = 400 + scrollProgress * (isMobileState ? 200 : 400);
  const textTranslateX = scrollProgress * (isMobileState ? 180 : 150);

  const [firstWord, restOfTitle] = !title
    ? ["", ""]
    : title.includes("|")
      ? title.split("|").map((s) => s.trim())
      : [title.split(" ")[0], title.split(" ").slice(1).join(" ")];

  return (
    <div ref={sectionRef} className="transition-colors duration-700 ease-in-out overflow-x-hidden">
      <section className="relative flex flex-col items-center justify-start min-h-[100dvh]">
        <div className="relative w-full flex flex-col items-center min-h-[100dvh]">
          <motion.div
            className="absolute inset-0 z-0 h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 - scrollProgress }}
            transition={{ duration: 0.1 }}
          >
            <Image
              src={bgImageSrc}
              alt=""
              width={1920}
              height={1080}
              className="w-screen h-screen"
              style={{ objectFit: "cover", objectPosition: "center" }}
              priority
            />
            <div className="absolute inset-0 bg-[#0d1230]/60" />
          </motion.div>

          <div className="container mx-auto flex flex-col items-center justify-start relative z-10">
            <div className="flex flex-col items-center justify-center w-full h-[100dvh] relative">
              <div
                className="absolute z-0 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-none rounded-2xl"
                style={{
                  width: `${mediaWidth}px`,
                  height: `${mediaHeight}px`,
                  maxWidth: "95vw",
                  maxHeight: "85vh",
                  boxShadow: "0px 0px 50px rgba(0, 0, 0, 0.3)",
                }}
              >
                {mediaType === "video" ? (
                  <div className="relative w-full h-full pointer-events-none">
                    <video
                      src={mediaSrc}
                      poster={posterSrc}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="auto"
                      className="w-full h-full object-cover rounded-xl"
                      controls={false}
                      disablePictureInPicture
                      disableRemotePlayback
                    />
                    <motion.div
                      className="absolute inset-0 bg-black/30 rounded-xl"
                      initial={{ opacity: 0.7 }}
                      animate={{ opacity: 0.5 - scrollProgress * 0.3 }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                ) : (
                  <div className="relative w-full h-full">
                    <Image
                      src={mediaSrc}
                      alt={title?.replace("|", " ") || "Media content"}
                      width={1344}
                      height={752}
                      className="w-full h-full object-cover rounded-xl"
                      priority
                    />
                    <motion.div
                      className="absolute inset-0 bg-black/50 rounded-xl"
                      initial={{ opacity: 0.7 }}
                      animate={{ opacity: 0.7 - scrollProgress * 0.3 }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                )}

                <div className="flex flex-col items-center text-center relative z-10 mt-4 transition-none">
                  {date && (
                    <p
                      className="text-lg md:text-2xl font-semibold text-white"
                      style={{ transform: `translateX(-${textTranslateX}vw)` }}
                    >
                      {date}
                    </p>
                  )}
                  {scrollToExpand && (
                    <p
                      className="text-white/80 font-medium text-center"
                      style={{ transform: `translateX(${textTranslateX}vw)` }}
                    >
                      {scrollToExpand}
                    </p>
                  )}
                </div>
              </div>

              <div
                className={`flex items-center justify-center text-center gap-4 w-full relative z-10 transition-none flex-col ${
                  textBlend ? "mix-blend-difference" : "mix-blend-normal"
                }`}
              >
                <motion.h1
                  className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white transition-none [text-shadow:0_2px_24px_rgba(0,0,0,.45)]"
                  style={{ transform: `translateX(-${textTranslateX}vw)` }}
                >
                  {firstWord}
                </motion.h1>
                <motion.p
                  className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-center text-white transition-none [text-shadow:0_2px_24px_rgba(0,0,0,.45)]"
                  style={{ transform: `translateX(${textTranslateX}vw)` }}
                >
                  {restOfTitle}
                </motion.p>
              </div>
            </div>

            <motion.section
              className="flex flex-col w-full px-8 py-10 md:px-16 lg:py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: showContent ? 1 : 0 }}
              transition={{ duration: 0.7 }}
            >
              {children}
            </motion.section>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ScrollExpandMedia;
