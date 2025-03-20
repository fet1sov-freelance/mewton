import { WebApp, WebAppUser } from '@twa-dev/types';
import { useEffect, useState } from 'react';
import { useUserStore } from '../store/userStore';

declare global {
  interface Window {
    Telegram: {
      WebApp: WebApp;
    };
  }
}

export function useTelegram() {
  const [tgw, setTgw] = useState<WebApp>();
  const [user, setUser] = useState<WebAppUser>({} as WebAppUser);
  const setUserData = useUserStore((state) => state.setUserData);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();

      setTgw(tg);
      const initDataUnsafe = tg?.initDataUnsafe;

      if (initDataUnsafe?.user) {
        setUser(initDataUnsafe.user);
        const data = {
          telegramId: initDataUnsafe.user.id,
          username: initDataUnsafe.user.username,
        };

        setUserData(data);
      }
    }
  }, []);

  return { tgw, user };
}
