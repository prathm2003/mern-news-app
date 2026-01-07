import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export default function Dashboard() {
  const { user, login } = useContext(AuthContext)
  const [activeTab, setActiveTab] = useState(user?.role === 'admin' ? 'news' : 'profile')

  // Admin: News State
  const [news, setNews] = useState([])
  const [title, setTitle] = useState('')
  const [script, setScript] = useState('')
  const [youtubeLink, setYoutubeLink] = useState('')
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isBreaking, setIsBreaking] = useState(false);
  const categories = ['General', 'Crime', 'Technology', 'Sports', 'Business', 'entertainment'];

  // Admin: Ads State
  const [ads, setAds] = useState([])
  const [adTitle, setAdTitle] = useState('')
  const [adContent, setAdContent] = useState('')
  const [adLink, setAdLink] = useState('')
  const [adImage, setAdImage] = useState('')

  // User: Profile State
  const [updateName, setUpdateName] = useState(user?.name || '')
  const [updatePassword, setUpdatePassword] = useState('')
  const [profileOtp, setProfileOtp] = useState('')
  const [showOtpInput, setShowOtpInput] = useState(false)

  // User: Liked News State
  const [likedNews, setLikedNews] = useState([])

  const loadData = () => {
    if (user?.role === 'admin') {
      axios.get(import.meta.env.VITE_API + '/news').then(res => setNews(res.data))
      axios.get(import.meta.env.VITE_API + '/ads').then(res => setAds(res.data))
    }
  }

  const loadLikedNews = () => {
    if (user) {
      axios.get(import.meta.env.VITE_API + '/news/liked', {
        headers: { Authorization: 'Bearer ' + user.token }
      }).then(res => setLikedNews(res.data)).catch(err => console.log(err));
    }
  }

  useEffect(() => {
    loadData();
    if (user?.role !== 'admin') {
      setActiveTab('profile');
      loadLikedNews();
    }
  }, [user]) // Reload when user changes

  // Admin Functions
  const addNews = async () => {
    try {
      await axios.post(import.meta.env.VITE_API + '/news',
        { title, script, youtubeLink, categories: selectedCategories, isBreaking },
        { headers: { Authorization: 'Bearer ' + user?.token } }
      )
      loadData()
      setTitle(''); setScript(''); setYoutubeLink(''); setIsBreaking(false); setSelectedCategories([]);
    } catch (err) { alert('Only admin can add news') }
  }

  const deleteNews = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await axios.delete(import.meta.env.VITE_API + '/news/' + id, {
        headers: { Authorization: 'Bearer ' + user?.token }
      })
      loadData()
    } catch (err) { alert('Delete failed') }
  }

  const addAd = async () => {
    try {
      await axios.post(import.meta.env.VITE_API + '/ads',
        { title: adTitle, content: adContent, link: adLink, imageUrl: adImage },
        { headers: { Authorization: 'Bearer ' + user?.token } }
      )
      loadData()
      setAdTitle(''); setAdContent(''); setAdLink(''); setAdImage('');
    } catch (err) { alert('Failed to add ad') }
  }

  const deleteAd = async (id) => {
    if (!window.confirm('Are you sure you want to delete this ad?')) return;
    try {
      await axios.delete(import.meta.env.VITE_API + '/ads/' + id, {
        headers: { Authorization: 'Bearer ' + user?.token }
      })
      loadData()
    } catch (e) { alert('Delete failed') }
  }

  // User Functions
  const handleSendProfileOtp = async () => {
    try {
      await axios.post(import.meta.env.VITE_API + '/auth/send-otp', {}, {
        headers: { Authorization: 'Bearer ' + user?.token }
      });
      setShowOtpInput(true);
      alert('OTP sent to your mobile (Check server console)');
    } catch (err) { alert('Failed to send OTP: ' + (err.response?.data?.message || err.message)) }
  }

  const handleUpdateProfile = async () => {
    try {
      const res = await axios.put(import.meta.env.VITE_API + '/auth/profile',
        { name: updateName, password: updatePassword || undefined, otp: profileOtp },
        { headers: { Authorization: 'Bearer ' + user?.token } }
      );
      login(res.data); // Update context
      alert('Profile Updated Successfully');
      setUpdatePassword('');
      setProfileOtp('');
      setShowOtpInput(false);
    } catch (err) {
      alert('Update failed: ' + (err.response?.data?.message || err.message));
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">
          {user?.role === 'admin' ? 'Admin Dashboard' : 'User Dashboard'}
        </h2>
        <div className="flex space-x-4 bg-white p-1 rounded-lg border border-gray-200">
          {user?.role === 'admin' ? (
            <>
              <button
                onClick={() => setActiveTab('news')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'news' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                Manage News
              </button>
              <button
                onClick={() => setActiveTab('ads')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'ads' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                Manage Ads
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'profile' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                Edit Profile
              </button>
              <button
                onClick={() => { setActiveTab('liked'); loadLikedNews(); }}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'liked' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                Liked News
              </button>
            </>
          )}
        </div>
      </div>

      {/* ADMIN: MANAGE NEWS */}
      {user?.role === 'admin' && activeTab === 'news' && (
        <>
          <div className="bg-white p-6 rounded-xl shadow-md mb-10 border border-gray-100">
            <h3 className="text-xl font-semibold mb-4">Add News</h3>
            <div className="grid grid-cols-1 gap-4">
              <input
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 border p-2"
                placeholder='Title' value={title} onChange={e => setTitle(e.target.value)}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 border p-2"
                  placeholder='YouTube Link (Watch URL)' value={youtubeLink} onChange={e => setYoutubeLink(e.target.value)}
                />
                <div className="border border-gray-300 rounded-md p-2 h-32 overflow-y-auto">
                  <span className="block text-sm text-gray-500 mb-1">Select Categories:</span>
                  {categories.map(c => (
                    <div key={c} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`cat-${c}`}
                        value={c}
                        checked={selectedCategories.includes(c)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCategories([...selectedCategories, c]);
                          } else {
                            setSelectedCategories(selectedCategories.filter(sc => sc !== c));
                          }
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`cat-${c}`} className="text-sm text-gray-700">{c}</label>
                    </div>
                  ))}
                </div>
              </div>
              <textarea
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 border p-2 h-32"
                placeholder='Script / Content' value={script} onChange={e => setScript(e.target.value)}
              />
              <div className="flex items-center">
                <input
                  id="isBreaking"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={isBreaking}
                  onChange={e => setIsBreaking(e.target.checked)}
                />
                <label htmlFor="isBreaking" className="ml-2 block text-sm text-gray-900">
                  Mark as Breaking News
                </label>
              </div>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition w-full md:w-auto md:self-start"
                onClick={addNews}
              >
                Add News
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map(n => (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden" key={n._id}>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-bold text-lg leading-tight">{n.title}</h5>
                    {n.isBreaking && <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-semibold">Breaking</span>}
                  </div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{n.script}</p>
                  <div className="flex justify-between items-center mt-auto">
                    <div className="flex flex-wrap gap-1 mt-auto">
                      {n.categories?.map(cat => (
                        <span key={cat} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{cat}</span>
                      ))}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        className={`text-xs px-2 py-1 rounded font-medium border ${n.isBreaking ? 'text-orange-600 border-orange-200 hover:bg-orange-50' : 'text-green-600 border-green-200 hover:bg-green-50'}`}
                        onClick={async () => {
                          try {
                            await axios.put(import.meta.env.VITE_API + '/news/' + n._id,
                              { isBreaking: !n.isBreaking },
                              { headers: { Authorization: 'Bearer ' + user?.token } }
                            );
                            loadData();
                          } catch (e) { alert('Update failed'); }
                        }}
                      >
                        {n.isBreaking ? 'Remove Breaking' : 'Make Breaking'}
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                        onClick={() => deleteNews(n._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ADMIN: MANAGE ADS */}
      {user?.role === 'admin' && activeTab === 'ads' && (
        <>
          <div className="bg-white p-6 rounded-xl shadow-md mb-10 border border-gray-100">
            <h3 className="text-xl font-semibold mb-4">Add Advertisement</h3>
            <div className="grid grid-cols-1 gap-4">
              <input
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 border p-2"
                placeholder='Ad Title' value={adTitle} onChange={e => setAdTitle(e.target.value)}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 border p-2"
                  placeholder='Image URL' value={adImage} onChange={e => setAdImage(e.target.value)}
                />
                <input
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 border p-2"
                  placeholder='Target Link' value={adLink} onChange={e => setAdLink(e.target.value)}
                />
              </div>
              <textarea
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 border p-2 h-24"
                placeholder='Ad Content / Description' value={adContent} onChange={e => setAdContent(e.target.value)}
              />
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition w-full md:w-auto md:self-start"
                onClick={addAd}
              >
                Create Ad
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ads.map(ad => (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden" key={ad._id}>
                <div className="h-40 bg-gray-100 relative">
                  {ad.imageUrl ? (
                    <img src={ad.imageUrl} alt={ad.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                  )}
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-lg mb-1">{ad.title}</h4>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{ad.content}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-blue-500 truncate max-w-[150px]">{ad.link}</span>
                    <button
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                      onClick={() => deleteAd(ad._id)}
                    >
                      Delete Ad
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* USER: EDIT PROFILE */}
      {user?.role !== 'admin' && activeTab === 'profile' && (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md border border-gray-100">
          <h3 className="text-2xl font-bold mb-6 text-gray-900">Edit Profile</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                value={updateName}
                onChange={e => setUpdateName(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">New Password (leave blank to keep current)</label>
              <input
                type="password"
                value={updatePassword}
                onChange={e => setUpdatePassword(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            {showOtpInput && (
              <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
                <label className="block text-sm font-bold text-yellow-800 mb-1">Enter OTP sent to your mobile</label>
                <input
                  type="text"
                  value={profileOtp}
                  onChange={e => setProfileOtp(e.target.value)}
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="6-digit OTP"
                />
                <p className="text-xs text-gray-500 mt-1">Check the server console for the simulation code.</p>
              </div>
            )}

            {!showOtpInput ? (
              <button
                onClick={handleSendProfileOtp}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Send OTP to Update
              </button>
            ) : (
              <button
                onClick={handleUpdateProfile}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Verify & Update Profile
              </button>
            )}
          </div>
        </div>
      )}

      {/* USER: LIKED NEWS */}
      {user?.role !== 'admin' && activeTab === 'liked' && (
        <div>
          <h3 className="text-2xl font-bold mb-6 text-gray-900">Liked News</h3>
          {likedNews.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
              <p className="text-gray-500 text-lg">You haven't liked any news yet.</p>
              <Link to="/" className="text-blue-600 hover:text-blue-800 mt-2 inline-block font-medium">Browse News</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {likedNews.map(n => (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden" key={n._id}>
                  <div className="p-4">
                    <h5 className="font-bold text-lg leading-tight mb-2">
                      <Link to={`/news/${n._id}`} className="hover:text-blue-600 transition-colors">
                        {n.title}
                      </Link>
                    </h5>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {n.categories?.map(cat => (
                        <span key={cat} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{cat}</span>
                      ))}
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-xs text-gray-400">{new Date(n.publishedAt).toLocaleDateString()}</span>
                      <Link to={`/news/${n._id}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium">Read Article &rarr;</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  )
}
