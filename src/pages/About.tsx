import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export const About = () => {
  const timelineEvents = [
    {
      year: '1984',
      title: 'Humble Beginnings',
      description: 'Started with a small workshop, crafting intricate designs by hand.',
    },
    {
      year: '1990s',
      title: 'Bollywood Award Era',
      description: 'Became the go-to craftsmen for prestigious Bollywood award trophies.',
    },
    {
      year: '2000s',
      title: 'Next Generation Joins',
      description: 'Second generation brings fresh perspective while honoring traditions.',
    },
    {
      year: '2010',
      title: 'Global Footprint',
      description: 'Expanded reach to international markets, maintaining quality standards.',
    },
    {
      year: '2023',
      title: 'Laser-Precision Atelier',
      description: 'Integrated cutting-edge laser technology with traditional craftsmanship.',
    },
  ];

  const galleryImages = [
    { src: '/images/about/team-family.jpg', alt: 'Family team working together' },
    { src: '/images/about/laser-cut.jpg', alt: 'Precision laser cutting process' },
    { src: '/images/about/gem-selection.jpg', alt: 'Careful gem selection process' },
    { src: '/images/about/workbench-tools.jpg', alt: 'Traditional tools on workbench' },
    { src: '/images/about/casting.jpg', alt: 'Metal casting process' },
    { src: '/images/about/quality-check.jpg', alt: 'Final quality inspection' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  const timelineVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen"
    >
      {/* Hero Section */}
      <motion.section variants={itemVariants} className="relative h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/about/workshop-1980.jpg"
            alt="Founder carving a trophy in 1980"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-6xl font-serif font-bold text-primary mb-6"
          >
            Crafting Stories in Gold Since 1984
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            A 40-year family journey from Bollywood award trophies to laser-precision pendants, 
            blending traditional craftsmanship with cutting-edge technology.
          </motion.p>
        </div>
      </motion.section>

      {/* Timeline Section */}
      <motion.section variants={itemVariants} className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-4xl font-serif font-bold text-center mb-16"
          >
            Our Journey Through Time
          </motion.h2>
          
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-accent transform md:-translate-x-px"></div>
            
            <div className="space-y-12">
              {timelineEvents.map((event, index) => (
                <motion.div
                  key={event.year}
                  variants={timelineVariants}
                  transition={{ delay: index * 0.2 }}
                  className={`flex items-center ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'}`}>
                    <div className="bg-card p-6 rounded-lg shadow-soft border ml-16 md:ml-0">
                      <div className="flex items-center mb-3">
                        <div className="w-3 h-3 bg-accent rounded-full mr-3"></div>
                        <span className="text-2xl font-bold text-accent">{event.year}</span>
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                      <p className="text-muted-foreground">{event.description}</p>
                    </div>
                  </div>
                  
                  {/* Timeline Dot */}
                  <div className="absolute left-6 md:left-1/2 w-4 h-4 bg-accent rounded-full border-4 border-background transform md:-translate-x-1/2"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Craftsmanship Section */}
      <motion.section variants={itemVariants} className="py-20 bg-muted">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div variants={itemVariants}>
              <img
                src="/images/about/handcraft.jpg"
                alt="Artisan soldering a ring with precision"
                className="w-full h-96 object-cover rounded-lg shadow-soft"
              />
            </motion.div>
            
            <motion.div variants={itemVariants} className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-serif font-bold">
                Precision Meets Tradition
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Our atelier combines ±5 μm laser accuracy with time-honored hand-setting traditions. 
                Each piece undergoes meticulous craftsmanship, ensuring every detail meets our 
                exacting standards developed over four decades.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                From the initial design concept to the final polish, our master craftsmen 
                blend cutting-edge technology with techniques passed down through generations, 
                creating heirloom-quality pieces that tell your unique story.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Gallery Section */}
      <motion.section variants={itemVariants} className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-4xl font-serif font-bold text-center mb-16"
          >
            Behind the Scenes
          </motion.h2>
          
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-2 md:grid-cols-3 gap-4"
          >
            {galleryImages.map((image, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                transition={{ delay: index * 0.1 }}
                className="group cursor-pointer"
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-48 md:h-64 object-cover rounded-lg shadow-soft transition-transform duration-300 group-hover:scale-105"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section variants={itemVariants} className="py-20 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center px-6">
          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-4xl font-serif font-bold mb-6"
          >
            Ready to create your heirloom?
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-xl mb-8 text-white/80"
          >
            Let us craft a piece that will carry your story for generations to come.
          </motion.p>
          <motion.div variants={itemVariants}>
            <Button asChild size="lg" className="bg-white text-black hover:bg-white/90">
              <Link to="/shop">Explore Our Collection</Link>
            </Button>
          </motion.div>
        </div>
      </motion.section>
    </motion.div>
  );
};