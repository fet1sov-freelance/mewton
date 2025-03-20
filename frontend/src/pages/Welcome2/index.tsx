import { Cards } from '@/components/cards';
import { WelcomeBottom } from '@/components/welcome-bottom';
import { Link } from 'react-router-dom';

export const SecondPage = () => {
  return (
    <div className="bg-welcomeBg flex justify-center font-sans">
      <div className="w-full  text-white h-screen font-bold flex flex-col max-w-xl">
        <div className="flex flex-1 flex-col items-center gap-5 mt-5">
          <div className="text-center w-[65%]">
            <h3 className="text-xl font-semibold">
              Unique and varied boost system for <span className="text-orange">faster farming</span>
            </h3>
          </div>
          <Cards />
        </div>
        <Link to="/welcome3">
          <WelcomeBottom activeTab={2} />
        </Link>
      </div>
    </div>
  );
};
