import { useConfig } from "../contexts/ConfigContext";

export interface TimerWithProgressProps {
  progress: number;
  max: number;
  id: string;
  isLoading?: boolean;
  isWaiting?: boolean;
}

export default function TimerWithProgress({
  children,
  progress,
  max = 1500,
  id,
  isLoading = false,
  isWaiting = false,
}: React.PropsWithChildren<TimerWithProgressProps>) {
  const { direction } = useConfig();

  // For countDown mode, invert the progress calculation
  const displayProgress = direction === "countUp" ? progress : max - progress;

  const progressPercentage = (displayProgress / max) * 100;

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
          
          @keyframes loading-spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
          
          @keyframes waiting-spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
          
          @keyframes loading-rotate {
            0% {
              transform: rotate(90deg);
            }
            100% {
              transform: rotate(450deg);
            }
          }
          
          @keyframes waiting-rotate {
            0% {
              transform: rotate(90deg);
            }
            100% {
              transform: rotate(450deg);
            }
          }
          
          .loading-gradient {
            animation: loading-rotate 3s linear infinite;
          }
          
          .waiting-gradient {
            animation: waiting-rotate 8s linear infinite;
          }
          
          .loading-circle {
            transform-origin: center;
            animation: loading-spin 1.5s linear infinite;
          }
          
          .waiting-circle {
            transform-origin: center;
            animation: waiting-spin 6s linear infinite;
          }
          
          @keyframes pulse {
            0% {
              opacity: 0.7;
            }
            50% {
              opacity: 1;
            }
            100% {
              opacity: 0.7;
            }
          }
          
          @keyframes waiting-pulse {
            0% {
              opacity: 0.6;
            }
            50% {
              opacity: 0.9;
            }
            100% {
              opacity: 0.6;
            }
          }
          
          .loading-pulse {
            animation: pulse 2s ease-in-out infinite;
          }
          
          .waiting-pulse {
            animation: waiting-pulse 4s ease-in-out infinite;
          }
        `}
      </style>
      <svg
        className={`absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[90%] h-[90%] ${customClass} ${
          isLoading ? "loading-pulse" : isWaiting ? "waiting-pulse" : ""
        }`}
        viewBox="0 0 100 100"
        style={{
          opacity: progress >= max && !isLoading && !isWaiting ? 0.5 : 1,
          transition:
            isLoading || isWaiting ? "none" : "opacity 0.5s ease-in-out",
        }}
      >
        {/* Define the gradient */}
        <defs>
          <linearGradient
            id={`progressGradient-${id}`}
            gradientUnits="userSpaceOnUse"
            className={
              isLoading
                ? "loading-gradient"
                : isWaiting
                ? "waiting-gradient"
                : ""
            }
            style={{
              transform:
                isLoading || isWaiting
                  ? "rotate(90deg)"
                  : "rotate(var(--rotation-angle))",
              transformOrigin: "50% 50%",
              transition:
                isLoading || isWaiting ? "none" : "transform 0.3s ease-in-out",
            }}
          >
            <stop
              offset="0%"
              stopOpacity="1"
              style={{
                stopColor: `var(--${id}-color)`,
              }}
            />
            <stop
              offset="25%"
              stopOpacity="0.8"
              style={{
                stopColor: `var(--${id}-color)`,
              }}
            />
            <stop
              offset="50%"
              stopOpacity="0.6"
              style={{
                stopColor: `var(--${id}-color)`,
              }}
            />
            <stop
              offset="75%"
              stopOpacity="0.4"
              style={{
                stopColor: `var(--${id}-color)`,
              }}
            />
            <stop
              offset="100%"
              stopOpacity="0.2"
              style={{
                stopColor: `var(--${id}-color)`,
              }}
            />
          </linearGradient>
        </defs>

        {/* Background circle */}
        <path
          d="M 50 4 a 46 46 0 0 1 0 92 46 46 0 0 1 0 -92"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            stroke: "var(--timer-bg-color)",
          }}
        />

        {/* Loading/waiting spinner or progress circle */}
        {isLoading ? (
          <g className="loading-circle">
            <path
              d="M 50 4 a 46 46 0 0 1 0 92 46 46 0 0 1 0 -92"
              stroke={`url(#progressGradient-${id})`}
              strokeWidth="5"
              fill="none"
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeDasharray={`${circumference * 0.25} ${
                circumference * 0.75
              }`}
              style={{
                transition: "none",
              }}
            />
          </g>
        ) : isWaiting ? (
          <g className="waiting-circle">
            <path
              d="M 50 4 a 46 46 0 0 1 0 92 46 46 0 0 1 0 -92"
              stroke={`url(#progressGradient-${id})`}
              strokeWidth="5"
              fill="none"
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeDasharray={`${circumference * 0.15} ${
                circumference * 0.85
              }`}
              style={{
                transition: "none",
              }}
            />
          </g>
        ) : (
          <path
            d="M 50 4 a 46 46 0 0 1 0 92 46 46 0 0 1 0 -92"
            stroke={`url(#progressGradient-${id})`}
            strokeWidth="5"
            fill="none"
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={fillOffset}
            style={{
              transition: "stroke-dashoffset 0.5s ease-in-out",
            }}
          />
        )}
      </svg>
      <div className="flex justify-center items-center align-center w-full h-full">
        {children}
      </div>
    </div>
  );
}
