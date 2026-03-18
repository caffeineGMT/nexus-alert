import Link from 'next/link';

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#ededed]">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 border-b border-[#222] bg-[#0a0a0a]/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold tracking-tight hover:text-[#3b82f6] transition">
            NEXUS Alert
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/blog" className="text-sm text-[#888] hover:text-[#ededed] transition">
              Blog
            </Link>
            <a
              href="https://chrome.google.com/webstore/detail/nexus-alert/EXTENSION_ID"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-[#3b82f6] text-white text-sm font-semibold hover:bg-[#2563eb] transition"
            >
              Install Free
            </a>
          </div>
        </div>
      </nav>

      <main className="pt-14">
        {children}
      </main>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-[#222] mt-20">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <Link href="/" className="text-lg font-bold tracking-tight hover:text-[#3b82f6] transition">
                NEXUS Alert
              </Link>
              <p className="text-[#555] text-sm mt-2">
                Never miss a NEXUS, Global Entry, or SENTRI appointment slot
              </p>
            </div>
            <div className="flex gap-8 text-sm">
              <Link href="/blog" className="text-[#888] hover:text-[#3b82f6] transition">
                Blog
              </Link>
              <a
                href="https://github.com/caffeineGMT/nexus-alert"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#888] hover:text-[#3b82f6] transition"
              >
                GitHub
              </a>
            </div>
          </div>
          <div className="text-center text-sm text-[#555] mt-8">
            <p>NEXUS Alert is free and open source. Not affiliated with CBP or DHS.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
