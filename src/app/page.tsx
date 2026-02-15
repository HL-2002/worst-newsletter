"use client";

import { useState, useRef, useCallback, useEffect } from "react";

/* ─── Country prefixes ─── */
const COUNTRY_PREFIXES = [
  { prefix: "+1", country: "US/Canada" },
  { prefix: "+7", country: "Russia" },
  { prefix: "+20", country: "Egypt" },
  { prefix: "+27", country: "South Africa" },
  { prefix: "+30", country: "Greece" },
  { prefix: "+31", country: "Netherlands" },
  { prefix: "+33", country: "France" },
  { prefix: "+34", country: "Spain" },
  { prefix: "+36", country: "Hungary" },
  { prefix: "+39", country: "Italy" },
  { prefix: "+40", country: "Romania" },
  { prefix: "+41", country: "Switzerland" },
  { prefix: "+44", country: "UK" },
  { prefix: "+45", country: "Denmark" },
  { prefix: "+46", country: "Sweden" },
  { prefix: "+47", country: "Norway" },
  { prefix: "+48", country: "Poland" },
  { prefix: "+49", country: "Germany" },
  { prefix: "+51", country: "Peru" },
  { prefix: "+52", country: "Mexico" },
  { prefix: "+53", country: "Cuba" },
  { prefix: "+54", country: "Argentina" },
  { prefix: "+55", country: "Brazil" },
  { prefix: "+56", country: "Chile" },
  { prefix: "+57", country: "Colombia" },
  { prefix: "+58", country: "Venezuela" },
  { prefix: "+60", country: "Malaysia" },
  { prefix: "+61", country: "Australia" },
  { prefix: "+62", country: "Indonesia" },
  { prefix: "+63", country: "Philippines" },
  { prefix: "+64", country: "New Zealand" },
  { prefix: "+65", country: "Singapore" },
  { prefix: "+66", country: "Thailand" },
  { prefix: "+81", country: "Japan" },
  { prefix: "+82", country: "South Korea" },
  { prefix: "+86", country: "China" },
  { prefix: "+90", country: "Turkey" },
  { prefix: "+91", country: "India" },
  { prefix: "+92", country: "Pakistan" },
  { prefix: "+93", country: "Afghanistan" },
  { prefix: "+94", country: "Sri Lanka" },
  { prefix: "+95", country: "Myanmar" },
  { prefix: "+98", country: "Iran" },
  { prefix: "+212", country: "Morocco" },
  { prefix: "+213", country: "Algeria" },
  { prefix: "+234", country: "Nigeria" },
  { prefix: "+254", country: "Kenya" },
  { prefix: "+351", country: "Portugal" },
  { prefix: "+352", country: "Luxembourg" },
  { prefix: "+353", country: "Ireland" },
  { prefix: "+354", country: "Iceland" },
  { prefix: "+358", country: "Finland" },
  { prefix: "+380", country: "Ukraine" },
  { prefix: "+420", country: "Czech Republic" },
  { prefix: "+421", country: "Slovakia" },
  { prefix: "+502", country: "Guatemala" },
  { prefix: "+503", country: "El Salvador" },
  { prefix: "+504", country: "Honduras" },
  { prefix: "+505", country: "Nicaragua" },
  { prefix: "+506", country: "Costa Rica" },
  { prefix: "+507", country: "Panama" },
  { prefix: "+593", country: "Ecuador" },
  { prefix: "+595", country: "Paraguay" },
  { prefix: "+598", country: "Uruguay" },
  { prefix: "+852", country: "Hong Kong" },
  { prefix: "+886", country: "Taiwan" },
  { prefix: "+966", country: "Saudi Arabia" },
  { prefix: "+971", country: "UAE" },
  { prefix: "+972", country: "Israel" },
];

/* ─── Phase 3 random fields ─── */
const PHASE3_FIELDS = [
  "Second Middle Name",
  "Hour of Birth (exact minute)",
  "Blood Type",
  "Shoe Size (in centimeters)",
  "Favorite Prime Number",
  "Mother's Maiden Name's Anagram",
  "Pet's Zodiac Sign",
  "WiFi Password (home)",
  "Number of Houseplants",
  "Last Dream You Remember",
  "Preferred Elevator Music Genre",
  "Cereal Eating Method (dry/wet/soup)",
  "Times You've Seen a Rainbow",
  "Socks Color Right Now",
  "Opinion on Pineapple Pizza (essay)",
  "Childhood Imaginary Friend's Name",
  "Furthest You've Thrown a Paper Airplane (meters)",
  "How Many Tabs Open Right Now",
  "Last Thing You Googled",
  "Preferred Microwave Beep Count",
  "Spirit Animal (be specific)",
  "Backup Spirit Animal",
  "Emergency Spirit Animal",
];

