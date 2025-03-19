import convertSvg from '@/assets/convert.png';
import tonSvg from '@/assets/ton.svg';
import { BottomTabs } from '@/components/BottomTabs';
import { Withdraw } from '@/components/Dialogs/withdraw';
import { Header } from '@/components/Header';
import { getBoosts } from '@/lib/helpers/boost';
import { formatWithSpaces } from '@/lib/helpers/txt';
import { useUserStore } from '@/lib/store/userStore';
import { SendTransactionRequest, useTonConnectUI } from '@tonconnect/ui-react';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { Clock } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function Boost() {
  const balance = useUserStore((state) => state.balance);
  const boosts = useUserStore((state) => state.boosts);
  const setBoosts = useUserStore((state) => state.setBoosts);
  const handleBuyBoost = useUserStore((state) => state.handleBuyBoost);
  const { t } = useTranslation();
  const [tonConnectUI] = useTonConnectUI();

  const buyBoost = (boostId: number, name: string, buyPrice: number) => {
    if (balance < buyPrice) {
      const transaction: SendTransactionRequest = {
        validUntil: Date.now() + 5 * 60 * 1000, // 5 minutes
        messages: [
          {
            address: import.meta.env.VITE_LINKED_WALLET,
            amount: String(buyPrice * Math.pow(10, 9)),
          },
        ],
      };

      tonConnectUI.sendTransaction(transaction);
    } else {
      handleBuyBoost(boostId, name, buyPrice);
    }
  }

  useEffect(() => {
    (async () => {
      const res = await getBoosts();

      setBoosts(res);
    })();
  }, []);

  return (
    <div className="flex justify-center ">
      <div className="flex flex-col w-full h-screen max-w-xl py-5 font-bold text-white">
        <Header />
        <div className="flex-1 mx-3 mt-5 w-[93%] flex flex-col items-center overflow-auto scrollbar-hide">
          <div className="flex flex-col items-center w-full gap-7">
            <h1 className="flex items-center gap-2 text-3xl">
              <img className="w-[40px]" src={tonSvg} alt="" />
              {formatWithSpaces(+balance.toFixed(2))}
            </h1>
            <Withdraw />

            <span className="text-3xl">{t('boost.boost')}</span>
          </div>
          <span className="text-[10px] my-4 text-center">{t('boost.boostsInfo')}</span>
          <div className="grid grid-cols-2 gap-3 w-[95%] mb-32">
            {boosts.map((item) => {
              const { boost, purchasedAt } = item;
              let isBoostAvailable =
                (dayjs().diff(dayjs(purchasedAt), 'hour') >= 12 && boost.isAvailable) 
                /* || boost.name === 'Loki' */;

              if (!item.boost.isAvailable) {
                isBoostAvailable = false;
              }

              return (
                <div
                  key={item.id}
                  className="flex flex-col items-center justify-between gap-2 p-4 bg-cardBg rounded-2xl"
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[10px] flex gap-2 items">
                      <img className="w-[12px]" src={convertSvg} alt="" />
                      {boost.name}
                    </span>
                    <span className="text-[10px] flex gap-1 items-center">
                      <img className="w-[12px]" src={tonSvg} alt="" />
                      {boost.buyPrice}
                    </span>
                  </div>
                  <img className="w-[79px]" src={`/boosts/${boost.imageUrl}.png` || `/boosts/cat8.png`} alt="" />
                  <button
                    disabled={!isBoostAvailable}
                    className={clsx(
                      !isBoostAvailable && 'bg-disabled',
                      'flex flex-col items-center w-full p-1 text-xs font-bold rounded-lg bg-orange',
                    )}
                    onClick={event => buyBoost(item.id, boost.name, boost.buyPrice)}
                  >
                    {isBoostAvailable ? (
                      <>
                        {t('boost.buy')}{' '}
                        <span className="text-[8px] flex gap-1 items-center">
                          +{boost.boostPrice} <img className="w-[10px]" src={tonSvg} alt="" />
                        </span>
                      </>
                    ) : (
                      <Clock size={32} />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
        <BottomTabs />
      </div>
    </div>
  );
}
