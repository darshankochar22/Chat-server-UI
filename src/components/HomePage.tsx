import { useState, useEffect } from "react";

const FONT_LINK = `@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,700;12..96,800&display=swap');`;

const EXTRA_CSS = `
@keyframes floatUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
@keyframes orbPulse{0%,100%{opacity:.14}50%{opacity:.24}}

.anim-up-2{animation:floatUp .8s .25s both}
.anim-up-3{animation:floatUp .8s .4s both}
.anim-up-4{animation:floatUp .8s .55s both}
.anim-up-5{animation:floatUp 1s .7s both}

.anim-orb-1{animation:orbPulse 7s ease-in-out infinite}
.anim-orb-2{animation:orbPulse 9s 2s ease-in-out infinite}

.reveal{opacity:0;transform:translateY(22px);transition:opacity .65s,transform .65s}
.reveal.in{opacity:1;transform:translateY(0)}

.grad-text{
background:linear-gradient(135deg,#00c8b4,#00e5cc,#1affd5);
-webkit-background-clip:text;
-webkit-text-fill-color:transparent;
background-clip:text;
}

.grad-bg{background:linear-gradient(135deg,#00c8b4,#00e5cc,#1affd5)}
`;

const GT = ({ children }: any) => (
  <span className="bg-gradient-to-r from-[#00c8b4] via-[#00e5cc] to-[#1affd5] bg-clip-text text-transparent">
    {children}
  </span>
);

const BtnGrad = ({ children, onClick }: any) => (
  <button
    onClick={onClick}
    className="inline-flex items-center gap-2 px-7 py-3 rounded-full
    bg-gradient-to-r from-[#00c8b4] via-[#00e5cc] to-[#1affd5]
    text-black font-bold text-sm
    shadow-[0_6px_28px_rgba(0,200,180,.4)]
    hover:-translate-y-[2px] hover:shadow-[0_14px_44px_rgba(0,200,180,.55)]
    transition whitespace-nowrap"
  >
    {children}
  </button>
);

const BtnGhost = ({ children, onClick }: any) => (
  <button
    onClick={onClick}
    className="inline-flex items-center gap-2 px-7 py-3 rounded-full
    bg-white/5 border border-white/[.13]
    text-[#e4e4f0] font-semibold text-sm
    hover:bg-white/10 hover:-translate-y-[2px]
    transition whitespace-nowrap"
  >
    {children}
  </button>
);

interface LandingPageProps {
  onStart?: () => void;
}

export default function LandingPage({ onStart }: LandingPageProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("in")),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const msgs = [
    { text: "yo where are you from?", me: false },
    { text: "somewhere it rains way too much lol", me: true },
    { text: "same… london?", me: false },
    { text: "close enough 😅", me: true },
  ];

  return (
    <>
      <style>{FONT_LINK + EXTRA_CSS}</style>

      {/* BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="anim-orb-1 absolute w-[55vw] h-[55vw] max-w-[750px] max-h-[750px]
          -top-[20%] -left-[15%] rounded-full blur-[130px]
          bg-[radial-gradient(circle,#00c8b4,#006055)] opacity-15" />

        <div className="anim-orb-2 absolute w-[35vw] h-[35vw] max-w-[500px] max-h-[500px]
          -bottom-[5%] -right-[8%] rounded-full blur-[100px]
          bg-[radial-gradient(circle,#00e5cc,#004d46)] opacity-10" />
      </div>

      {/* NAV */}
      <nav className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between
        px-5 sm:px-10 md:px-16 py-3 transition-all
        ${scrolled ? "bg-black/90 backdrop-blur-xl border-b border-[#00c8b420]" : ""}`}>

        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-[#00c8b4] via-[#00e5cc] to-[#1affd5]
            grid place-items-center text-black">
          </div>
        </div>
      </nav>

      <div className="relative z-10 bg-black text-[#e4e4f0]">

        {/* HERO */}
        <section className="min-h-[85svh] flex flex-col items-center justify-center text-center
          px-5 sm:px-10 md:px-16 pt-32 pb-32">

          <h1 className="anim-up-2 font-extrabold tracking-tight leading-none
            text-[clamp(44px,9vw,110px)] max-w-[14ch]">
            Talk to someone.<br /><GT>Anyone. Now.</GT>
          </h1>

          <div className="anim-up-4 flex gap-3 mt-9 flex-wrap justify-center">
            <BtnGrad onClick={onStart}>Chat Now — Free</BtnGrad>
            <BtnGhost onClick={onStart}>How it works</BtnGhost>
          </div>
        </section>
                {/* EXPERIENCE */}
     <section className="px-5 sm:px-10 md:px-16 py-20 md:py-24 border-t border-white/5">

     <div className="mx-auto max-w-6xl grid lg:grid-cols-2 gap-14 items-center">

    {/* LEFT TEXT */}
    <div className="reveal text-center lg:text-left max-w-xl mx-auto lg:mx-0">
      <h2 className="font-extrabold tracking-tight leading-tight
        text-[clamp(28px,4.5vw,52px)] mb-4">
        Built different.<br /><GT>Designed to feel human.</GT>
      </h2>
    </div>

    {/* RIGHT IMAGE */}
    <div className="reveal relative w-full max-w-md mx-auto">
      <div className="relative rounded-2xl overflow-hidden border border-[#00c8b430]
        shadow-[0_30px_70px_rgba(0,0,0,.6)]">

        <img
          src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=900&q=80&fit=crop"
          className="w-full h-[420px] object-cover brightness-50"
        />
      </div>

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-[90%]
        bg-black/90 backdrop-blur-xl border border-[#00c8b440]
        rounded-2xl p-4 shadow-xl">

        {msgs.map((m, i) => (
          <div
            key={i}
            className={`max-w-[80%] mb-2 px-3 py-2 text-xs
            ${m.me
              ? "ml-auto grad-soft border border-[#00c8b4]"
              : "bg-white/10 border border-white/10"}
            rounded-xl`}
          >
            {m.text}
          </div>
        ))}
      </div>
     </div>

    </div>
  </section>
    {/* CTA */} <section className="px-5 sm:px-10 md:px-16 py-16 md:py-24 flex justify-center"> <div className="reveal w-full max-w-4xl relative overflow-hidden border border-[#00c8b440] rounded-[28px]"> <img src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1400&q=80&fit=crop" className="absolute inset-0 w-full h-full object-cover brightness-[.25]" /> <div className="relative text-center px-6 md:px-16 py-16"> <h2 className="font-extrabold tracking-tight leading-tight text-[clamp(32px,5vw,64px)] mb-5"> Your next stranger<br /><GT>is waiting right now.</GT> </h2> <div className="flex gap-3 justify-center flex-wrap"> <BtnGrad onClick={onStart}>Start Chatting Free</BtnGrad> <BtnGhost onClick={onStart}>Learn More</BtnGhost> </div> </div> </div> </section>
      </div>
    </>
  );
}
