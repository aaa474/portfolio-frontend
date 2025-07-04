import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MainPageContent from './MonitorPages/MainPageContent';
import ExperienceContent from './MonitorPages/ExperienceContent';
import ProjectsContent from './MonitorPages/ProjectsContent';
import AboutMeContent from './MonitorPages/AboutMeContent';
import ContactContent from './MonitorPages/ContactContent';

const panels = [
  {
    title: 'Main Page',
    content: <MainPageContent />
  },
  {
    title: 'About Me',
    content: <AboutMeContent />
  },
  {
    title: 'Experience',
    content: <ExperienceContent />
  },
  {
    title: 'Projects',
    content: <ProjectsContent />,
  },
  {
    title: 'Contact',
    content: <ContactContent />,
  },
];

export default function PageSlider({ index, setIndex }) {

  const lastIndexRef = useRef(index);
  const [isAnimating, setIsAnimating] = useState(false);


  const handleNext = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    const newIndex = (index + 1) % panels.length;
    setIndex(newIndex);
    
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handlePrev = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    const newIndex = (index - 1 + panels.length) % panels.length;
    setIndex(newIndex);
    
    
    setTimeout(() => setIsAnimating(false), 500);
  };

  
  useEffect(() => {
    lastIndexRef.current = index;
  }, [index]);

  return (
    <div className="relative h-screen bg-gray-100 flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute w-11/12 md:w-3/4 max-w-3xl bg-white shadow-xl rounded-lg p-8 text-center"
        >
          <h2 className="text-3xl font-bold mb-4">{panels[index].title}</h2>
          <div className="text-left">{panels[index].content}</div>
        </motion.div>
      </AnimatePresence>

      <button
        onClick={handlePrev}
        disabled={isAnimating}
        className={`absolute left-4 text-2xl p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-opacity ${
          isAnimating ? 'opacity-50 cursor-not-allowed' : 'opacity-100'
        }`}
      >
      </button>
      <button
        onClick={handleNext}
        disabled={isAnimating}
        className={`absolute right-4 text-2xl p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-opacity ${
          isAnimating ? 'opacity-50 cursor-not-allowed' : 'opacity-100'
        }`}
      >
      </button>
    </div>
  );
}