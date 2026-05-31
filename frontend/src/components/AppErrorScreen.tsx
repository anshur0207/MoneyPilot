import React from "react"
import { AlertTriangle, WifiOff, RefreshCw, ShieldAlert } from "lucide-react"

interface AppErrorScreenProps {
  type?: "loading" | "network" | "server" | "error"
  onRetry?: () => void
}

const AppErrorScreen: React.FC<AppErrorScreenProps> = ({
  type = "loading",
  onRetry,
}) => {
  const getContent = () => {
    switch (type) {
      case "loading":
        return {
          title: "Please Hold On",
          description:
            "We're preparing your financial workspace. This may take a few seconds.",
          icon: <RefreshCw className="w-14 h-14 text-white animate-spin" />,
          gradient: "from-purple-500 to-blue-500",
          showRetry: false,
        }

      case "network":
        return {
          title: "No Internet Connection",
          description:
            "Your network appears to be offline. Please check your internet connection and try again.",
          icon: <WifiOff className="w-14 h-14 text-white" />,
          gradient: "from-orange-500 to-red-500",
          showRetry: true,
        }

      case "server":
        return {
          title: "Something Went Wrong",
          description:
            "Our servers are temporarily unavailable. Please try again in a few moments.",
          icon: <ShieldAlert className="w-14 h-14 text-white" />,
          gradient: "from-red-500 to-pink-500",
          showRetry: true,
        }

      case "error":
        return {
          title: "Unexpected Error",
          description:
            "An unexpected issue occurred while loading your data. Please try again.",
          icon: <AlertTriangle className="w-14 h-14 text-white" />,
          gradient: "from-yellow-500 to-orange-500",
          showRetry: true,
        }

      default:
        return {
          title: "Loading",
          description: "Please wait...",
          icon: <RefreshCw className="w-14 h-14 text-white animate-spin" />,
          gradient: "from-purple-500 to-blue-500",
          showRetry: false,
        }
    }
  }

  const content = getContent()

  return (
    <div className="min-h-screen bg-[#050816] flex items-center justify-center px-6 overflow-hidden">
      {/* BACKGROUND GLOW */}
      <div
        className={`absolute w-[450px] h-[450px] bg-gradient-to-r ${content.gradient} opacity-20 blur-[150px] rounded-full`}
      ></div>

      {/* MAIN CARD */}
      <div className="relative z-10 w-full max-w-md bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[36px] p-10 text-center shadow-2xl">
        {/* ICON */}
        <div
          className={`w-28 h-28 mx-auto rounded-full bg-gradient-to-r ${content.gradient} flex items-center justify-center shadow-2xl`}
        >
          {content.icon}
        </div>

        {/* TITLE */}
        <h1 className="text-white text-3xl font-bold mt-8">
          {content.title}
        </h1>

        {/* DESCRIPTION */}
        <p className="text-gray-400 text-lg leading-8 mt-5">
          {content.description}
        </p>

        {/* PROGRESS BAR */}
        {type === "loading" && (
          <div className="mt-10">
            <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${content.gradient} animate-pulse`}
                style={{ width: "70%" }}
              ></div>
            </div>

            <p className="text-sm text-gray-500 mt-4">
              Loading your workspace...
            </p>
          </div>
        )}

        {/* RETRY BUTTON */}
        {content.showRetry && (
          <button
            onClick={onRetry}
            className={`mt-10 w-full py-4 rounded-2xl font-semibold text-white bg-gradient-to-r ${content.gradient} hover:scale-[1.02] transition duration-300`}
          >
            Retry Again
          </button>
        )}

        {/* FOOTER */}
        <div className="mt-10 flex items-center justify-center gap-2 text-gray-500 text-sm">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
          <span>MoneyPilot Secure Environment</span>
        </div>
      </div>
    </div>
  )
}

export default AppErrorScreen
