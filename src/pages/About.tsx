
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
    { 
      src: '/src/assets/jeweler-workshop.jpg', 
      alt: 'Jeweler working in his workshop cutting gold ring with saw' 
    },
    { 
      src: '/src/assets/tima-6263056.jpg', 
      alt: 'Professional jewelry crafting workspace' 
    },
    { 
      src: '/src/assets/tima-6263103.jpg', 
      alt: 'Skilled craftsman working on intricate jewelry details' 
    },
    { 
      src: '/src/assets/tima-6263108.jpg', 
      alt: 'Precision jewelry making process' 
    },
    { 
      src: '/src/assets/tima-6263149.jpg', 
      alt: 'Master craftsman at work in jewelry atelier' 
    },
    { 
      src: '/src/assets/moha-sour-11041197.jpg', 
      alt: 'Final quality inspection and finishing touches' 
    },
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
            src="/src/assets/jeweler-workshop.jpg"
            alt="Master craftsman creating custom jewelry in workshop"
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
                src="/src/assets/tima-6263056.jpg"
                alt="Precision tools and detailed jewelry crafting process"
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
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {galleryImages.map((image, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                transition={{ delay: index * 0.1 }}
                className="group cursor-pointer overflow-hidden rounded-lg shadow-soft"
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="p-4 bg-card">
                  <p className="text-sm text-muted-foreground">{image.alt}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Customer Stories Section */}
      <motion.section variants={itemVariants} className="py-20 bg-muted">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-4xl font-serif font-bold text-center mb-16"
          >
            Happy Customers
          </motion.h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div variants={itemVariants} className="bg-card p-8 rounded-lg shadow-soft">
              <div className="flex items-center mb-4">
                <img
                  src="https://images.unsplash.com/photo-1494790108755-2616b612b588?w=100&h=100&fit=crop&crop=face&auto=format&q=80"
                  alt="Happy customer Sarah"
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold">Sarah Johnson</h4>
                  <p className="text-sm text-muted-foreground">New York, NY</p>
                </div>
              </div>
              <p className="text-muted-foreground italic">
                "The custom pendant with my daughter's name is absolutely beautiful. 
                The craftsmanship is exceptional, and I wear it every day. It's become 
                a treasured piece that I'll pass down to her."
              </p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="bg-card p-8 rounded-lg shadow-soft">
              <div className="flex items-center mb-4">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face&auto=format&q=80"
                  alt="Happy customer Michael"
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold">Michael Chen</h4>
                  <p className="text-sm text-muted-foreground">Los Angeles, CA</p>
                </div>
              </div>
              <p className="text-muted-foreground italic">
                "I ordered matching pendants for my wife and myself for our anniversary. 
                The attention to detail and quality exceeded my expectations. 
                Truly a work of art that represents our love story."
              </p>
            </motion.div>
          </div>
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
