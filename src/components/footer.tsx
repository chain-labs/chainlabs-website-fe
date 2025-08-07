"use client";

import React from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { 
  MoveUpRight, 
  Phone, 
  Github, 
  Linkedin, 
  Twitter, 
  Mail,
  MapPin
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FooterProps {
  showPersonalized: boolean;
  className?: string;
}

export const Footer = ({ showPersonalized, className }: FooterProps) => {
  const socialLinks = [
    { name: "GitHub", icon: Github, href: "#" },
    { name: "LinkedIn", icon: Linkedin, href: "#" },
    { name: "Twitter", icon: Twitter, href: "#" },
    { name: "Email", icon: Mail, href: "mailto:hello@chainlabs.com" },
  ];

  const quickLinks = [
    { label: "Solutions", href: "#solutions" },
    { label: "Case Studies", href: "#case-studies" },
    { label: "About Us", href: "#about" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <motion.footer
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={cn(
        "relative w-full transition-all duration-500",
        showPersonalized
          ? "bg-surface/50 backdrop-blur-sm border-t border-border/30"
          : "bg-gradient-to-br from-background via-background to-primary/5",
        className
      )}
    >
      {/* Background Elements for non-personalized view */}
      {!showPersonalized && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-full blur-3xl" />
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-gradient-to-bl from-primary/8 via-transparent to-transparent rounded-full blur-2xl" />
        </div>
      )}

      <div className="relative z-10 container max-w-7xl mx-auto px-4 md:px-6">
        {/* Main Footer Content */}
        <div className="py-16 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Brand Section */}
            <div className="lg:col-span-5 space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex items-center space-x-3"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                  <span className="text-background font-bold">CL</span>
                </div>
                <span className="text-2xl font-bold text-foreground">
                  Chain Labs
                </span>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-muted-foreground text-lg leading-relaxed max-w-md"
              >
                Building the future with AI-powered solutions. Transform your business 
                with cutting-edge technology and expert development.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex items-center space-x-2 text-muted-foreground"
              >
                <MapPin className="w-4 h-4" />
                <span className="text-sm">San Francisco, CA</span>
              </motion.div>
            </div>

            {/* Quick Links */}
            <div className="lg:col-span-3 space-y-6">
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-lg font-semibold text-foreground"
              >
                Quick Links
              </motion.h3>
              <div className="space-y-3">
                {quickLinks.map((link, index) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                    className="block text-muted-foreground hover:text-primary transition-colors duration-300 text-sm"
                    whileHover={{ x: 5 }}
                  >
                    {link.label}
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Contact & CTA */}
            <div className="lg:col-span-4 space-y-6">
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-lg font-semibold text-foreground"
              >
                Ready to Get Started?
              </motion.h3>
              
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-muted-foreground text-sm leading-relaxed"
              >
                Let's discuss how AI can transform your business. 
                Book a free consultation today.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Button
                  className="group relative overflow-hidden bg-primary hover:bg-primary/90 text-primary-foreground"
                  size="lg"
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Book a Call
                  <MoveUpRight className="ml-2 h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </Button>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border/30 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex items-center space-x-4"
            >
              {socialLinks.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                  className="p-2 rounded-lg bg-muted/20 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300"
                  aria-label={link.name}
                >
                  <link.icon className="h-5 w-5" />
                </motion.a>
              ))}
            </motion.div>

            {/* Copyright */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center text-sm text-muted-foreground"
            >
              &copy; {new Date().getFullYear()} Chain Labs. All rights reserved.
            </motion.div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};