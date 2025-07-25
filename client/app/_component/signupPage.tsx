"use client"
import { SignIn } from "@clerk/nextjs";
import { useState } from "react";
import Particles_bg from "./paricles_bg";
import Image from "next/image";
import PdfIcon from './pdfi.png'
import { FileText } from "lucide-react";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import TextType from "./textType";


const SignUpPage = () => {
    const [showSignIn, setShowSignIn] = useState(false);
    return <>
        {!showSignIn &&
            <div className="relative w-screen h-screen overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Particles_bg
                        particleColors={['#ffffff', '#ffffff']}
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
                        <div><FileText /></div>
                        <div>DocuMind AI

                        </div>
                    </div>
                    <div className="mt-32 text-white text-center font-bold text-5xl w-[50%] h-40 leading-normal"><TextType
                        text={["Transform any PDF into an intelligent conversation partner.", "Ask anything. Your documents hold the answers."]}
                        typingSpeed={100}
                        pauseDuration={1000}
                        showCursor={true}
                        cursorCharacter="|"
                    />
                    </div>
                    <div onClick={() => setShowSignIn(true)} className="relative overflow-hidden px-10 py-3 mt-15 bg-white text-black rounded-3xl hover:cursor-pointer text-lg font-medium transition-colors duration-300 before:absolute before:inset-0 before:bg-blue-700 before:scale-x-0 hover:before:scale-x-100 before:origin-left before:transition-transform before:duration-400 before:rounded-3xl before:top-[1px] before:right-[1px] before:bottom-[1px] before:left-[1px] before:z-[-1]z-10 hover:text-white">
                        <div className="relative z-10">SignUp</div>
                    </div>
                </div>
            </div>

        }
        {showSignIn && <div className="flex justify-center items-center h-screen">
            <SignIn routing="hash" />
        </div>}
    </>
}
export default SignUpPage;