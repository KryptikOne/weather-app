export default function BreakpointHelper() {
  return (
    <div className="fixed bottom-3 left-3 z-[9999999999] flex items-center justify-center rounded-sm bg-gray-800 p-1 font-normal uppercase text-white text-[10px] border border-gray-700">
      <div className="block sm:hidden">xs</div>
      <div className="hidden sm:block md:hidden">sm</div>
      <div className="hidden md:block lg:hidden">md</div>
      <div className="hidden lg:block xl:hidden">lg</div>
      <div className="hidden xl:block 2xl:hidden">xl</div>
      <div className="hidden 2xl:block">2xl</div>
    </div>
  )
}