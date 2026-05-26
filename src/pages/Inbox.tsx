import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search, MessageSquare, User, Bot, Sparkles, Send, 
  MoreVertical, Phone, Info, CheckCircle2, Clock
} from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "customer" | "ai" | "human";
  timestamp: string;
}

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  status: "ai" | "human";
  avatar: string;
}

const chats: Chat[] = [
  { id: "1", name: "Ahmed Khan", lastMessage: "Order confirm karoon?", time: "12:30 PM", unread: 2, status: "ai", avatar: "AK" },
  { id: "2", name: "Sara Malik", lastMessage: "JazakAllah! Payment options kya hain?", time: "11:45 AM", unread: 0, status: "human", avatar: "SM" },
  { id: "3", name: "Bilal Shah", lastMessage: "Shukriya! Kal milte hain.", time: "Yesterday", unread: 0, status: "ai", avatar: "BS" },
  { id: "4", name: "Zainab Raza", lastMessage: "Catalog bheijiye please.", time: "Yesterday", unread: 0, status: "ai", avatar: "ZR" },
];

const initialMessages: Message[] = [
  { id: "1", text: "Assalam o alaikum! Lahore mein delivery timings kya hain?", sender: "customer", timestamp: "11:40 AM" },
  { id: "2", text: "Walaikum Assalam! Hum subah 11 se raat 11 tak Lahore ke har kone mein delivery karte hain. Kya aap menu dekhna chahenge?", sender: "ai", timestamp: "11:41 AM" },
  { id: "3", text: "Ji zaroor, price list bhi bheijiye.", sender: "customer", timestamp: "11:42 AM" },
  { id: "4", text: "Hamara best-seller Zinger Stack Rs. 750 ka hai. Delivery charges DHA ke liye sirf Rs. 100 hain. Order confirm karoon?", sender: "ai", timestamp: "11:43 AM" },
];

