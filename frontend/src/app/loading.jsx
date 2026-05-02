export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] bg-background/65 backdrop-blur-[1px] flex items-center justify-center">
      <div className="relative">
        <div className="absolute inset-0 animate-pulse rounded-full bg-primary/20 blur-xl" />
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-muted" />
          <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        </div>
      </div>
    </div>
  );
}