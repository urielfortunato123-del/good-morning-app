import { useEffect, useState } from 'react';

interface Coin {
  id: number;
  left: number;
  delay: number;
  duration: number;
  emoji: string;
}

interface CoinAnimationProps {
  isActive: boolean;
  onComplete?: () => void;
}

const COIN_EMOJIS = ['💰', '💶', '💵', '💴', '🪙', '✨', '⭐'];

export const CoinAnimation = ({ isActive, onComplete }: CoinAnimationProps) => {
  const [coins, setCoins] = useState<Coin[]>([]);

  useEffect(() => {
    if (isActive) {
      const newCoins: Coin[] = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: 1.5 + Math.random() * 1.5,
        emoji: COIN_EMOJIS[Math.floor(Math.random() * COIN_EMOJIS.length)],
      }));
      setCoins(newCoins);

      const timeout = setTimeout(() => {
        setCoins([]);
        onComplete?.();
      }, 3500);

      return () => clearTimeout(timeout);
    }
  }, [isActive, onComplete]);

  if (!isActive || coins.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {coins.map((coin) => (
        <div
          key={coin.id}
          className="absolute text-3xl md:text-4xl animate-coin-fall"
          style={{
            left: `${coin.left}%`,
            animationDelay: `${coin.delay}s`,
            animationDuration: `${coin.duration}s`,
          }}
        >
          {coin.emoji}
        </div>
      ))}
    </div>
  );
};
