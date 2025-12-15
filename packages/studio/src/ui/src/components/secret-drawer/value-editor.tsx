import { useEffect, useRef, useState } from "react";
import { Textarea } from "@heroui/react";
import { ShieldAlert } from "lucide-react";

interface ValueEditorProps {
  value: string;
  onChange: (value: string) => void;
  onFocus: () => void;
  onBlur: () => void;
}

export function ValueEditor({
  value,
  onChange,
  onFocus,
  onBlur,
}: ValueEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const textareaWrapperRef = useRef<HTMLDivElement>(null);
  const [editorHeight, setEditorHeight] = useState(0);

  useEffect(() => {
    if (!editorRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setEditorHeight(entry.contentRect.height);
      }
    });
    observer.observe(editorRef.current);
    return () => observer.disconnect();
  }, []);

  // Sync scroll between textarea and line numbers
  useEffect(() => {
    const textareaWrapper = textareaWrapperRef.current;
    const lineNumbers = lineNumbersRef.current;

    if (!textareaWrapper || !lineNumbers) return;

    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      if (lineNumbers && target.scrollTop !== undefined) {
        lineNumbers.scrollTop = target.scrollTop;
      }
    };

    // Find the actual scrollable textarea element
    const textarea = textareaWrapper.querySelector("textarea");
    if (textarea) {
      textarea.addEventListener("scroll", handleScroll);
      return () => textarea.removeEventListener("scroll", handleScroll);
    }
  }, [value]);

  return (
    <div className="flex flex-col h-full">
      {/* Editor Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-default-100 bg-background/50 text-xs text-muted-foreground backdrop-blur-sm shrink-0">
        <div className="flex items-center gap-4">
          <span>Plain Text</span>
          <span className="text-default-300">|</span>
          <span>UTF-8</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldAlert size={12} className="text-warning" />
          <span>Value is encrypted at rest</span>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 relative flex overflow-auto" ref={editorRef}>
        {/* Line Numbers Gutter */}
        <div
          ref={lineNumbersRef}
          className="bg-background/50 border-r border-default-100 flex flex-col items-end pr-3 pl-2 py-2 text-xs font-mono text-default-300 select-none overflow-hidden"
          style={{ minHeight: "100%" }}
        >
          {Array.from({
            length: Math.max(
              (value || "").split("\n").length,
              Math.ceil((editorHeight || 500) / 24)
            ),
          }).map((_, i) => {
            return (
              <div key={i} className="leading-6 h-6">
                {i + 1}
              </div>
            );
          })}
        </div>

        {/* Textarea */}
        <div
          ref={textareaWrapperRef}
          className="flex-1 min-h-full relative h-full"
        >
          <Textarea
            classNames={{
              input:
                "font-mono text-sm leading-6 bg-transparent !text-foreground resize-none overflow-hidden min-h-full! max-h-full!",
              inputWrapper:
                "bg-transparent! shadow-none items-start py-2 px-4 hover:bg-transparent focus-within:bg-transparent rounded-none min-h-full h-full",
              innerWrapper: "bg-transparent",
              base: "min-h-full h-full",
            }}
            minRows={Math.max(
              (value || "").split("\n").length,
              Math.ceil((editorHeight || 500) / 24)
            )}
            onFocus={onFocus}
            onBlur={onBlur}
            value={value || ""}
            onValueChange={onChange}
            placeholder="Enter secret value here..."
            disableAnimation
          />
        </div>
      </div>
    </div>
  );
}
