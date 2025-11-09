// Mint Noir — Simple, Modern, Sleek Loader
// Palette: MINT #5cfda2  |  NOIR #101419
// Stack: React + framer-motion + (optionally) Tailwind

import React from "react";
import { motion, MotionConfig, useReducedMotion } from "motion/react";

const MINT = "#5cfda2";
const NOIR = "#101419";

const AnimatedLogo = ({ exitAnimationing }: { exitAnimationing: boolean }) => {
  return (
    <motion.svg
      width="128"
      height="128"
      viewBox="0 0 42 43"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-[0_8px_24px_rgba(56,189,248,0.25)]"
    >
      {/* Fill pop-in + exitAnimation pop-out */}
      <motion.path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M41.99 21.513c0 11.348-9.396 20.548-20.988 20.548C9.41 42.06.013 32.86.013 21.513.013 10.165 9.41.966 21.002.966s20.989 9.2 20.989 20.547zm-31.435 8.434c.953.267 1.94.398 2.93.39 1.54.066 3.076-.192 4.505-.757 2.453-1.066 3.485-3.083 3.833-5.55.035-.256-.11-.232-.235-.21-.033.005-.064.01-.09.01h-3.801c-.32-.004-.433.085-.514.394-.447 1.694-1.547 2.428-3.35 2.212a1.538 1.538 0 01-1.104-.471 1.478 1.478 0 01-.402-1.113c-.004-.21.008-.42.036-.628l.197-1.172c.272-1.622.54-3.225.853-4.834.348-1.76 1.497-2.591 3.301-2.459a7.086 7.086 0 002.813-.385 6.986 6.986 0 002.422-1.455c.23-.194.19-.309 0-.495a4.601 4.601 0 00-1.669-1.061 10.79 10.79 0 00-4.923-.38c-3.305.362-5.564 2.255-6.313 5.421-.278 1.177-.488 2.378-.697 3.57-.107.605-.212 1.208-.326 1.804a13.922 13.922 0 00-.365 3.512c.121 1.888 1.064 3.087 2.899 3.657zM24.41 19.249c-1.497 1.41-3.363 1.65-5.266 1.809-.16.013-.32.02-.48.026-.162.007-.322.014-.48.027-.316.027-.424 0-.357-.363.23-1.185.451-2.379.64-3.573.043-.254.185-.258.362-.262l.09-.003a6.645 6.645 0 003.778-1.248 5.876 5.876 0 002.083-2.985.436.436 0 01.185-.307.455.455 0 01.356-.073h4.4c.38 0 .416.11.357.442a7348.037 7348.037 0 00-3.062 17.124c-.058.328-.17.412-.496.407h-3.755c-.348 0-.451-.057-.366-.442.55-2.822 1.086-5.65 1.62-8.476l.355-1.873c.014-.049.023-.12.036-.23zm4.617 11.008h2.286c.767 0 1.53 0 2.314.008.351 0 .468-.119.518-.442a149.3 149.3 0 01.645-3.799c.054-.314-.068-.34-.33-.34h-4.626c-.324 0-.405.115-.45.376-.096.515-.186 1.03-.277 1.546-.13.749-.262 1.497-.409 2.244-.063.318-.018.407.33.407z"
        fill="var(--color-primary)"
        initial={{ scale: 0.8, rotate: -8, opacity: 0 }}
        animate={
          exitAnimationing
            ? "exitAnimation"
            : { scale: [0.8, 1.04, 1], rotate: [-8, 0], opacity: 1 }
        }
        variants={{
          exitAnimation: {
            y: -12,
            rotate: 8,
            scale: 0.86,
            opacity: 0,
            transition: {
              duration: 0.35,
              ease: [0.22, 1, 0.36, 1],
            },
          },
        }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      />
    </motion.svg>
  );
};

export default function InitialLoadingScreen({
  handleComplete,
}: {
  handleComplete: () => void;
}) {
  const reduce = useReducedMotion();
  const [exitAnimationing, setExitAnimationing] = React.useState(false);

  // Auto-dismiss after a short delay. Replace with your own trigger if needed.
  React.useEffect(() => {
    const t = setTimeout(() => setExitAnimationing(true), 1800);
    return () => clearTimeout(t);
  }, []);

  return (
    <MotionConfig
      reducedMotion="user"
      transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
    >
      <motion.div
        className="relative grid h-dvh w-screen place-items-centerAnimation text-white"
        style={{ backgroundColor: NOIR }}
        initial={{
          opacity: 1,
          filter: "blur(0px)",
          clipPath: "inset(0% 0% 0% 0% round 0px)",
          transition: {
            when: "beforeChildren",
            staggerChildren: 0.06,
          },
        }}
        animate={
          exitAnimationing
            ? {
                opacity: 0,
                filter: "blur(10px)",
                clipPath: "inset(50% 50% 50% 50% round 24px)",
                transition: {
                  when: "afterChildren",
                  duration: 0.7,
                  ease: [0.22, 1, 0.36, 1],
                },
              }
            : {
                opacity: 1,
                filter: "blur(0px)",
                clipPath: "inset(0% 0% 0% 0% round 0px)",
                transition: {
                  when: "afterChildren",
                  staggerChildren: 0.06,
                },
              }
        }
        custom={reduce}
        onAnimationComplete={() => {
          if (exitAnimationing) handleComplete();
        }}
      >
        {/* Soft mint vignette (very subtle) */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(40% 40% at 50% 45%, rgba(92,253,162,0.10), transparent 65%)`,
          }}
          initial={{
            opacity: 1,
            filter: "blur(0px)",
            clipPath: "inset(0% 0% 0% 0% round 0px)",
            transition: {
              when: "beforeChildren",
              staggerChildren: 0.06,
            },
          }}
          animate={
            exitAnimationing
              ? {
                  opacity: 1,
                  filter: "blur(0px)",
                  clipPath: "inset(0% 0% 0% 0% round 0px)",
                  transition: {
                    when: "afterChildren",
                    staggerChildren: 0.06,
                  },
                }
              : {
                  opacity: 1,
                  filter: "blur(0px)",
                  clipPath: "inset(0% 0% 0% 0% round 0px)",
                  transition: {
                    when: "beforeChildren",
                    staggerChildren: 0.06,
                  },
                }
          }
          custom={reduce}
        />

        {/* Mint ring burst on exitAnimation */}
        {exitAnimationing && !reduce && (
          <div className="pointer-events-none absolute inset-0 grid place-items-centerAnimation z-10">
            <motion.div
              className="h-40 w-40 rounded-full"
              style={{
                borderColor: MINT,
                borderWidth: 2,
                boxShadow: `0 0 40px ${MINT}55, inset 0 0 20px ${MINT}22`,
              }}
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{
                scale: [0.3, 1.05, 1.35],
                opacity: [0, 0.9, 0],
              }}
              transition={{
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1],
              }}
            />
          </div>
        )}

        {/* CenterAnimation card */}
        <motion.div
          className="relative z-20 flex flex-col items-centerAnimation gap-4 rounded-xl border border-white/10 bg-white/5 px-8 py-10 backdrop-blur-md shadow-2xl"
          initial={{
            y: 0,
            scale: 1,
            opacity: 1,
            rotateX: 0,
            transition: {
              type: "spring",
              stiffness: 160,
              damping: 18,
              mass: 0.7,
            },
          }}
          animate={
            exitAnimationing
              ? {
                  y: -40,
                  scale: 0.92,
                  rotateX: 12,
                  opacity: 0,
                  filter: "blur(6px)",
                  transition: {
                    duration: 0.55,
                    ease: [0.22, 1, 0.36, 1],
                  },
                }
              : {
                  y: 0,
                  scale: 1,
                  opacity: 1,
                  rotateX: 0,
                  transition: {
                    type: "spring",
                    stiffness: 160,
                    damping: 18,
                    mass: 0.7,
                  },
                }
          }
          custom={reduce}
        >
          <AnimatedLogo exitAnimationing={exitAnimationing} />

          <motion.div
            className="text-centerAnimation"
            initial={{ opacity: 1, y: 0 }}
            animate={
              exitAnimationing
                ? {
                    opacity: 0,
                    y: -12,
                    transition: {
                      duration: 0.35,
                      ease: "easeInOut",
                    },
                  }
                : { opacity: 0, y: 20 }
            }
            custom={reduce}
          >
            <div className="text-[10px] uppercase tracking-[0.3em] text-white/60">
              Preparing
            </div>
            <div className="mt-1 text-xl font-medium" style={{ color: MINT }}>
              ChainLabs
            </div>
          </motion.div>

          {/* Minimal progress shimmer */}
          <div className="mt-2 h-1 w-56 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full w-1/3 rounded-full"
              style={{
                background: `linear-gradient(90deg, transparent, ${MINT}, transparent)`,
              }}
              animate={
                reduce || exitAnimationing
                  ? { opacity: 0.9 }
                  : { x: ["-120%", "220%"] }
              }
              transition={{
                duration: reduce || exitAnimationing ? 0.25 : 1.6,
                repeat: reduce || exitAnimationing ? 0 : Infinity,
                ease: "easeInOut",
              }}
            />
          </div>

          <motion.div
            className="text-xs text-white/55"
            initial={{ opacity: 1, y: 0 }}
            custom={reduce}
            animate={
              reduce || exitAnimationing
                ? { opacity: 0.7 }
                : { opacity: [0.45, 1, 0.45] }
            }
            transition={{
              duration: reduce || exitAnimationing ? 0.25 : 3,
              repeat: reduce || exitAnimationing ? 0 : Infinity,
            }}
          >
            Loading experiences…
          </motion.div>
        </motion.div>
      </motion.div>
    </MotionConfig>
  );
}
