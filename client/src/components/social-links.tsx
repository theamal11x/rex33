import { motion } from 'framer-motion';
import { SiLinkedin, SiGithub, SiInstagram } from "react-icons/si";
import { RiTwitterXFill } from "react-icons/ri";
import { HiGlobeAlt } from "react-icons/hi";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface SocialLink {
  name: string;
  url: string;
  icon: React.ReactNode;
  color: string;
  hoverBg: string;
}

export function SocialLinks({
  variant = "default",
  animate = true,
  size = "md",
  showLabels = false
}: {
  variant?: "default" | "footer" | "header" | "minimal" | "floating";
  animate?: boolean;
  size?: "sm" | "md" | "lg";
  showLabels?: boolean;
}) {
  const socialLinks: SocialLink[] = [
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/mohsinraja/",
      icon: <SiLinkedin className="w-full h-full" />,
      color: "text-[#0A66C2]",
      hoverBg: "bg-[#0A66C2]/10"
    },
    {
      name: "Twitter",
      url: "https://twitter.com/mohsinraja",
      icon: <RiTwitterXFill className="w-full h-full" />,
      color: "text-[#000000]",
      hoverBg: "bg-[#000000]/10"
    },
    {
      name: "GitHub",
      url: "https://github.com/mohsinraja",
      icon: <SiGithub className="w-full h-full" />,
      color: "text-[#333]",
      hoverBg: "bg-[#333]/10"
    },
    {
      name: "Instagram",
      url: "https://instagram.com/mohsinraja",
      icon: <SiInstagram className="w-full h-full" />,
      color: "text-[#E4405F]", 
      hoverBg: "bg-[#E4405F]/10"
    },
    {
      name: "Website",
      url: "https://mohsinraja.com",
      icon: <HiGlobeAlt className="w-full h-full" />,
      color: "text-primary",
      hoverBg: "bg-primary/10"
    }
  ];
  
  // Size configuration
  const sizes = {
    sm: {
      container: "gap-1",
      icon: "w-3 h-3",
      button: "w-8 h-8",
    },
    md: {
      container: "gap-2",
      icon: "w-4 h-4",
      button: "w-10 h-10", 
    },
    lg: {
      container: "gap-3",
      icon: "w-5 h-5",
      button: "w-12 h-12",
    }
  };
  
  // Style based on variant
  const variants = {
    default: {
      container: "flex justify-center",
      button: "rounded-full bg-white shadow-sm border border-slate-200 transition-all duration-300",
      iconWrapper: `${sizes[size].icon}`,
    },
    footer: {
      container: "flex justify-center",
      button: "rounded-full bg-white/10 backdrop-blur-sm transition-all duration-300",
      iconWrapper: `${sizes[size].icon}`,
    },
    header: {
      container: "flex justify-end",
      button: "rounded-full bg-white/40 backdrop-blur-md shadow-sm transition-all duration-300",
      iconWrapper: `${sizes[size].icon}`,
    },
    minimal: {
      container: "flex justify-center",
      button: "rounded-lg transition-all duration-300",
      iconWrapper: `${sizes[size].icon}`,
    },
    floating: {
      container: "fixed bottom-6 left-1/2 -translate-x-1/2 flex p-2 bg-white/80 backdrop-blur-md rounded-full shadow-lg border border-white/30",
      button: "rounded-full glass-effect transition-all duration-300",
      iconWrapper: `${sizes[size].icon}`,
    }
  };
  
  const container = {
    hidden: { opacity: 0, y: 10 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { y: 10, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };
  
  return (
    <TooltipProvider>
      <motion.div 
        className={`${variants[variant].container} ${sizes[size].container}`}
        variants={animate ? container : undefined}
        initial={animate ? "hidden" : undefined}
        animate={animate ? "show" : undefined}
      >
        {socialLinks.map((link, index) => (
          <motion.div key={link.name} variants={animate ? item : undefined}>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.button
                  className={`${variants[variant].button} ${sizes[size].button} flex items-center justify-center group overflow-hidden`}
                  whileHover={{ 
                    scale: 1.1, 
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)" 
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.open(link.url, '_blank')}
                  aria-label={link.name}
                >
                  <div className={`absolute inset-0 opacity-0 ${link.hoverBg} group-hover:opacity-100 transition-opacity duration-300`}></div>
                  
                  <div className={`relative ${link.color} ${variants[variant].iconWrapper}`}>
                    {link.icon}
                  </div>
                  
                  {showLabels && (
                    <span className="ml-2 font-medium text-sm">{link.name}</span>
                  )}
                </motion.button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{link.name}</p>
              </TooltipContent>
            </Tooltip>
          </motion.div>
        ))}
      </motion.div>
    </TooltipProvider>
  );
}