"use client";

import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
import { useEffect, useState } from "react";

import { motion, AnimatePresence } from "motion/react";

type Testimonial = {
	quote: string;
	name: string;
	designation: string;
	src: string;
	company: string;
};

export const AnimatedTestimonials = ({
	testimonials,
	autoplay = false,
}: {
	testimonials: Testimonial[];
	autoplay?: boolean;
}) => {
	const [active, setActive] = useState(0);

	const handleNext = () => {
		setActive((prev) => (prev + 1) % testimonials.length);
	};

	const handlePrev = () => {
		setActive(
			(prev) => (prev - 1 + testimonials.length) % testimonials.length
		);
	};

	const isActive = (index: number) => {
		return index === active;
	};

	useEffect(() => {
		if (autoplay) {
			const interval = setInterval(handleNext, 5000);
			return () => clearInterval(interval);
		}
	}, [autoplay]);

	const randomRotateY = () => {
		return Math.floor(Math.random() * 21) - 10;
	};

	const renderStars = (rating: number) => {
		return Array.from({ length: 5 }, (_, i) => (
			<motion.svg
				key={i}
				initial={{ scale: 0, rotate: -180 }}
				animate={{ scale: 1, rotate: 0 }}
				transition={{ delay: i * 0.1, duration: 0.3 }}
				className={`h-5 w-5 ${
					i < rating
						? "fill-primary text-primary"
						: "fill-gray-300 text-gray-300 dark:fill-neutral-600 dark:text-neutral-600"
				}`}
				viewBox="0 0 20 20"
			>
				<path d="M10 15l-5.878 3.09 1.123-6.545L0 6.91l6.564-.955L10 0l3.436 5.955L20 6.91l-5.245 4.635L15.878 18z" />
			</motion.svg>
		));
	};

	return (
		<div className="mx-auto max-w-sm px-4 py-20 font-sans antialiased md:max-w-6xl md:px-8 lg:px-12">
			<div className="relative grid grid-cols-1 gap-20 md:grid-cols-2 lg:gap-32">
				<div className="hidden sm:block">
					<div className="relative h-80 w-full">
						<AnimatePresence>
							{testimonials.map((testimonial, index) => (
								<motion.div
									key={testimonial.src}
									initial={{
										opacity: 0,
										scale: 0.9,
										z: -100,
										rotate: randomRotateY(),
									}}
									animate={{
										opacity: isActive(index) ? 1 : 0.7,
										scale: isActive(index) ? 1 : 0.95,
										z: isActive(index) ? 0 : -100,
										rotate: isActive(index)
											? 0
											: randomRotateY(),
										zIndex: isActive(index)
											? 40
											: testimonials.length + 2 - index,
										y: isActive(index) ? [0, -80, 0] : 0,
									}}
									exit={{
										opacity: 0,
										scale: 0.9,
										z: 100,
										rotate: randomRotateY(),
									}}
									transition={{
										duration: 0.4,
										ease: "easeInOut",
									}}
									className="absolute inset-0 origin-bottom"
								>
									<div className="relative h-full w-full overflow-hidden rounded-3xl bg-gradient-to-br from-surface to-surface-muted backdrop-blur-md p-1">
										<div className="relative h-full w-full overflow-hidden rounded-3xl bg-surface">
											<img
												src={testimonial.src}
												alt={testimonial.name}
												width={500}
												height={500}
												draggable={false}
												className="h-full w-full object-contain object-center"
											/>
											<div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
											<div className="absolute bottom-4 left-4 right-4">
												<motion.div
													initial={{
														opacity: 0,
														y: 20,
													}}
													animate={{
														opacity: isActive(index)
															? 1
															: 0,
														y: isActive(index)
															? 0
															: 20,
													}}
													className="text-white"
												>
													<div className="text-sm font-medium">
														{testimonial.company}
													</div>
												</motion.div>
											</div>
										</div>
									</div>
								</motion.div>
							))}
						</AnimatePresence>
					</div>
				</div>

				<div className="flex flex-col justify-between gap-4 py-4">
					<motion.div
						key={active}
						initial={{
							y: 20,
							opacity: 0,
						}}
						animate={{
							y: 0,
							opacity: 1,
						}}
						exit={{
							y: -20,
							opacity: 0,
						}}
						transition={{
							duration: 0.3,
							ease: "easeInOut",
						}}
						className="relative"
					>
						{/* Quote Icon */}
						<motion.div
							// initial={{ scale: 0, rotate: -45 }}
							// animate={{ scale: 1, rotate: 0 }}
							// transition={{ duration: 0.5, delay: 0.2 }}
							className="mb-6"
						>
							<Quote className="h-8 w-8 text-primary" />
						</motion.div>

						{/* Quote Text */}
						<motion.p className="mb-8 text-lg leading-relaxed text-text-secondary dark:text-neutral-300">
							{testimonials[active].quote
								.split(" ")
								.map((word, index) => (
									<motion.span
										key={index}
										initial={{
											filter: "blur(10px)",
											opacity: 0,
											y: 5,
										}}
										animate={{
											filter: "blur(0px)",
											opacity: 1,
											y: 0,
										}}
										transition={{
											duration: 0.2,
											ease: "easeInOut",
											delay: 0.02 * index,
										}}
										className="inline-block"
									>
										{word}&nbsp;
									</motion.span>
								))}
						</motion.p>

						{/* Author Info */}
						<div className="space-y-1">
							<h3 className="text-xl font-bold text-text-primary dark:text-white">
								{testimonials[active].name}
							</h3>
							<p className="text-sm font-medium text-primary">
								{testimonials[active].designation}
							</p>
							<p className="text-sm text-text-secondary dark:text-neutral-500">
								{testimonials[active].company}
							</p>
						</div>
					</motion.div>

					{/* Navigation */}
					<div className="flex items-center justify-between">
						<div className="flex gap-4">
							<motion.button
								whileHover={{ scale: 1.1 }}
								whileTap={{ scale: 0.95 }}
								onClick={handlePrev}
								className="group/button flex h-12 w-12 items-center justify-center rounded-full bg-surface border border-border hover:bg-primary hover:border-primary transition-all duration-300"
							>
								<ArrowLeft className="h-5 w-5 text-text-secondary group-hover/button:text-white transition-all duration-300 group-hover/button:-translate-x-0.5" />
							</motion.button>
							<motion.button
								whileHover={{ scale: 1.1 }}
								whileTap={{ scale: 0.95 }}
								onClick={handleNext}
								className="group/button flex h-12 w-12 items-center justify-center rounded-full bg-surface border border-border hover:bg-primary hover:border-primary transition-all duration-300"
							>
								<ArrowRight className="h-5 w-5 text-text-secondary group-hover/button:text-white transition-all duration-300 group-hover/button:translate-x-0.5" />
							</motion.button>
						</div>

						{/* Progress Indicators */}
						<div className="flex gap-2">
							{testimonials.map((_, index) => (
								<motion.button
									key={index}
									onClick={() => setActive(index)}
									className={`h-2 rounded-full transition-all duration-300 ${
										isActive(index)
											? "w-8 bg-primary"
											: "w-2 bg-border hover:bg-primary/50"
									}`}
									whileHover={{ scale: 1.2 }}
									whileTap={{ scale: 0.9 }}
								/>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const testimonialsImages = [
	{
		name: "Sarah Chen",
		designation: "Chief Technology Officer",
		company: "TechFlow Solutions",
		src: "https://api.dicebear.com/9.x/adventurer/svg?seed=Sarah%20Chen",
		quote: "Chain Labs transformed our customer service with their AI chatbot. Response times dropped by 80% and customer satisfaction soared. Their team understood our needs perfectly and delivered beyond expectations.",
	},
	{
		name: "Marcus Rodriguez",
		designation: "Operations Director",
		company: "RetailPro Industries",
		src: "https://api.dicebear.com/9.x/adventurer/svg?seed=Marcus%20Rodriguez",
		quote: "Their predictive analytics solution helped us forecast demand 3x more accurately. Game-changing for our supply chain. The ROI was immediate and the implementation was seamless.",
	},
	{
		name: "Jennifer Kim",
		designation: "VP of Marketing",
		company: "GrowthCorp Digital",
		src: "https://api.dicebear.com/9.x/adventurer/svg?seed=Jennifer%20Kim",
		quote: "The personalization engine they built increased our conversion rates by 250%. ROI was immediate and substantial. Chain Labs doesn't just build solutions, they build partnerships.",
	},
	{
		name: "David Park",
		designation: "Chief Executive Officer",
		company: "InnovateTech Ventures",
		src: "https://api.dicebear.com/9.x/adventurer/svg?seed=David%20Park",
		quote: "Chain Labs doesn't just deliver AI solutions - they deliver business transformation. Their expertise in blockchain integration set us apart from competitors. Highly recommended.",
	},
];

const ScrollingCarouselTestimonials = () => {
	const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

	useEffect(() => {
		// In real scenario, fetch testimonials from an API
		let testimonialsData: Testimonial[] = [];

		async function importAll() {
			const testimonialsFetchData: {
				quote: string;
				name: string;
				designation: string;
				src: string;
				url: string;
			}[] = await fetch(
				"https://testimonial-microservice-production.up.railway.app/api/get-testimonials/"
			).then((res) => res.json());
			testimonialsData = testimonialsFetchData.map((t, index) => ({
				quote: t.quote,
				name: t.name,
				designation: t.designation,
				src: testimonialsImages[index % testimonialsImages.length].src,
				company: t.url,
			}));
			setTestimonials(testimonialsData);
		}

		importAll();
	}, []);
	return (
		<section
			className="relative py-16 sm:py-24 lg:py-32 w-full max-w-7xl min-h-fit flex flex-col justify-center items-center"
			id="testimonials"
		>
			<div className="container flex flex-col items-center gap-8 mb-8">
				<motion.div
					initial={{ opacity: 0, y: 22 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="text-center max-w-3xl"
				>
					<p className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1 text-xs font-medium tracking-wider text-primary ring-1 ring-primary/25">
						<span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
						Testimonials
					</p>
					<h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
						What{" "}
						<span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
							Leaders Are Saying
						</span>
					</h2>
					<p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
						Strategic, measurable outcomes—directly from the teams
						we partner with to turn AI ambition into operating
						advantages.
					</p>
				</motion.div>
			</div>

			{testimonials.length > 0 && (
				<AnimatedTestimonials
					testimonials={testimonials}
					autoplay={true}
				/>
			)}
		</section>
	);
};

export { ScrollingCarouselTestimonials };
