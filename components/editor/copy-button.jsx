"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"

// Enhance the copy button with better styling
export function CopyButton({ value }) {
  const [hasCopied, setHasCopied] = useState(false)

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(value)
    setHasCopied(true)

    setTimeout(() => {
      setHasCopied(false)
    }, 2000)
  }

  return (
    <Button
      size="sm"
      variant={hasCopied ? "success" : "outline"}
      className={`relative h-8 px-3 ${hasCopied ? "bg-green-500/10 text-green-500 hover:bg-green-500/20 hover:text-green-600" : "hover:bg-accent hover:text-foreground/80"}`}
      onClick={copyToClipboard}
      disabled={hasCopied}
    >
      {hasCopied ? (
        <div className="flex items-center">
          <Check className="h-4 w-4 mr-1" />
          <span className="text-xs">Copied!</span>
        </div>
      ) : (
        <div className="flex items-center">
          <Copy className="h-4 w-4 mr-1" />
          <span className="text-xs">Copy HTML</span>
        </div>
      )}
    </Button>
  )
}

