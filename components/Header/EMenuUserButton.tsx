"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { usePathname } from "next/navigation";

const EMenuUserButton = () => {
    const { isSignedIn, user, isLoaded } = useUser();
    const path = usePathname();

    return isSignedIn ? (
        <div className="flex items-center">
            <span className="mr-3 userButton" style={{ height: 40 }}>
                <UserButton />
            </span>
            {path !== "/dashboard" && (
                <Link href={"/dashboard"}>
                    <Button>
                        Dashboard <ArrowUpRight />
                    </Button>
                </Link>
            )}
        </div>
    ) : (
        <Link href={"/sign-in"}>
            <Button>Login</Button>
        </Link>
    );
};

export default EMenuUserButton;
