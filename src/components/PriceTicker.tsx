'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { translations } from '@/locales/translations';
import { FiTrendingUp, FiRefreshCw } from 'react-icons/fi';
import { API_BASE_URL } from '@/lib/config';

interface MarketPrices {
  cacao_international: number;
  cafe_international: number;
  cacao_local: number;
  cafe_local: number;
  last_updated: string;
}

export const PriceTicker: React.FC = () => {
  const params = useParams();
  const rawLocale = params?.locale as string;
  const locale = (rawLocale === 'es' || rawLocale === 'en') ? rawLocale : 'es';
  const t = translations[locale].hero;

  const [prices, setPrices] = useState<MarketPrices | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPrices = async (force = false) => {
    try {
      setRefreshing(true);
      const url = `${API_BASE_URL}/api/market-prices${force ? '?force=true' : ''}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setPrices(data);
      }
    } catch (err) {
      console.error('Error fetching prices:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const loadPrices = async () => { await fetchPrices(); };
    loadPrices();
    // Actualizar cada 2 minutos
    const interval = setInterval(fetchPrices, 120000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="ticker-wrap flex justify-center items-center">
        <p className="text-white text-xs font-semibold animate-pulse">
          {t.tickerLoading}
        </p>
      </div>
    );
  }

  // Generamos múltiples duplicados de la lista para que la animación de la marquesina sea fluida y continua
  const tickerItems = prices
    ? [
        { label: t.tickerCacao, value: `$${prices.cacao_international.toLocaleString()} USD/MT`, type: 'up' },
        { label: t.tickerCafe, value: `$${prices.cafe_international.toFixed(2)} USD/lb`, type: 'up' },
        { label: `${t.tickerCompra} (Cacao)`, value: `S/. ${prices.cacao_local.toFixed(2)}`, type: 'local' },
        { label: `${t.tickerCompra} (Café)`, value: `S/. ${prices.cafe_local.toFixed(2)}`, type: 'local' },
      ]
    : [];

  // Duplicar el array de items para crear una marquesina infinita sin cortes
  const repeatedItems = [...tickerItems, ...tickerItems, ...tickerItems, ...tickerItems];

  return (
    <div className="ticker-wrap relative z-20 flex justify-between items-center w-full">
      <div className="flex-1 overflow-hidden relative">
        <div className="ticker">
          {repeatedItems.map((item, idx) => (
            <div
              key={idx}
              className={`ticker-item ${item.type === 'up' ? 'up' : 'local'}`}
              aria-hidden={idx >= tickerItems.length ? true : undefined}
            >
              <FiTrendingUp />
              <span>{item.label}:</span>
              <span className="font-bold">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
      
      {prices && (
        <div className="hidden md:flex items-center px-4 border-l border-slate-800 text-[10px] text-slate-400 gap-2 whitespace-nowrap h-full">
          <span>
            {t.tickerUpdated}: {formatTime(prices.last_updated)} | {locale === 'es' ? 'Fuente: ICE' : 'Source: ICE'}
          </span>
          <button
            onClick={() => fetchPrices(true)}
            disabled={refreshing}
            className={`hover:text-white transition-colors cursor-pointer ${refreshing ? 'animate-spin' : ''}`}
            title={locale === 'es' ? 'Refrescar Precios' : 'Refresh Prices'}
            aria-label={locale === 'es' ? 'Refrescar Precios' : 'Refresh Prices'}
          >
            <FiRefreshCw size={12} />
          </button>
        </div>
      )}
    </div>
  );
};
