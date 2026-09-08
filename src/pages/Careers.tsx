import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Briefcase, MapPin, Clock, Users, Heart, Sparkles, Globe } from "lucide-react";
import { Link } from "react-router-dom";

const jobOpenings = [
  {
    id: 1,
    title: "Senior Perfumer",
    department: "Creative",
    location: "Paris, France",
    type: "Full-time",
    description: "Join our creative team to develop innovative fragrance compositions using the finest ingredients from around the world."
  },
  {
    id: 2,
    title: "Brand Marketing Manager",
    department: "Marketing",
    location: "London, UK",
    type: "Full-time",
    description: "Lead our brand marketing initiatives and develop compelling campaigns that resonate with luxury fragrance consumers."
  },
  {
    id: 3,
    title: "E-commerce Specialist",
    department: "Digital",
    location: "Remote",
    type: "Full-time",
    description: "Optimize our online shopping experience and drive digital sales growth across all platforms."
  },
  {
    id: 4,
    title: "Quality Assurance Analyst",
    department: "Operations",
    location: "Dubai, UAE",
    type: "Full-time",
    description: "Ensure the highest quality standards for our fragrance products through rigorous testing and analysis."
  }
];

const benefits = [
  {
    icon: Heart,
    title: "Health & Wellness",
    description: "Comprehensive health insurance, gym memberships, and wellness programs."
  },
  {
    icon: Sparkles,
    title: "Product Perks",
    description: "Generous discounts on our fragrances and exclusive access to new launches."
  },
  {
    icon: Globe,
    title: "Global Opportunities",
    description: "Work with teams worldwide and opportunities for international transfers."
  },
  {
    icon: Users,
    title: "Growth & Learning",
    description: "Professional development programs, mentorship, and career advancement paths."
  }
];

const Careers = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-serif mb-4">Join Our Team</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Be part of a passionate team dedicated to crafting exceptional fragrances. 
          We're always looking for talented individuals who share our commitment to excellence.
        </p>
      </div>

      {/* Why Join Us */}
      <div className="mb-24">
        <h2 className="text-3xl font-sans font-black tracking-widest mb-10 text-center uppercase">Why Work at AURIX?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <Card key={index} className="text-center border-none shadow-md rounded-none">
              <CardContent className="pt-6">
                <div className="bg-neutral-100 w-12 h-12 rounded-none flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="text-black h-6 w-6" />
                </div>
                <h3 className="font-serif text-lg mb-2">{benefit.title}</h3>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Culture Section */}
      <div className="bg-neutral-50 rounded-none border border-neutral-100 p-10 mb-24">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-sans font-black tracking-widest mb-6 uppercase">Our Culture</h2>
          <p className="mb-6 text-neutral-700 leading-relaxed text-sm">
            At AURIX, we believe that great fragrances come from great people. Our culture is built on 
            creativity, collaboration, and a shared passion for the art of perfumery. We celebrate 
            diversity, encourage innovation, and support each team member's growth.
          </p>
          <p className="text-neutral-700 leading-relaxed text-sm">
            Whether you're in our creative labs, marketing offices, or retail boutiques, you'll find 
            a welcoming environment where your ideas are valued and your contributions make a real impact.
          </p>
        </div>
      </div>

      {/* Open Positions */}
      <div className="mb-24">
        <h2 className="text-3xl font-serif mb-10 text-center">Open Positions</h2>
        <div className="space-y-4">
          {jobOpenings.map((job) => (
            <Card key={job.id} className="hover:shadow-lg transition-shadow rounded-none border border-neutral-200">
              <CardHeader className="pb-2">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle className="font-sans font-bold text-xl uppercase tracking-wider">{job.title}</CardTitle>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="secondary" className="bg-neutral-100 text-neutral-800 rounded-none border border-neutral-200">
                        {job.department}
                      </Badge>
                      <div className="flex items-center gap-1 text-gray-500 text-sm">
                        <MapPin className="h-4 w-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1 text-gray-500 text-sm">
                        <Clock className="h-4 w-4" />
                        {job.type}
                      </div>
                    </div>
                  </div>
                  <Button className="bg-black hover:bg-neutral-800 text-white rounded-none uppercase text-xs tracking-wider md:self-start">
                    Apply Now
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{job.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Don't See Your Role */}
      <div className="text-center bg-neutral-100 rounded-none p-10">
        <Briefcase className="h-12 w-12 text-black mx-auto mb-4" />
        <h2 className="text-2xl font-sans font-black tracking-widest mb-4 uppercase">Don't See Your Role?</h2>
        <p className="text-neutral-700 max-w-xl mx-auto mb-6 text-sm">
          We're always interested in meeting talented individuals. Send us your resume and 
          tell us how you can contribute to the AURIX team.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="bg-black hover:bg-neutral-800 text-white rounded-none uppercase text-xs tracking-wider">
            <Link to="/contact">Contact Us</Link>
          </Button>
          <Button asChild variant="outline" className="border-black text-black rounded-none uppercase text-xs tracking-wider hover:bg-black hover:text-white">
            <Link to="/about">Learn About Us</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Careers;
