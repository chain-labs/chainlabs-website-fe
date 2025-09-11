"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { ArrowLeft, Home } from "lucide-react";

import MetallicPaint, { parseLogoImage } from "@/components/ui/metalic-paint";
import { Button } from "@/components/ui/button";
import logo from "../../public/assets/logo.svg";

const NotFound = () => {
	const router = useRouter();
	const [imageData, setImageData] = useState<ImageData | null>(null);

	useEffect(() => {
		async function loadDefaultImage() {
			try {
				const response = await fetch(logo as unknown as string);
				const blob = await response.blob();
				const file = new File([blob], "default.png", {
					type: blob.type,
				});

				const parsedData = await parseLogoImage(file);
				setImageData(parsedData?.imageData ?? null);
			} catch (err) {
				console.error("Error loading default image:", err);
				setImageData(null);
			}
		}
		loadDefaultImage();
	}, []);

	return (
		<Suspense>
			<div className="relative min-h-[100dvh] overflow-hidden">
				{/* Metallic background */}
				<div
					aria-hidden
					className="pointer-events-none absolute inset-0 -z-10"
				>
					<div className="absolute inset-0">
						<MetallicPaint
							imageData={imageData ?? new ImageData(1, 1)}
							params={{
								edge: 2,
								patternBlur: 0.005,
								patternScale: 2,
								refraction: 0.015,
								speed: 0.3,
								liquid: 0.07,
							}}
						/>
					</div>
					{/* Soft gradient overlays */}
					<div
						className="absolute inset-0"
						style={{
							background:
								"radial-gradient(800px circle at 10% 10%, color-mix(in oklab, var(--color-primary, #7c3aed) 10%, transparent), transparent 40%), radial-gradient(800px circle at 90% 90%, color-mix(in oklab, var(--color-primary, #7c3aed) 10%, transparent), transparent 40%)",
						}}
					/>
					<div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,.35))]" />
				</div>

				{/* Content */}
				<div className="container max-w-6xl mx-auto px-4">
					<div className="flex min-h-[100dvh] flex-col items-center justify-center text-center gap-8 py-16">
						<motion.div
							initial={{ opacity: 0, y: 16 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, ease: "easeOut" }}
							className="space-y-5"
						>
							<motion.div
								initial={{ opacity: 0, scale: 0.98 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{
									duration: 0.6,
									ease: "easeOut",
									delay: 0.05,
								}}
								className="inline-flex items-center rounded-full border border-border/50 bg-card/40 px-3 py-1 text-xs text-muted-foreground backdrop-blur"
							>
								Page not found
							</motion.div>

							<motion.h1
								initial={{ opacity: 0, y: 8 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{
									duration: 0.6,
									ease: "easeOut",
									delay: 0.1,
								}}
								className="text-6xl md:text-7xl font-extrabold tracking-tight text-foreground"
							>
								404
							</motion.h1>

							<motion.p
								initial={{ opacity: 0, y: 8 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{
									duration: 0.6,
									ease: "easeOut",
									delay: 0.15,
								}}
								className="max-w-xl mx-auto text-base md:text-lg text-muted-foreground"
							>
								The page you’re looking for doesn’t exist or has
								been moved.
							</motion.p>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: 8 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{
								duration: 0.6,
								ease: "easeOut",
								delay: 0.2,
							}}
							className="flex flex-col sm:flex-row items-center gap-3"
						>
							<Link href="/">
								<Button className="inline-flex items-center gap-2">
									<Home className="h-4 w-4" />
									Go Home
								</Button>
							</Link>
							<Button
								variant="secondary"
								onClick={() => router.back()}
								className="inline-flex items-center gap-2"
							>
								<ArrowLeft className="h-4 w-4" />
								Go Back
							</Button>
						</motion.div>

						{/* Helpful links (optional, hide on very small screens) */}
						<motion.div
							initial={{ opacity: 0, y: 8 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{
								duration: 0.6,
								ease: "easeOut",
								delay: 0.25,
							}}
							className="hidden sm:flex items-center gap-4 text-sm text-muted-foreground"
						>
							<span>Or explore:</span>
							<div className="flex items-center gap-3">
								<a
									href="/#services"
									className="hover:text-foreground transition-colors"
								>
									Services
								</a>
								<span aria-hidden>•</span>
								<a
									href="/#case-studies"
									className="hover:text-foreground transition-colors"
								>
									Case Studies
								</a>
								<span aria-hidden>•</span>
								<a
									href="/#contact"
									className="hover:text-foreground transition-colors"
								>
									Contact
								</a>
							</div>
						</motion.div>
					</div>
				</div>
			</div>
		</Suspense>
	);
};

export default NotFound;
