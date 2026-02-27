import Image from "next/image";

export function VisaIcon({ className }: { className?: string }) {
    return <Image src="/images/visa.svg" alt="Visa" className={className} width={50} height={30} />
}

export function MastercardIcon({ className }: { className?: string }) {
    return <Image src="/images/mastercard.svg" alt="Mastercard" className={className} width={50} height={30} />
}

export function CbIcon({ className }: { className?: string }) {
    return <Image src="/images/cb.svg" alt="CB" className={className} width={50} height={30} />
}

export function PayPalIcon({ className }: { className?: string }) {
    return <Image src="/images/paypal.svg" alt="PayPal" className={className} width={50} height={30} />
}