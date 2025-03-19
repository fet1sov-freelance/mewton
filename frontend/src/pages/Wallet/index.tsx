import tonSvg from '@/assets/ton.svg';
import { BottomTabs } from '@/components/BottomTabs';
import { Withdraw } from '@/components/Dialogs/withdraw';
import { Header } from '@/components/Header';
import { formatWithSpaces } from '@/lib/helpers/txt';
import { useUserStore } from '@/lib/store/userStore';
import { useTranslation } from 'react-i18next';

export function Wallet() {
  const balance = useUserStore((state) => state.balance);
  const totalEarned = useUserStore((state) => state.totalEarned);
  const { t } = useTranslation();
  return (
    <div className="flex justify-center">
      <div className="flex flex-col w-full h-screen max-w-xl py-10 font-bold text-white">
        <Header />
        <div className="flex-1 mx-4 my-10">
          <div className="flex items-center justify-between">
            <h1 className="mb-2 text-2xl ">{t('wallet.title')}</h1>
          </div>
          <div className="flex justify-between mt-10 mb-5">
            <div className="flex items-center gap-2">
              <img className="w-[40px]" src={tonSvg} alt="" />
              <h2 className="text-4xl font-bold">{formatWithSpaces(+balance.toFixed(2))}</h2>
            </div>
            <div className="bg-gray w-[105px] gap-1  rounded-md flex flex-col items-center justify-between p-2">
              <span className="text-xs text-center">{t('wallet.totalEarned')}</span>
              <span className="flex items-center gap-1 text-xs">
                <img className="w-[15px]" src={tonSvg} alt="" />
                {totalEarned.toFixed(2)}
              </span>
            </div>
          </div>
          <div className="flex flex-col w-2/5 gap-4">
            <Withdraw />
          </div>
          <div className="w-full h-[3px] bg-gray my-10" />
          <div className="flex flex-col gap-3">
            <p className="text-xs text-textColor">{t('wallet.note')}</p>
            <p className="text-xs text-textColor">{t('wallet.note2')}</p>
          </div>
        </div>
        <BottomTabs />
      </div>
    </div>
  );
}
