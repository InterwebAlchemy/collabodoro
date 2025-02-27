export interface TimerWithProgressProps {
  progress: number;
  max: number;
  color: string;
  id: string;
}

export default function TimerWithProgress({
  children,
  progress,
  max = 1500,
  color = "#f1f1f1",
  id,
}: React.PropsWithChildren<TimerWithProgressProps>) {
  const progressPercentage = (progress / max) * 100;

  // Calculate the circumference of the circle
  const radius = 50;
  const circumference = 2 * Math.PI * radius;

  // Calculate the stroke-dashoffset based on progress
  const fillOffset = circumference - (progressPercentage / 100) * circumference;

  // Calculate rotation angle for the gradient based on progress
  const rotationAngle = 90 + (progressPercentage / 100) * 360;

  // Custom class name for this specific instance
  const customClass = `progress-svg-${id}`;

  return (
    <div className="relative w-full h-full flex justify-center items-center align-center">
      {/* Define a style block for this specific gradient instance */}
      <style>
        {`
          .${customClass} {
            --rotation-angle: ${rotationAngle}deg;
          }
        `}
      </style>
      <svg
        className={`absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[90%] h-[90%] ${customClass}`}
        viewBox="0 0 100 100"
        style={{
          opacity: progress >= max ? 0.5 : 1,
          transition: "opacity 0.5s ease-in-out",
        }}
      >
        {/* Define the gradient */}
        <defs>
          <linearGradient
            id={`progressGradient-${id}`}
            gradientUnits="userSpaceOnUse"
            style={{
              // Use CSS custom property for transform
              transform: "rotate(var(--rotation-angle))",
              transformOrigin: "50% 50%",
              transition: "transform 0.3s ease-in-out",
            }}
          >
            <stop offset="0%" stopColor={color} stopOpacity="1" />
            <stop offset="25%" stopColor={color} stopOpacity="0.8" />
            <stop offset="50%" stopColor={color} stopOpacity="0.6" />
            <stop offset="75%" stopColor={color} stopOpacity="0.4" />
            <stop offset="100%" stopColor={color} stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Background circle */}
        <path
          d="M 50 4 a 46 46 0 0 1 0 92 46 46 0 0 1 0 -92"
          stroke="#666"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Progress circle */}
        <path
          d="M 50 4 a 46 46 0 0 1 0 92 46 46 0 0 1 0 -92"
          stroke={`url(#progressGradient-${id})`} // Use the gradient instead of solid color
          strokeWidth="5"
          fill="none"
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={fillOffset}
          // Add transition for smooth animation
          style={{
            transition: "stroke-dashoffset 0.5s ease-in-out",
          }}
        />
      </svg>
      <div className="flex justify-center items-center align-center w-full h-full">
        {children}
      </div>
    </div>
  );
}
