import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  Mic,
  Square,
  Play,
  Settings as SettingsIcon,
  CheckCircle2,
  History,
  Trophy,
  TrendingUp,
  MessageCircle,
  RefreshCw,
  ChevronRight,
  BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const BACKEND_URL = "http://localhost:8000";

interface WordItem {
  word: string;
  status: 'default' | 'correct' | 'wrong' | 'missing';
}

export default function QuranCoach() {
  const [surahs, setSurahs] = useState<any[]>([]);
  const [juzs, setJuzs] = useState<any[]>([]);
  const [rukus, setRukus] = useState<any[]>([]);
  const [selectedSurah, setSelectedSurah] = useState(localStorage.getItem("selectedSurah") || "البقرة");
  const [selectedJuz, setSelectedJuz] = useState<number>(1);
  const [selectedRuku, setSelectedRuku] = useState<number | null>(null);
  const [selectionType, setSelectionType] = useState<"surah" | "juz" | "ruku">("surah");

  const [startAyah, setStartAyah] = useState(parseInt(localStorage.getItem("startAyah") || "1"));
  const [endAyah, setEndAyah] = useState(parseInt(localStorage.getItem("endAyah") || "3"));
  const [mode, setMode] = useState<"hifz" | "nazra">(localStorage.getItem("coach_mode") as any || "nazra");
  
  // Counselor States
  const [isCounselling, setIsCounselling] = useState(false);
  const [counsellorChat, setCounsellorChat] = useState<any[]>([]);
  const [counselInput, setCounselInput] = useState("");
  
  // User Profile States
  const [showOnboarding, setShowOnboarding] = useState(!localStorage.getItem("user_profile_complete"));
  const [userProfile, setUserProfile] = useState<any>(() => {
    const saved = localStorage.getItem("user_profile");
    return saved ? JSON.parse(saved) : { name: "", age: "", hifzStatus: "new_student" };
  });

  // Hifz Specific States
  const [activeTab, setActiveTab] = useState<"sabak" | "sabqi" | "manzil">("sabak");
  const [isLessonPassed, setIsLessonPassed] = useState(false);
  const [hifzProgress, setHifzProgress] = useState(() => {
    const saved = localStorage.getItem("hifz_progress");
    return saved ? JSON.parse(saved) : {
      sabak: { surah: "الفاتحة", start: 1, end: 7 },
      sabqi: { surah: "البقرة", start: 1, end: 5 },
      manzil: { surah: "البقرة", start: 6, end: 20 }
    };
  });

  const [quranWords, setQuranWords] = useState<WordItem[]>([]);
  const [transcribedText, setTranscribedText] = useState("");
  const [result, setResult] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({ total_sessions: 0, avg_score: 0, best_score: 0, streak: 0, weekly: [] });

  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [userMessage, setUserMessage] = useState("");
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioQueueRef = useRef<string[]>([]);

  useEffect(() => {
    fetch(`${BACKEND_URL}/surahs`).then(res => res.json()).then(setSurahs);
    fetch(`${BACKEND_URL}/juzs`).then(res => res.json()).then(setJuzs);
    refreshData();
    if (!localStorage.getItem("user_profile_complete")) setShowOnboarding(true);
  }, []);

  useEffect(() => {
    const fetchAyahs = async () => {
      let currentSurah = selectedSurah;
      let currentStart = startAyah;
      let currentEnd = endAyah;

      if (mode === 'hifz') {
        currentSurah = hifzProgress[activeTab].surah;
        currentStart = hifzProgress[activeTab].start;
        currentEnd = hifzProgress[activeTab].end;
      } else if (selectionType === 'juz') {
        const j = juzs.find(jz => jz.index === selectedJuz);
        if (j) {
          const sObj = surahs.find(s => s.id === j.start.surah);
          currentSurah = sObj?.name || "";
          currentStart = j.start.ayah;
          currentEnd = j.end.ayah;
        }
      } else if (selectionType === 'ruku' && selectedRuku !== null) {
        currentSurah = selectedSurah;
        const r = rukus.find(rk => rk.index === selectedRuku);
        if (r) {
          const prevR = rukus.find(rk => rk.index === selectedRuku - 1);
          currentStart = prevR ? prevR.end_ayah + 1 : 1;
          currentEnd = r.end_ayah;
        }
      }

      const surahId = surahs.find(s => s.name === currentSurah)?.id || 2;
      try {
        const res = await fetch(`${BACKEND_URL}/ayahs?surah_id=${surahId}&start=${currentStart}&end=${currentEnd}`);
        const data = await res.json();
        const combined = data.map((a: any) => a.text).join(" ");
        setQuranWords(combined.split(" ").map((w: string) => ({ word: w, status: 'default' })));
      } catch (err) { console.error(err); }
    };
    if (surahs.length && juzs.length) fetchAyahs();
  }, [selectedSurah, startAyah, endAyah, surahs, juzs, rukus, mode, activeTab, hifzProgress, selectionType, selectedJuz, selectedRuku]);

  useEffect(() => {
    const fetchRukus = async () => {
      const sId = surahs.find(s => s.name === selectedSurah)?.id;
      if (sId) {
        const res = await fetch(`${BACKEND_URL}/rukus?surah_id=${sId}`);
        const data = await res.json();
        setRukus(data);
      }
    };
    if (surahs.length) fetchRukus();
  }, [selectedSurah, surahs]);

  const resetOnboarding = () => {
    localStorage.removeItem("user_profile_complete");
    setShowOnboarding(true);
    setShowSettings(false);
  };

  useEffect(() => {
    localStorage.setItem("user_profile", JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem("hifz_progress", JSON.stringify(hifzProgress));
  }, [hifzProgress]);

  const updateHighlights = (diff: any[]) => {
    setQuranWords((prev) => {
      const next = prev.map((w) => ({ ...w }));
      let lastMatchIdx = -1;
      let di = 0;
      for (let i = 0; i < next.length && di < diff.length; i++) {
        // Simple letters-only match
        const r1 = next[i].word.replace(/[^\u0621-\u064A]/g, '');
        const r2 = diff[di].word.replace(/[^\u0621-\u064A]/g, '');
        if (r1 === r2) {
          next[i].status = "correct";
          lastMatchIdx = i;
          di++;
        }
      }
      if (lastMatchIdx !== -1) {
        for (let i = 0; i < lastMatchIdx; i++) {
          if (next[i].status === "default") next[i].status = "missing";
        }
      }
      return next;
    });
  };

  const processChunk = async (blob: Blob) => {
    let currentSurah = selectedSurah;
    let currentStart = startAyah;
    let currentEnd = endAyah;

    if (mode === 'hifz') {
      currentSurah = hifzProgress[activeTab].surah;
      currentStart = hifzProgress[activeTab].start;
      currentEnd = hifzProgress[activeTab].end;
    }

    const fd = new FormData();
    fd.append("audio_file", blob, "chunk.wav");
    fd.append("surah_name", currentSurah);
    fd.append("start_ayah", currentStart.toString());
    fd.append("end_ayah", currentEnd.toString());

    try {
      const res = await fetch(`${BACKEND_URL}/analyze-stream`, { method: "POST", body: fd });
      const data = await res.json();
      if (data.transcribed_text) {
        setTranscribedText(data.transcribed_text);
        if (data.word_diff) updateHighlights(data.word_diff);
      }
    } catch (err) {}
  };

  const refreshData = async () => {
    const p1 = fetch(`${BACKEND_URL}/student/local_user/progress`).then(res => res.json());
    const p2 = fetch(`${BACKEND_URL}/student/local_user/stats`).then(res => res.json());
    const [prog, st] = await Promise.all([p1, p2]);
    setHistory(Array.isArray(prog) ? prog.slice(0, 5) : []);
    setStats(st);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
      });
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];
      setResult(null);
      setRecordingTime(0);
      setTranscribedText("");
      setQuranWords(prev => prev.map(w => ({ ...w, status: 'default' })));

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
          // We must send the whole accumulated buffer so it has valid headers
          processChunk(new Blob(chunksRef.current, { type: recorder.mimeType }));
        }
      };

      recorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType });
        if (blob.size > 1000) analyzeRecitation(blob);
      };

      recorder.start(4000);
      setIsRecording(true);
      toast.info("تلاوت شروع کریں");
    } catch (err) { toast.error("مائیک تک رسائی نہیں ملی"); }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
      setIsRecording(false);
    }
  };

  const analyzeRecitation = async (blob: Blob) => {
    setIsFinalizing(true);

    let currentSurah = selectedSurah;
    let currentStart = startAyah;
    let currentEnd = endAyah;

    if (mode === 'hifz') {
      currentSurah = hifzProgress[activeTab].surah;
      currentStart = hifzProgress[activeTab].start;
      currentEnd = hifzProgress[activeTab].end;
    }

    const fd = new FormData();
    fd.append("audio_file", blob, "recitation.wav");
    fd.append("surah_name", currentSurah);
    fd.append("start_ayah", currentStart.toString());
    fd.append("end_ayah", currentEnd.toString());
    fd.append("student_id", "local_user");

    try {
      const res = await fetch(`${BACKEND_URL}/analyze`, { method: "POST", body: fd });
      const data = await res.json();
      setResult(data);
      if (data.word_diff) {
        setQuranWords(prev => prev.map(pw => {
          const m = data.word_diff.find((d: any) => d.word.replace(/[^\u0621-\u064A]/g, '') === pw.word.replace(/[^\u0621-\u064A]/g, ''));
          return m ? { ...pw, status: m.status } : pw;
        }));
      }
      refreshData();

      // Adaptive Advancement Logic
      const score = data.feedback?.overall_score || 0;
      if (activeTab === 'sabak' && mode === 'hifz' && score >= 95) {
        setIsLessonPassed(true);
        toast.success("ماشاء اللہ! آپ کا سبق پختہ ہے۔ اگلا سبق ان لاک ہو گیا ہے!", {
          icon: '✨',
          duration: 5000
        });
        
        setHifzProgress(prev => ({
          ...prev,
          sabak: {
            ...prev.sabak,
            start: prev.sabak.end + 1,
            end: prev.sabak.end + 3
          }
        }));
      } else if (activeTab === 'sabak' && mode === 'hifz' && score < 95) {
        setIsLessonPassed(false);
      }
    } catch (err) { toast.error("تجزیہ ناکام رہا"); }
    finally { setIsFinalizing(false); }
  };

  const sendInteractiveMessage = async () => {
    if (!userMessage.trim() || !result) return;
    setIsSendingMessage(true);
    const fd = new FormData();
    fd.append("surah_name", selectedSurah);
    fd.append("start_ayah", startAyah.toString());
    fd.append("end_ayah", endAyah.toString());
    fd.append("student_id", "local_user");
    fd.append("student_message", userMessage);
    fd.append("transcribed_text", result.transcribed_text);

    try {
      const res = await fetch(`${BACKEND_URL}/analyze`, { method: "POST", body: fd });
      setResult(await res.json());
      setUserMessage("");
      toast.success("جواب موصول ہو گیا");
    } catch (err) { toast.error("میسج فیل ہو گیا"); }
    finally { setIsSendingMessage(false); }
  };

  const playReference = () => {
    if (isPlaying) {
      if (audioRef.current) audioRef.current.pause();
      audioQueueRef.current = [];
      setIsPlaying(false);
      return;
    }
    const surahId = surahs.find(s => s.name === selectedSurah)?.id || 1;
    const urls = [];
    for (let i = startAyah; i <= endAyah; i++) {
      const finalId = surahId === 1 ? i + 1 : i;
      urls.push(`https://everyayah.com/data/Alafasy_128kbps/${String(surahId).padStart(3, '0')}${String(finalId).padStart(3, '0')}.mp3`);
    }
    audioQueueRef.current = urls;
    playNext();
  };

  const playNext = () => {
    if (!audioQueueRef.current.length) { setIsPlaying(false); return; }
    const url = audioQueueRef.current.shift()!;
    const audio = new Audio(url);
    audioRef.current = audio;
    setIsPlaying(true);
    audio.onended = playNext;
    audio.play();
  };

  const saveOnboarding = () => {
    localStorage.setItem("user_profile", JSON.stringify(userProfile));
    localStorage.setItem("user_profile_complete", "true");
    localStorage.setItem("selectedSurah", selectedSurah);
    localStorage.setItem("startAyah", startAyah.toString());
    localStorage.setItem("endAyah", endAyah.toString());
    localStorage.setItem("coach_mode", mode);
    setShowOnboarding(false);
    toast.success(`${userProfile.name}، یسر (YUSR) میں خوش آمدید!`);
  };

  const handleCounsellorChat = async () => {
    if (!counselInput.trim()) return;
    const msg = counselInput;
    setCounselInput(""); 
    setCounsellorChat(prev => [...prev, { role: 'user', text: msg }]);
    
    try {
      const res = await fetch(`${BACKEND_URL}/plan-with-ai`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, context: userProfile })
      });
      const data = await res.json();
      setCounsellorChat(prev => [...prev, { role: 'ai', text: data.reply }]);
      if (data.recommended_plan) {
        setHifzProgress(data.recommended_plan);
        toast.info("آپ کا اسٹڈی پلان اپ ڈیٹ کر دیا گیا ہے!");
      }
    } catch (err) { toast.error("چیٹ میں مسئلہ رہا"); }
  };

  const saveSettings = () => {
    let finalSurah = selectedSurah;
    let finalStart = startAyah;
    let finalEnd = endAyah;

    // Resolve derived values if Ruku or Juz is selected
    if (selectionType === 'juz') {
      const j = juzs.find(jz => jz.index === selectedJuz);
      if (j) {
        finalSurah = surahs.find(s => s.id === j.start.surah)?.name || selectedSurah;
        finalStart = j.start.ayah;
        finalEnd = j.end.ayah;
      }
    } else if (selectionType === 'ruku' && selectedRuku !== null) {
      const r = rukus.find(rk => rk.index === selectedRuku);
      if (r) {
        const prevR = rukus.find(rk => rk.index === selectedRuku - 1);
        finalStart = prevR ? prevR.end_ayah + 1 : 1;
        finalEnd = r.end_ayah;
        finalSurah = selectedSurah;
      }
    }

    if (mode === 'hifz') {
      setHifzProgress((prev: any) => ({
        ...prev,
        [activeTab]: {
          surah: finalSurah,
          start: finalStart,
          end: finalEnd
        }
      }));
    } else {
      setSelectedSurah(finalSurah);
      setStartAyah(finalStart);
      setEndAyah(finalEnd);
    }

    localStorage.setItem("selectedSurah", finalSurah);
    localStorage.setItem("startAyah", finalStart.toString());
    localStorage.setItem("endAyah", finalEnd.toString());
    localStorage.setItem("selectionType", selectionType);
    localStorage.setItem("selectedJuz", selectedJuz.toString());
    if (selectedRuku) localStorage.setItem("selectedRuku", selectedRuku.toString());
    localStorage.setItem("coach_mode", mode);
    
    setShowSettings(false);
    toast.success("سیٹنگز محفوظ ہو گئیں");
  };

  return (
    <div className="min-h-screen bg-sacred-cream selection:bg-sacred-gold/30">
      {/* Navigation */}
      <nav className="border-b border-sacred-green/5 bg-white/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 overflow-hidden">
              <img src="/logo.png" alt="YUSR" className="size-full object-contain" />
            </div>
            <div>
              <h1 className="text-xl font-black text-sacred-green tracking-tighter leading-none">YUSR</h1>
              <span className="text-[10px] uppercase tracking-widest text-sacred-gold font-bold">Smart Quran Companion</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-4 px-4 py-2 bg-sacred-green/5 rounded-full border border-sacred-green/10">
              <div className="flex items-center gap-2 text-sm font-medium">
                <span className="text-sacred-gold">🔥 {stats.streak} Days</span>
                <span className="w-px h-3 bg-sacred-green/20" />
                <span className="text-sacred-green capitalize">{mode} Mode</span>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setShowSettings(true)} className="rounded-full hover:bg-sacred-green/5 text-sacred-green">
              <SettingsIcon className="size-5" />
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 grid grid-cols-12 gap-8">
        {/* Main Content */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          {/* Curriculum Tabs (Hifz Mode Only) */}
          {mode === 'hifz' && (
            <div className="flex gap-2 p-1.5 bg-white border border-sacred-green/5 rounded-[32px] w-fit mx-auto shadow-sm">
              {[
                { id: 'sabak', label: 'آج کا سبق', icon: <BookOpen className="size-4" /> },
                { id: 'sabqi', label: 'سبقی', icon: <History className="size-4" /> },
                { id: 'manzil', label: 'منزل', icon: <RefreshCw className="size-4" /> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all
                    ${activeTab === tab.id ? 'bg-sacred-green text-white shadow-lg' : 'text-sacred-green/40 hover:bg-sacred-green/5'}`}
                >
                  {tab.icon}
                  <span className="font-urdu">{tab.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* Lesson Header */}
          <div className="flex items-center justify-between bg-white border border-sacred-green/5 p-6 rounded-3xl shadow-sm relative overflow-hidden group">
            {!isLessonPassed && activeTab === 'sabak' && mode === 'hifz' && (
              <div className="absolute inset-y-0 left-0 w-1 bg-amber-400 animate-pulse" />
            )}
            <div className="flex items-center gap-4">
              <div className={`size-12 rounded-2xl flex items-center justify-center transition-colors
                ${activeTab === 'sabak' ? 'bg-sacred-gold/10 text-sacred-gold' : 'bg-emerald-50 text-emerald-600'}`}>
                <BookOpen className="size-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold font-arabic text-sacred-green">
                  {mode === 'hifz' ? hifzProgress[activeTab].surah : selectedSurah}
                </h2>
                <p className="text-sm text-sacred-green/60">
                  {activeTab === 'sabak' ? 'نیا سبق' : activeTab === 'sabqi' ? 'حالیہ دہرائی' : 'منزل'} — 
                  آیت {mode === 'hifz' ? hifzProgress[activeTab].start : startAyah} سے {mode === 'hifz' ? hifzProgress[activeTab].end : endAyah} تک
                </p>
              </div>
            </div>
            {activeTab === 'sabak' && !isLessonPassed && mode === 'hifz' ? (
              <Badge variant="outline" className="rounded-full border-amber-200 bg-amber-50 text-amber-600 px-4 py-1 font-bold font-urdu">پہلے یہ پختہ کریں</Badge>
            ) : (
              <Button onClick={() => setShowSettings(true)} variant="outline" className="rounded-full border-sacred-green/10 hover:bg-sacred-green/5">
                تبدیل کریں <ChevronRight className="ml-2 size-4" />
              </Button>
            )}
          </div>

          {/* Ayah Canvas */}
          <Card className="border-0 shadow-xl shadow-sacred-green/5 rounded-[40px] overflow-hidden bg-white">
            <div className="p-12 space-y-12">
              <div
                dir="rtl"
                className={`transition-all duration-700 text-center leading-[2.5] font-arabic text-5xl flex flex-wrap justify-center gap-y-6 ${isRecording && mode === 'hifz' ? 'blur-2xl opacity-5' : 'opacity-100'}`}
              >
                {quranWords.map((w, i) => (
                  <span
                    key={i}
                    className={`inline-block mx-2 transition-colors duration-500 rounded-lg px-2
                      ${w.status === 'correct' ? 'text-emerald-600 bg-emerald-50' :
                        w.status === 'wrong' ? 'text-rose-600 bg-rose-50' :
                          w.status === 'missing' ? 'text-amber-500 bg-amber-50' :
                            'text-sacred-green/90'}`}
                  >
                    {w.word}
                  </span>
                ))}
              </div>

              {/* Transcription Preview */}
              {transcribedText && (
                <div className="pt-8 border-t border-sacred-green/5">
                  <p className="text-xs uppercase tracking-widest text-sacred-green/40 font-bold mb-4 text-center">آپ کی تلاوت (لائیو)</p>
                  <p className="font-urdu text-2xl text-sacred-green/70 text-center leading-relaxed">{transcribedText}</p>
                </div>
              )}

              {/* Controls */}
              <div className="flex flex-col items-center gap-8 pt-8">
                <div className="flex items-center gap-6">
                  <Button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`size-24 rounded-full transition-all duration-500 shadow-2xl relative
                      ${isRecording ? 'bg-rose-500 hover:bg-rose-600 scale-110 shadow-rose-500/40' : 'bg-sacred-green hover:bg-sacred-emerald shadow-sacred-green/40'}`}
                  >
                    {isRecording ? <Square className="size-8 fill-white" /> : <Mic className="size-10 text-white" />}
                    {isRecording && <span className="absolute -top-1 -right-1 size-6 bg-white rounded-full animate-ping" />}
                  </Button>

                  <Button
                    onClick={playReference}
                    variant="outline"
                    className={`size-16 rounded-full border-sacred-green/10 text-sacred-green transition-all
                      ${isPlaying ? 'bg-sacred-green/5 text-sacred-gold ring-4 ring-sacred-gold/20' : 'hover:bg-sacred-green/5'}`}
                  >
                    {isPlaying ? <RefreshCw className="size-6 animate-spin" /> : <Play className="size-8 ml-1 fill-sacred-green/10" />}
                  </Button>
                </div>

                {isRecording && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-rose-50 rounded-full animate-pulse border border-rose-100">
                    <div className="size-2 bg-rose-500 rounded-full" />
                    <span className="text-rose-600 font-mono font-bold">{Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Progress Bar (Finalizing) */}
            {isFinalizing && (
              <div className="h-1.5 w-full bg-sacred-green/5 overflow-hidden">
                <div className="h-full bg-sacred-gold animate-[progress_2s_ease-in-out_infinite]" style={{ width: '40%' }} />
              </div>
            )}
          </Card>

          {/* Feedback Section */}
          {result && (
            <Card className="border-0 shadow-xl shadow-sacred-green/5 rounded-[40px] p-8 space-y-8 bg-white overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Trophy className="size-32 text-sacred-gold" />
              </div>

              <div className="flex items-center gap-6">
                <div className="size-20 rounded-[24px] bg-sacred-green flex items-center justify-center text-sacred-cream shadow-xl">
                  <span className="text-3xl font-black">{result.feedback?.overall_score || 0}%</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-sacred-green">استاد کا تجزیہ</h3>
                  <p className="text-sacred-green/60 uppercase text-[10px] tracking-widest font-bold">Feedback Result</p>
                </div>
              </div>

              <div className="bg-sacred-cream/50 p-8 rounded-[32px] border border-sacred-green/5 relative">
                <p className="font-urdu text-2xl leading-relaxed text-sacred-green/90 text-right">
                  {result.feedback?.feedback_urdu}
                </p>
                {result.feedback?.encouragement_urdu && (
                  <div className="mt-8 pt-6 border-t border-sacred-green/5 italic text-sacred-gold text-center font-urdu text-xl">
                    "{result.feedback.encouragement_urdu}"
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className="space-y-4 pt-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-sacred-green/40 px-4">استاد سے مخاطب ہوں</label>
                <div className="flex gap-3">
                  <Input
                    placeholder="مثلاً: میں آخری حرف بھول گیا تھا..."
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                    className="h-14 rounded-2xl bg-sacred-cream border-sacred-green/5 font-urdu text-lg px-6 focus:ring-sacred-gold focus:border-sacred-gold transition-all"
                    onKeyDown={(e) => e.key === 'Enter' && sendInteractiveMessage()}
                  />
                  <Button
                    onClick={sendInteractiveMessage}
                    disabled={isSendingMessage || !userMessage.trim()}
                    className="h-14 w-14 rounded-2xl bg-sacred-gold hover:bg-sacred-gold/90 transition-all shadow-lg shadow-sacred-gold/20 shrink-0"
                  >
                    {isSendingMessage ? <RefreshCw className="size-5 animate-spin" /> : <MessageCircle className="size-6" />}
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          {/* Stats Card */}
          <Card className="border-0 shadow-lg shadow-sacred-green/5 rounded-[40px] p-8 bg-sacred-green text-sacred-cream relative overflow-hidden group">
            <div className="absolute -bottom-10 -right-10 size-48 bg-white/5 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000" />

            <div className="relative space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sacred-gold uppercase text-[10px] tracking-widest font-black">Statistics</h3>
                  <p className="text-xl font-bold">آپ کی کارکردگی</p>
                </div>
                <div className="size-12 rounded-2xl bg-white/10 flex items-center justify-center">
                  <TrendingUp className="size-6 text-sacred-gold" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-3xl bg-white/5 border border-white/10">
                  <p className="text-[10px] text-white/40 uppercase font-bold mb-1">Average</p>
                  <p className="text-2xl font-bold">{stats.avg_score}%</p>
                </div>
                <div className="p-4 rounded-3xl bg-white/5 border border-white/10">
                  <p className="text-[10px] text-white/40 uppercase font-bold mb-1">Sessions</p>
                  <p className="text-2xl font-bold">{stats.total_sessions}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-[10px] uppercase font-black text-white/40 px-2">
                  <span>Weekly Activity</span>
                  <span>Trend</span>
                </div>
                <div className="flex items-end justify-between h-24 gap-2 px-2">
                  {stats.weekly?.map((day: any, i: number) => (
                    <div key={i} className="flex-1 group/bar relative">
                      <div
                        className="w-full bg-sacred-gold/40 hover:bg-sacred-gold rounded-t-lg transition-all duration-500 cursor-help"
                        style={{ height: `${Math.max((day.score || 0), 10)}%` }}
                      >
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white text-sacred-green text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity">
                          {day.score}%
                        </div>
                      </div>
                      <div className="absolute top-full left-0 w-full text-[8px] mt-2 text-center text-white/30 font-bold uppercase">{day.day}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* History Card */}
          <Card className="border-0 shadow-lg shadow-sacred-green/5 rounded-[40px] p-8 bg-white">
            <div className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <h3 className="font-bold text-sacred-green">حالیہ ریکارڈز</h3>
                <History className="size-4 text-sacred-green/20" />
              </div>

              <div className="space-y-3">
                {history.map((h: any, i: number) => (
                  <div key={i} className="group p-4 rounded-3xl bg-sacred-cream hover:bg-sacred-green hover:text-white transition-all cursor-pointer border border-sacred-green/5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-xl bg-white/20 flex items-center justify-center text-xs font-bold font-arabic">
                          {i + 1}
                        </div>
                        <div>
                          <p className="text-sm font-bold font-arabic">{h.surah_name}</p>
                          <p className="text-[10px] opacity-40 uppercase font-black">Ayah {h.start_ayah}-{h.end_ayah}</p>
                        </div>
                      </div>
                      <Badge className="bg-sacred-gold/20 text-sacred-gold group-hover:bg-white/20 group-hover:text-white border-0">
                        {h.overall_score}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </main>

      {/* Onboarding Dialog */}
      <Dialog open={showOnboarding} onOpenChange={setShowOnboarding}>
        <DialogContent className="max-w-md rounded-[40px] border-0 bg-sacred-cream p-0 overflow-hidden shadow-2xl">
          {!isCounselling ? (
            <div className="p-10 space-y-8">
              <div className="text-center space-y-4">
                <div className="size-24 overflow-hidden mx-auto">
                  <img src="/logo.png" alt="YUSR" className="size-full object-contain" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-sacred-green">خوش آمدید</h2>
                  <p className="text-sacred-green/60 text-sm mt-2">پڑھائی شروع کرنے سے پہلے اپنے استاد سے مشورہ کریں</p>
                </div>
              </div>

              <div className="space-y-4">
                <Input 
                  placeholder="آپ کا نام" 
                  value={userProfile.name}
                  onChange={e => setUserProfile({...userProfile, name: e.target.value})}
                  className="h-14 rounded-2xl bg-white border-sacred-green/5 font-urdu text-lg px-6"
                />
                <Button 
                  onClick={() => setIsCounselling(true)} 
                  className="w-full h-16 rounded-[24px] bg-sacred-gold hover:bg-sacred-gold/90 text-white font-bold text-lg shadow-xl"
                >
                  استاد سے بات کریں
                </Button>
                <button 
                  onClick={() => saveOnboarding()} 
                  className="w-full text-sacred-green/40 text-sm font-bold hover:text-sacred-green transition-colors py-2"
                >
                  میں اپنی مرضی سے سیٹ کروں گا (Skip)
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col h-[600px]">
              <div className="p-6 bg-sacred-green text-white flex justify-between items-center">
                <h3 className="font-bold">Al-Mu'allim Counselor</h3>
                <Button variant="ghost" size="sm" onClick={() => saveOnboarding()}>محفوظ کریں</Button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-sacred-cream/50">
                {counsellorChat.map((m, i) => (
                  <div key={i} className={`flex ${m.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[80%] p-4 rounded-2xl text-sm font-urdu ${m.role === 'user' ? 'bg-white text-sacred-green shadow-sm' : 'bg-sacred-gold text-white'}`}>
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-white border-t flex gap-2">
                <Input 
                  placeholder="اپنی بات لکھیں..." 
                  value={counselInput}
                  onChange={e => setCounselInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleCounsellorChat()}
                  className="rounded-xl"
                />
                <Button onClick={handleCounsellorChat}><MessageCircle className="size-4" /></Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-md rounded-[40px] border-0 bg-sacred-cream p-0 overflow-hidden shadow-2xl">
          <div className="p-10 space-y-8">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black text-sacred-green">سیٹنگز</DialogTitle>
              <DialogDescription>تلاوت کا انتخاب کریں</DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <div className="flex bg-white rounded-2xl p-1 border border-sacred-green/5">
                <button 
                  onClick={() => setSelectionType("surah")}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${selectionType === 'surah' ? 'bg-sacred-green text-white shadow-md' : 'text-sacred-green/40'}`}
                >سورۃ</button>
                <button 
                  onClick={() => setSelectionType("juz")}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${selectionType === 'juz' ? 'bg-sacred-green text-white shadow-md' : 'text-sacred-green/40'}`}
                >پارہ</button>
                <button 
                  onClick={() => setSelectionType("ruku")}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${selectionType === 'ruku' ? 'bg-sacred-green text-white shadow-md' : 'text-sacred-green/40'}`}
                >رکوع</button>
              </div>

              {selectionType === 'surah' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-sacred-green/40 px-2">سورۃ</label>
                    <Select value={selectedSurah} onValueChange={setSelectedSurah}>
                      <SelectTrigger className="h-14 rounded-2xl bg-white border-sacred-green/5 font-bold font-arabic shadow-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px] rounded-2xl">
                        {surahs.map(s => <SelectItem key={s.id} value={s.name} className="font-arabic">{s.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-[9px] text-sacred-green/40 px-2 uppercase">آواز آیت (آغاز)</span>
                      <Input type="number" value={startAyah} onChange={e => setStartAyah(parseInt(e.target.value))} className="h-14 rounded-2xl bg-white border-sacred-green/5 font-bold px-6" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] text-sacred-green/40 px-2 uppercase">آواز آیت (اختتام)</span>
                      <Input type="number" value={endAyah} onChange={e => setEndAyah(parseInt(e.target.value))} className="h-14 rounded-2xl bg-white border-sacred-green/5 font-bold px-6" />
                    </div>
                  </div>
                </div>
              )}

              {selectionType === 'juz' && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-sacred-green/40 px-2">پارہ منتخب کریں</label>
                  <Select value={selectedJuz.toString()} onValueChange={val => setSelectedJuz(parseInt(val))}>
                    <SelectTrigger className="h-14 rounded-2xl bg-white border-sacred-green/5 font-bold shadow-sm">
                      <SelectValue placeholder="پارہ منتخب کریں" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px] rounded-2xl">
                      {juzs.map(j => <SelectItem key={j.index} value={j.index.toString()}>پارہ {j.index}: {j.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {selectionType === 'ruku' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-sacred-green/40 px-2">پہلے سورۃ منتخب کریں</label>
                    <Select value={selectedSurah} onValueChange={setSelectedSurah}>
                      <SelectTrigger className="h-14 rounded-2xl bg-white border-sacred-green/5 font-bold font-arabic shadow-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px] rounded-2xl">
                        {surahs.map(s => <SelectItem key={s.id} value={s.name} className="font-arabic">{s.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-sacred-green/40 px-2">رکوع منتخب کریں</label>
                    <Select value={selectedRuku?.toString() || ""} onValueChange={val => setSelectedRuku(parseInt(val))}>
                      <SelectTrigger className="h-14 rounded-2xl bg-white border-sacred-green/5 font-bold shadow-sm">
                        <SelectValue placeholder="رکوع منتخب کریں" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px] rounded-2xl">
                        {rukus.map(r => <SelectItem key={r.index} value={r.index.toString()}>رکوع {r.index} (آیت {r.end_ayah} تک)</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-sacred-green/40 px-2">طریقہ کار</label>
                <div className="grid grid-cols-2 gap-3 p-1.5 bg-white rounded-[24px] border border-sacred-green/5">
                  <button onClick={() => setMode('nazra')} className={`py-3 rounded-2xl text-sm font-bold transition-all ${mode === 'nazra' ? 'bg-sacred-green text-white shadow-lg' : 'text-sacred-green/40 hover:bg-sacred-green/5'}`}>ناظرہ</button>
                  <button onClick={() => setMode('hifz')} className={`py-3 rounded-2xl text-sm font-bold transition-all ${mode === 'hifz' ? 'bg-sacred-green text-white shadow-lg' : 'text-sacred-green/40 hover:bg-sacred-green/5'}`}>حفظ</button>
                </div>
              </div>
            </div>

            <Button onClick={saveSettings} className="w-full h-16 rounded-[24px] bg-sacred-gold hover:bg-sacred-gold/90 text-white font-bold text-lg shadow-xl shadow-sacred-gold/20">
              محفوظ کریں
            </Button>

            <button 
              onClick={resetOnboarding}
              className="w-full text-sacred-green/30 text-xs font-bold hover:text-sacred-green transition-colors py-2 pt-4"
            >
              دوبارہ پرسنلائز کریں (AI Counselor)
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
