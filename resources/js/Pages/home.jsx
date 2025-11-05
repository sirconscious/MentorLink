import BubbleMenu from "@/components/BubbleMenu" 
import { gsap } from "gsap";
import { useEffect, useRef } from "react";

export default function home() { 
  const heroRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      heroRef.current.children,
      { 
        opacity: 0
      },
      { 
        opacity: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: "power1.out"
      }
    );
  }, []);

  const items = [
    {
      label: 'home',
      href: '#',
      ariaLabel: 'Home',
      rotation: -8,
      hoverStyles: { bgColor: '#3b82f6', textColor: '#ffffff' }
    },
    {
      label: 'about',
      href: '#about',
      ariaLabel: 'About',
      rotation: 8,
      hoverStyles: { bgColor: '#10b981', textColor: '#ffffff' }
    },
    {
      label: 'projects',
      href: '#',
      ariaLabel: 'Projects',
      rotation: 8,
      hoverStyles: { bgColor: '#f59e0b', textColor: '#ffffff' }
    },
    {
      label: 'blog',
      ariaLabel: 'Blog',
      rotation: 8,
      hoverStyles: { bgColor: '#ef4444', textColor: '#ffffff' }
    },
    {
      label: 'contact',
      href: '#',
      ariaLabel: 'Contact',
      rotation: -8,
      hoverStyles: { bgColor: '#8b5cf6', textColor: '#ffffff' }
    }
  ];

  return (
    <div>
      <BubbleMenu
        logo={<span style={{ fontWeight: 700 }}>MentorLink</span>}
        items={items}
        menuAriaLabel="Toggle navigation"
        menuBg="#ffffff"
        menuContentColor="#111111"
        useFixedPosition={false}
        animationEase="back.out(1.5)"
        animationDuration={0.5}
        staggerDelay={0.12}
      /> 
      {/* Hero Section */}
      <div className="bg-background min-h-screen flex items-center justify-center px-4 sm:px-8 py-20">
        <div ref={heroRef} className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 max-w-7xl w-full">
          <div className="flex flex-col items-center lg:items-start gap-6 flex-1">
            <h1 
              className="text-5xl sm:text-7xl lg:text-9xl text-center lg:text-left text-foreground" 
              style={{ fontFamily: "'Momo Trust Display', sans-serif" }}
            >
              MentorLink
            </h1>
            <p 
              className="text-lg sm:text-xl text-center lg:text-left max-w-md text-muted-foreground"
            >
              Connecting students for academic success through peer mentorship
            </p>
            <button 
              className="bg-purple-400 hover:bg-purple-500 text-white font-bold text-lg px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Get Started
            </button>
          </div>
          <img 
            src="/images/Coding workshop-amico.svg" 
            alt="Webinar illustration" 
            className="w-full max-w-[300px] sm:max-w-[600px] lg:max-w-[700px] h-auto flex-1" 
          />
        </div>
      </div>
    </div>
  )
}