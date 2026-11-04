export function MovieGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {Array.from({ length: 10 }, (_, index) => (
        <div key={index} className="flex animate-pulse flex-col gap-2">
          <div className="aspect-[2/3] rounded-[10px] bg-gray-200" />
          <div className="h-4 w-3/4 rounded bg-gray-200" />
          <div className="h-3 w-1/3 rounded bg-gray-200" />
        </div>
      ))}
    </div>
  );
}
