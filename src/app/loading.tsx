export default function Loading() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="h-0.5 w-full bg-transparent overflow-hidden">
        <div className="h-full bg-blue-500 animate-loading-bar" />
      </div>
      <style>{`
        @keyframes loading-bar {
          0% { width: 0%; margin-left: 0%; }
          30% { width: 40%; margin-left: 0%; }
          60% { width: 30%; margin-left: 50%; }
          100% { width: 0%; margin-left: 100%; }
        }
        .animate-loading-bar {
          animation: loading-bar 1.2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
