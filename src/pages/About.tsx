
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BookOpen, Info, User, Users } from "lucide-react";
import { Link } from "react-router-dom";
import philosophyImage from "@/assets/philosophy-image.jpg";
import usamaMalikPhoto from "@/assets/usama-malik.jpg";
import michelLambertPhoto from "@/assets/michel-lambert.jpg";
import amelieRouxPhoto from "@/assets/amelie-roux.jpg";
import thomasMartinPhoto from "@/assets/thomas-martin.jpg";

const About = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-serif mb-4 text-white">Our Story</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Founded in 2015, AURIX has transformed the art of luxury 
          fragrance with our focus on exquisite ingredients and bespoke craftsmanship.
        </p>
      </div>

      {/* Brand Philosophy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-24 items-center">
        <img src={philosophyImage} alt="Artisan perfume making process" className="h-96 w-full object-cover rounded-none" />
        <div>
          <h2 className="text-3xl font-serif mb-6 text-white">Our Philosophy</h2>
          <p className="mb-4 text-gray-300">
            At AURIX, we believe that a fragrance is more than just a scent—it is an 
            extension of one's identity, a captured memory, and a silent communicator of personality.
          </p>
          <p className="mb-6 text-gray-300">
            Our perfumers are guided by three core principles: exceptional quality, artistic innovation,
            and emotional resonance. Each fragrance is thoughtfully created to evoke specific memories,
            emotions, and experiences.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <BookOpen className="text-perfume-gold" />
              <span className="text-white">Artisanal Approach</span>
            </div>
            <div className="flex items-center gap-3">
              <Info className="text-perfume-gold" />
              <span className="text-white">Sustainable Sourcing</span>
            </div>
            <div className="flex items-center gap-3">
              <User className="text-perfume-gold" />
              <span className="text-white">Personal Expression</span>
            </div>
            <div className="flex items-center gap-3">
              <Users className="text-perfume-gold" />
              <span className="text-white">Collaborative Creation</span>
            </div>
          </div>
        </div>
      </div>

      {/* Our Process */}
      <div className="mb-24">
        <h2 className="text-3xl font-serif mb-10 text-center text-white">Our Process</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Ingredient Sourcing",
              description: "We travel the world to source the finest raw materials, from Bulgarian roses to Madagascan vanilla."
            },
            {
              title: "Artisanal Blending",
              description: "Our master perfumers create unique compositions that evolve beautifully on the skin over time."
            },
            {
              title: "Meticulous Testing",
              description: "Each fragrance undergoes extensive testing to ensure longevity, projection, and emotional impact."
            }
          ].map((step, index) => (
            <Card key={index} className="bg-neutral-900 border-neutral-800 rounded-none shadow-none">
              <CardContent className="pt-6">
                <div className="bg-neutral-800 w-12 h-12 rounded-none flex items-center justify-center mb-4">
                  <span className="text-white font-bold">{index + 1}</span>
                </div>
                <h3 className="font-serif text-xl mb-2 text-white">{step.title}</h3>
                <p className="text-gray-400">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Meet Our Team */}
      <div className="mb-24">
        <h2 className="text-3xl font-serif mb-10 text-center text-white">Meet Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              name: "Usama Malik",
              position: "Founder & Creative Director",
              bio: "With 10 years of experience in the fragrance industry, Usama brings an unparalleled vision to AURIX.",
              photo: usamaMalikPhoto
            },
            {
              name: "Michel Lambert",
              position: "Master Perfumer",
              bio: "A graduate of ISIPCA in Versailles, Michel has created award-winning fragrances for over 15 years.",
              photo: michelLambertPhoto
            },
            {
              name: "Amélie Roux",
              position: "Ingredient Specialist",
              bio: "Amélie travels the world to source the most exquisite and sustainable raw materials.",
              photo: amelieRouxPhoto
            },
            {
              name: "Thomas Martin",
              position: "Design Director",
              bio: "Thomas ensures that our packaging and presentation match the elegance of our fragrances.",
              photo: thomasMartinPhoto
            }
          ].map((member, index) => (
            <Card key={index} className="overflow-hidden bg-neutral-900 border-neutral-800 rounded-none shadow-none">
              {member.photo ? (
                <img src={member.photo} alt={member.name} className="h-60 w-full object-cover" />
              ) : (
                <div className="h-60 bg-neutral-800"></div>
              )}
              <CardContent className="p-4">
                <h3 className="font-serif text-lg mb-1 text-white uppercase tracking-widest text-sm">{member.name}</h3>
                <p className="text-perfume-gold text-xs font-bold mb-2 uppercase tracking-widest">{member.position}</p>
                <p className="text-gray-400 text-sm">{member.bio}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Commitment */}
      <div className="bg-neutral-900 border border-neutral-800 p-10 rounded-none mb-24">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-serif mb-6 text-white">Our Commitment</h2>
          <p className="mb-6 text-gray-400">
            We are committed to sustainable practices, from responsibly sourcing our ingredients to 
            using recyclable packaging. Every purchase supports our initiatives to reduce environmental 
            impact and give back to the communities where we source our materials.
          </p>
          <Separator className="my-8 bg-neutral-800" />
          <p className="italic text-gray-500">
            "To create a true luxury fragrance is to capture an emotion in a bottle – a moment that 
            can be relived with every spray." — Usama Malik, Founder
          </p>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center">
        <h2 className="text-3xl font-serif mb-6 text-white">Experience Our Fragrances</h2>
        <p className="mb-8 text-gray-400 max-w-2xl mx-auto">
          Discover your perfect scent from our collection of meticulously crafted fragrances.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="rounded-none bg-perfume-gold text-black hover:bg-yellow-600 uppercase tracking-widest text-[10px] font-bold px-8">
            <Link to="/products">Shop Collection</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-none border-neutral-700 bg-transparent text-white hover:bg-neutral-800 hover:text-white uppercase tracking-widest text-[10px] font-bold px-8">
            <Link to="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default About;
