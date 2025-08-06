"use client";

import { Button } from "@/components/ui/button";
import { MoveUpRight, Phone, Github, Linkedin, Twitter, Dribbble } from "lucide-react";
import { motion } from "framer-motion";

export const Footer = () => {
  const socialLinks = [
    { name: "GitHub", icon: Github, href: "#" },
    { name: "LinkedIn", icon: Linkedin, href: "#" },
    { name: "Twitter", icon: Twitter, href: "#" },
    { name: "Dribbble", icon: Dribbble, href: "#" },
  ];

  return (
    <footer className="w-full bg-surface py-12 md:py-16 text-text-secondary">
      <div className="container mx-auto px-4 md:px-6 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-col items-center gap-6 mb-8 text-center"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-text-primary">
            Ready to Build Your AI Future?
          </h2>
          <Button
            className="group relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
          >
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#00D4AA_0%,#00A085_50%,#00D4AA_100%)]" />
            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-background px-6 py-2 text-primary backdrop-blur-3xl font-semibold text-lg transition-all duration-300 group-hover:text-primary-foreground group-hover:bg-primary">
              <Phone className="mr-3 h-5 w-5" />
              Book a Call 
              <MoveUpRight className="ml-2 h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </span>
          </Button>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-6 md:gap-8 mb-8">
          {socialLinks.map((link, index) => (
            <motion.a
              key={link.name}
              href={link.href}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              viewport={{ once: true }}
              className="text-text-secondary hover:text-primary transition-colors duration-300"
              aria-label={link.name}
            >
              <link.icon className="h-6 w-6 md:h-7 md:w-7" />
            </motion.a>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center text-sm md:text-base"
        >
          &copy; {new Date().getFullYear()} Chain Labs. All rights reserved.
        </motion.div>
      </div>
    </footer>
  );
};