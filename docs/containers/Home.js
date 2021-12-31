import React from "react";

function Home() {
  return (
    <div>
      <div>
        <div className="flex flex-col items-center px-2 sm:px-20 mb-5 text-center">
          <h1 className="text-6xl sm:text-8xl font-extrabold tracking-tighter leading-thight">
            NextJS Router
            <span
              className="block text-transperent bg-clip-text bg-gradient-to-l from-lighterGreen to-lightGreen"
              style={{ color: "transparent" }}
            >
              with localization
            </span>
          </h1>
          <p className="text-darkWhite text-xl sm:text-3xl mt-3 sm:mt-5">
            <span className="text-white px-2 rounded">nextjs-i18n-router</span>
            is a plugin for integrating multilanguage for your URLs.
          </p>
        </div>
        <div className="flex flex-col items-center sm:flex-row w-full justify-center">
          <button className="w-full sm:w-auto mt-3 flex items-center justify-center py-3 px-5 rounded ring-2 ring-white bg-white text-black">
            Documentation
          </button>
          <button className="w-full sm:w-auto mt-3 sm:ml-3 flex items-center justify-center py-3 px-5 rounded ring-2 ring-darkWhite text-lightWhite">
            yarn add @xxxxx
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
