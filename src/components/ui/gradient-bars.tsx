'use client';

interface GradientBarsProps {
    bars?: number;
}

export const GradientBars = ({
    bars = 20,


}: GradientBarsProps) => {
    return (
        <div className="absolute inset-0 z-0 overflow-hidden">
            <div className="flex h-full w-full">
                {Array.from({ length: bars }).map((_, index) => {
                    // Calculate scale for each bar (optional, for visual effect)
                    const position = index / (bars - 1);
                    const center = 0.5;
                    const distance = Math.abs(position - center);
                    const scale = 0.3 + 0.7 * Math.pow(distance * 2, 1.2);

                    return (
                        <div
                            key={`bg-bar-${index}`}
                            className="flex-1 origin-bottom bg-gradient-to-t from-primary/10 to-transparent transition-transform duration-1000"
                            style={{
                                transform: `scaleY(${scale})`,
                                opacity: 1 - distance * 0.1,
                            }}
                        />
                    );
                })}
            </div>
        </div>
    );
};
