import { Phone, Mail, MapPin, Facebook, Instagram, Twitter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useSiteSetting } from "@/hooks/useSiteSettings";

const Contact = () => {
  const facebookUrl = useSiteSetting('social_facebook') || '#';
  const instagramUrl = useSiteSetting('social_instagram') || '#';
  const twitterUrl = useSiteSetting('social_twitter') || '#';

  return (
    <div className="min-h-screen bg-transparent">
      {/* Hero Section */}
      <section className="bg-neutral-900 border-b border-neutral-800 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            We'd love to hear from you. Get in touch with us for any inquiries.
          </p>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* Phone */}
            <Card className="text-center hover:shadow-lg transition-shadow bg-neutral-900 border-neutral-800 rounded-none shadow-none">
              <CardContent className="pt-8 pb-6">
                <div className="w-16 h-16 bg-neutral-800 rounded-none flex items-center justify-center mx-auto mb-4 border border-neutral-700">
                  <Phone className="w-6 h-6 text-perfume-gold" />
                </div>
                <h3 className="text-lg font-serif text-white mb-2 uppercase tracking-widest text-sm">Phone</h3>
                <a 
                  href="tel:+919104455400" 
                  className="text-gray-400 hover:text-perfume-gold transition-colors font-medium tracking-wider"
                >
                  +91-9104455400
                </a>
              </CardContent>
            </Card>

            {/* Email */}
            <Card className="text-center hover:shadow-lg transition-shadow bg-neutral-900 border-neutral-800 rounded-none shadow-none">
              <CardContent className="pt-8 pb-6">
                <div className="w-16 h-16 bg-neutral-800 rounded-none flex items-center justify-center mx-auto mb-4 border border-neutral-700">
                  <Mail className="w-6 h-6 text-perfume-gold" />
                </div>
                <h3 className="text-lg font-serif text-white mb-2 uppercase tracking-widest text-sm">Email</h3>
                <a 
                  href="mailto:malikusama95@gmail.com" 
                  className="text-gray-400 hover:text-perfume-gold transition-colors font-medium tracking-wider"
                >
                  malikusama95@gmail.com
                </a>
              </CardContent>
            </Card>

            {/* Address */}
            <Card className="text-center hover:shadow-lg transition-shadow bg-neutral-900 border-neutral-800 rounded-none shadow-none">
              <CardContent className="pt-8 pb-6">
                <div className="w-16 h-16 bg-neutral-800 rounded-none flex items-center justify-center mx-auto mb-4 border border-neutral-700">
                  <MapPin className="w-6 h-6 text-perfume-gold" />
                </div>
                <h3 className="text-lg font-serif text-white mb-2 uppercase tracking-widest text-sm">Address</h3>
                <p className="text-gray-400 font-medium tracking-wider leading-relaxed">
                  Ahmedabad - 380001,<br />
                  Gujarat, India
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Social Media */}
          <div className="mt-16 text-center">
            <h3 className="text-xl font-serif text-white mb-6 uppercase tracking-widest text-sm">Follow Us</h3>
            <div className="flex items-center justify-center gap-6">
              <a href={facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-12 h-12 bg-neutral-900 border border-neutral-700 rounded-none flex items-center justify-center text-perfume-gold hover:bg-perfume-gold hover:text-black transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-12 h-12 bg-neutral-900 border border-neutral-700 rounded-none flex items-center justify-center text-perfume-gold hover:bg-perfume-gold hover:text-black transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href={twitterUrl} target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="w-12 h-12 bg-neutral-900 border border-neutral-700 rounded-none flex items-center justify-center text-perfume-gold hover:bg-perfume-gold hover:text-black transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
