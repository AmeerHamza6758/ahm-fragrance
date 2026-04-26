export default function Loading() {
  return (
    <div className="fixed inset-0 z-9998 bg-background/55 flex items-center justify-center">
      <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
    </div>
  );
}

