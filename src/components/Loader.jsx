import React from "react";
import loading from "../assets/loading.png";

const Loader = () => {
  return (
    <div className=" w-full h-full flex flex-col gap-5 justify-center items-center">
      <img src={loading} alt="" className=" w-20 animate-spin transition-all delay-300 duration-300" />
      <h2 className=" font-bold text-2xl text-center tracking-widest text-gray-500 animate-pulse">Loading ...</h2>
    </div>
  );
};

export default Loader;
