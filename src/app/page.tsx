import Header from '@/app/ui/global/header'
import Banner from '@/app/ui/global/banner'

export default function Home() {

  return (
    <div className="page min-h-full">
      <Header />
      <Banner />
      <main className="bg-gray-100 w-full">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-gray-900">Main Section</p>
        </div>
      </main>
    </div>
  )
}
