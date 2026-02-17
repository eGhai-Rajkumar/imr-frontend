import { Users, Award, Globe, Shield, MapPin, Heart, Star, CheckCircle, Leaf, Briefcase } from 'lucide-react';
import { useState, useEffect } from 'react';
import PageHeader from '../../../components/layout/PageHeader';

// --- DATA ---

const stats = [
  { icon: Users, value: 15000, label: 'Happy Travelers', suffix: '+' },
  { icon: Award, value: 12, label: 'Years Experience', suffix: '+' },
  { icon: Globe, value: 50, label: 'Destinations', suffix: '+' },
  { icon: Shield, value: 100, label: 'Satisfaction Rate', suffix: '%' },
];

const team = [
  {
    name: 'Poonam Sharma',
    role: 'CEO & Founder',
    image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    name: 'Ops Team',
    role: 'Head of Operations',
    image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    name: 'Tour Guides',
    role: 'Field Experts',
    image: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    name: 'Support Team',
    role: 'Customer Relations',
    image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
];

const values = [
  {
    icon: Heart,
    title: 'Honesty',
    description: 'We prioritize honest communication and fair pricing, fostering trust with clients and partners.',
  },
  {
    icon: Shield,
    title: 'Transparency',
    description: 'We ensure clarity in all our products, services, and processes.',
  },
  {
    icon: Award,
    title: 'Quality',
    description: 'We focus on delivering excellent service and value by working with top people and operators.',
  },
  {
    icon: Star,
    title: 'Personal',
    description: 'We offer tailored advice and personal, friendly service, making each experience unique.',
  },
  {
    icon: Leaf,
    title: 'Sustainable Tourism',
    description: 'We promote responsible tourism, respecting local cultures, the environment, and fair economic practices.',
  },
  {
    icon: Briefcase,
    title: 'Professional',
    description: 'We approach business with integrity, efficiency, and realibility, maintaining a grounded, respectful attitude.',
  },
];

// --- UTILITY COMPONENTS ---

function CountUpAnimation({ end, duration = 2000, suffix = '' }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);

      setCount(Math.floor(end * percentage));

      if (percentage < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return <span>{count.toLocaleString()}{suffix}</span>;
}

// --- MAIN COMPONENT: ABOUT PAGE ---

export default function AboutPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-surface">

      <PageHeader
        title="About Indian Mountain Rovers"
        subtitle="Making Memories, Not Just Itineraries"
        breadcrumb="About Us"
        bgImage="https://images.pexels.com/photos/1008155/pexels-photo-1008155.jpeg?auto=compress&cs=tinysrgb&w=1920"
      />

      <div className="container mx-auto px-4 py-20">

        {/* Story Section */}
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="relative">
            <div className="absolute top-0 left-0 w-full h-full bg-primary/5 rounded-3xl transform -rotate-3"></div>
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.pexels.com/photos/2387418/pexels-photo-2387418.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Himalayan Trek"
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>

          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary">
              Who We Are
            </h2>
            <div className="w-20 h-1 bg-accent rounded-full"></div>
            <div className="space-y-6 text-gray-600 text-lg leading-relaxed font-light text-justify">
              <p>
                <strong className="text-primary font-bold">Indian Mountain Rovers</strong> is a full fledged tourism oriented agency, is all set to make a big difference in value added tour operations. Indian Mountain Rovers is the local ground handler for worldwide customers run by a experienced enterprising businessman supported by a team who have 12 years experience in hotel management and travel industries. The company image is based on innovation, technology, credibility, quality services, fair-business practices & respect to our relationships with customers, suppliers, & office colleagues.
              </p>
              <p>
                Through an amalgamation of user friendly tools and human touch, we deliver the most responsive personalized service in the industry. Our structure puts us in a different league compared to the many poorly organized ground handlers which you may have encountered in North India. We also have a strict policy of answering all emails and queries within 24 hours for offline requests. We believe you would have an extremely positive working relationship with our reliable team.
              </p>
              <p className="italic text-gray-500 font-medium">
                "Journeys can be bought but memories cannot… let this journey be an experience. We invite you to the Indian Mountain Rovers to enjoy a host of privileges."
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="relative py-16 mb-32 bg-primary rounded-3xl overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8 px-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="text-center group"
                >
                  <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/20 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-8 w-8 text-accent" />
                  </div>
                  <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                    <CountUpAnimation end={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-white/80 font-medium tracking-wide uppercase text-sm">{stat.label}</div>
                  <div className="text-white/80 font-medium tracking-wide uppercase text-xs mt-1">Clock-work Precision</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <span className="text-accent font-bold tracking-widest uppercase text-sm">Why Choose Us</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mt-2">
              Our Values
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="group bg-white rounded-2xl p-8 shadow-soft hover:shadow-glass transition-all duration-300 hover:-translate-y-2 border border-gray-100"
                >
                  <div className="w-16 h-16 bg-primary/5 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:bg-primary group-hover:text-white">
                    <Icon className="h-8 w-8 text-primary group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-800">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-sm">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Registration Info */}
        <div className="mb-24 bg-gray-50 rounded-3xl p-10 border border-gray-200">
          <div className="text-center">
            <h3 className="text-2xl font-serif font-bold text-primary mb-6">Registration Information</h3>
            <div className="grid md:grid-cols-2 gap-8 text-left max-w-4xl mx-auto">
              <div>
                <h4 className="font-bold text-gray-800 mb-2">Registered with:</h4>
                <p className="text-gray-600">Department of Tourism Government of Himachal Pradesh, India</p>
                <p className="text-gray-600 font-medium mt-2">Indian Mountain Rovers No: <br /> 11-576/12-DTO-SML</p>
              </div>
              <div>
                <h4 className="font-bold text-gray-800 mb-2">Registered Office:</h4>
                <p className="text-gray-600">Manali highway Chakkar Shimla</p>

                <h4 className="font-bold text-gray-800 mt-4 mb-2">Phone:</h4>
                <p className="text-gray-600 text-lg font-bold text-accent">+91 82788 29941</p>
                <p className="text-gray-600 text-lg font-bold text-accent">+91 94183 44227</p>
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <span className="text-accent font-bold tracking-widest uppercase text-sm">The People</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mt-2">
              Meet Our Team
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-soft p-6 text-center hover:shadow-2xl transition-all duration-300 group hover:-translate-y-2"
              >
                <div className="relative mb-6 inline-block">
                  <div className="absolute inset-0 bg-accent rounded-full blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-300" />
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-32 h-32 rounded-full object-cover relative z-10 border-4 border-white shadow-lg group-hover:border-accent transition-colors duration-300"
                  />
                </div>
                <h3 className="text-xl font-bold mb-2 text-primary">{member.name}</h3>
                <p className="text-secondary font-medium text-sm">{member.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="relative overflow-hidden rounded-3xl shadow-2xl">
          <div className="absolute inset-0 bg-primary"></div>
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]"></div>
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle at top right, #2C6E58 0%, transparent 40%)'
            }}
          ></div>

          <div className="relative z-10 p-12 md:p-20 text-center text-white">
            <h2 className="text-4xl md:text-6xl font-serif font-bold mb-6">Ready to Start Your Journey?</h2>
            <p className="text-xl md:text-2xl mb-10 text-white/90 font-light max-w-3xl mx-auto">
              We do not just make the itineraries, we actually make memories.
            </p>
            <a href="/triplist">
              <button className="bg-accent text-white px-12 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-primary transition-all duration-300 shadow-lg hover:shadow-glow transform hover:-translate-y-1">
                Browse Tours
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
