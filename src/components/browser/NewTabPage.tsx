import {
  Clapperboard,
  Gamepad2,
  Globe,
  Music,
  Plus,
  Search,
  Sparkles,
  Tv,
  X,
  BookOpen,
  FileText,
  Video,
  Brain,
  Server,
  GraduationCap,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Battery,
  BatteryCharging,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";

import { useSettings } from "@/lib/settings";
import { useBookmarks } from "@/lib/bookmarks";
import { getFaviconUrl } from "@/lib/favicons";

type Props = {
  onNavigate: (input: string) => void;
  onOpenGames: () => void;
  onOpenSettings?: () => void;
};

export function NewTabPage({ onNavigate, onOpenGames }: Props) {
  const [value, setValue] = useState("");
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ label: "", url: "" });
  const [isFocused, setIsFocused] = useState(false);
  const { settings, update } = useSettings();
  const { bookmarks, addBookmark, removeBookmark } = useBookmarks();

  // Battery Level State
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isCharging, setIsCharging] = useState(false);

  useEffect(() => {
    if (typeof navigator !== "undefined" && "getBattery" in navigator) {
      interface BatteryObj {
        level: number;
        charging: boolean;
        addEventListener: (type: string, listener: () => void) => void;
        removeEventListener: (type: string, listener: () => void) => void;
      }
      const nav = navigator as unknown as { getBattery: () => Promise<BatteryObj> };
      nav.getBattery().then((battery) => {
        const updateBattery = () => {
          setBatteryLevel(Math.round(battery.level * 100));
          setIsCharging(battery.charging);
        };
        updateBattery();
        battery.addEventListener("levelchange", updateBattery);
        battery.addEventListener("chargingchange", updateBattery);
        return () => {
          battery.removeEventListener("levelchange", updateBattery);
          battery.removeEventListener("chargingchange", updateBattery);
        };
      });
    } else {
      // Fallback static battery level if blocked by iframe sandboxing permissions
      setBatteryLevel(100);
      setIsCharging(false);
    }
  }, []);

  // Clock state
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Timer/Pomodoro State
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [timerMode, setTimerMode] = useState<"focus" | "break">("focus");

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Toggle modes when complete
            const nextMode = timerMode === "focus" ? "break" : "focus";
            setTimerMode(nextMode);
            return nextMode === "focus" ? 25 * 60 : 5 * 60;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timerMode]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning, Scholar";
    if (hour < 17) return "Afternoon Focus Session";
    return "Evening Study Hours";
  };

  const timerPercentage =
    timerMode === "focus" ? (timeLeft / (25 * 60)) * 100 : (timeLeft / (5 * 60)) * 100;

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-between bg-black bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px] text-neutral-200 font-sans px-6 py-12 select-none overflow-y-auto no-scrollbar">
      {/* Top Section - Live Status Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex w-full max-w-4xl justify-between items-center border border-neutral-900 bg-neutral-950/80 backdrop-blur-md px-6 py-3 rounded-2xl shadow-sm mb-4"
      >
        {/* Academic Motto / Focus Mode Status */}
        <div className="flex items-center gap-2.5 text-xs font-medium text-neutral-400">
          <div className="h-1.5 w-1.5 rounded-full bg-neutral-400 animate-pulse" />
          <span>{getGreeting()}</span>
        </div>

        {/* Live Clock & Battery Info */}
        <div className="flex items-center gap-4.5 text-sm font-semibold tracking-wide text-neutral-200 font-sans">
          {/* Clock */}
          <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-neutral-500" />
            <span className="font-medium">
              {currentTime
                .toLocaleTimeString([], {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })
                .toUpperCase()}
            </span>
          </div>

          {/* Divider */}
          <div className="h-3.5 w-[1px] bg-neutral-800" />

          {/* Battery */}
          <div className="flex items-center gap-2">
            {isCharging ? (
              <BatteryCharging className="h-4 w-4 text-white animate-pulse" />
            ) : (
              <Battery
                className={`h-4 w-4 ${(batteryLevel ?? 100) < 20 ? "text-neutral-500 animate-bounce" : "text-neutral-500"}`}
              />
            )}
            <span className="text-xs font-semibold text-neutral-400">
              {batteryLevel !== null ? `${batteryLevel}%` : "100%"}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Center Main Workspace */}
      <div className="flex flex-col items-center justify-center w-full max-w-2xl my-auto py-4">
        {/* Floating Brand Title and Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
          className="group flex flex-col items-center mb-8 cursor-pointer relative"
        >
          {/* Subtle Background Glow behind logo */}
          <div className="absolute -top-10 w-44 h-44 bg-white/5 rounded-full blur-3xl opacity-40 group-hover:opacity-75 transition-opacity duration-700" />

          {/* Premium Logo Frame */}
          <motion.div
            whileHover={{ rotate: 3, scale: 1.05 }}
            transition={{ type: "spring", stiffness: 200, damping: 12 }}
            className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0f0f0f] border border-neutral-800/80 shadow-md mb-4"
          >
            <GraduationCap className="h-9 w-9 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]" />
          </motion.div>

          <span className="text-4xl font-semibold tracking-tight leading-none text-neutral-100 font-sans transition-all group-hover:text-white">
            StudyHub
          </span>

          <span className="text-xs text-neutral-500 font-normal mt-1.5 tracking-wider uppercase opacity-80">
            {settings.discreetMode ? "isolated research environment" : "unified academic sandbox"}
          </span>
        </motion.div>

        {/* Command Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="w-full max-w-[580px] mb-8"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (value.trim()) onNavigate(value);
            }}
            className={`flex items-center gap-3 rounded-2xl border bg-neutral-950 pl-4.5 pr-2.5 py-2.5 transition-all duration-300 ${
              isFocused
                ? "border-neutral-500 shadow-[0_0_20px_rgba(255,255,255,0.08)] ring-1 ring-neutral-500/20"
                : "border-neutral-800 hover:border-neutral-700"
            }`}
          >
            <Search className="h-4 w-4 shrink-0 text-neutral-500" />
            <input
              value={value}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Search for Query or URL..."
              spellCheck={false}
              autoFocus
              className="flex-1 min-w-0 bg-transparent text-sm text-neutral-100 outline-none placeholder:text-neutral-600 font-normal tracking-wide"
            />

            {/* Hidden submit button to support mobile browser keyboards pressing Enter/Go */}
            <button type="submit" className="hidden" aria-hidden="true" />

            {/* Private/Standard Engine Dropdown */}
            <select
              value={settings.searchEngine}
              onChange={(e) => update({ searchEngine: e.target.value })}
              className="rounded-xl bg-neutral-900 border border-neutral-800 px-3 py-1 text-xs text-neutral-300 outline-none hover:text-white cursor-pointer hover:border-neutral-700 transition-all duration-200 shrink-0"
            >
              <option value="https://duckduckgo.com/?q=%s">DuckDuckGo</option>
              <option value="https://www.google.com/search?q=%s">Google</option>
              <option value="https://search.brave.com/search?q=%s">Brave</option>
              <option value="https://search.yahoo.com/search?p=%s">Yahoo</option>
            </select>
          </form>
        </motion.div>

        {/* Dynamic Quick Access Bookmarks Grid */}
        <div className="flex flex-wrap items-center justify-center gap-10 max-w-lg w-full mb-10">
          {bookmarks.map((b) => {
            const isGames =
              b.url === "frosted://games" ||
              b.title.toLowerCase() === "games" ||
              b.title.toLowerCase() === "lessons" ||
              b.title.toLowerCase() === "play lessons";
            const isMovies =
              b.title.toLowerCase() === "movies" || b.title.toLowerCase() === "study videos";
            const isMusic = b.title.toLowerCase() === "music";
            const isAI = b.title.toLowerCase() === "ai";
            const isVMs = b.title.toLowerCase() === "vms";

            let displayTitle = b.title;
            const lowerTitle = b.title.toLowerCase();
            const lowerUrl = b.url.toLowerCase();
            let iconType:
              | "book"
              | "video"
              | "audio"
              | "brain"
              | "server"
              | "search"
              | "group"
              | "repo"
              | "encyclopedia"
              | "general" = "general";

            if (settings.discreetMode) {
              if (isGames) {
                displayTitle = "Study Modules";
                iconType = "book";
              } else if (
                isMovies ||
                lowerTitle.includes("youtube") ||
                lowerTitle.includes("movie") ||
                lowerTitle.includes("netflix") ||
                lowerTitle.includes("twitch") ||
                lowerUrl.includes("youtube.com") ||
                lowerUrl.includes("netflix.com") ||
                lowerUrl.includes("twitch.tv")
              ) {
                displayTitle = "Lecture Media";
                iconType = "video";
              } else if (
                isMusic ||
                lowerTitle.includes("spotify") ||
                lowerTitle.includes("soundcloud") ||
                lowerTitle.includes("music") ||
                lowerTitle.includes("songs") ||
                lowerUrl.includes("spotify.com") ||
                lowerUrl.includes("soundcloud.com")
              ) {
                displayTitle = "Audio Library";
                iconType = "audio";
              } else if (
                isAI ||
                lowerTitle.includes("gpt") ||
                lowerTitle.includes("openai") ||
                lowerTitle.includes("gemini") ||
                lowerTitle.includes("claude") ||
                lowerTitle.includes("ai") ||
                lowerUrl.includes("chatgpt.com") ||
                lowerUrl.includes("openai.com") ||
                lowerUrl.includes("gemini.google.com") ||
                lowerUrl.includes("claude.ai")
              ) {
                displayTitle = "Syllabus AI";
                iconType = "brain";
              } else if (
                isVMs ||
                lowerTitle.includes("vm") ||
                lowerTitle.includes("vms") ||
                lowerTitle.includes("virtual") ||
                lowerUrl.includes("vmware") ||
                lowerUrl.includes("virtualbox")
              ) {
                displayTitle = "Lab Resources";
                iconType = "server";
              } else if (lowerTitle.includes("google") || lowerUrl.includes("google.com")) {
                displayTitle = "Research Engine";
                iconType = "search";
              } else if (
                lowerTitle.includes("discord") ||
                lowerUrl.includes("discord.com") ||
                lowerUrl.includes("discord.gg")
              ) {
                displayTitle = "Study Group";
                iconType = "group";
              } else if (lowerTitle.includes("github") || lowerUrl.includes("github.com")) {
                displayTitle = "Student Repo";
                iconType = "book";
              } else if (lowerTitle.includes("wikipedia") || lowerUrl.includes("wikipedia.org")) {
                displayTitle = "Encyclopedia";
                iconType = "book";
              } else {
                iconType = "general";
              }
            }

            let renderIcon;
            if (settings.discreetMode) {
              switch (iconType) {
                case "book":
                  renderIcon = <BookOpen className="h-6 w-6 text-white" />;
                  break;
                case "video":
                  renderIcon = <Video className="h-6 w-6 text-white" />;
                  break;
                case "audio":
                  renderIcon = <FileText className="h-6 w-6 text-white" />;
                  break;
                case "brain":
                  renderIcon = <Brain className="h-6 w-6 text-white" />;
                  break;
                case "server":
                  renderIcon = <Server className="h-6 w-6 text-white" />;
                  break;
                case "search":
                  renderIcon = <Search className="h-6 w-6 text-white" />;
                  break;
                case "group":
                  renderIcon = <GraduationCap className="h-6 w-6 text-white" />;
                  break;
                default:
                  renderIcon = <FileText className="h-6 w-6 text-white" />;
                  break;
              }
            } else {
              if (isGames) {
                renderIcon = <Gamepad2 className="h-6 w-6 text-white" />;
              } else if (isMovies) {
                renderIcon = <Clapperboard className="h-6 w-6 text-white" />;
              } else if (isMusic) {
                renderIcon = <Music className="h-6 w-6 text-white" />;
              } else if (isAI) {
                renderIcon = <Sparkles className="h-6 w-6 text-white" />;
              } else if (isVMs) {
                renderIcon = <Tv className="h-6 w-6 text-white" />;
              } else {
                renderIcon = (
                  <>
                    <img
                      src={getFaviconUrl(b.url)}
                      alt=""
                      className="h-7 w-7 object-contain rounded-md"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        const sibling = e.currentTarget.nextElementSibling as HTMLElement;
                        if (sibling) sibling.style.display = "block";
                      }}
                    />
                    <Globe className="h-6 w-6 text-neutral-400 hidden" />
                  </>
                );
              }
            }

            return (
              <div key={b.id} className="group relative flex flex-col items-center w-20">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    if (isGames) {
                      onOpenGames();
                    } else {
                      onNavigate(b.url);
                    }
                  }}
                  className="flex h-16 w-16 items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-950 hover:bg-neutral-900 hover:border-neutral-700 transition-all cursor-pointer relative shadow-md"
                >
                  {renderIcon}
                </motion.button>
                <span className="mt-2.5 text-xs text-neutral-400 font-medium group-hover:text-white transition-colors truncate max-w-full text-center">
                  {displayTitle}
                </span>

                {/* Delete button on hover */}
                {!isGames && (
                  <button
                    aria-label={`Delete ${b.title}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeBookmark(b.id);
                    }}
                    className="absolute -top-1.5 -right-1.5 hidden group-hover:flex h-5 w-5 items-center justify-center rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800 shadow-md transition-colors cursor-pointer z-10"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            );
          })}

          {/* Add custom bookmark button */}
          <div className="flex flex-col items-center w-20">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setAdding(!adding)}
              className="flex h-16 w-16 items-center justify-center rounded-2xl border border-dashed border-neutral-800 hover:border-neutral-600 bg-black hover:bg-neutral-900 transition-all cursor-pointer shadow-md"
            >
              <Plus className="h-6 w-6 text-neutral-500 hover:text-neutral-300" />
            </motion.button>
            <span className="mt-2.5 text-xs text-neutral-500 font-medium">Add Shortcut</span>
          </div>
        </div>

        {/* Add Bookmark form overlay */}
        <AnimatePresence>
          {adding && (
            <motion.form
              initial={{ opacity: 0, y: 12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ duration: 0.2 }}
              onSubmit={(e) => {
                e.preventDefault();
                if (!draft.label.trim() || !draft.url.trim()) return;
                addBookmark(draft.label.trim(), draft.url.trim());
                setDraft({ label: "", url: "" });
                setAdding(false);
              }}
              className="mb-8 flex flex-wrap items-center gap-2.5 rounded-2xl border border-neutral-800 bg-[#0d0d0d] p-3.5 shadow-2xl"
            >
              <input
                autoFocus
                value={draft.label}
                onChange={(e) => setDraft({ ...draft, label: e.target.value })}
                placeholder="Name (e.g. Wikipedia)"
                className="w-36 rounded-xl bg-black border border-neutral-800 px-3 py-2 text-xs text-white outline-none focus:border-neutral-600 transition-colors"
              />
              <input
                value={draft.url}
                onChange={(e) => setDraft({ ...draft, url: e.target.value })}
                placeholder="URL (e.g. wikipedia.org)"
                className="w-48 rounded-xl bg-black border border-neutral-800 px-3 py-2 text-xs text-white outline-none focus:border-neutral-600 transition-colors"
              />
              <button
                type="submit"
                className="rounded-xl bg-white px-4 py-2 text-xs font-semibold text-black hover:bg-neutral-200 active:scale-95 transition-all cursor-pointer"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setAdding(false)}
                className="rounded-xl border border-neutral-800 px-3 py-2 text-xs text-neutral-400 hover:text-white hover:bg-neutral-900 transition-all cursor-pointer"
              >
                Cancel
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
