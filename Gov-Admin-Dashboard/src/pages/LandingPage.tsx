import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Building2,
  Home,
  Shield,
  FileCheck,
  Users,
  Phone,
  MapPin,
  ArrowRight,
  CheckCircle,
  Globe,
} from 'lucide-react';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-navy-light to-primary opacity-95" />
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="heroGrid" width="60" height="60" patternUnits="userSpaceOnUse">
                  <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#heroGrid)" className="text-primary-foreground" />
            </svg>
          </div>
        </div>
        
        <nav className="relative z-10 container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-accent flex items-center justify-center">
                <Globe className="h-6 w-6 text-accent-foreground" />
              </div>
              <div>
                <span className="font-bold text-xl text-primary-foreground">Aarohan</span>
                <span className="block text-xs text-primary-foreground/70">Viksit Bharat 2047</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10" asChild>
                <Link to="/gram-panchayat">Gram Panchayat</Link>
              </Button>
              <Button variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10" asChild>
                <Link to="/zilla-parishad">Zilla Parishad</Link>
              </Button>
            </div>
          </div>
        </nav>

        <div className="relative z-10 container mx-auto px-6 py-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent mb-8">
            <Shield className="h-4 w-4" />
            <span className="text-sm font-medium">EDAI Project</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground mb-6 tracking-tight">
            Digital & Inclusive
            <span className="block text-accent">Governance</span>
          </h1>
          
          <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-12">
            Bridging the digital divide with accessible governance solutions. 
            Voice-assisted, multilingual, and designed for every citizen of India.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-8" asChild>
              <Link to="/gram-panchayat">
                <Home className="mr-2 h-5 w-5" />
                Gram Panchayat Portal
              </Link>
            </Button>
            <Button
              size="lg"
              className="bg-primary-foreground/10 text-primary-foreground border border-primary-foreground/30 hover:bg-primary-foreground/10 text-lg px-8"
              asChild
            >
              <Link to="/zilla-parishad">
                <Building2 className="mr-2 h-5 w-5" />
                Zilla Parishad Portal
              </Link>
            </Button>

          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </header>

      {/* Features Section */}
      <section className="py-24 container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Empowering Every Citizen</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive governance solutions designed for accessibility and transparency
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: FileCheck,
              title: 'Blockchain Documents',
              description: 'Secure, verifiable digital documents with tamper-proof blockchain technology.',
              color: 'bg-success/10 text-success',
            },
            {
              icon: Phone,
              title: 'Voice-Assisted Access',
              description: 'IVR and voice commands for citizens with low literacy or no smartphones.',
              color: 'bg-accent/10 text-accent',
            },
            {
              icon: MapPin,
              title: 'Location-Based Services',
              description: 'Real-time complaint tracking and regional analysis with interactive maps.',
              color: 'bg-primary/10 text-primary',
            },
            {
              icon: Users,
              title: 'Women Empowerment',
              description: 'Dedicated job portals and opportunities for women in government services.',
              color: 'bg-warning/10 text-warning',
            },
            {
              icon: Shield,
              title: 'Transparent Grievance',
              description: 'Multi-channel complaint system with automatic escalation and tracking.',
              color: 'bg-destructive/10 text-destructive',
            },
            {
              icon: Globe,
              title: 'Multilingual Support',
              description: 'Access services in regional languages with audio guidance.',
              color: 'bg-navy-light/10 text-navy-light',
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="group p-8 bg-card rounded-2xl border border-border hover:border-accent/30 hover:shadow-lg transition-all duration-300"
            >
              <div className={`inline-flex p-4 rounded-xl ${feature.color} mb-6`}>
                <feature.icon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Portal Selection */}
      <section className="py-24 bg-muted/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Portal</h2>
            <p className="text-lg text-muted-foreground">
              Access the dashboard tailored to your administrative level
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Link
              to="/gram-panchayat"
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-forest to-success p-8 text-success-foreground hover:shadow-xl transition-all duration-300"
            >
              <div className="relative z-10">
                <div className="inline-flex p-4 rounded-xl bg-success-foreground/20 mb-6">
                  <Home className="h-10 w-10" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Gram Panchayat</h3>
                <p className="text-success-foreground/80 mb-6">
                  Village-level administration for rural complaint management, document issuance, and community services.
                </p>
                <ul className="space-y-2 mb-6">
                  {['Local Complaint Management', 'Document Issuance', 'Bulk Calling Campaigns', 'Scheme Distribution'].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center gap-2 font-semibold">
                  Enter Portal <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
              <div className="absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-success-foreground/10" />
            </Link>

            <Link
              to="/zilla-parishad"
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-navy-light p-8 text-primary-foreground hover:shadow-xl transition-all duration-300"
            >
              <div className="relative z-10">
                <div className="inline-flex p-4 rounded-xl bg-primary-foreground/20 mb-6">
                  <Building2 className="h-10 w-10" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Zilla Parishad</h3>
                <p className="text-primary-foreground/80 mb-6">
                  District-level administration with oversight of all Gram Panchayats and regional governance.
                </p>
                <ul className="space-y-2 mb-6">
                  {['District-wide Analytics', 'Escalation Management', 'Scheme Uploading', 'Regional Overview'].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center gap-2 font-semibold">
                  Enter Portal <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
              <div className="absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-primary-foreground/10" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
                <Globe className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <span className="font-bold text-foreground">Aarohan</span>
                <span className="block text-xs text-muted-foreground">Viksit Bharat Challenge 2047</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              EDAI Project
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
