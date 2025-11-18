import BubbleMenu from "@/components/BubbleMenu";
import { gsap } from "gsap";
import { useEffect, useRef } from "react";
import { router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, GraduationCap, Star } from "lucide-react";

export default function Home() {
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

  const menuItems = [
    {
      label: 'home',
      href: '#',
      ariaLabel: 'Home',
      rotation: -8,
      hoverStyles: { bgColor: 'var(--color-primary)', textColor: 'var(--color-primary-foreground)' }
    },
    {
      label: 'mentors',
      href: '#mentors',
      ariaLabel: 'Mentors',
      rotation: 8,
      hoverStyles: { bgColor: 'var(--color-chart-2)', textColor: 'var(--color-primary-foreground)' }
    },
    {
      label: 'subjects',
      href: '#subjects',
      ariaLabel: 'Subjects',
      rotation: 8,
      hoverStyles: { bgColor: 'var(--color-chart-3)', textColor: 'var(--color-primary-foreground)' }
    },
    {
      label: 'about',
      ariaLabel: 'About',
      rotation: 8,
      hoverStyles: { bgColor: 'var(--color-chart-4)', textColor: 'var(--color-primary-foreground)' }
    },
    {
      label: 'contact',
      href: '#contact',
      ariaLabel: 'Contact',
      rotation: -8,
      hoverStyles: { bgColor: 'var(--color-chart-5)', textColor: 'var(--color-primary-foreground)' }
    }
  ];

  return (
    <div className="theme3">
      <BubbleMenu
        logo={<span style={{ fontWeight: 700, fontFamily: "'Montserrat', sans-serif" }}>MentorLink</span>}
        items={menuItems}
        menuAriaLabel="Toggle navigation"
        menuBg="var(--color-card)"
        menuContentColor="var(--color-foreground)"
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
              className="text-5xl sm:text-7xl lg:text-8xl text-center lg:text-left text-foreground font-bold"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              MentorLink
            </h1>
            <p
              className="text-lg sm:text-xl text-center lg:text-left max-w-md text-muted-foreground leading-relaxed"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Connect with experienced mentors for personalized guidance and accelerate your learning journey.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 text-lg rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
                onClick={() => router.get("/login")}
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold px-8 py-6 text-lg rounded-lg transition-all duration-300"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
                onClick={() => router.get("/login")}
              >
                Become a Mentor
              </Button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="flex-1 flex justify-center">
            <img
              src="/images/undraw_developer-activity_4zqd.svg"
              alt="Mentorship illustration"
              className="w-full max-w-[300px] sm:max-w-[400px] lg:max-w-[500px] h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  )
}