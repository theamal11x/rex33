import { motion } from 'framer-motion';
import { SiLinkedin, SiGithub, SiInstagram } from "react-icons/si";
import { RiTwitterXFill } from "react-icons/ri";
import { HiGlobeAlt } from "react-icons/hi";
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface SocialLink {
  name: string;
  url: string;
  icon: React.ReactNode;
  color: string;
}

export function SocialLinks() {
  const socialLinks: SocialLink[] = [
    {
      name: "Twitter",
      url: "https://x.com/theamal11x",
      icon: <RiTwitterXFill className="w-3 h-3 sm:w-4 sm:h-4" />,
      color: "hover:text-[#000000] focus:text-[#000000]"
    },
    {
      name: "GitHub",
      url: "https://github.com/theamal11z",
      icon: <SiGithub className="w-3 h-3 sm:w-4 sm:h-4" />,
      color: "hover:text-[#333] focus:text-[#333]"
    },
    {
      name: "Instagram",
      url: "https://www.instagram.com/alamal11x/",
      icon: <SiInstagram className="w-3 h-3 sm:w-4 sm:h-4" />,
      color: "hover:text-[#E4405F] focus:text-[#E4405F]"
    }
  ];
  
  return (
    <motion.div 
      className="flex justify-center gap-1 mt-1"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      <TooltipProvider>
        {socialLinks.map((link) => (
          <Tooltip key={link.name}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full ${link.color} transition-colors duration-200`}
                onClick={() => window.open(link.url, '_blank')}
                aria-label={link.name}
              >
                {link.icon}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{link.name}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </motion.div>
  );
}