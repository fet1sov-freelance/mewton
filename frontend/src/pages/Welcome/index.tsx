import tonSvg from '@/assets/ton.svg';
import { Coin } from '@/components/Coin';
import { WelcomeBottom } from '@/components/welcome-bottom';
import { Link } from 'react-router-dom';

export const Welcome = () => {
  return (
    <div className="flex justify-center bg-welcomeBg">
      <div className="flex flex-col w-full h-screen max-w-xl font-bold text-white">
        <div className="flex flex-col items-center justify-between flex-1 mt-5">
          <div className="text-center w-[85%]">
            <h3 className="text-2xl font-semibold">
              
            </h3>
            <span className="text-xs font-medium">
              The first p2e game where profits already have their{' '}
              <span className="text-orange">real value</span>
            </span>
          </div>
          <Coin />
          <div className="flex flex-col items-center">
            <span className="flex gap-4 text-4xl font-semibold text-orange">
              LOTS OF <img className="w-10" src={tonSvg} alt="" />
            </span>
            <span className="text-4xl font-semibold ">PER DAY</span>
          </div>
          <span className="text-xs font-medium text-center text-welcomeText">
            Tap and earn TON directly in the app!
          </span>
        </div>
        <Link to="/welcome2">
          <WelcomeBottom activeTab={1} />
        </Link>
      </div>
    </div>
  );
};
