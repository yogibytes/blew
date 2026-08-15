'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/Common/Button'

interface Slide {
  id: number
  title: string
  description: string
  image: string
  cta: string
}

const slides: Slide[] = [
  {
    id: 1,
    title: 'Instant Crypto Payments',
    description: 'Accept SOL and USDC instantly. Zero intermediaries, maximum speed.',
    image: '/images/wings-hero.jpg',
    cta: 'Start Accepting',
  },
  {
    id: 2,
    title: 'Powered by Blockchain',
    description: 'Built on Solana network. Transparent, secure, and decentralized.',
    image: '/images/blockchain-hero.jpg',
    cta: 'Learn More',
  },
  {
    id: 3,
    title: 'Global Payments, Instantly',
    description: 'Send and receive payments across the world in seconds.',
    image: '/images/world-map-hero.jpg',
    cta: 'Go Global',
  },
]

export const HeroCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [direction, setDirection] = useState(0)

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  }

  const paginate = (newDirection: number) => {
    setDirection(newDirection)
    setCurrentSlide((prev) => (prev + newDirection + slides.length) % slides.length)
  }

  useEffect(() => {
    const timer = setInterval(() => {
      paginate(1)
    }, 8000)
    return () => clearInterval(timer)
  }, [])

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: 0.2 },
    },
  }

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, delay: 0.4 },
    },
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 },
    },
  }

  return (
    <div className="relative w-full h-96 overflow-hidden rounded-2xl glow-box-strong">
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.5 },
          }}
          className="absolute inset-0"
        >
          <Image
            src={slides[currentSlide].image}
            alt={slides[currentSlide].title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
            <motion.h2
              variants={textVariants}
              initial="hidden"
              animate="visible"
              key={`title-${currentSlide}`}
              className="text-4xl font-bold mb-3"
            >
              {slides[currentSlide].title}
            </motion.h2>
            
            <motion.p
              variants={textVariants}
              initial="hidden"
              animate="visible"
              key={`desc-${currentSlide}`}
              className="text-lg mb-6 text-gray-100 max-w-xl"
            >
              {slides[currentSlide].description}
            </motion.p>

            <motion.div
              variants={buttonVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              key={`button-${currentSlide}`}
              className="w-fit"
            >
              <Button variant="accent" size="lg">
                {slides[currentSlide].cta}
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => {
              setDirection(index > currentSlide ? 1 : -1)
              setCurrentSlide(index)
            }}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'w-8 bg-white'
                : 'w-2 bg-white/50 hover:bg-white/70'
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>

      {/* Arrow Navigation */}
      <button
        onClick={() => paginate(-1)}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all duration-200 backdrop-blur-md"
        aria-label="Previous slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={() => paginate(1)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all duration-200 backdrop-blur-md"
        aria-label="Next slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )
}
