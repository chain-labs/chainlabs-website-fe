"use client";

import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Confetti } from "@/components/ui/confetti";
import type { ConfettiRef } from "@/components/ui/confetti";
import {
	Sparkles,
	Video,
	Clock,
	Users,
	CheckCircle,
	CalendarDays,
	RefreshCw,
} from "lucide-react";
import { useGlobalStore } from "@/global-store";

import Cal, { getCalApi } from "@calcom/embed-react";
import { cn } from "@/lib/utils";
import { apiClient } from "@/api-client";

const MEETING_LINK_ID = "pratham-chudasama-bzmppi/1min";

type APIResponse = {
	status: "success" | "error";
	data: {
		title: string;
		id: number;
		uid: string;
		description: string;
		customInputs: Record<string, any>;
		smsReminderNumber: string | null;
		recurringEventId: null;
		startTime: string;
		endTime: string;
		location: string;
		status: "ACCEPTED" | "CANCELLED" | "REJECTED" | "PENDING";
		metadata: {
			videoCallUrl: string;
		};
		cancellationReason: string | null;
		cancelledBy: string | null;
		responses: {
			name: string;
			email: string;
			guests: Array<any>;
			location: {
				optionValue: string;
				value: string;
			};
		};
		rejectionReason: null;
		userPrimaryEmail: string;
		fromReschedule: null;
		rescheduled: null;
		rescheduledBy: null;
		user: {
			id: number;
			name: string;
			email: string;
			username: string;
			timeZone: string;
			avatarUrl: string;
		};
		attendees: [
			{
				name: string;
				email: string;
				timeZone: string;
				phoneNumber: string | null;
			}
		];
		eventTypeId: number;
		eventType: {
			eventName: string | null;
			slug: string;
			timeZone: string | null;
			schedulingType: string | null;
			hideOrganizerEmail: boolean;
		};
		seatsReferences: [];
		tracking: null;
	};
};

