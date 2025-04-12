import { useTelegram } from '@/lib/hooks/useTelegram';
import { useTonConnectUI, useTonWallet } from '@tonconnect/ui-react';
import { useTranslation } from 'react-i18next';

export const Header = () => {
  const { user } = useTelegram();
  const { t } = useTranslation();

  const [tonConnectUI] = useTonConnectUI();
  
  const wallet = useTonWallet();

  function WalletInfo()
  {
    if (wallet)
    {
      return (
        <div className='flex flex-row'>
          <p>{wallet.account.address.substring(0, 5) + "..."}</p>
          <button className='bg-[red] px-[10px] rounded-xl' onClick={() => tonConnectUI.disconnect()}>{'-'}</button>
        </div>
      );
    } else {
      return (
        <button onClick={() => tonConnectUI.openModal()} className="px-4 py-2 text-xs font-bold bg-primary rounded-xl">{t('Header.connectWallet')}</button>
      );
    }
    
  }

  return (
    <div className="flex items-center justify-between px-4">
      <div className="flex items-center gap-5">
        {user.photo_url && <img className="w-12 h-12 rounded-2xl" src={user.photo_url} alt="" />}{' '}
        {!user.photo_url && (
          <div className="flex items-center justify-center w-12 h-12 text-xs text-center bg-light rounded-2xl">
            {t('Header.userAvatar')}
          </div>
        )}
        <span className="text-xs">{user.username}</span>
      </div>
      <WalletInfo></WalletInfo>
    </div>
  );
};