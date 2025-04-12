import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import rest from '@/lib/services/rest';
import { useUserStore } from '@/lib/store/userStore';
import { useTonWallet } from '@tonconnect/ui-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

export const Withdraw = () => {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState('');

  const balance = useUserStore((state) => state.balance);

  const handleInputChange = (e: any) => {
    setInputValue(e.target.value);
  }

  const wallet = useTonWallet();

  const withdrawFunds = async (event: any) => {
      event.preventDefault();

      if (balance >= Number(inputValue))
      {
        await rest.post("/blockchain/withdraw", {
          amount: inputValue,
          address: wallet?.account.address
        });
  
        toast(t('ton'));
      } else {
        toast(t('tonerror'));
      }
      
  };

  return (
    <Dialog>
      <DialogTrigger>
        <button className="w-full px-4 py-2 text-xs font-bold bg-orange rounded-xl">
          {t('wallet.withdraw')}
        </button>
      </DialogTrigger>
      <DialogContent>
        <div className="flex flex-col items-center gap-5 text-white">
          <span className="text-2xl font-bold">{t('wallet.withdraw')}</span>
          <div className="w-full h-[1px] bg-slate-300" />
          <input
            type="number"
            placeholder={t('modals.placeholder')}
            value={inputValue}
            min={0.1}
            onChange={handleInputChange}
            className="w-full px-3 py-1 font-normal rounded-md bg-gray focus:outline-none"
          />
          <button onClick={event => withdrawFunds(event)} className="w-full p-1 text-base font-semibold rounded-lg bg-orange">
            {t('wallet.withdraw')}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
