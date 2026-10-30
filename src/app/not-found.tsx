import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#151B2B] text-ivory flex flex-col items-center justify-center p-4 text-center">
      <h1 className="text-6xl font-serif font-black text-gold mb-3">404</h1>
      <h2 className="text-2xl font-serif font-bold text-ivory mb-2">पेज नहीं मिला (Page Not Found)</h2>
      <p className="text-sm text-ivory/70 max-w-md mb-6">
        आप जो पृष्ठ खोज रहे हैं वह मौजूद नहीं है या हटा दिया गया है।
      </p>
      <Link
        href="/"
        className="px-6 py-2.5 rounded-xl bg-gold hover:bg-gold-light text-navy font-bold text-sm shadow-lg transition"
      >
        मुख्य पृष्ठ पर जाएँ (Back to Home)
      </Link>
    </div>
  );
}

