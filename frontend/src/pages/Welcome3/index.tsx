import tonSvg from '@/assets/ton.svg';
import { WelcomeBottom } from '@/components/welcome-bottom';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ThirdPage = () => {
  return (
    <div className="flex justify-center bg-welcomeBg ">
      <div className="flex flex-col w-full h-screen max-w-xl font-bold text-white">
        <div className="flex flex-col items-center flex-1 gap-16 mt-10">
          <div className="text-center w-[75%]">
            <h3 className="text-2xl font-semibold">
              <span className="block text-orange">Instant withdrawals</span>
              to your wallet!
            </h3>
          </div>
          <div className="flex flex-col items-center justify-between w-4/5 gap-5 p-4 rounded-lg bg-gray">
            <span className="flex items-center gap-2">
              <img className="w-[20px]" src={tonSvg} alt="" />
              UJF...33_
              <ChevronDown />
            </span>
            <span className="text-2xl">Withdraw</span>
            <div className="w-full h-[1px] bg-slate-300" />
            <input
              disabled
              type="number"
              placeholder="Enter the amount in TON"
              className="w-full px-3 py-1 font-normal rounded-md bg-cardBg"
            />
            <div className="flex flex-col justify-between w-full gap-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold">Fee</span>
                <div className="flex w-1/2 gap-2">
                  <span className="text-xs font-bold">Will be credited</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold">3%</span>
                <div className="flex w-1/2 gap-2">
                  <span className="flex items-center self-start gap-1 text-xs font-bold">
                    <img className="w-[10px]" src={tonSvg} alt="" />0
                  </span>
                </div>
              </div>
            </div>
            <button className="w-full p-1 text-base font-semibold rounded-lg bg-orange">
              Withdraw
            </button>
          </div>
        </div>
        <Link to="/">
          <WelcomeBottom activeTab={3} />
        </Link>
      </div>
    </div>
  );
};
