export interface TimerWithProgressProps {
  progress: number;
  max: number;
  color: string;
}

export default function TimerWithProgress({
  children,
  progress,
  max = 1500,
  color = "#f1f1f1",
}: React.PropsWithChildren<TimerWithProgressProps>) {
  const progressPercentage = (progress / max) * 100;

  // Calculate the circumference of the circle
  const radius = 46;
  const circumference = 2 * Math.PI * radius;

  // Calculate the stroke-dashoffset based on progress
  const fillOffset = circumference - (progressPercentage / 100) * circumference;

  return (
    <div className="relative w-full h-full flex justify-center items-center align-center">
      <svg
        className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[90%] h-[90%]"
        viewBox="0 0 100 100"
        style={{
          opacity: progress >= max ? 0.75 : 1,
          transition: "opacity 0.5s ease-in-out",
        }}
      >
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
          stroke={color} // Use a color that stands out - this can be customized
          strokeWidth="5"
          fill="none"
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={fillOffset}
          // Add transition for smooth animation
          style={{ transition: "stroke-dashoffset 0.5s ease-in-out" }}
        />
      </svg>
      <div className="flex justify-center items-center align-center w-full h-full">
        {children}
      </div>
    </div>
  );
}
