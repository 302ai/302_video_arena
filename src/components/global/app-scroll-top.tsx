"use client";

import { ArrowUpToLine } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

export default function AppScrollTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button when page is scrolled down 100px
      setShow(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!show) return null;

  return (
    <Button
      variant="outline"
      size="icon"
      className="motion-safe:animate-bounce-slow fixed bottom-24 right-8 z-50 rounded-full shadow-lg hover:shadow-xl"
      onClick={scrollToTop}
    >
      <ArrowUpToLine className="h-4 w-4" />
    </Button>
  );
}
