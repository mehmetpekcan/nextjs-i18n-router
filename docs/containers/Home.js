import React from "react";

function Home() {
  return (
    <div>
      <div>
        <div className="flex flex-col items-center px-2 md:px-20 text-center">
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter leading-thight">
            Monorepos that
            <span
              className="block text-transperent bg-clip-text bg-gradient-to-l from-lighterGreen to-lightGreen"
              style={{ color: "transparent" }}
            >
              make ship happen.
            </span>
          </h1>
          <p className="text-lightWhite text-xl md:text-3xl mt-2 md:mt-5">
            Turborepo is a high-performance build system for JavaScript andw
            TypeScript codebases.
          </p>
        </div>
        <div className="flex flex-col">
          <button className="text-lightGreen">Documentation</button>
          <button>yarn add @xxxxx</button>
        </div>
      </div>
    </div>
  );
}

export default Home;
