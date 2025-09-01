"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { ArrowLeft, Home, RotateCw } from "lucide-react";

import MetallicPaint, { parseLogoImage } from "@/components/ui/metalic-paint";
import { Button } from "@/components/ui/button";
import logo from "../../public/assets/logo.svg";

export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	const router = useRouter();
	const [imageData, setImageData] = useState<ImageData | null>(null);
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		async function loadDefaultImage() {
			try {
				const response = await fetch(logo as unknown as string);
				const blob = await response.blob();
				const file = new File([blob], "default.png", {
					type: blob.type,
				});
				const parsed = await parseLogoImage(file);
				setImageData(parsed?.imageData ?? null);
			} catch {
				setImageData(null);
			}
		}
		loadDefaultImage();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const copyDetails = async () => {
		const details = [
			`Message: ${error?.message ?? "Unknown error"}`,
			error?.digest ? `Digest: ${error.digest}` : "",
			error?.stack ? `Stack:\n${error.stack}` : "",
			`UserAgent: ${navigator.userAgent}`,
		]
			.filter(Boolean)
			.join("\n\n");
		try {
			await navigator.clipboard.writeText(details);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch {
			// ignore
		}
	};

	return (
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
							Something went wrong
						</motion.div>

						<motion.h1
							initial={{ opacity: 0, y: 8 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{
								duration: 0.6,
								ease: "easeOut",
								delay: 0.1,
							}}
							className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground"
						>
							We hit an unexpected error
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
							Try again, go back, or return home. If the problem
							persists, share the error details with support.
						</motion.p>

						{error?.digest && (
							<div className="text-xs text-muted-foreground">
								Error ID:{" "}
								<span className="font-mono">
									{error.digest}
								</span>
							</div>
						)}
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
						<Button
							onClick={reset}
							className="inline-flex items-center gap-2"
						>
							<RotateCw className="h-4 w-4" />
							Try Again
						</Button>
						<Button
							variant="secondary"
							onClick={() => router.back()}
							className="inline-flex items-center gap-2"
						>
							<ArrowLeft className="h-4 w-4" />
							Go Back
						</Button>
						<Link href="/">
							<Button
								variant="ghost"
								className="inline-flex items-center gap-2"
							>
								<Home className="h-4 w-4" />
								Home
							</Button>
						</Link>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 8 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{
							duration: 0.6,
							ease: "easeOut",
							delay: 0.25,
						}}
						className="flex flex-col items-center gap-2"
					>
						<Button
							size="sm"
							variant="outline"
							onClick={copyDetails}
						>
							{copied ? "Copied!" : "Copy Error Details"}
						</Button>

						<details className="mt-2 max-w-3xl text-left">
							<summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
								Error details (dev)
							</summary>
							<pre className="mt-2 text-xs bg-muted p-3 rounded overflow-auto">
								{error?.message}
								{error?.stack && (
									<div className="mt-2 text-muted-foreground whitespace-pre-wrap">
										{error.stack}
									</div>
								)}
							</pre>
						</details>
					</motion.div>
				</div>
			</div>
		</div>
	);
}
