'use client';
import './globals.css';
import { useState } from "react";
import Hero from '@/components/Hero/Hero';
import About from '@/components/About/About';
import PopularStoriesSection from '@/components/PopularStoriesSection/PopularStoriesSection';
import OurTravellers from "@/components/OurTravellers/OurTravellers";
import Join from '@/components/Join/Join';
import { ConfirmModal } from "@/components/ConfirmModal/ConfirmModal";

export default function Home() {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleConfirm = () => {
    setIsConfirmOpen(false);
  };

  const handleCancel = () => {
    setIsConfirmOpen(false);
  };

  return (
    <div>
      <Hero />
      <About />
      <PopularStoriesSection />
      <OurTravellers />
      <Join />
      
      {isConfirmOpen && (
        <ConfirmModal
          title="Ви точно хочете вийти?"
          text="Ми будемо сумувати за вами!"
          confirmButtonText="Вийти"
          cancelButtonText="Відмінити"
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}