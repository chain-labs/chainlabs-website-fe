"use client";

import { motion } from "motion/react";
import { X, Calendar } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function AnnouncementBanner() {
	const MEETING_LINK = process.env.NEXT_PUBLIC_MEETING_LINK || "#book-a-call";
	const [isVisible, setIsVisible] = useState(true);

	if (!isVisible) return null;

	return (
		<motion.div
			initial={{ opacity: 0, y: -50 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -50 }}
			transition={{ duration: 0.3 }}
			className="relative bg-gradient-to-r from-primary/90 via-primary to-primary/90 text-primary-foreground"
		>
			<div className="container mx-auto px-4 py-3">
				<div className="flex items-center justify-between gap-4">
					<div className="flex-1 text-center">
						<p className="text-sm font-medium">
							🚧 This site is work in progress, if needed{" "}
							<Link
								href={MEETING_LINK}
								className="font-semibold underline underline-offset-2 hover:text-primary-foreground/90 transition-colors"
							>
								get in touch with us by booking a call here
							</Link>
						</p>
					</div>
					<button
						onClick={() => setIsVisible(false)}
						className="flex-shrink-0 p-1 hover:bg-white/20 rounded transition-colors"
						aria-label="Close announcement"
					>
						<X className="w-4 h-4" />
					</button>
				</div>
			</div>
		</motion.div>
	);
}
