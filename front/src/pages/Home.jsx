import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useSearchParams } from 'react-router-dom'
import NewsCard from '../components/NewsCard'
import BreakingNews from '../components/BreakingNews'
import AdCard from '../components/AdCard'
import HeroCarousel from '../components/HeroCarousel'

export default function Home() {
  const [news, setNews] = useState([])
  const [ads, setAds] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchParams] = useSearchParams()
  const categoryParam = searchParams.get('category')

  // Defined categories to show as sections
  const categories = ['World', 'Technology', 'Sports', 'Business', 'entertainment', 'Crime', 'General'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        // Fetch all news and ads. We will filter client-side for the home page layout.
        const [newsRes, adsRes] = await Promise.all([
          axios.get(import.meta.env.VITE_API + '/news'),
          axios.get(import.meta.env.VITE_API + '/ads')
        ])
        // Sort by date descending (newest first)
        const sortedNews = newsRes.data.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
        setNews(sortedNews)
        setAds(adsRes.data)
      } catch (err) {
        console.error("Error fetching data:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>

  // 1. If a specific category is selected (e.g. from Navbar), show the classic grid layout for that category.
  if (categoryParam && categoryParam !== 'All') {
    const filteredNews = news.filter(n => n.categories && n.categories.includes(categoryParam));
    return (
      <div className="bg-gray-50 min-h-screen pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <BreakingNews news={news.filter(n => n.isBreaking)} />
          <div className="flex items-center space-x-4 mb-8 mt-8">
            <h2 className="text-3xl font-bold text-gray-900">{categoryParam} News</h2>
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">{filteredNews.length} Articles</span>
          </div>
          {filteredNews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredNews.map(n => <NewsCard key={n._id} news={n} />)}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-500 text-lg">No news found in this category.</div>
          )}
        </div>
      </div>
    )
  }

  // 2. Default Home Page Layout (Carousel + Category Sections)
  const recentNews = news.slice(0, 5); // Top 5 for carousel

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* Breaking News Ticker */}
        <BreakingNews news={news.filter(n => n.isBreaking)} />

        {/* Hero Carousel - Top 5 News */}
        <div className="mt-8">
          <HeroCarousel news={recentNews} />
        </div>

        {/* Category Sections */}
        <div className="space-y-16 mt-16">
          {categories.map((cat, index) => {
            // Get news for this category, limit to 4 items for the section preview
            const catNews = news.filter(n => n.categories && n.categories.includes(cat)).slice(0, 4);

            if (catNews.length === 0) return null; // Don't show empty sections

            // Determine if we should show an ad after this section
            // We show an ad after every 2nd section (index 1, 3, 5...)
            const showAd = index % 2 === 1;
            const adToDisplay = ads.length > 0 ? ads[Math.floor(index / 2) % ads.length] : null;

            return (
              <React.Fragment key={cat}>
                <div className="relative animate-fade-in-up">
                  <div className="flex justify-between items-end mb-6 border-b border-gray-200 pb-2">
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 border-l-8 border-blue-600 pl-4">
                      {cat}
                    </h3>
                    <a href={`/?category=${cat}`} className="text-blue-600 hover:text-blue-800 font-semibold text-sm flex items-center transition-colors">
                      View All {cat} <span className="ml-1 text-lg">&rarr;</span>
                    </a>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {catNews.map(n => (
                      <NewsCard key={n._id} news={n} />
                    ))}
                  </div>
                </div>

                {/* Interspersed Ad */}
                {showAd && adToDisplay && (
                  <div className="my-12">
                    <AdCard ad={adToDisplay} />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

      </div>
    </div>
  )
}
