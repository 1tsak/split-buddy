import { Link } from "react-router-dom";
import hero_img from "../assets/hero_img.svg";
import { useTranslation } from "react-i18next";

const HeroSection = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-8 md:flex-row md:justify-between md:items-center">
      <div className="md:h-full w-full md:w-[40%] flex flex-col text-center md:text-left md:justify-center gap-2">
        <span className="text-2xl sm:text-3xl md:text-3xl xl:text-4xl">
          <span className="text-2xl">{t('greeting')}</span> <br />
          {t('welcomeMessage')} <br />
          <span className="text-main">{t('appName')}</span> <br />
        </span>
        <span className="text-gray-500 text-lg text-justify">
          {t('description')} <br />
        </span>
        <span className="block mt-5 pt-3">
          <Link
            className="px-6 py-4 bg-main rounded-md text-white text-lg"
            to={"/dashboard"}
          >
            {t('startNow')}
          </Link>
        </span>
      </div>
      <img className="h-[20rem] md:h-[30rem]" src={hero_img} alt="Hero" />
    </div>
  );
};

export default HeroSection;
