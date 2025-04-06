import { getUser, refill } from '@/lib/helpers/user';
import { toast } from 'sonner';
import { create } from 'zustand';
import { buyBoost } from '../helpers/boost';
import { history } from '../utils/history';
import rest from '../services/rest';

interface IUser {
  telegramId: number;
  username: string | undefined;
}

interface IBoost {
  boostLastBuyDate: Date;
  boostPrice: number;
  buyPrice: number;
  createdAt: Date;
  id: number;
  imageUrl: string;
  isAvailable: boolean;
  name: string;
  updatedAt: Date;
}

interface UserBoosts {
  id: number;
  purchasedAt: Date;
  boost: IBoost;
}

interface UserInterface {
  telegramId: number;
  username: string | undefined;
  firstName: string;
  lastName: string;
  points: number;
  energy: number;
  energyReFill: number;
  balance: number;
  isLoading: boolean;
  catsBought: number;
  totalEarned: number;
  boosts: UserBoosts[];
  isAdmin: boolean;

  setUserData: (userInfo: IUser) => void;
  setPoints: (points: number) => void;
  setEnergy: (energy: number) => void;
  syncUserData: () => void;
  setIsLoading: (isLoading: boolean) => void;
  setBoosts: (boosts: UserBoosts[]) => void;
  handleBuyBoost: (boostId: number, name: string, buyPrice: number) => () => void;
  handleTonTransaction: () => () => void;
}

export const useUserStore = create<UserInterface>((set) => ({
  telegramId: 0,
  username: '',
  firstName: '',
  lastName: '',
  points: 0,
  energy: 0,
  energyReFill: 0,
  balance: 0,
  isLoading: false,
  catsBought: 0,
  totalEarned: 0,
  boosts: [],
  isAdmin: false,

  setUserData: (data: IUser) => set({ ...data }),
  setPoints: (points: number) => {
    set((state) => {
      if (state.energy < 0) return { points: state.points };

      return { points };
    });
  },
  syncUserData: async () => {
    set({ isLoading: true });
    const userData = await getUser();

    const data = {
      telegramId: userData.telegramId,
      points: userData.points,
      energy: userData.energy,
      energyReFill: userData.energyReFillList,
      balance: userData.balance,
      catsBought: userData.catsBought,
      isLoading: false,
      totalEarned: userData.totalEarned,
      isAdmin: userData.isAdmin,
    };
    
    set({ isLoading: false });

    set(data);
  },
  setEnergy: async (energy: number) => {
    if (energy < 0) {
      set({ isLoading: true });
      await refill();
      const userData = await getUser();

      set({ energy: userData.energy, energyReFill: userData.energyReFillList });
      set({ isLoading: false });
      return;
    }
    set({ energy });
  },

  setIsLoading: (isLoading: boolean) => set({ isLoading }),
  setBoosts: (boosts: UserBoosts[]) => set({ boosts }),

  handleBuyBoost: (boostId: number, name: string, buyPrice: number) => async () => {
    const { balance } = useUserStore.getState();
    if (buyPrice > balance && name !== 'Loki') {
      history.push('/wallet');
      toast('Not enough balance');
      return;
    }
    const res = await buyBoost(boostId);

    if (res.status == 500)
    {
      history.push('/wallet');
      toast('Not enough balance');
      return;
    }

    const userData = await getUser();

    set({
      boosts: res.data.boosts,
      balance: userData.balance,
      points: userData.points,
      totalEarned: userData.totalEarned,
      catsBought: userData.catsBought,
    });

    toast(`Successfully! You bought "${name}"`);
  },
  handleTonTransaction: () => async () => {
    const res = await rest.get(`/blockchain/transaction`);
    return res.data;
  }
}));
