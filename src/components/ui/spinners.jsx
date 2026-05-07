'use client'
import { BarLoader, PulseLoader, ClipLoader } from "react-spinners"


const styles = {
    display: "block",
    margin: "0 auto",
}


export const Spinner1 = () => {
    return (
        <PulseLoader
            color={'currentcolor'}
            size={10}
            loading={true}
            cssOverride={styles}
            aria-label="Loading Spinner1"
            data-testid="loader-1"
        />
    );
}


export const Spinner2 = () => {
    return (
        <BarLoader
            color={'currentcolor'}
            width={60}
            height={10}
            loading={true}
            cssOverride={styles}
            aria-label="Loading Spinner2"
            data-testid="loader-2"
        />
    )
}


export const Spinner3 = () => {
    return (
        <ClipLoader
            color={'currentcolor'}
            size={20}
            loading={true}
            aria-label="Loading Spinner3"
            data-testid="loader-3"
        />
    )
}