const Inbox = () => {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(chats[0]);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputText, setInputText] = useState("");
  const [mode, setMode] = useState<"ai" | "human">("ai");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: mode === "ai" ? "ai" : "human",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages([...messages, newMessage]);
    setInputText("");
  };

  return (
    <div className="flex h-full bg-background overflow-hidden">
      {/* ─── Chat List ─── */}
      <div className="w-80 border-r flex flex-col bg-card/30 backdrop-blur-sm">
        <div className="p-4 border-b space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-black text-xl">Inbox</h2>
            <Button variant="ghost" size="icon" className="rounded-full"><MoreVertical className="h-4 w-4" /></Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search chats..." className="pl-9 h-10 rounded-xl bg-background/50 border-none focus-visible:ring-1" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setSelectedChat(chat)}
              className={`w-full p-4 flex items-center gap-4 transition-all hover:bg-foreground/5 border-l-4 ${selectedChat?.id === chat.id ? 'bg-primary/5 border-primary' : 'border-transparent'}`}
            >
              <div className="relative">
                <div className="h-12 w-12 rounded-full bg-gradient-primary flex items-center justify-center text-white font-black shadow-sm">
                  {chat.avatar}
                </div>
                {chat.status === "ai" && (
                  <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-primary rounded-full border-2 border-background flex items-center justify-center">
                    <Bot className="h-3 w-3 text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1 text-left min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="font-bold truncate">{chat.name}</span>
                  <span className="text-[10px] text-muted-foreground font-medium">{chat.time}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground truncate pr-2">{chat.lastMessage}</p>
                  {chat.unread > 0 && (
                    <span className="h-4 min-w-[16px] bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ─── Chat Window ─── */}
      <div className="flex-1 flex flex-col relative">
        {selectedChat ? (
          <>
            {/* Header */}
            <header className="h-16 border-b flex items-center justify-between px-6 bg-background/50 backdrop-blur-sm z-10">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-black text-sm">
                  {selectedChat.avatar}
                </div>
                <div>
                  <div className="font-bold text-sm leading-tight">{selectedChat.name}</div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    {mode === "ai" ? (
                      <span className="text-primary flex items-center gap-1"><Sparkles className="h-2.5 w-2.5" /> AI Agent Active</span>
                    ) : (
                      <span className="text-amber-600 flex items-center gap-1"><User className="h-2.5 w-2.5" /> Human Mode</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-foreground/5 p-1 rounded-lg flex gap-1 mr-4">
                  <button 
                    onClick={() => setMode("ai")}
                    className={`px-3 py-1.5 rounded-md text-[10px] font-black transition-all flex items-center gap-1.5 ${mode === "ai" ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    <Bot className="h-3 w-3" /> AI
                  </button>
                  <button 
                    onClick={() => setMode("human")}
                    className={`px-3 py-1.5 rounded-md text-[10px] font-black transition-all flex items-center gap-1.5 ${mode === "human" ? "bg-background shadow-sm text-amber-600" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    <User className="h-3 w-3" /> HUMAN
                  </button>
                </div>
                <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground"><Phone className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground"><Info className="h-4 w-4" /></Button>
              </div>
            </header>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="flex justify-center">
                <span className="bg-foreground/5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-3 py-1 rounded-full">Today</span>
              </div>
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.sender === "customer" ? "justify-start" : "justify-end"}`}>
                  <div className={`max-w-[70%] space-y-1`}>
                    <div className={`px-4 py-2.5 rounded-2xl text-sm font-medium shadow-sm transition-all hover:shadow-md ${
                      m.sender === "customer" 
                        ? "bg-card border rounded-bl-sm" 
                        : m.sender === "ai" 
                          ? "bg-primary/10 border border-primary/20 text-primary-foreground rounded-br-sm bg-gradient-primary" 
                          : "bg-amber-500 text-white rounded-br-sm"
                    }`}>
                      {m.sender !== "customer" && (
                        <div className="flex items-center gap-1 text-[9px] font-black uppercase tracking-tighter opacity-80 mb-1">
                          {m.sender === "ai" ? <Sparkles className="h-2.5 w-2.5" /> : <User className="h-2.5 w-2.5" />}
                          {m.sender === "ai" ? "AI Agent" : "Human Team"}
                        </div>
                      )}
                      {m.text}
                    </div>
                    <div className={`flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground ${m.sender === "customer" ? "justify-start" : "justify-end"}`}>
                      {m.timestamp}
                      {m.sender !== "customer" && <CheckCircle2 className="h-3 w-3 text-primary" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-6 pt-2">
              <form onSubmit={handleSendMessage} className="relative group">
                <div className="absolute -inset-1 bg-gradient-primary rounded-2xl opacity-10 blur group-focus-within:opacity-30 transition-opacity" />
                <Card className="relative p-2 flex items-center gap-2 rounded-2xl shadow-lg border-primary/10">
                  <Input 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={mode === "ai" ? "Monitor AI or type to reply..." : "Reply as human..."}
                    className="flex-1 border-none focus-visible:ring-0 shadow-none bg-transparent h-10 text-sm font-medium"
                  />
                  <Button type="submit" size="icon" className="h-10 w-10 rounded-xl bg-gradient-primary shadow-glow transition-transform hover:scale-105 active:scale-95">
                    <Send className="h-4 w-4" />
                  </Button>
                </Card>
              </form>
              <div className="mt-3 flex items-center justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-emerald-500"><Clock className="h-3 w-3" /> Avg. Reply: 2s</span>
                  <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                  <span>DHA Phase 5, Lahore</span>
                </div>
                <span>Character Count: {inputText.length}</span>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12 space-y-4">
            <div className="h-20 w-20 rounded-full bg-primary/5 flex items-center justify-center">
              <MessageSquare className="h-10 w-10 text-primary/30" />
            </div>
            <div>
              <h2 className="font-display font-black text-2xl">Select a Chat</h2>
              <p className="text-muted-foreground max-w-xs mx-auto">Click on a conversation to see messages and manage the AI agent.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inbox;
