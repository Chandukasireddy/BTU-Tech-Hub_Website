import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import MeetupSection from "@/components/MeetupSection";
import PhotosSection from "@/components/PhotosSection";
import ActivitiesSection from "@/components/ActivitiesSection";
import ProjectsSection from "@/components/ProjectsSection";
import WhyJoinSection from "@/components/WhyJoinSection";
import CommunitySection from "@/components/CommunitySection";
import FooterSection from "@/components/FooterSection";

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    // 1. Check hash first (e.g. #meetup, #meetup-20, #photos, ?utm_source=...#meetup)
    let targetId = "";
    if (location.hash) {
      targetId = location.hash.replace(/^#/, "");
    } else {
      // 2. Check path (e.g. /meetup, /meetup-20, /photos, /gallery, etc.)
      const path = location.pathname.replace(/^\/+|\/+$/g, "").toLowerCase();
      if (path.startsWith("meetup") || path.startsWith("meetups")) targetId = "meetup";
      else if (path === "photos" || path === "gallery") targetId = "photos";
      else if (path === "about") targetId = "about";
      else if (path === "activities") targetId = "activities";
      else if (path === "projects") targetId = "projects";
      else if (path === "community" || path === "join") targetId = "community";
    }

    if (targetId) {
      const scrollToTarget = () => {
        const element =
          document.getElementById(targetId) ||
          (targetId.toLowerCase().startsWith("meetup") ? document.getElementById("meetup") : null);
        if (element) {
          const navOffset = 70;
          const elementPosition = element.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({
            top: Math.max(0, elementPosition - navOffset),
            behavior: "smooth",
          });
          return true;
        }
        return false;
      };

      if (!scrollToTarget()) {
        const timer1 = setTimeout(scrollToTarget, 100);
        const timer2 = setTimeout(scrollToTarget, 300);
        const timer3 = setTimeout(scrollToTarget, 700);
        return () => {
          clearTimeout(timer1);
          clearTimeout(timer2);
          clearTimeout(timer3);
        };
      } else {
        const timer = setTimeout(scrollToTarget, 300);
        return () => clearTimeout(timer);
      }
    }
  }, [location.pathname, location.hash, location.search]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <MeetupSection />
        <PhotosSection />
        <ActivitiesSection />
        <ProjectsSection />
        <WhyJoinSection />
        <CommunitySection />
      </main>
      <FooterSection />
    </div>
  );
};

export default Index;
