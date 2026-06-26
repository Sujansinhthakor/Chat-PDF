"use client";
import Particles_bg from "./paricles_bg";
import { FileText } from "lucide-react";
import TextType from "./textType";
import Link from "next/link";

const SignUpPage = () => {
  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Particles_bg
          particleColors={["#ffffff", "#ffffff"]}
          particleCount={100}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover={false}
          alphaParticles={false}
          disableRotation={false}
        />
      </div>

      <div className="font-sans relative z-10 flex flex-col items-center justify-start h-full pt-10">
        <div className="flex gap-2 w-[50%] font-medium text-xl backdrop-blur-md bg-violet-500/5  border border-gray-400/40 rounded-full px-8 py-4 shadow-2xl">
          <div>
            <FileText />
          </div>
          <div>ChatPDF</div>
        </div>
        <div className="mt-32 text-white text-center font-bold text-5xl w-[50%] h-40 leading-normal">
          <TextType
            text={[
              "Transform any PDF into an intelligent conversation partner.",
              "Ask anything. Your documents hold the answers.",
            ]}
            typingSpeed={100}
            pauseDuration={1000}
            showCursor={true}
            cursorCharacter="|"
          />
        </div>
        <Link href="/signup">
          <div className="relative overflow-hidden px-10 py-3 mt-15 bg-white text-black rounded-3xl hover:cursor-pointer text-lg font-medium transition-colors duration-300 before:absolute before:inset-0 before:bg-blue-700 before:scale-x-0 hover:before:scale-x-100 before:origin-left before:transition-transform before:duration-400 before:rounded-3xl before:top-[1px] before:right-[1px] before:bottom-[1px] before:left-[1px] before:z-[-1]z-10 hover:text-white">
            <div className="relative z-10">SignUp</div>
          </div>
        </Link>
      </div>
    </div>
  );
};
export default SignUpPage;
