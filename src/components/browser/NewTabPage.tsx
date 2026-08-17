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
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

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

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center bg-black bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:52px_52px] text-neutral-200 font-sans px-4 py-8 select-none overflow-y-auto">
      {/* Center content container */}
      <div className="flex flex-col items-center justify-center w-full max-w-2xl py-8">
        {/* Large wordmark: "frosted" with hover animation, underline, and glow */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover="hover"
          transition={{ duration: 0.35 }}
          className="group flex flex-col items-center select-none mb-10 cursor-pointer"
        >
          <motion.span
            variants={{
              rest: { scale: 1, tracking: "0em" },
              hover: { scale: 1.05, tracking: "0.02em" },
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`text-[76px] font-normal leading-none font-sans transition-colors group-hover:text-white ${
              settings.discreetMode
                ? "text-neutral-300 drop-shadow-[0_0_10px_rgba(255,255,255,0.05)] text-[64px]"
                : "text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            }`}
          >
            {settings.discreetMode ? "study portal" : "StudyHub"}
          </motion.span>
          <motion.div
            variants={{
              rest: { width: "250px", opacity: 0.9, scaleX: 1 },
              hover: { width: "290px", opacity: 1, scaleX: 1.08 },
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="h-[4px] bg-white relative mt-3 shadow-[0_0_20px_rgba(255,255,255,0.95)] group-hover:shadow-[0_0_30px_rgba(255,255,255,1)]"
          />
        </motion.div>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25, delay: 0.05 }}
          className="w-full max-w-[580px] mb-8"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (value.trim()) onNavigate(value);
            }}
            className={`flex items-center gap-3 rounded-xl border bg-black/90 px-4 py-3 transition-all ${
              isFocused
                ? "border-neutral-500 shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                : "border-neutral-800/80 hover:border-neutral-700"
            }`}
          >
            <Search className="h-4 w-4 shrink-0 text-neutral-400" />
            <input
              value={value}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onChange={(e) => setValue(e.target.value)}
              placeholder={
                settings.discreetMode
                  ? "Search database or type a URL..."
                  : "Search DuckDuckGo or type a URL"
              }
              spellCheck={false}
              autoFocus
              className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-neutral-500 font-light"
            />

            {/* Dropdown Selector Badge */}
            <select
              value={settings.searchEngine}
              onChange={(e) => update({ searchEngine: e.target.value })}
              className="rounded-lg bg-[#0a0a0a] border border-neutral-800/80 px-2.5 py-1 text-xs text-neutral-300 outline-none hover:text-white cursor-pointer hover:border-neutral-700 transition-colors"
            >
              <option value="https://duckduckgo.com/?q=%s">DuckDuckGo</option>
              <option value="https://www.google.com/search?q=%s">Google</option>
              <option value="https://www.bing.com/search?q=%s">Bing</option>
              <option value="https://search.brave.com/search?q=%s">Brave</option>
              <option value="https://search.yahoo.com/search?p=%s">Yahoo</option>
            </select>
          </form>
        </motion.div>

        {/* Dynamic Quick Access Bookmarks Grid */}
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-6 max-w-lg w-full">
          {bookmarks.map((b) => {
            const isGames =
              b.url === "frosted://games" ||
              b.title.toLowerCase() === "games" ||
              b.title.toLowerCase() === "play lessons";
            const isMovies = b.title.toLowerCase() === "movies";
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
                      className="h-7 w-7 object-contain rounded-sm"
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
              <div key={b.id} className="group relative flex flex-col items-center w-16">
                <button
                  onClick={() => {
                    if (isGames) {
                      onOpenGames();
                    } else {
                      onNavigate(b.url);
                    }
                  }}
                  className="flex h-14 w-14 items-center justify-center rounded-full border border-neutral-800/80 bg-black hover:bg-neutral-900/80 hover:border-neutral-700 transition-all cursor-pointer relative shadow-sm"
                >
                  {renderIcon}
                </button>
                <span className="mt-2 text-xs text-neutral-300 font-normal group-hover:text-white transition-colors truncate max-w-full text-center">
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
                    className="absolute -top-1 -right-1 hidden group-hover:flex h-4 w-4 items-center justify-center rounded-full bg-neutral-900 border border-neutral-700 text-neutral-400 hover:text-white shadow-sm transition-colors cursor-pointer z-10"
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                )}
              </div>
            );
          })}

          {/* Add custom bookmark button */}
          <div className="flex flex-col items-center w-16">
            <button
              onClick={() => setAdding(!adding)}
              className="flex h-14 w-14 items-center justify-center rounded-full border border-neutral-800/80 bg-black hover:bg-neutral-900/80 hover:border-neutral-700 transition-all cursor-pointer shadow-sm"
            >
              <Plus className="h-6 w-6 text-neutral-200" />
            </button>
            <span className="mt-2 text-xs text-neutral-300 font-normal">Add</span>
          </div>
        </div>

        {/* Add Bookmark form overlay */}
        {adding && (
          <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={(e) => {
              e.preventDefault();
              if (!draft.label.trim() || !draft.url.trim()) return;
              addBookmark(draft.label.trim(), draft.url.trim());
              setDraft({ label: "", url: "" });
              setAdding(false);
            }}
            className="mt-6 flex flex-wrap items-center gap-2 rounded-xl border border-neutral-800 bg-[#0d0d0d] p-3 shadow-md"
          >
            <input
              autoFocus
              value={draft.label}
              onChange={(e) => setDraft({ ...draft, label: e.target.value })}
              placeholder="Name (e.g. Wiki)"
              className="w-32 rounded bg-black border border-neutral-800 px-3 py-1.5 text-xs text-white outline-none focus:border-neutral-600"
            />
            <input
              value={draft.url}
              onChange={(e) => setDraft({ ...draft, url: e.target.value })}
              placeholder="URL (e.g. wikipedia.org)"
              className="w-48 rounded bg-black border border-neutral-800 px-3 py-1.5 text-xs text-white outline-none focus:border-neutral-600"
            />
            <button
              type="submit"
              className="rounded bg-white px-3.5 py-1.5 text-xs font-semibold text-black hover:opacity-90 transition-opacity"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setAdding(false)}
              className="rounded border border-neutral-800 px-3 py-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
          </motion.form>
        )}
      </div>
    </div>
  );
}
