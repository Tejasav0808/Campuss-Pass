import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { Search, Filter, Calendar, MapPin, ArrowRight, ArrowLeft, Clock } from 'lucide-react';

const MOCK_EVENTS = [
  {
    id: '1',
    title: 'Cyber Security Hackathon',
    category: 'Mru cyber squad',
    mainCategory: 'Clubs',
    date: 'Oct 24, 2026',
    time: '10:00 AM',
    venue: 'MRU Main Hall',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800',
    price: 'Free',
    is_free: true,
  },
  {
    id: '2',
    title: 'AI Innovation Meetup',
    category: 'AIML INNOVATION CLUB',
    mainCategory: 'Clubs',
    date: 'Nov 12, 2026',
    time: '6:00 PM',
    venue: 'Campus Green',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=800',
    price: '₹150',
    is_free: false,
  },
  {
    id: '3',
    title: 'Rudra Dance Fest',
    category: 'Rudra',
    mainCategory: 'Societies',
    date: 'Dec 05, 2026',
    time: '5:30 PM',
    venue: 'Library Lounge',
    image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=800',
    price: 'Free',
    is_free: true,
  },
  {
    id: '4',
    title: 'Wild Cats Clan Meet',
    category: 'wild cats',
    mainCategory: 'Clans',
    date: 'Oct 15, 2026',
    time: '8:00 AM',
    venue: 'Recreation Wing',
    image: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?q=80&w=800',
    price: 'Free',
    is_free: true,
    is_new: false,
  },
  {
    id: '5',
    title: 'IEEE Workshop',
    category: 'IEEE',
    mainCategory: 'Clubs',
    date: 'Dec 12, 2026',
    time: '2:00 PM',
    venue: 'Creative Studio',
    image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?q=80&w=800',
    price: '₹250',
    is_free: false,
    is_new: true,
  },
];

const CATEGORIES = ['All', 'Clubs', 'Clans', 'Societies'];
const SUB_CATEGORIES: Record<string, string[]> = {
  Clubs: ['Mru cyber squad', 'AIML INNOVATION CLUB', 'CCMRU', 'IEEE'],
  Clans: ['wild cats', 'Airfalcons', 'Forest rhinos', 'MRU Foundation'],
  Societies: ['Rudra', 'Moksha', 'Khalibali', 'Noora', 'felicia']
};

