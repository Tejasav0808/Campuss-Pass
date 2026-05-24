import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import {
  ArrowRight, ShieldCheck, Users, User
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';


import { FuzzyText } from '../components/FuzzyText';
import { LightBeamButton } from '../components/LightBeamButton';

const getGradientColors = (color: string): [string, string, string] => {
  switch (color) {
    case 'indigo': return ["#6366f1", "#a855f7", "#6366f1"];
    case 'violet': return ["#8b5cf6", "#d946ef", "#8b5cf6"];
    case 'emerald': return ["#10b981", "#34d399", "#10b981"];
    default: return ["#8b5cf6", "#06b6d4", "#8b5cf6"];
  }
};

export default function LandingPage() {
  const { } = useAuth();
  const [_searchParams] = useSearchParams();

  useEffect(() => {
    document.title = 'CampusPass | The Ultimate Hub';
  }, []);

  const roles = [
    {
      id: 'student',
      title: 'Student Hub',
      desc: 'Discover events and book tickets.',
      icon: User,
      color: 'indigo',
      action: 'Explore & Join'
    },
    {
      id: 'organizer',
      title: 'Organizer Hub',
      desc: 'Create and manage your club events.',
      icon: Users,
      color: 'violet',
      action: 'Manage Events'
    },
    {
      id: 'admin',
      title: 'Admin',
      desc: 'Platform oversight and management.',
      icon: ShieldCheck,
      color: 'emerald',
      action: 'Control Hub'
    }
  ];

  return (
    <div className="min-h-screen bg-[#050014] flex flex-col overflow-x-hidden font-sans">
      <Navbar />

      <main className="flex-grow flex flex-col pt-20">
        {/* Hero Section */}
        <section className="relative py-24 lg:py-32 px-6">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] bg-violet-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="flex justify-center"
              >
                <FuzzyText
                  fontSize="clamp(2rem, 5vw, 4.5rem)"
                  fontWeight={800}
                  color="#ffffff"
                  baseIntensity={0.15}
                  hoverIntensity={0.4}
                  fuzzRange={20}
                  enableHover={true}
                >
                  The ultimate hub for campus events
                </FuzzyText>
              </motion.div>
            </div>

            {/* Role Entry Selection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
              {roles.map((role, i) => (
                <motion.div
                  key={role.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                >
                  <Link
                    to={`/login?role=${role.id}`}
                    className="group block bg-white/5 backdrop-blur-xl p-8 rounded-[3rem] border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-500 relative overflow-hidden h-full"
                  >
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-${role.color}-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all duration-700 group-hover:scale-150`}></div>

                    <div className={`w-16 h-16 bg-${role.color}-500/20 text-${role.color}-400 rounded-2xl flex items-center justify-center mb-8 relative z-10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                      <role.icon size={32} />
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-4 relative z-10">{role.title}</h3>
                    <p className="text-slate-400 leading-relaxed mb-10 font-medium relative z-10">{role.desc}</p>

                    <div className="relative z-10 flex">
                      <LightBeamButton
                        gradientColors={getGradientColors(role.color)}
                        className="inline-flex items-center gap-3"
                      >
                        {role.action}
                        <ArrowRight size={18} className="transition-transform duration-300 group-hover/btn:translate-x-2" />
                      </LightBeamButton>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
