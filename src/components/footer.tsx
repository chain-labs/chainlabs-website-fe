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
	MapPin,
	RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useGlobalStore } from "@/global-store";
import { apiClient } from "@/api-client";
import Link from "next/link";

interface FooterProps {
	showPersonalized: boolean;
	className?: string;
}

export const Footer = ({ showPersonalized, className }: FooterProps) => {
	const callUnlocked =
		useGlobalStore().personalised?.personalisation.call_unlocked;

	const resetSession = useGlobalStore((s) => s.resetSession); // added
	const [isResetting, setIsResetting] = React.useState(false); // added

	const handleReset = async () => {
		// added
		if (isResetting) return;
		setIsResetting(true);
		try {
			await apiClient.resetSession().catch(() => {});
			apiClient.clearAuth();
			resetSession();
			await apiClient.initializeSession().catch(() => {});
			window.scrollTo({ top: 0, behavior: "smooth" });
		} finally {
			setIsResetting(false);
		}
	};

	const socialLinks = [
		{ name: "GitHub", icon: Github, href: "#" },
		{ name: "LinkedIn", icon: Linkedin, href: "#" },
		{ name: "Twitter", icon: Twitter, href: "#" },
		{ name: "Email", icon: Mail, href: "mailto:hello@chainlabs.com" },
	];

	return (
		<motion.footer
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
					<div className="grid grid-cols-1 lg:grid-cols-9 gap-12 lg:gap-16">
						{/* Brand Section */}
						<div className="lg:col-span-5 space-y-6">
							<motion.div className="flex items-center space-x-2">
								<div className="rounded-lg text-[#5cfda2] flex items-center justify-center">
									<svg
										width="42"
										height="43"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											fillRule="evenodd"
											clipRule="evenodd"
											d="M41.99 21.513c0 11.348-9.396 20.548-20.988 20.548C9.41 42.06.013 32.86.013 21.513.013 10.165 9.41.966 21.002.966s20.989 9.2 20.989 20.547zm-31.435 8.434c.953.267 1.94.398 2.93.39 1.54.066 3.076-.192 4.505-.757 2.453-1.066 3.485-3.083 3.833-5.55.035-.256-.11-.232-.235-.21-.033.005-.064.01-.09.01h-3.801c-.32-.004-.433.085-.514.394-.447 1.694-1.547 2.428-3.35 2.212a1.538 1.538 0 01-1.104-.471 1.478 1.478 0 01-.402-1.113c-.004-.21.008-.42.036-.628l.197-1.172c.272-1.622.54-3.225.853-4.834.348-1.76 1.497-2.591 3.301-2.459a7.086 7.086 0 002.813-.385 6.986 6.986 0 002.422-1.455c.23-.194.19-.309 0-.495a4.601 4.601 0 00-1.669-1.061 10.79 10.79 0 00-4.923-.38c-3.305.362-5.564 2.255-6.313 5.421-.278 1.177-.488 2.378-.697 3.57-.107.605-.212 1.208-.326 1.804a13.922 13.922 0 00-.365 3.512c.121 1.888 1.064 3.087 2.899 3.657zM24.41 19.249c-1.497 1.41-3.363 1.65-5.266 1.809-.16.013-.32.02-.48.026-.162.007-.322.014-.48.027-.316.027-.424 0-.357-.363.23-1.185.451-2.379.64-3.573.043-.254.185-.258.362-.262l.09-.003a6.645 6.645 0 003.778-1.248 5.876 5.876 0 002.083-2.985.436.436 0 01.185-.307.455.455 0 01.356-.073h4.4c.38 0 .416.11.357.442a7348.037 7348.037 0 00-3.062 17.124c-.058.328-.17.412-.496.407h-3.755c-.348 0-.451-.057-.366-.442.55-2.822 1.086-5.65 1.62-8.476l.355-1.873c.014-.049.023-.12.036-.23zm4.617 11.008h2.286c.767 0 1.53 0 2.314.008.351 0 .468-.119.518-.442a149.3 149.3 0 01.645-3.799c.054-.314-.068-.34-.33-.34h-4.626c-.324 0-.405.115-.45.376-.096.515-.186 1.03-.277 1.546-.13.749-.262 1.497-.409 2.244-.063.318-.018.407.33.407z"
											fill="currentColor"
										></path>
									</svg>
								</div>
								<span className="text-xl text-foreground">
									Chain Labs
								</span>
							</motion.div>

							<motion.p
								initial={{ opacity: 0, x: -20 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.6, delay: 0.1 }}
								className="text-muted-foreground leading-relaxed max-w-md"
							>
								Building the future with AI-powered solutions.
								Transform your business with cutting-edge
								technology and expert development.
							</motion.p>

							<motion.div
								initial={{ opacity: 0, x: -20 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.6, delay: 0.2 }}
								className="flex items-center space-x-2 text-muted-foreground"
							>
								<MapPin className="w-4 h-4" />
								<span className="text-sm">
									Bangalore, India
								</span>
							</motion.div>
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
								Let's discuss how AI can transform your
								business. Book a free consultation today.
							</motion.p>

							<motion.div
								initial={{ opacity: 0, y: 10 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.6, delay: 0.2 }}
								className="w-fit"
							>
								{callUnlocked ? (
									<Link
										href="#book-a-call"
										className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive shadow-xs h-10 rounded-md px-6 has-[>svg]:px-4 group relative overflow-hidden bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer"
									>
										<Phone className="mr-2 h-4 w-4" />
										Book a Call
										<MoveUpRight className="ml-2 h-4 w-4" />
									</Link>
								) : (
									<div className="relative">
										<Button
											className="group relative overflow-hidden bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer"
											size="lg"
										>
											<Phone className="mr-2 h-4 w-4" />
											Book a Call
											<MoveUpRight className="ml-2 h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
										</Button>
										<div className="absolute inset-0 grid place-items-center pointer-events-none">
											<span className="rounded-md bg-background/80 px-3 py-1 text-xs text-muted-foreground border border-border/50 shadow-sm text-center">
												Complete the missions to unlock
											</span>
										</div>
									</div>
								)}
							</motion.div>
						</div>
					</div>
				</div>

				{/* Bottom Section */}
				<div className="border-t border-border/30 py-6 sm:py-8">
					<div className="flex flex-col lg:flex-row items-center justify-between gap-4 sm:gap-6">
						{/* Social Links */}
						<motion.div
							initial={{ opacity: 0, y: 10 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6 }}
							className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 w-full lg:w-auto"
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
									transition={{
										duration: 0.3,
										delay: 0.1 * index,
									}}
									className="p-2 rounded-lg bg-muted/20 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300"
									aria-label={link.name}
								>
									<link.icon className="h-5 w-5" />
								</motion.a>
							))}
						</motion.div>

						{/* Docs Links */}
						<motion.div
							initial={{ opacity: 0, y: 10 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: 0.3 }}
							className="grid grid-cols-3 gap-x-4 gap-y-2 text-center w-full lg:w-auto items-center"
							style={{ minWidth: 340 }} // optional: ensures fixed width for layout stability
						>
							<a
								href="/privacy-policy.pdf"
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center justify-center space-x-2 text-muted-foreground hover:text-primary transition-colors duration-300"
							>
								<span className="text-sm">
									Privacy & Policy
								</span>
							</a>
							<a
								href="/ai-disclosure.pdf"
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center justify-center space-x-2 text-muted-foreground hover:text-primary transition-colors duration-300"
							>
								<span className="text-sm">AI Disclosure</span>
							</a>
							<button
								type="button"
								onClick={handleReset}
								disabled={isResetting}
								title="Reset your session"
								aria-busy={isResetting}
								className="inline-flex items-center justify-center gap-1.5 text-muted-foreground hover:text-destructive transition-colors duration-300 disabled:opacity-60"
							>
								<RotateCcw className="h-4 w-4" />
								<span className="text-sm">
									{isResetting
										? "Resetting..."
										: "Reset session"}
								</span>
							</button>
						</motion.div>

						{/* Copyright */}
						<motion.div
							initial={{ opacity: 0, y: 10 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: 0.2 }}
							className="text-center text-sm text-muted-foreground w-full lg:w-auto"
						>
							&copy; {new Date().getFullYear()} Chain Labs. All
							rights reserved.
						</motion.div>
					</div>
				</div>
			</div>
		</motion.footer>
	);
};
