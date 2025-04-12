import bgPng from '@/assets/bg.png';
import energySvg from '@/assets/energy.png';
import coinSvg from '@/assets/moneta.png';
import tonSvg from '@/assets/ton.svg';
import { BottomTabs } from '@/components/BottomTabs';
import { Coin } from '@/components/Coin';
import { Header } from '@/components/Header';
import { formatWithSpaces } from '@/lib/helpers/txt';
import { syncPoints } from '@/lib/helpers/user';
import { useUserStore } from '@/lib/store/userStore';
import { debounce } from '@/lib/utils/debounce';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

export const Main = () => {
  const points = useUserStore((state) => state.points);
  const totalEarned = useUserStore((state) => state.totalEarned);
  const balance = useUserStore((state) => state.balance);
  const catsBought = useUserStore((state) => state.catsBought);
  const setPoints = useUserStore((state) => state.setPoints);
  const setEnergy = useUserStore((state) => state.setEnergy);
  const energys = useUserStore((state) => state.energy);
  const energyReFill = useUserStore((state) => state.energyReFill);
  const [clicks, setClicks] = useState<{ id: number; x: number; y: number }[]>([]);
  const pointsToAdd = 1;
  const { t } = useTranslation();

  const syncAndUpdatePoints = useRef(
    debounce(async (currentPoints: number, energy: number) => {
      await syncPoints(currentPoints, energy);
    }, 1000),
  );

  const handleCardClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    if (energys <= 0 && energyReFill === 0) return;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    card.style.transform = `perspective(1000px) rotateX(${-y / 10}deg) rotateY(${x / 10}deg)`;
    setTimeout(() => {
      card.style.transform = '';
    }, 100);

    setPoints(points + pointsToAdd);
    setEnergy(energys - pointsToAdd);
    setClicks([...clicks, { id: Date.now(), x: e.pageX, y: e.pageY }]);
    if (energys - pointsToAdd < 0) return;
    syncAndUpdatePoints.current(points + pointsToAdd, energys - pointsToAdd);
  };

  const handleAnimationEnd = (id: number) => {
    setClicks((prevClicks) => prevClicks.filter((click) => click.id !== id));
  };

  return (
    <div className="flex justify-center overflow-hidden">
      <div className="relative flex flex-col w-full max-w-xl max-h-screen py-5 font-bold text-white">
        <img
          className="absolute top-0 bottom-0 left-0 right-0 max-h-screen opacity-20 -z-10 "
          src={bgPng}
          alt=""
        />
        <Header />
        <div className="flex-1 mx-4 my-8">
          <div className="grid w-full grid-cols-3 gap-5">
            <div className="flex flex-col items-center justify-between gap-1 p-2 rounded-md bg-cardBg">
              <span className="text-xs text-center">{t('Main.totalEarned')}</span>
              <span className="flex gap-2 text-xs">
                <img className="w-[16px]" src={tonSvg} alt="" />
                {totalEarned.toFixed(2)}
              </span>
            </div>
            <div className="flex flex-col items-center justify-between gap-1 p-2 rounded-md bg-grayBg">
              <span className="text-xs text-center">{t('Main.balance')}</span>
              <span className="flex gap-2 text-xs">
                <img className="w-[16px] " src={tonSvg} alt="" />
                {balance.toFixed(2)}
              </span>
            </div>
            <div className="flex flex-col items-center justify-between gap-1 p-2 rounded-md bg-grayBg">
              <span className="text-xs text-center">{t('Main.catsBought')}</span>
              <span className="flex gap-2 text-xs">
                <img className="w-[16px] " src={'./boosts/cat.png'} alt="" />
                {catsBought}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-center gap-4 py-2 mt-4 h-[57vh]">
            <h1 className="flex items-center gap-2 mt-1 text-3xl">
              <img className="w-[47px] h-[47px]" src={coinSvg} alt="" />
              {formatWithSpaces(points)}
            </h1>
            <Coin onClick={handleCardClick} />
            <div className="flex justify-between w-2/3">
              <span className="flex gap-2">
                <img className="w-[26px] h-[26px]" src={energySvg} alt="" /> {energys}/1000
              </span>
              <span className="flex items-center gap-2">
                <img className="w-[26px] h-[26px]" src={'./boosts/cat.png'} alt="" /> {energyReFill}
              </span>
            </div>
          </div>
        </div>
        <BottomTabs />
      </div>
      {clicks.map((click) => (
        <div
          key={click.id}
          className="absolute text-5xl font-bold text-white opacity-0 pointer-events-none"
          style={{
            top: `${click.y - 42}px`,
            left: `${click.x - 28}px`,
            animation: `float 1s ease-out`,
          }}
          onAnimationEnd={() => handleAnimationEnd(click.id)}
        >
          {pointsToAdd}
        </div>
      ))}
    </div>
  );
};
