'use client'

import { useParamStore } from "@/hooks/useParamStore";
import { Button } from "flowbite-react";
import Heading from "./Heading";
import { signIn } from "@/auth";

type Props = {
    title?: string;
    subtitle?: string;
    showReset?: boolean;
    showLogin?: boolean;
    callbackUrl?: string
}

export default function EmptyFilter({
    title = 'No matches for this filter', 
    subtitle = 'Try changing the filter or search term', 
    showReset,
    showLogin
}: Props) {
    const reset = useParamStore(state => state.reset);
    return (
        <div className="flex flex-col gap-2 items-center justify-center h-[40vh] shadow-lg">
            <Heading title={title} subtitle={subtitle} center />
                {
                    showReset && (
                        <Button outline onClick={reset}>
                            Remove filters
                        </Button>
                    )
                }
                {
                    showLogin && (
                        <Button outline onClick={() => signIn('id-server', {callbackUrl: '/'})}>
                            Login
                        </Button>
                    )
                }
        </div>
    )
}
