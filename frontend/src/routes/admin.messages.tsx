import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, MailOpen, Reply, Archive, Trash2, X, CornerUpLeft } from "lucide-react";
import { useMessages, updateMessageStatus, deleteMessage, type Message, type MessageStatus } from "@/lib/submissionsStore";

export const Route = createFileRoute("/admin/messages")({
  component: MessagesAdmin,
});

const FILTERS: { key: "all" | MessageStatus; label: string }[] = [
  { key: "all", label: "All" },
  { key: "new", label: "New" },
  { key: "read", label: "Read" },
  { key: "replied", label: "Replied" },
  { key: "archived", label: "Archived" },
];

function MessagesAdmin() {
  const messages = useMessages();
  const [filter, setFilter] = useState<"all" | MessageStatus>("all");
  const [selected, setSelected] = useState<Message | null>(null);

  const filtered = filter === "all" ? messages : messages.filter((m) => m.status === filter);
  const counts = {
    all: messages.length,
    new: messages.filter((m) => m.status === "new").length,
    read: messages.filter((m) => m.status === "read").length,
    replied: messages.filter((m) => m.status === "replied").length,
    archived: messages.filter((m) => m.status === "archived").length,
  };

  const open = (m: Message) => {
    setSelected(m);
    if (m.status === "new") updateMessageStatus(m.id, "read");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-maroon">Messages</h1>
        <p className="text-muted-foreground text-sm mt-1">Enquiries submitted through the Contact page.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button key={f.key} onClick={() => setFilter(f.key)} className={`px-4 py-2 rounded-full text-sm font-medium border transition ${filter === f.key ? "bg-maroon text-cream border-maroon" : "bg-card border-border hover:border-gold"}`}>
            {f.label} <span className="opacity-70">({counts[f.key]})</span>
          </button>
        ))}
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Mail className="size-10 mx-auto text-muted-foreground/50" />
            <p className="mt-3 text-sm text-muted-foreground">No messages{filter !== "all" ? ` with status "${filter}"` : " yet"}.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map((m) => (
              <button key={m.id} onClick={() => open(m)} className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-secondary/40 transition">
                <div className={`size-9 shrink-0 grid place-items-center rounded-lg ${m.status === "new" ? "bg-blue-100 text-blue-700" : "bg-secondary text-muted-foreground"}`}>
                  {m.status === "new" ? <Mail className="size-4" /> : <MailOpen className="size-4" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`truncate ${m.status === "new" ? "font-semibold text-foreground" : "font-medium text-foreground/80"}`}>{m.name}</span>
                    <span className="text-xs text-muted-foreground truncate">· {m.subject || "(no subject)"}</span>
                  </div>
                  <div className="text-sm text-muted-foreground truncate">{m.message}</div>
                </div>
                <StatusPill status={m.status} />
                <span className="text-xs text-muted-foreground whitespace-nowrap hidden sm:block">{new Date(m.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {selected && <MessageDrawer message={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function MessageDrawer({ message: m, onClose }: { message: Message; onClose: () => void }) {
  const setStatus = (s: MessageStatus) => { updateMessageStatus(m.id, s); onClose(); };
  const remove = () => { if (confirm("Delete this message?")) { deleteMessage(m.id); onClose(); } };
  const mailto = `mailto:${m.email}?subject=${encodeURIComponent("Re: " + (m.subject || "Your enquiry"))}`;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-md bg-background h-full overflow-y-auto shadow-xl">
        <div className="sticky top-0 bg-maroon text-cream px-5 py-4 flex items-center justify-between">
          <div className="font-display text-xl">Message</div>
          <button onClick={onClose} aria-label="Close" className="size-9 grid place-items-center rounded hover:bg-cream/15"><X className="size-5" /></button>
        </div>
        <div className="p-5 space-y-5">
          <div className="flex items-center justify-between">
            <StatusPill status={m.status} />
            <span className="text-xs text-muted-foreground">{new Date(m.createdAt).toLocaleString()}</span>
          </div>
          <div className="rounded-xl border border-border p-4">
            <div className="font-display text-lg text-maroon">{m.name}</div>
            <a href={`mailto:${m.email}`} className="text-sm text-gold-deep hover:text-maroon">{m.email}</a>
            {m.subject && <div className="mt-2 text-sm font-medium">{m.subject}</div>}
          </div>
          <div className="rounded-xl bg-secondary/50 p-4 text-sm leading-relaxed whitespace-pre-wrap">{m.message}</div>
          <div className="grid grid-cols-2 gap-2 pt-2">
            <a href={mailto} className="inline-flex items-center justify-center gap-1.5 rounded-md bg-maroon text-cream py-2.5 text-sm font-semibold hover:bg-maroon-deep"><CornerUpLeft className="size-4" /> Reply</a>
            <button onClick={() => setStatus("replied")} className="inline-flex items-center justify-center gap-1.5 rounded-md bg-green-600 text-white py-2.5 text-sm font-semibold hover:bg-green-700"><Reply className="size-4" /> Mark Replied</button>
            <button onClick={() => setStatus("archived")} className="inline-flex items-center justify-center gap-1.5 rounded-md border border-border py-2.5 text-sm font-medium hover:border-gold"><Archive className="size-4" /> Archive</button>
            <button onClick={remove} className="inline-flex items-center justify-center gap-1.5 rounded-md border border-destructive/40 text-destructive py-2.5 text-sm font-medium hover:bg-destructive/10"><Trash2 className="size-4" /> Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    new: "bg-blue-100 text-blue-700",
    read: "bg-secondary text-muted-foreground",
    replied: "bg-green-100 text-green-700",
    archived: "bg-secondary text-muted-foreground",
  };
  return <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${map[status] ?? ""}`}>{status}</span>;
}
