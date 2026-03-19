'use client';

export default function FooterLinks() {
  const handlePrivacySettings = () => {
    localStorage.removeItem('nexus-alert-cookie-consent');
    window.location.reload();
  };

  return (
    <div className="mt-3 space-x-4">
      <a
        href="/how-it-works"
        className="text-[#888] hover:text-[#3b82f6] transition"
      >
        How It Works
      </a>
      <a href="/blog" className="text-[#888] hover:text-[#3b82f6] transition">
        Blog
      </a>
      <a
        href="/privacy"
        className="text-[#888] hover:text-[#3b82f6] transition"
      >
        Privacy Policy
      </a>
      <a href="/terms" className="text-[#888] hover:text-[#3b82f6] transition">
        Terms of Service
      </a>
      <button
        onClick={handlePrivacySettings}
        className="text-[#888] hover:text-[#3b82f6] transition cursor-pointer bg-transparent border-none inline"
        aria-label="Manage cookie preferences"
      >
        Privacy Settings
      </button>
      <a
        href="https://github.com/caffeineGMT/nexus-alert"
        className="text-[#888] hover:text-[#3b82f6] transition"
      >
        GitHub
      </a>
    </div>
  );
}