/* ─── Waste-o-meter activities ─── */
const WASTE_ACTIVITIES = [
  { name: "Build a full app with Kilo Code", time: 120, emoji: "🚀" },
  { name: "Watch a One Piece episode", time: 24 * 60, emoji: "🏴‍☠️" },
  { name: "Microwave a burrito", time: 90, emoji: "🌯" },
  { name: "Pet a dog", time: 30, emoji: "🐕" },
  { name: "Stare at the ceiling existentially", time: 45, emoji: "😶" },
  { name: "Learn to say 'hello' in 3 languages", time: 60, emoji: "🌍" },
  { name: "Make instant ramen", time: 180, emoji: "🍜" },
  { name: "Take a power nap", time: 300, emoji: "😴" },
  { name: "Write a haiku about regret", time: 60, emoji: "📝" },
  { name: "Scroll TikTok", time: 1, emoji: "📱", note: "(but you'd never stop)" },
  { name: "Doomscroll Twitter/X", time: 0, emoji: "🕳️", note: "(∞ — you'd still be scrolling)" },
  { name: "Contemplate the void", time: 15, emoji: "🌀" },
  { name: "Organize your desktop icons", time: 120, emoji: "🖥️" },
  { name: "Listen to the entire Bee Movie script", time: 5400, emoji: "🐝" },
  { name: "Blink", time: 0.4, emoji: "👁️" },
  { name: "Boil water for tea", time: 180, emoji: "🍵" },
  { name: "Do 10 push-ups", time: 30, emoji: "💪" },
  { name: "Regret filling out this form", time: 5, emoji: "😭" },
];

/* ─── Random date helper ─── */
function randomDate(after?: Date, before?: Date): Date {
  const min = after ? after.getTime() : new Date(0, 0, 1).getTime();
  const max = before ? before.getTime() : new Date(9999, 11, 31).getTime();
  if (min >= max) return new Date(min);
  return new Date(min + Math.random() * (max - min));
}

