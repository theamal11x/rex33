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
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/mohsinraja/",
      icon: <SiLinkedin className="w-4 h-4" />,
      color: "hover:text-[#0A66C2] focus:text-[#0A66C2]"
    },
    {
      name: "Twitter",
      url: "https://twitter.com/mohsinraja",
      icon: <RiTwitterXFill className="w-4 h-4" />,
      color: "hover:text-[#000000] focus:text-[#000000]"
    },
    {
      name: "GitHub",
      url: "https://github.com/mohsinraja",
      icon: <SiGithub className="w-4 h-4" />,
      color: "hover:text-[#333] focus:text-[#333]"
    },
    {
      name: "Instagram",
      url: "https://instagram.com/mohsinraja",
      icon: <SiInstagram className="w-4 h-4" />,
      color: "hover:text-[#E4405F] focus:text-[#E4405F]"
    },
    {
      name: "Website",
      url: "https://mohsinraja.com",
      icon: <HiGlobeAlt className="w-4 h-4" />,
      color: "hover:text-amber-500 focus:text-amber-500"
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
                className={`w-8 h-8 rounded-full ${link.color} transition-colors duration-200`}
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