const BookCallSection = () => {
	const callUnlocked =
		useGlobalStore().personalised?.personalisation.call_unlocked;

	const callRecordDataArray =
		useGlobalStore().personalised?.personalisation.call_record;

	const callRecord = callRecordDataArray?.[callRecordDataArray.length - 1];

	const callLinkUID = callRecord?.uid;
	const hasBooking = !!callLinkUID;

	const [callLinkData, setCallLinkData] = useState<APIResponse | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [now, setNow] = useState(() => Date.now());
	const [showScheduler, setShowScheduler] = useState(false);

	const confettiRef = useRef<ConfettiRef>(null);
	const prevUnlockedRef = useRef<boolean>(callUnlocked);

	// Confetti celebration (unchanged)
	const fireCelebration = () => {
		if (!confettiRef.current) return;
		const origins = [
			{ x: 0.1, y: 0.15 },
			{ x: 0.3, y: 0.1 },
			{ x: 0.5, y: 0.08 },
			{ x: 0.7, y: 0.1 },
			{ x: 0.9, y: 0.15 },
		];
		const waves = 1;
		const interval = 220;
		for (let w = 0; w < waves; w++) {
			setTimeout(() => {
				origins.forEach((origin) => {
					confettiRef.current?.fire({
						particleCount: 120,
						spread: 85,
						startVelocity: 55,
						scalar: 0.9,
						origin,
					});
				});
			}, w * interval);
		}
		setTimeout(() => {
			confettiRef.current?.fire({
				particleCount: 320,
				spread: 360,
				startVelocity: 60,
				scalar: 1,
				origin: { x: 0.5, y: 0.25 },
			});
		}, waves * interval + 80);
	};

	useEffect(() => {
		if (!prevUnlockedRef.current && callUnlocked) fireCelebration();
		prevUnlockedRef.current = callUnlocked;
	}, [callUnlocked]);

	// Fetch booking details only if we have a UID
	useEffect(() => {
		if (!hasBooking) return;
		(async () => {
			setLoading(true);
			setError(null);
			try {
				const res = await fetch(
					`https://api.cal.com/v2/bookings/${callLinkUID}`
				);
				if (!res.ok) {
					throw new Error(`Request failed (${res.status})`);
				}
				const data: APIResponse = await res.json();
				setCallLinkData(data);
			} catch (e: any) {
				setError(e.message || "Failed to load booking");
			} finally {
				setLoading(false);
			}
		})();
	}, [hasBooking, callLinkUID]);

	// Cal embed configuration
	useEffect(() => {
		(async function () {
			const cal = await getCalApi({
				namespace: MEETING_LINK_ID.split("/")[1],
			});
			cal("ui", {
				cssVarsPerTheme: {
					light: { "cal-brand": "#5cfda2" },
					dark: { "cal-brand": "#5cfda2" },
				},
				hideEventTypeDetails: true,
				layout: "month_view",
			});
			cal("on", {
				action: "bookingSuccessful",
				callback: async (e) => {
					const { data } = e.detail;
					const { id, uid } = data.booking as {
						id: string;
						uid: string;
					};
					await apiClient.sendCallLink({ id, uid });
					setShowScheduler(false); // return to details after new booking
				},
			});
		})();
	}, []);

	// Ticker for countdown
	useEffect(() => {
		const id = setInterval(() => setNow(Date.now()), 1000);
		return () => clearInterval(id);
	}, []);

	// Safely derive fields from API response
	const booking = callLinkData?.data;
	const status = booking?.status; // "ACCEPTED" | "CANCELLED" | "REJECTED" | "PENDING"
	const startISO = booking?.startTime;
	const endISO = booking?.endTime;
	const startDate = startISO ? new Date(startISO) : null;
	const endDate = endISO ? new Date(endISO) : null;
	const durationMins =
		startDate && endDate
			? Math.max(
					1,
					Math.round(
						(endDate.getTime() - startDate.getTime()) / 60000
					)
			  )
			: null;
	const locationLabel = booking?.location || "Virtual";
	const joinUrl = booking?.metadata?.videoCallUrl || "";
	const participants = booking?.attendees?.length ?? 0;
	const bookingUID = booking?.uid;

	// New meeting phase booleans
	const meetingCancelled = status === "CANCELLED" || status === "REJECTED";
	const meetingStarted =
		!!startDate &&
		!!endDate &&
		now >= startDate.getTime() &&
		now < endDate.getTime() &&
		!meetingCancelled;
	const meetingEnded =
		!!endDate && now >= endDate.getTime() && !meetingCancelled;
	const meetingScheduled =
		!!startDate &&
		now < startDate.getTime() &&
		!meetingCancelled &&
		!meetingEnded &&
		!meetingStarted;

	// Auto-switch to scheduler if the current booking is no longer actionable
	useEffect(() => {
		if (
			(meetingCancelled || meetingEnded) &&
			hasBooking &&
			!showScheduler
		) {
			setShowScheduler(true);
		}
	}, [meetingCancelled, meetingEnded, hasBooking, showScheduler]);

	// Only show details when there is an active upcoming or in-progress meeting and not forcing scheduler
	const showBookingDetails =
		hasBooking && !showScheduler && !meetingCancelled && !meetingEnded;

	const statusColors: Record<NonNullable<typeof status>, string> = {
		ACCEPTED: "text-emerald-500 bg-emerald-500/10 ring-emerald-500/30",
		PENDING: "text-amber-500 bg-amber-500/10 ring-amber-500/30",
		CANCELLED: "text-rose-500 bg-rose-500/10 ring-rose-500/30",
		REJECTED: "text-rose-500 bg-rose-500/10 ring-rose-500/30",
	};

	const renderStatusBadge = () => {
		if (!status) return null;
		return (
			<span
				className={cn(
					"inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium ring-1",
					statusColors[status]
				)}
			>
				<span className="h-1.5 w-1.5 rounded-full bg-current" />
				{status}
			</span>
		);
	};

	// Countdown logic
	const [countdownLabel, setCountdownLabel] = useState<string | null>(null);
	useEffect(() => {
		if (
			startDate &&
			endDate &&
			status &&
			status !== "CANCELLED" &&
			status !== "REJECTED"
		) {
			const nowDate = new Date(now);
			if (nowDate < startDate) {
				const diff = startDate.getTime() - now;
				const secs = Math.max(0, Math.floor(diff / 1000));
				const d = Math.floor(secs / 86400);
				const h = Math.floor((secs % 86400) / 3600);
				const m = Math.floor((secs % 3600) / 60);
				const s = secs % 60;

				setCountdownLabel(
					d > 0
						? `${d}d ${h}h ${m}m`
						: h > 0
						? `${h}h ${m}m ${s}s`
						: m > 0
						? `${m}m ${s}s`
						: `${s}s`
				);
			} else if (nowDate >= startDate && nowDate < endDate) {
				setCountdownLabel("Live now");
			} else if (nowDate >= endDate) {
				setCountdownLabel("Completed");
			}
		}
	}, [now, startDate, endDate, status]);

	// Cancellation / rejection reason
	const cancellationInfo =
		status === "CANCELLED"
			? booking?.cancellationReason ||
			  (booking?.cancelledBy
					? `Cancelled by ${booking.cancelledBy}`
					: "Cancelled")
			: status === "REJECTED"
			? booking?.rejectionReason || "Rejected"
			: null;

	return (
		<section
			className="relative py-16 sm:py-24 lg:py-32 w-full max-w-7xl min-h-fit flex flex-col justify-center items-center"
			id="book-a-call"
		>
			<Confetti
				ref={confettiRef}
				manualstart
				className="pointer-events-none fixed inset-0 w-full h-full z-[60]"
			/>

			<div className="container max-w-7xl w-full mx-auto px-4 relative z-10">
				{!callUnlocked && (
					<div className="absolute inset-0 z-20 flex items-center justify-center">
						<div className="rounded-2xl bg-background/70 backdrop-blur-md border border-border/50 px-4 py-2 text-sm text-muted-foreground">
							Booking is locked. Complete the required steps to
							unlock.
						</div>
					</div>
				)}

				<div
					className={cn(
						!callUnlocked
							? "pointer-events-none select-none blur-sm opacity-60"
							: "",
						"w-full"
					)}
				>
					<motion.div
						initial={{ opacity: 0, y: 18 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6, ease: "easeOut" }}
						className="text-center max-w-4xl mx-auto mb-18"
					>
						<p className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1 text-xs font-medium tracking-wider text-primary ring-1 ring-primary/25">
							<span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
							Get Started
						</p>
						<motion.h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
							{hasBooking ? (
								<>
									Your{" "}
									<span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
										Session Details
									</span>
								</>
							) : (
								<>
									Book Your{" "}
									<span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
										AI Strategy Session
									</span>
								</>
							)}
						</motion.h2>
						<motion.p
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.8, delay: 0.4 }}
							className="mt-4 text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed"
						>
							{hasBooking
								? "Below is the live status of your booking."
								: "A 15‑minute diagnostic to surface quick wins, clarify feasibility, and map an actionable pilot—no sales fluff, just value."}
						</motion.p>
					</motion.div>

					{hasBooking ? (
						showBookingDetails ? (
							<motion.div
								initial={{ opacity: 0, y: 24 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.6 }}
								className="relative mx-auto w-full max-w-3xl"
							>
								<div className="rounded-2xl sm:rounded-3xl border border-border/60 bg-gradient-to-br from-surface/80 to-surface-muted/80 backdrop-blur-md p-6 sm:p-8 shadow-lg">
									<div className="flex items-start gap-4">
										<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 ring-1 ring-primary/30 text-primary">
											<CheckCircle className="h-7 w-7" />
										</div>
										<div className="flex-1">
											<h3 className="text-xl font-semibold text-foreground flex items-center gap-3">
												Strategy Call
												{renderStatusBadge()}
											</h3>
											{countdownLabel && (
												<p className="mt-2 text-xs font-medium text-primary/80">
													{countdownLabel ===
													"Live now"
														? "Live now"
														: countdownLabel ===
														  "Completed"
														? "Completed"
														: `Scheduled`}
												</p>
											)}
											{booking?.description && (
												<p className="mt-2 text-xs text-muted-foreground">
													{booking.description}
												</p>
											)}
										</div>
									</div>

									{loading && (
										<div className="mt-6 grid gap-5 sm:grid-cols-2">
											{Array.from({ length: 2 }).map(
												(_, i) => (
													<div
														key={i}
														className="space-y-3"
													>
														<div className="h-3 w-24 rounded bg-muted/40 animate-pulse" />
														<div className="h-10 rounded-lg bg-muted/30 animate-pulse" />
														<div className="h-10 rounded-lg bg-muted/30 animate-pulse" />
														<div className="h-10 rounded-lg bg-muted/30 animate-pulse" />
													</div>
												)
											)}
										</div>
									)}

									{!loading && error && (
										<div className="mt-6 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
											Failed to load booking: {error}
										</div>
									)}

									{!loading && !error && booking && (
										<>
											<div className="mt-6 grid gap-5 sm:grid-cols-2">
												<div className="space-y-3">
													<h4 className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
														Session
													</h4>
													<div className="flex items-center gap-3 rounded-lg border border-border/50 bg-background/60 p-3 text-sm">
														<Clock className="h-4 w-4 text-primary" />
														<span>
															{startDate
															? startDate.toLocaleString(
																		"en-US",
																		{
																			dateStyle: "medium",
																			timeStyle: "short",
																		}
																  )
																: "—"}
														</span>
													</div>
													<div className="flex items-center gap-3 rounded-lg border border-border/50 bg-background/60 p-3 text-sm">
														<CalendarDays className="h-4 w-4 text-primary" />
														<span>
															Duration:{" "}
															{durationMins
																? `${durationMins} min`
																: "—"}
														</span>
													</div>
													<div className="flex items-center gap-3 rounded-lg border border-border/50 bg-background/60 p-3 text-sm">
														<Video className="h-4 w-4 text-primary" />
														<span>
															Type:{" "}
															{locationLabel}
														</span>
													</div>
												</div>

												<div className="space-y-3">
													<h4 className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
														Meta
													</h4>
													<div className="flex items-center gap-3 rounded-lg border border-border/50 bg-background/60 p-3 text-sm">
														<Sparkles className="h-4 w-4 text-primary" />
														<span>
															Status:{" "}
															<span className="font-medium">
																{status}
															</span>
														</span>
													</div>
													<div className="flex items-center gap-3 rounded-lg border border-border/50 bg-background/60 p-3 text-sm">
														<Users className="h-4 w-4 text-primary" />
														<span>
															Participants:{" "}
															{participants}
														</span>
													</div>
													{cancellationInfo ? (
														<div className="flex items-start gap-3 rounded-lg border border-border/50 bg-background/60 p-3 text-xs leading-relaxed text-rose-500">
															<span className="font-medium">
																Reason:
															</span>
															<span>
																{
																	cancellationInfo
																}
															</span>
														</div>
													) : (
														<div className="flex items-center gap-3 rounded-lg border border-border/50 bg-background/60 p-3 text-sm">
															<Clock className="h-4 w-4 text-primary" />
															<span>
																{countdownLabel
																	? countdownLabel ===
																	  "Live now"
																		? "Live now"
																		: countdownLabel ===
																		  "Completed"
																		? "Completed"
																		: `Starts in ${countdownLabel}`
																	: "—"}
															</span>
														</div>
													)}
												</div>
											</div>

											{/* Actions (single location for meeting link) */}
											<div className="mt-8 flex flex-wrap gap-3">
												{status === "ACCEPTED" &&
													joinUrl &&
													startDate && (
														<a
															href={joinUrl}
															target="_blank"
															rel="noopener noreferrer"
															className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition"
														>
															<Video className="h-4 w-4" />
															Join Call
														</a>
													)}
												{meetingScheduled &&
													bookingUID && (
														<a
															href={`https://app.cal.com/reschedule/${bookingUID}`}
															target="_blank"
															rel="noopener noreferrer"
															className="inline-flex items-center justify-center gap-2 rounded-md border border-border/60 bg-background/70 px-5 py-2.5 text-sm font-medium hover:bg-accent/30 transition"
														>
															<RefreshCw className="h-4 w-4" />
															Reschedule
														</a>
													)}

												{(meetingStarted ||
													meetingEnded ||
													meetingCancelled) && (
													<a
														href={`https://cal.com/${MEETING_LINK_ID}`}
														target="_blank"
														rel="noopener noreferrer"
														className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition"
													>
														<Video className="h-4 w-4" />
														Book Another Call
													</a>
												)}
											</div>

											<p className="mt-6 text-[13px] text-muted-foreground leading-relaxed">
												{meetingCancelled
													? "This session is inactive. You may book another call."
													: meetingEnded
													? "Session completed. Book another call if you’d like a follow-up."
													: meetingStarted
													? "Session is in progress. You can schedule another call for later."
													: "Need a different time? Use the reschedule option before the session starts."}
											</p>
										</>
									)}

									{!loading &&
										!error &&
										status === "PENDING" && (
											<p className="mt-4 text-xs text-amber-500">
												Pending approval. You will
												receive a confirmation email
												once accepted.
											</p>
										)}
								</div>
							</motion.div>
						) : (
							<div className="w-full">
								<div className="mb-6 flex items-center gap-3 justify-center">
									<h3 className="text-lg font-semibold">
										Book a New Strategy Session
									</h3>
									{hasBooking &&
										!meetingCancelled &&
										!meetingEnded && (
											<button
												type="button"
												onClick={() =>
													setShowScheduler(false)
												}
												className="text-xs px-2 py-1 rounded border border-border/50 hover:bg-accent/30 transition"
											>
												Back
											</button>
										)}
								</div>
								<Cal
									namespace={MEETING_LINK_ID.split("/")[1]}
									calLink={MEETING_LINK_ID}
									style={{ width: "100%", height: "100%" }}
									config={{
										layout: "month_view",
										theme: "auto",
									}}
								/>
								{meetingCancelled && (
									<p className="mt-4 text-xs text-muted-foreground text-center">
										Previous session was cancelled. This
										will create a new booking.
									</p>
								)}
								{meetingEnded && (
									<p className="mt-4 text-xs text-muted-foreground text-center">
										Previous session ended. Book a follow-up
										below.
									</p>
								)}
							</div>
						)
					) : (
						<Cal
							namespace={MEETING_LINK_ID.split("/")[1]}
							calLink={MEETING_LINK_ID}
							style={{ width: "100%", height: "100%" }}
							config={{ layout: "month_view", theme: "auto" }}
						/>
					)}
				</div>
			</div>
		</section>
	);
};

export { BookCallSection };
