import { useTelegram } from '@/lib/hooks/useTelegram';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { useTranslation } from 'react-i18next';

export const Header = () => {
  const { user } = useTelegram();
  const { t } = useTranslation();

  const [tonConnectUI] = useTonConnectUI();

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
      <button onClick={() => tonConnectUI.openModal()} className="px-4 py-2 text-xs font-bold bg-primary rounded-xl">{t('Header.connectWallet')}</button>
    </div>
  );
};