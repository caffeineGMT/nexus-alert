'use client';

export default function CopyButton({ text }: { text: string }) {
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        alert('Code copied to clipboard!');
      }}
      className="ml-2 px-3 py-1 text-xs rounded bg-[#3b82f6] hover:bg-[#2563eb] transition"
    >
      Copy
    </button>
  );
}
