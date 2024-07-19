import { Link } from "react-router-dom";
import hero_img from "../assets/hero_img.svg"
const HeroSection = () => {
  return (
    <div className="flex flex-col gap-8 md:flex-row md:justify-between md:items-center">
      <div className="md:h-full w-full md:w-[40%] flex flex-col text-center md:text-left md:justify-center gap-2">
        <span className="text-2xl sm:text-3xl md:text-3xl xl:text-4xl">
          {" "}
          <span className="text-2xl">Hello! </span> <br /> Welcome to{" "}
          <span className="text-main">Split Buddy</span> <br />
        </span>
        <span className="text-gray-500 text-lg text-justify ">
          Sharing expenses with friends is simpler than ever with Split Buddy.
          Make Sure Everyone get paid back. This is completely free! <br />
        </span>
        <span className="block mt-5 pt-3">
          <Link
            className="px-6 py-4 bg-main rounded-md text-white text-lg"
            to={"/dashboard"}
          >
            Start Now
          </Link>
        </span>
      </div>
        <img className="h-[20rem] md:h-[30rem]" src={hero_img} alt="" />
    </div>
  );
};

export default HeroSection;
