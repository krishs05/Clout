import React from "react"
import { ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"

export const InteractiveHoverButton = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ children, className, ...props }, ref) => {
    return (
        <button
            ref={ref}
            className={cn(
                "group bg-background relative w-full sm:w-auto cursor-pointer overflow-hidden rounded-full border border-white/10 p-2 px-6 text-center font-semibold text-white",
                className
            )}
            {...props}
        >
            <div className="flex items-center justify-center gap-2">
                <div className="bg-indigo-500 h-2 w-2 rounded-full transition-all duration-300 group-hover:scale-[100.8]"></div>
                <span className="inline-block transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">
                    {children}
                </span>
            </div>
            <div className="text-white absolute top-0 z-10 flex h-full w-full translate-x-12 items-center justify-center gap-2 opacity-0 transition-all duration-300 group-hover:-translate-x-5 group-hover:opacity-100">
                <span>{children}</span>
                <ArrowRight className="w-4 h-4" />
            </div>
        </button>
    )
})
InteractiveHoverButton.displayName = "InteractiveHoverButton"
