'use client';

export default function CrispChatButton() {
  return (
    <button
      onClick={() => {
        if (typeof window !== 'undefined' && (window as any).$crisp) {
          (window as any).$crisp.push(['do', 'chat:open']);
        }
      }}
      className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm"
    >
      Live Chat
    </button>
  );
}