export default function EventsGrid() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeSubCategory, setActiveSubCategory] = useState('All');
  const [priceFilter, setPriceFilter] = useState<'All' | 'Free' | 'Paid'>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'price'>('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [displayEvents, setDisplayEvents] = useState(MOCK_EVENTS);

  useEffect(() => {
    document.title = 'CampusPass | Events Grid';
    
    // Load events from localStorage
    const saved = localStorage.getItem('campus_pass_org_events');
    if (saved) {
      const customEvents = JSON.parse(saved);
      // Ensure IDs are strings and merge
      const formattedCustom = customEvents.map((ev: any) => ({
        ...ev,
        id: String(ev.id),
        is_free: !ev.revenue.includes('$'), // simplified logic
        price: ev.revenue.includes('@') ? ev.revenue.split('@')[1].replace(')', '').trim() : (ev.revenue.includes('$') ? ev.revenue : 'Free')
      }));
      setDisplayEvents(formattedCustom);
    } else {
      setDisplayEvents([]);
    }
  }, []);

  const filteredEvents = displayEvents
    .filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === 'All' || (event as any).mainCategory === activeCategory;
      const matchesSubCategory = activeSubCategory === 'All' || event.category === activeSubCategory;
      const matchesPrice = priceFilter === 'All' || 
        (priceFilter === 'Free' ? event.is_free : !event.is_free);
      return matchesSearch && matchesCategory && matchesSubCategory && matchesPrice;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        // Mock sorting: newest first (higher ID or is_new flag)
        if (a.is_new && !b.is_new) return -1;
        if (!a.is_new && b.is_new) return 1;
        return parseInt(b.id) - parseInt(a.id);
      }
      return 0;
    });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-grow pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header & Search */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
            <div>
              <h1 className="text-5xl font-bold text-slate-900 tracking-tight mb-4">Discover Events</h1>
              <p className="text-slate-500 text-lg max-w-2xl">Find your next obsession. Join workshops, festivals, and summits happening on campus.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <div className="relative flex-grow lg:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="text" 
                  placeholder="Search events..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>
              <div className="relative">
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center justify-center gap-2 px-8 py-4 border rounded-2xl font-bold transition-all shadow-sm ${
                    showFilters || priceFilter !== 'All' 
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-indigo-100' 
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Filter size={20} />
                  Filter {priceFilter !== 'All' ? `(${priceFilter})` : ''}
                </button>

                {showFilters && (
                  <>
                    <div 
                      className="fixed inset-0 z-20" 
                      onClick={() => setShowFilters(false)}
                    ></div>
                    <div className="absolute right-0 mt-4 w-72 bg-white rounded-[2rem] shadow-2xl border border-slate-100 p-6 z-30 animate-in fade-in zoom-in duration-200 origin-top-right">
                      <div className="space-y-6">
                        <div>
                          <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Price Type</label>
                          <div className="flex flex-col gap-2">
                            {['All', 'Free', 'Paid'].map((f) => (
                              <button
                                key={f}
                                onClick={() => setPriceFilter(f as any)}
                                className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                                  priceFilter === f 
                                    ? 'bg-indigo-50 text-indigo-600' 
                                    : 'text-slate-500 hover:bg-slate-50'
                                }`}
                              >
                                {f}
                                {priceFilter === f && <div className="w-2 h-2 bg-indigo-600 rounded-full" />}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="pt-6 border-t border-slate-50">
                          <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Sort By</label>
                          <button
                            onClick={() => setSortBy('newest')}
                            className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold bg-indigo-50 text-indigo-600"
                          >
                            Newest First
                            <div className="w-2 h-2 bg-indigo-600 rounded-full" />
                          </button>
                        </div>

                        <button 
                          onClick={() => setShowFilters(false)}
                          className="w-full py-4 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all"
                        >
                          Apply Filters
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-col gap-6 mb-10">
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setActiveSubCategory('All');
                  }}
                  className={`px-8 py-3 rounded-2xl text-sm font-bold whitespace-nowrap transition-all ${
                    activeCategory === cat 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                      : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {activeCategory !== 'All' && SUB_CATEGORIES[activeCategory] && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex gap-2 overflow-x-auto pb-4 no-scrollbar border-l-4 border-indigo-500/20 pl-4"
              >
                <button
                  onClick={() => setActiveSubCategory('All')}
                  className={`px-5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    activeSubCategory === 'All' 
                      ? 'bg-indigo-100 text-indigo-600' 
                      : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                  }`}
                >
                  All {activeCategory}
                </button>
                {SUB_CATEGORIES[activeCategory].map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setActiveSubCategory(sub)}
                    className={`px-5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      activeSubCategory === sub 
                        ? 'bg-indigo-100 text-indigo-600' 
                        : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </motion.div>
            )}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link 
                  to={`/events/${event.id}`} 
                  className="group block bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={event.image} 
                      alt={event.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                    <div className="absolute top-6 right-6 flex flex-col gap-2">
                      <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl text-[10px] font-black text-slate-900 shadow-xl uppercase tracking-tighter">
                        {event.category}
                      </div>
                      <div className={`px-4 py-2 rounded-2xl text-[10px] font-black text-white shadow-xl uppercase tracking-tighter ${event.is_free ? 'bg-emerald-500' : 'bg-indigo-600'}`}>
                        {event.price}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-8">
                    <div className="flex items-center gap-4 text-indigo-600 text-xs font-bold mb-4">
                      <div className="flex items-center gap-1.5 bg-indigo-50 px-3 py-1.5 rounded-full">
                        <Calendar size={14} />
                        {event.date}
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Clock size={14} />
                        {event.time}
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <MapPin size={14} />
                        {event.venue}
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors leading-tight">
                      {event.title}
                    </h3>
                    <p className="text-slate-500 text-sm mb-8 line-clamp-2 leading-relaxed">
                      Join us for an unforgettable experience at MRU. Don't miss out on this incredible opportunity to connect and grow.
                    </p>
                    
                    <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                      <div className="flex -space-x-3">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                            <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                          </div>
                        ))}
                        <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                          +42
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-indigo-600 font-bold group-hover:gap-3 transition-all">
                        View Details
                        <ArrowLeft className="rotate-180" size={18} />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search size={32} className="text-slate-300" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">No events found</h3>
              <p className="text-slate-500">Try adjusting your search or filters to find what you're looking for.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
