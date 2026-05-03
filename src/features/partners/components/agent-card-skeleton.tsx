export function AgentCardSkeleton() {
  return (
    <div className="relative bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm h-full flex flex-col animate-pulse">
      <div className="absolute top-0 left-0 right-0 h-24 bg-gray-100/80" />

      <div className="relative p-6 pt-10 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-6">
          <div className="h-20 w-20 rounded-2xl bg-gray-200 shrink-0" />
          <div className="h-6 w-16 rounded-md bg-gray-100" />
        </div>

        <div className="space-y-3 mb-6">
          <div className="h-7 rounded-lg bg-gray-200 w-4/5" />
          <div className="h-4 rounded-md bg-gray-100 w-1/3" />
          <div className="h-4 rounded-md bg-gray-100 w-2/3" />
        </div>

        <div className="grid grid-cols-1 gap-3 py-4 border-y border-gray-100 mb-6 mt-auto">
          <div className="flex items-center justify-between">
            <div className="h-4 rounded bg-gray-100 w-24" />
            <div className="h-4 rounded bg-gray-200 w-20" />
          </div>
          <div className="flex items-center justify-between">
            <div className="h-4 rounded bg-gray-100 w-28" />
            <div className="h-4 rounded bg-gray-200 w-24" />
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-auto">
          <div className="flex gap-2">
            <div className="flex-1 h-10 rounded-xl bg-gray-100" />
            <div className="flex-1 h-10 rounded-xl bg-gray-100" />
          </div>
          <div className="w-full h-12 rounded-xl bg-gray-200" />
        </div>
      </div>
    </div>
  );
}
