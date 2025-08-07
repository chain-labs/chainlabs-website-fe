"use client";

import { motion } from "motion/react";

declare global {
	interface Window {
		gtag?: (command: string, targetId: string, config?: any) => void;
	}
}

import {
	Calendar,
	ArrowRight,
	Sparkles,
	MessageSquare,
	Phone,
	Video,
	Clock,
	Zap,
	Users,
	CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const BookCallSection = () => {
	const handleBookCall = (calendarLink: string, callType: string) => {
		// Track the call booking event
		if (typeof window !== "undefined" && window.gtag) {
			window.gtag("event", "book_call_click", {
				call_type: callType,
				source: "book_call_section",
			});
		}

		window.open(calendarLink, "_blank");
	};

	const consultationFeatures = [
		{
			icon: CheckCircle,
			title: "Free 30-Minute Strategy Session",
			description: "No commitment, just insights",
		},
		{
			icon: Users,
			title: "Direct Access to AI Experts",
			description: "Work with senior developers & strategists",
		},
		{
			icon: Zap,
			title: "Custom Solution Blueprint",
			description: "Tailored roadmap for your business",
		},
		{
			icon: Clock,
			title: "Quick Implementation Timeline",
			description: "Fast-track your AI transformation",
		},
	];

	return (
		<section className="relative py-24 overflow-visible">
			<div className="container max-w-7xl mx-auto px-4 relative z-10">
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8 }}
					className="text-center mb-16"
				>
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						whileInView={{ opacity: 1, scale: 1 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6, delay: 0.2 }}
						className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary/10 via-primary/20 to-primary/10 rounded-full text-primary font-medium text-sm mb-8 backdrop-blur-sm border border-primary/20"
					>
						<Sparkles className="w-4 h-4" />
						Free AI Strategy Session Available
					</motion.div>

					<motion.h2
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.8, delay: 0.3 }}
						className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
					>
						Ready to{" "}
						<span className="bg-gradient-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent">
							Transform
						</span>{" "}
						Your Business?
					</motion.h2>

					<motion.p
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.8, delay: 0.4 }}
						className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
					>
						Book a free consultation with our AI experts. No sales
						pitch, just valuable insights and a custom roadmap
						tailored to your business goals.
					</motion.p>
				</motion.div>

				{/* Features Grid */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8, delay: 0.5 }}
					className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
				>
					{consultationFeatures.map((feature, index) => (
						<motion.div
							key={feature.title}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{
								duration: 0.6,
								delay: 0.6 + index * 0.1,
							}}
							className="relative group"
						>
							<div className="relative w-full h-full p-6 rounded-2xl bg-surface/50 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1">
								<div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/30 mb-4 group-hover:scale-110 transition-transform duration-300">
									<feature.icon className="w-6 h-6 text-primary" />
								</div>
								<h3 className="font-semibold text-foreground mb-2 text-sm">
									{feature.title}
								</h3>
								<p className="text-muted-foreground text-sm leading-relaxed">
									{feature.description}
								</p>
							</div>
						</motion.div>
					))}
				</motion.div>

				{/* Bottom CTA */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8, delay: 1 }}
					className="text-center"
				>
					<div className="max-w-2xl mx-auto p-8 rounded-3xl bg-gradient-to-br from-surface/80 to-surface-muted/80 backdrop-blur-sm border border-border/50">
						<div className="flex items-center justify-center gap-2 mb-4">
							<Calendar className="w-5 h-5 text-primary" />
							<span className="text-sm font-medium text-muted-foreground">
								Available Monday - Friday, 9 AM - 6 PM EST
							</span>
						</div>
						<h3 className="text-xl font-semibold text-foreground mb-3">
							Not sure which option is right for you?
						</h3>
						<p className="text-muted-foreground mb-6">
							Start with a quick chat and we'll recommend the best
							next steps for your specific needs.
						</p>
						<Button
							onClick={() =>
								handleBookCall(
									"https://cal.com/chainlabs/quick-chat",
									"General Consultation"
								)
							}
							variant="outline"
							size="lg"
							className="border-primary/30 hover:bg-primary hover:text-primary-foreground hover:border-primary"
						>
							Schedule Quick Chat
							<ArrowRight className="w-4 h-4 ml-2" />
						</Button>
					</div>
				</motion.div>
			</div>
		</section>
	);
};

export { BookCallSection };
