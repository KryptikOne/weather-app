import Header from '@/app/ui/global/header'

export default function Home() {

  return (
    <div className="page min-h-full">
      <Header />
      <main className="bg-gray-300 w-full">
        <div className="mx-auto max-w-7xl h-full px-4 py-6 sm:px-6 lg:px-8">

          <h1 className="text-2xl text-gray-900">Main Section</h1>
          <p className="mt-4 text-gray-700">This is the main content area.</p>

        </div>
      </main>
    </div>
  )
}