function formatDate(d: Date): string {
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/* ─── 90s Infomercial Ads ─── */
const INFOMERCIAL_ADS = [
  {
    title: "🔥 MEGA SLICER 3000 🔥",
    body: "It slices! It dices! It makes julienne fries! ORDER NOW and get a SECOND Mega Slicer absolutely FREE!*",
    fine: "*Just pay separate processing and handling of $49.99",
    bg: "linear-gradient(135deg, #ff6600, #ff0066)",
    phone: "1-800-SLICER",
  },
  {
    title: "💪 AB-BLASTER EXTREME 💪",
    body: "Get ROCK HARD ABS in just 3 minutes a day! As seen on TV! Results NOT typical!",
    fine: "Consult your doctor. Side effects include looking TOO good.",
    bg: "linear-gradient(135deg, #cc0000, #990066)",
    phone: "1-800-ABS-NOW",
  },
  {
    title: "🧹 SUPER SHAMWOW DELUXE 🧹",
    body: "It holds 20x its weight in liquid! You'll say WOW every time! German engineering!",
    fine: "Not actually German. Not actually engineering.",
    bg: "linear-gradient(135deg, #0066cc, #00cccc)",
    phone: "1-800-SHAMWOW",
  },
  {
    title: "💎 CUBIC ZIRCONIA COLLECTION 💎",
    body: "REAL* diamonds at UNREAL prices! Each stone is hand-inspected by our team of experts!",
    fine: "*Not real diamonds. Experts are interns.",
    bg: "linear-gradient(135deg, #9900cc, #ff66cc)",
    phone: "1-800-BLING",
  },
  {
    title: "🍳 SET IT AND FORGET IT! 🍳",
    body: "The Ronco Rotisserie! Makes perfect chicken EVERY time! Your family will LOVE you!",
    fine: "Family love not guaranteed. Chicken may vary.",
    bg: "linear-gradient(135deg, #cc6600, #ffcc00)",
    phone: "1-800-RONCO",
  },
  {
    title: "📞 PSYCHIC HOTLINE 📞",
    body: "Miss Cleo KNOWS your future! Call NOW for your FREE* reading! The cards never lie!",
    fine: "*First 30 seconds free. $4.99/min after. For entertainment only.",
    bg: "linear-gradient(135deg, #330066, #6600cc)",
    phone: "1-900-PSYCHIC",
  },
  {
    title: "🎵 NOW THAT'S WHAT I CALL MUSIC 🎵",
    body: "47 ORIGINAL hits! Macarena! MMMBop! Barbie Girl! All on ONE CD! Not available in stores!",
    fine: "Available in stores. We lied.",
    bg: "linear-gradient(135deg, #009900, #66ff00)",
    phone: "1-800-MUSIC",
  },
  {
    title: "🦷 DENTAWHITE 9000 🦷",
    body: "Whiter teeth in SECONDS! Just apply and SMILE! Dentists HATE this one weird trick!",
    fine: "Dentists don't hate it. They've never heard of it.",
    bg: "linear-gradient(135deg, #ffffff, #66ccff)",
    phone: "1-800-TEETH",
  },
  {
    title: "🏋️ THIGHMASTER ULTRA 🏋️",
    body: "Suzanne Somers approved! Tone your thighs while watching TV! It's THAT easy!",
    fine: "Nothing is that easy. Suzanne was paid.",
    bg: "linear-gradient(135deg, #ff3399, #ff9933)",
    phone: "1-800-THIGHS",
  },
  {
    title: "🌊 CHIA PET PLATINUM EDITION 🌊",
    body: "Ch-ch-ch-CHIA! The pottery that GROWS! New shapes: Chia Biden! Chia Shrek! Chia Chia Pet!",
    fine: "Seeds may not sprout. Chia Shrek is just a green blob.",
    bg: "linear-gradient(135deg, #006600, #33cc33)",
    phone: "1-800-CHIA",
  },
  {
    title: "⚡ FLEX TAPE ⚡",
    body: "I SAWED THIS BOAT IN HALF! And repaired it with ONLY Flex Tape! That's a LOT of damage!",
    fine: "Do not saw boats in half. We are not responsible.",
    bg: "linear-gradient(135deg, #000000, #333333)",
    phone: "1-800-FLEX",
  },
  {
    title: "🎮 GAME GENIE ULTRA 🎮",
    body: "UNLIMITED LIVES! INFINITE POWER! Beat ANY game with our SECRET codes! Your friends will be JEALOUS!",
    fine: "Friends may stop playing with you entirely.",
    bg: "linear-gradient(135deg, #0000cc, #6666ff)",
    phone: "1-800-GENIE",
  },
];

interface AdState {
  id: number;
  adIndex: number;
  x: number;
  y: number;
}

/* ─── Draggable Ad Component ─── */
function InfomercialAd({
  ad,
  position,
  onDragStart,
  onDragMove,
  onDragEnd,
  onClose,
  onMinimize,
}: {
  ad: (typeof INFOMERCIAL_ADS)[number];
  position: { x: number; y: number };
  onDragStart: (e: React.PointerEvent) => void;
  onDragMove: (e: React.PointerEvent) => void;
  onDragEnd: () => void;
  onClose: () => void;
  onMinimize: () => void;
}) {
  return (
    <div
      onPointerDown={onDragStart}
      onPointerMove={onDragMove}
      onPointerUp={onDragEnd}
      onPointerCancel={onDragEnd}
      style={{
        position: "fixed",
        left: position.x,
        top: position.y,
        zIndex: 9999,
        width: 280,
        background: ad.bg,
        border: "4px outset #ffcc00",
        boxShadow: "4px 4px 0px #000, inset 0 0 20px rgba(255,255,255,0.2)",
        fontFamily: '"Comic Sans MS", cursive',
        cursor: "grab",
        touchAction: "none",
        userSelect: "none",
      }}
    >
      {/* Title bar */}
      <div
        style={{
          background: "linear-gradient(90deg, #000080, #1084d0)",
          padding: "2px 6px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "2px solid #ffcc00",
        }}
      >
        <span style={{ color: "#fff", fontSize: 11, fontWeight: "bold" }}>
          ⚠️ SPECIAL OFFER ⚠️
        </span>
        <span style={{ display: "flex", gap: 2 }}>
          <span
            style={{
              background: "#c0c0c0",
              border: "2px outset #fff",
              width: 16,
              height: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: "bold",
              color: "#000",
              cursor: "pointer",
            }}
            title="Minimize"
            onClick={(e) => {
              e.stopPropagation();
              onMinimize();
            }}
          >
            ─
          </span>
          <span
            style={{
              background: "#c0c0c0",
              border: "2px outset #fff",
              width: 16,
              height: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 10,
              fontWeight: "bold",
              color: "#000",
              cursor: "pointer",
            }}
            title="Close"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            ✕
          </span>
        </span>
      </div>
      {/* Content */}
      <div style={{ padding: 10 }}>
        <h3
          style={{
            color: "#ffff00",
            fontSize: 16,
            fontWeight: "bold",
            textAlign: "center",
            textShadow: "2px 2px 0px #000",
            marginBottom: 6,
          }}
        >
          {ad.title}
        </h3>
        <p
          style={{
            color: "#fff",
            fontSize: 12,
            textAlign: "center",
            marginBottom: 8,
            textShadow: "1px 1px 0px #000",
          }}
        >
          {ad.body}
        </p>
        <div
          style={{
            background: "#ffff00",
            color: "#cc0000",
            fontWeight: "bold",
            fontSize: 14,
            textAlign: "center",
            padding: "4px 8px",
            border: "2px solid #cc0000",
            marginBottom: 6,
          }}
        >
          CALL NOW: {ad.phone}
        </div>
        <p
          style={{
            color: "rgba(255,255,255,0.5)",
            fontSize: 8,
            textAlign: "center",
          }}
        >
          {ad.fine}
        </p>
        <div
          style={{
            textAlign: "center",
            marginTop: 6,
          }}
        >
          <span
            style={{
              background: "#ff0000",
              color: "#fff",
              fontWeight: "bold",
              fontSize: 11,
              padding: "2px 10px",
              border: "2px outset #ff6666",
              cursor: "pointer",
              display: "inline-block",
            }}
            onClick={(e) => {
              e.stopPropagation();
              alert("📞 Just kidding! There's nothing to order. But thanks for clicking!");
            }}
          >
            🛒 ORDER NOW!!!
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─── Marquee text ─── */
function MarqueeText({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`overflow-hidden whitespace-nowrap ${className ?? ""}`}>
      <div className="inline-block animate-marquee">{children}</div>
    </div>
  );
}

/* ─── Blink text ─── */
function BlinkText({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={`animate-blink ${className ?? ""}`}>{children}</span>;
}

/* ─── Main Component ─── */
export default function Home() {
  // Phase: 1 = basic form, 2 = extended form, 3 = chaos form, 4 = newsletter
  const [phase, setPhase] = useState<1 | 2 | 3 | 4>(1);
  const [startTime] = useState<number>(() => Date.now());
  const [endTime, setEndTime] = useState<number | null>(null);

  // Phase 1 fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Phase 2 fields
  const [middleName, setMiddleName] = useState("");
  const [birthDate, setBirthDate] = useState<Date>(randomDate());
  const [birthLower, setBirthLower] = useState<Date>(new Date(0, 0, 1));
  const [birthUpper, setBirthUpper] = useState<Date>(new Date(9999, 11, 31));
  const [countryPrefix, setCountryPrefix] = useState("");

  // Phase 3 fields
  const [phase3Values, setPhase3Values] = useState<Record<string, string>>({});
  const [fieldMapping, setFieldMapping] = useState<number[]>([]);

  // Fade mechanic
  const [charCount, setCharCount] = useState(0);
  const [unfadeUsed, setUnfadeUsed] = useState(false);

  // Warning messages
  const [showWarning1, setShowWarning1] = useState(false);
  const [showWarning2, setShowWarning2] = useState(false);

  // Visitor number (stable across re-renders)
  const [visitorNumber] = useState(() =>
    String(Math.floor(Math.random() * 999999)).padStart(6, "0")
  );

  // Refs for phase 3 inputs
  const phase3Refs = useRef<(HTMLInputElement | null)[]>([]);

  // Ads state
  const [ads, setAds] = useState<AdState[]>([]);
  const adCountRef = useRef(0);
  const dragRef = useRef<{ adId: number; offsetX: number; offsetY: number } | null>(null);

  // Spawn an ad every 60 seconds
  useEffect(() => {
    const spawnAd = () => {
      const id = adCountRef.current++;
      const adIndex = id % INFOMERCIAL_ADS.length;
      // Random position near center with some jitter
      const x = Math.max(20, Math.min(window.innerWidth - 300, window.innerWidth / 2 - 140 + (Math.random() - 0.5) * 200));
      const y = Math.max(20, Math.min(window.innerHeight - 300, window.innerHeight / 2 - 150 + (Math.random() - 0.5) * 200));
      setAds((prev) => [...prev, { id, adIndex, x, y }]);
    };

    // First ad after 60 seconds
    const interval = setInterval(spawnAd, 60_000);
    return () => clearInterval(interval);
  }, []);

  // Drag handlers for ads
  const handleAdDragStart = useCallback((adId: number, e: React.PointerEvent) => {
    const adEl = e.currentTarget as HTMLElement;
    const rect = adEl.getBoundingClientRect();
    dragRef.current = {
      adId,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
    };
    adEl.setPointerCapture(e.pointerId);
  }, []);

  const handleAdDragMove = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const { adId, offsetX, offsetY } = dragRef.current;
    const newX = e.clientX - offsetX;
    const newY = e.clientY - offsetY;
    setAds((prev) =>
      prev.map((ad) => (ad.id === adId ? { ...ad, x: newX, y: newY } : ad))
    );
  }, []);

  const handleAdDragEnd = useCallback(() => {
    dragRef.current = null;
  }, []);

  // Close button spawns a NEW ad as punishment
  const handleAdClose = useCallback(() => {
    const id = adCountRef.current++;
    const adIndex = id % INFOMERCIAL_ADS.length;
    const x = Math.max(20, Math.min(window.innerWidth - 300, Math.random() * (window.innerWidth - 300)));
    const y = Math.max(20, Math.min(window.innerHeight - 300, Math.random() * (window.innerHeight - 300)));
    setAds((prev) => [...prev, { id, adIndex, x, y }]);
  }, []);

  // Minimize button scatters ALL ads to random positions
  const handleAdMinimize = useCallback(() => {
    setAds((prev) =>
      prev.map((ad) => ({
        ...ad,
        x: Math.max(20, Math.min(window.innerWidth - 300, Math.random() * (window.innerWidth - 300))),
        y: Math.max(20, Math.min(window.innerHeight - 300, Math.random() * (window.innerHeight - 300))),
      }))
    );
  }, []);

  // Scroll container ref
  const pageRef = useRef<HTMLDivElement>(null);

  /* ─── Fade mechanic (derived) — 0 to 80 keystrokes ─── */
  const FADE_KEYSTROKES = 80;
  const fadeOpacity = Math.max(0, 1 - charCount / FADE_KEYSTROKES);
  const unfadeVisible = Math.min(1, charCount / FADE_KEYSTROKES);
  const unfadeEnabled = fadeOpacity <= 0.05;

  const handleFadeInput = useCallback(() => {
    setCharCount((c) => c + 1);
    setUnfadeUsed(false);
  }, []);

  const handleUnfade = useCallback(() => {
    if (!unfadeEnabled) {
      alert("🚫 The page ain't faded enough yet! Keep typing!");
      setTimeout(() => {
        alert("Wait... did you actually understand what that meant? 🤔");
      }, 100);
      return;
    }
    setUnfadeUsed(true);
    setCharCount(0);
  }, [unfadeEnabled]);

  /* ─── Phase 3: generate shuffled field mapping ─── */
  const generateFieldMapping = useCallback(() => {
    const indices = PHASE3_FIELDS.map((_, i) => i);
    // Fisher-Yates shuffle
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    // Make sure no index maps to itself
    for (let i = 0; i < indices.length; i++) {
      if (indices[i] === i) {
        const swapWith = (i + 1) % indices.length;
        [indices[i], indices[swapWith]] = [indices[swapWith], indices[i]];
      }
    }
    setFieldMapping(indices);
  }, []);

  /* ─── Tab/Enter hijacking for phase 3 ─── */
  useEffect(() => {
    if (phase !== 3) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Tab" || e.key === "Enter") {
        e.preventDefault();
        if (pageRef.current) {
          const maxScroll = pageRef.current.scrollHeight - pageRef.current.clientHeight;
          const randomScroll = Math.floor(Math.random() * maxScroll);
          pageRef.current.scrollTo({ top: randomScroll, behavior: "smooth" });
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [phase]);

  /* ─── Birthdate controls ─── */
  const handleBirthAfter = useCallback(() => {
    const newLower = new Date(birthDate.getTime() + 1);
    setBirthLower(newLower);
    const newDate = randomDate(newLower, birthUpper);
    setBirthDate(newDate);
  }, [birthDate, birthUpper]);

  const handleBirthBefore = useCallback(() => {
    const newUpper = new Date(birthDate.getTime() - 1);
    setBirthUpper(newUpper);
    const newDate = randomDate(birthLower, newUpper);
    setBirthDate(newDate);
  }, [birthDate, birthLower]);

  /* ─── Submit handlers ─── */
  const handleSubmit1 = useCallback(() => {
    setShowWarning1(true);
    setTimeout(() => {
      setPhase(2);
      setShowWarning1(false);
    }, 2000);
  }, []);

  const handleSubmit2 = useCallback(() => {
    setShowWarning2(true);
    generateFieldMapping();
    setTimeout(() => {
      setPhase(3);
      setShowWarning2(false);
    }, 3000);
  }, [generateFieldMapping]);

  const handleSubmit3 = useCallback(() => {
    setEndTime(Date.now());
    setPhase(4);
  }, []);

  /* ─── Phase 3 click handler (alternate fields) ─── */
  const handlePhase3Click = useCallback(
    (visualIndex: number) => {
      if (fieldMapping.length === 0) return;
      const actualIndex = fieldMapping[visualIndex];
      const ref = phase3Refs.current[actualIndex];
      if (ref) {
        ref.focus();
      }
    },
    [fieldMapping]
  );

  /* ─── Waste-o-meter calculation ─── */
  const timeSpentSeconds = endTime ? (endTime - startTime) / 1000 : 0;
  const timeSpentMinutes = timeSpentSeconds / 60;

  /* ─── Retro styles ─── */
  const retroBorder = "border-4 border-double border-yellow-300";
  const retroInput =
    "bg-purple-900 text-lime-300 border-2 border-inset border-gray-400 p-2 font-mono text-sm w-full focus:outline-none focus:bg-purple-800";
  const retroButton =
    "bg-gray-300 text-black border-2 border-outset border-gray-500 px-6 py-2 font-bold cursor-pointer active:border-inset hover:bg-gray-400 font-mono";
  const retroLabel = "text-cyan-300 font-bold text-sm";

  /* ─── Ad overlay (rendered in both views) ─── */
  const adOverlay = ads.map((ad) => (
    <InfomercialAd
      key={ad.id}
      ad={INFOMERCIAL_ADS[ad.adIndex]}
      position={{ x: ad.x, y: ad.y }}
      onDragStart={(e) => handleAdDragStart(ad.id, e)}
      onDragMove={handleAdDragMove}
      onDragEnd={handleAdDragEnd}
      onClose={handleAdClose}
      onMinimize={handleAdMinimize}
    />
  ));

  /* ─── RENDER ─── */

  // Newsletter view
  if (phase === 4) {
    return (
      <>
      {adOverlay}
      <div
        ref={pageRef}
        className="min-h-screen p-4"
        style={{
          background: "linear-gradient(180deg, #000080 0%, #008080 50%, #800080 100%)",
          fontFamily: '"Comic Sans MS", cursive',
        }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className={`${retroBorder} bg-black p-4 mb-4 inline-block`}>
            <h1 className="text-4xl md:text-6xl font-bold text-yellow-300 drop-shadow-[2px_2px_0px_#ff00ff]">
              📰 THE WORST NEWSLETTER EVER 📰
            </h1>
          </div>
          <MarqueeText className="text-2xl text-lime-300 my-4">
            🎉🎉🎉 CONGRATULATIONS! YOU MADE IT! 🎉🎉🎉 &nbsp;&nbsp;&nbsp; YOU ARE NOW A CERTIFIED TIME WASTER!
            &nbsp;&nbsp;&nbsp; 🏆🏆🏆
          </MarqueeText>
        </div>

        {/* Waste-o-meter */}
        <div className={`${retroBorder} bg-black p-6 mb-8 max-w-3xl mx-auto`}>
          <h2 className="text-3xl text-center text-red-400 mb-4">
            <BlinkText>⏱️ WASTE-O-METER ⏱️</BlinkText>
          </h2>
          <div className="text-center mb-6">
            <p className="text-5xl font-bold text-yellow-300 font-mono">
              {Math.floor(timeSpentSeconds)}s
            </p>
            <p className="text-xl text-cyan-300 mt-2">
              ({timeSpentMinutes.toFixed(2)} minutes of your life, gone forever)
            </p>
          </div>

          <h3 className="text-xl text-lime-300 mb-4 text-center underline">
            Things you could have done instead:
          </h3>
          <div className="space-y-3">
            {WASTE_ACTIVITIES.map((activity) => {
              const couldHaveDone = activity.time > 0 ? Math.floor(timeSpentSeconds / activity.time) : 0;
              const isInfinite = activity.time === 0;
              return (
                <div
                  key={activity.name}
                  className="flex items-center justify-between bg-purple-900 p-3 border border-gray-600"
                >
                  <span className="text-white">
                    {activity.emoji} {activity.name}
                    {activity.note && <span className="text-gray-400 text-xs ml-1">{activity.note}</span>}
                  </span>
                  <span
                    className={`font-bold font-mono ${couldHaveDone > 0 || isInfinite ? "text-red-400" : "text-gray-500"}`}
                  >
                    {isInfinite ? "∞ times" : couldHaveDone > 0 ? `${couldHaveDone}x` : "not enough time 😅"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Newsletter "content" */}
        <div className={`${retroBorder} bg-navy p-6 mb-8 max-w-3xl mx-auto`} style={{ backgroundColor: "#000040" }}>
          <h2 className="text-3xl text-center text-yellow-300 mb-6">📋 Newsletter Content 📋</h2>

          <div className="text-center space-y-6 text-white">
            <p className="text-xl">
              <BlinkText>🚧 UNDER CONSTRUCTION 🚧</BlinkText>
            </p>
            <div className="my-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://web.archive.org/web/20091027065853im_/http://geocities.com/SiliconValley/Haven/1901/construction.gif"
                alt="Under construction"
                className="mx-auto"
                width={400}
                height={40}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
            <p className="text-lg text-cyan-300">
              Content will be added <strong>some time in the future™</strong>.
            </p>
            <p className="text-lg text-lime-300">
              Maybe next week. Maybe next year. Maybe when the sun explodes. 🌞💥
            </p>

            <hr className="border-yellow-300 my-6" />

            <p className="text-xl text-yellow-300 font-bold">But hey, don&apos;t worry!</p>
            <p className="text-lg text-white">
              Your effort filling out that <em>absolutely hideous</em> form wasn&apos;t wasted!
            </p>
            <p className="text-lg text-pink-300">
              It was a <strong>test of patience and dedication</strong>. 🧘
            </p>
            <p className="text-lg text-cyan-300">
              And you passed! (Or rather, you wasted your time. Same thing, really.)
            </p>

            <hr className="border-yellow-300 my-6" />

            <p className="text-sm text-gray-400">
              P.S. None of your data was stored anywhere. If you want to see this page again, you&apos;ll have to fill
              out the entire form again. Yes, really. 😈
            </p>
          </div>
        </div>

        {/* Visitor counter */}
        <div className="text-center text-sm text-gray-400 mt-8 mb-4">
          <p>
            You are visitor number:{" "}
            <span className="text-lime-300 font-mono font-bold">
              {visitorNumber}
            </span>
          </p>
          <p className="mt-2">Best viewed with Netscape Navigator 4.0 at 800x600</p>
          <p className="mt-1">© 1997-2026 The Worst Newsletter Ever. No rights reserved.</p>
        </div>
      </div>
      </>
    );
  }

  // Form view
  return (
    <>
    {adOverlay}
    <div
      ref={pageRef}
      className="min-h-screen p-4 overflow-auto"
      style={{
        background: "linear-gradient(180deg, #000080 0%, #008080 100%)",
        fontFamily: '"Comic Sans MS", cursive',
        height: "100vh",
        overflowY: "scroll",
      }}
    >
      {/* Unfade button (phase 2 only) */}
      {phase >= 2 && (
        <button
          onClick={handleUnfade}
          className="fixed top-4 right-4 z-50 px-4 py-2 font-bold font-mono text-sm transition-all"
          style={{
            opacity: unfadeVisible,
            backgroundColor: unfadeEnabled ? "#ff00ff" : "#333",
            color: unfadeEnabled ? "#fff" : "#666",
            border: "3px outset #999",
            cursor: unfadeEnabled ? "pointer" : "not-allowed",
            transform: `scale(${0.5 + unfadeVisible * 0.5})`,
          }}
        >
          🔆 UN-FADE
        </button>
      )}

      {/* Header */}
      <div className="text-center mb-6">
        <div className={`${retroBorder} bg-black p-4 mb-4 inline-block`}>
          <h1 className="text-3xl md:text-5xl font-bold text-yellow-300 drop-shadow-[2px_2px_0px_#ff00ff]">
            📰 SIGN UP FOR THE WORST NEWSLETTER 📰
          </h1>
        </div>
        <MarqueeText className="text-xl text-lime-300 my-2">
          ⚠️ WARNING: This form is intentionally terrible! ⚠️ &nbsp;&nbsp;&nbsp; You WILL regret this!
          &nbsp;&nbsp;&nbsp; 🔥🔥🔥
        </MarqueeText>
      </div>

      {/* Form container */}
      <div
        className={`${retroBorder} bg-black p-6 max-w-2xl mx-auto mb-8`}
        style={phase >= 2 ? { opacity: fadeOpacity, transition: "opacity 0.3s" } : {}}
      >
        {/* ─── PHASE 1: Basic fields ─── */}
        <fieldset className="mb-6">
          <legend className="text-xl text-yellow-300 font-bold mb-4">
            <BlinkText>✨ Basic Information (ALL fields required!) ✨</BlinkText>
          </legend>

          <div className="space-y-4">
            <div>
              <label className={retroLabel}>First Name *</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  if (phase >= 2) handleFadeInput();
                }}
                className={retroInput}
                placeholder="Enter your first name..."
              />
            </div>
            <div>
              <label className={retroLabel}>Last Name *</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                  if (phase >= 2) handleFadeInput();
                }}
                className={retroInput}
                placeholder="Enter your last name..."
              />
            </div>
            <div>
              <label className={retroLabel}>Email *</label>
              <input
                type="text"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (phase >= 2) handleFadeInput();
                }}
                className={retroInput}
                placeholder="definitely_real@email.com"
              />
            </div>
            <div>
              <label className={retroLabel}>Password *</label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (phase >= 2) handleFadeInput();
                }}
                className={retroInput}
                placeholder="hunter2"
              />
            </div>
          </div>
        </fieldset>

        {/* Warning 1 */}
        {showWarning1 && (
          <div className="bg-red-900 border-4 border-red-500 p-4 mb-4 text-center animate-pulse">
            <p className="text-2xl text-red-300 font-bold">⚠️ WAIT! ⚠️</p>
            <p className="text-white text-lg">Make sure to fill ALL the fields!</p>
            <p className="text-yellow-300 text-sm mt-2">(More fields incoming...)</p>
          </div>
        )}

        {/* ─── PHASE 2: Extended fields ─── */}
        {phase >= 2 && (
          <fieldset className="mb-6 border-4 border-red-500 p-4 bg-red-950/30">
            <legend className="text-xl text-red-400 font-bold mb-4">
              <BlinkText>🚨 ADDITIONAL REQUIRED FIELDS 🚨</BlinkText>
            </legend>

            <div className="space-y-4">
              <div>
                <label className={`${retroLabel} text-red-400`}>Middle Name * (yes, really)</label>
                <input
                  type="text"
                  value={middleName}
                  onChange={(e) => {
                    setMiddleName(e.target.value);
                    handleFadeInput();
                  }}
                  className={`${retroInput} border-red-500`}
                  placeholder="If you don't have one, make one up"
                />
              </div>

              {/* Birthdate chaos picker */}
              <div>
                <label className={`${retroLabel} text-red-400`}>Date of Birth * (good luck)</label>
                <div className="bg-purple-950 border-2 border-gray-500 p-4 mt-1">
                  <p className="text-center text-2xl text-yellow-300 font-mono mb-4">{formatDate(birthDate)}</p>
                  <p className="text-center text-xs text-gray-400 mb-3">
                    Range: {formatDate(birthLower)} → {formatDate(birthUpper)}
                  </p>
                  <div className="flex justify-center gap-4">
                    <button
                      type="button"
                      onClick={handleBirthBefore}
                      className={`${retroButton} bg-red-300 hover:bg-red-400`}
                    >
                      ◀ BEFORE
                    </button>
                    <button
                      type="button"
                      onClick={handleBirthAfter}
                      className={`${retroButton} bg-green-300 hover:bg-green-400`}
                    >
                      AFTER ▶
                    </button>
                  </div>
                  <p className="text-center text-xs text-gray-500 mt-2">
                    Click &quot;Before&quot; or &quot;After&quot; to narrow down your birthdate. Eventually.
                  </p>
                </div>
              </div>

              {/* Country by phone prefix */}
              <div>
                <label className={`${retroLabel} text-red-400`}>Country of Residence * (by phone prefix)</label>
                <select
                  value={countryPrefix}
                  onChange={(e) => setCountryPrefix(e.target.value)}
                  className={`${retroInput} border-red-500`}
                >
                  <option value="">-- Select your country&apos;s phone prefix --</option>
                  {COUNTRY_PREFIXES.map((c) => (
                    <option key={c.prefix} value={c.prefix}>
                      {c.prefix}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Hint: You probably know your country&apos;s phone prefix, right? ...Right?
                </p>
              </div>
            </div>
          </fieldset>
        )}

        {/* Warning 2 */}
        {showWarning2 && (
          <div className="bg-red-900 border-4 border-red-500 p-4 mb-4 text-center animate-pulse">
            <p className="text-2xl text-red-300 font-bold">🤔 ARE YOU SURE YOU&apos;RE PAYING ATTENTION? 🤔</p>
            <p className="text-white text-lg">You STILL need to fill ALL the fields!</p>
            <p className="text-yellow-300 text-sm mt-2">(Even MORE fields incoming... sorry not sorry)</p>
          </div>
        )}

        {/* ─── PHASE 3: Chaos fields ─── */}
        {phase >= 3 && (
          <fieldset className="mb-6 border-4 border-dashed border-pink-500 p-4 bg-pink-950/20">
            <legend className="text-xl text-pink-400 font-bold mb-4">
              <BlinkText>💀 FINAL FIELDS (we promise this is the last batch) 💀</BlinkText>
            </legend>
            <p className="text-xs text-gray-400 mb-4 text-center">
              Pro tip: Tab and Enter don&apos;t work here. You must click each field. Also, the fields might not be what
              they seem... 😈
            </p>

            <div className="space-y-3">
              {PHASE3_FIELDS.map((fieldName, visualIndex) => (
                <div
                  key={fieldName}
                  onClick={() => handlePhase3Click(visualIndex)}
                  className="cursor-pointer"
                >
                  <label className="text-pink-300 text-xs font-bold block mb-1">{fieldName} *</label>
                  <input
                    ref={(el) => {
                      phase3Refs.current[visualIndex] = el;
                    }}
                    type="text"
                    value={phase3Values[fieldName] ?? ""}
                    onChange={(e) => {
                      setPhase3Values((prev) => ({
                        ...prev,
                        [fieldName]: e.target.value,
                      }));
                      handleFadeInput();
                    }
                    }
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePhase3Click(visualIndex);
                    }}
                    className={`${retroInput} border-pink-500 text-pink-200`}
                    placeholder={`Enter your ${fieldName.toLowerCase()}...`}
                  />
                </div>
              ))}
            </div>
          </fieldset>
        )}

        {/* Submit button */}
        <div className="text-center mt-6">
          {phase === 1 && (
            <button type="button" onClick={handleSubmit1} className={`${retroButton} text-xl px-10 py-3`}>
              🚀 SUBSCRIBE NOW! 🚀
            </button>
          )}
          {phase === 2 && (
            <button type="button" onClick={handleSubmit2} className={`${retroButton} text-xl px-10 py-3 bg-red-200`}>
              📝 SUBMIT (for real this time) 📝
            </button>
          )}
          {phase === 3 && (
            <button
              type="button"
              onClick={handleSubmit3}
              className={`${retroButton} text-xl px-10 py-3 bg-pink-200 animate-pulse`}
            >
              🙏 PLEASE LET ME IN 🙏
            </button>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-gray-400 mt-4 mb-8">
        <p>By submitting this form, you agree to absolutely nothing.</p>
        <p>Your data will not be stored, sold, or even looked at. It goes straight to /dev/null.</p>
        <p className="mt-2">© 1997-2026 The Worst Newsletter Ever</p>
      </div>
    </div>
    </>
  );
}
