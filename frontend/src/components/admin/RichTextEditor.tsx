import { useEffect, useRef } from "react";
import { Bold, Italic, Underline, List, ListOrdered, Heading2, Heading3, Link2, Eraser } from "lucide-react";

/**
 * Lightweight rich-text editor built on contentEditable + document.execCommand.
 * Outputs an HTML string. Suitable for trusted, admin-authored content.
 */
export function RichTextEditor({ value, onChange, placeholder }: { value: string; onChange: (html: string) => void; placeholder?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  // Initialise / sync external value without clobbering the caret while typing.
  useEffect(() => {
    const el = ref.current;
    if (el && el.innerHTML !== value) el.innerHTML = value || "";
  }, [value]);

  const exec = (command: string, arg?: string) => {
    ref.current?.focus();
    document.execCommand(command, false, arg);
    onChange(ref.current?.innerHTML ?? "");
  };

  const addLink = () => {
    const url = window.prompt("Enter URL (https://…)");
    if (url) exec("createLink", url);
  };

  const btn = "size-8 grid place-items-center rounded hover:bg-secondary text-foreground/70 hover:text-maroon transition";

  const tools: { icon: typeof Bold; label: string; onClick: () => void }[] = [
    { icon: Bold, label: "Bold", onClick: () => exec("bold") },
    { icon: Italic, label: "Italic", onClick: () => exec("italic") },
    { icon: Underline, label: "Underline", onClick: () => exec("underline") },
    { icon: Heading2, label: "Heading", onClick: () => exec("formatBlock", "H2") },
    { icon: Heading3, label: "Subheading", onClick: () => exec("formatBlock", "H3") },
    { icon: List, label: "Bullet list", onClick: () => exec("insertUnorderedList") },
    { icon: ListOrdered, label: "Numbered list", onClick: () => exec("insertOrderedList") },
    { icon: Link2, label: "Link", onClick: addLink },
    { icon: Eraser, label: "Clear formatting", onClick: () => exec("removeFormat") },
  ];

  return (
    <div className="rounded-lg border border-input bg-background overflow-hidden">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-border bg-secondary/40 px-2 py-1.5">
        {tools.map((t) => (
          <button key={t.label} type="button" title={t.label} aria-label={t.label} onClick={t.onClick} className={btn}>
            <t.icon className="size-4" />
          </button>
        ))}
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        data-placeholder={placeholder}
        onInput={(e) => onChange((e.target as HTMLDivElement).innerHTML)}
        onBlur={(e) => onChange((e.target as HTMLDivElement).innerHTML)}
        className="admin-rte min-h-[180px] px-4 py-3 text-sm leading-relaxed focus:outline-none prose-admin"
      />
    </div>
  );
}
