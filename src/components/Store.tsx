import React, { useState, useMemo } from 'react';
import { Game, Category, GameCard } from './Home';
import { Search, Gamepad2, ArrowLeft } from 'lucide-react';

interface StoreProps {
  games: Game[];
  categories: Category[];
  onGameClick?: (gameId: number) => void;
  onBack?: () => void;
}

const Store: React.FC<StoreProps> = ({ games, categories, onGameClick, onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<number | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      const matchesSearch = game.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'all' || game.category_id === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [games, searchQuery, activeCategory]);

  const totalPages = Math.ceil(filteredGames.length / itemsPerPage);
  const currentGames = filteredGames.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleCategoryChange = (categoryId: number | 'all') => {
    setActiveCategory(categoryId);
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-[#f0f5f9] pb-20 pt-4">
      <div className="container mx-auto px-2">
        {/* Header Card */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-3 flex items-center gap-3">
          {onBack && (
            <button onClick={onBack} className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center text-red-600 hover:bg-red-100 transition-colors border border-red-100 flex-shrink-0">
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0 border border-red-100">
              <Gamepad2 className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-gray-900 font-bold text-xl leading-tight font-bree">Store</h1>
              <p className="text-xs text-gray-500 mt-0.5">Browse all available games</p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-3">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search games..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-bree text-sm"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-4 pb-1">
          <button
            onClick={() => handleCategoryChange('all')}
            className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              activeCategory === 'all' 
                ? 'bg-red-600 text-white shadow-md' 
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 shadow-sm'
            }`}
          >
            All Games
          </button>
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                activeCategory === category.id 
                  ? 'bg-red-600 text-white shadow-md' 
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 shadow-sm'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Games Grid */}
        {currentGames.length > 0 ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-2 sm:gap-4 md:gap-6">
            {currentGames.map((game) => (
              <GameCard key={game.id} game={game} onClick={() => onGameClick?.(game.id)} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 border border-gray-100">
              <Gamepad2 className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-gray-900 font-bold text-lg mb-1 font-bree">No games found</h3>
            <p className="text-gray-500 text-sm">Try adjusting your search or category filter.</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              <i className="fa-solid fa-chevron-left text-sm"></i>
            </button>
            
            <div className="flex gap-1">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all ${
                    currentPage === i + 1
                      ? 'bg-red-600 text-white shadow-md'
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 shadow-sm'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              <i className="fa-solid fa-chevron-right text-sm"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Store;
