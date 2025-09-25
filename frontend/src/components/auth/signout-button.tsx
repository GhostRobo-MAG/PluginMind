"use client"

import * as React from "react"
import { signOut } from "next-auth/react"

import { DEFAULT_SIGNOUT_REDIRECT } from "@/config/defaults"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

type ButtonProps = React.ComponentPropsWithoutRef<typeof Button>

export const SignOutButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, onClick, children, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        type="button"
        aria-label="Sign Out"
        variant="ghost"
        className={cn("w-full justify-start text-sm", className)}
        onClick={(e) => {
          onClick?.(e)
          void signOut({
            callbackUrl: DEFAULT_SIGNOUT_REDIRECT,
            redirect: true,
          })
        }}
        {...props}
      >
        <Icons.logout className="mr-2 size-4" aria-hidden="true" />
        {children ?? "Sign out"}
      </Button>
    )
  }
)

SignOutButton.displayName = "SignOutButton"
