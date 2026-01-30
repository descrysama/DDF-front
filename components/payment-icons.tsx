export function VisaIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 32" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="32" rx="3" fill="#1434CB"/>
      <path d="M20.4 20.8L22.2 11.2H24.6L22.8 20.8H20.4ZM17.4 11.2L15.1 17.9L14.8 16.3L13.9 11.9C13.9 11.9 13.8 11.2 12.9 11.2H8.5L8.4 11.4C8.4 11.4 9.6 11.6 10.9 12.4L13 20.8H15.5L19.5 11.2H17.4ZM38.6 20.8H40.8L38.9 11.2H37C36.2 11.2 36 11.7 36 11.7L32.3 20.8H34.8L35.3 19.4H38.3L38.6 20.8ZM36 17.3L37.2 13.8L37.9 17.3H36ZM31.1 13.1L31.5 10.8C31.5 10.8 30.3 10.4 29 10.4C27.6 10.4 24.7 11 24.7 13.9C24.7 16.5 28.4 16.5 28.4 17.8C28.4 19.1 25.1 18.9 23.9 18L23.5 20.4C23.5 20.4 24.7 21 26.4 21C28.1 21 30.9 20.2 30.9 17.5C30.9 14.8 27.2 14.6 27.2 13.5C27.2 12.4 29.8 12.5 31.1 13.1Z" fill="white"/>
    </svg>
  )
}

export function MastercardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 32" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="32" rx="3" fill="#000"/>
      <circle cx="18" cy="16" r="9" fill="#EB001B"/>
      <circle cx="30" cy="16" r="9" fill="#F79E1B"/>
      <path d="M24 9.5C25.5 10.8 26.5 12.8 26.5 15C26.5 17.2 25.5 19.2 24 20.5C22.5 19.2 21.5 17.2 21.5 15C21.5 12.8 22.5 10.8 24 9.5Z" fill="#FF5F00"/>
    </svg>
  )
}

export function CbIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 32" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="32" rx="3" fill="#0082C3"/>
      <path d="M14 12C14 10.9 14.9 10 16 10H18C19.1 10 20 10.9 20 12V14C20 15.1 19.1 16 18 16H16C14.9 16 14 15.1 14 14V12Z" fill="white"/>
      <path d="M14 18C14 16.9 14.9 16 16 16H18C19.1 16 20 16.9 20 18V20C20 21.1 19.1 22 18 22H16C14.9 22 14 21.1 14 20V18Z" fill="white"/>
      <text x="28" y="21" fill="white" fontSize="10" fontWeight="bold" fontFamily="Arial">CB</text>
    </svg>
  )
}

export function PayPalIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 32" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="32" rx="3" fill="#003087"/>
      <path d="M19 10H23C25.2 10 27 11.8 27 14C27 16.2 25.2 18 23 18H21L20 22H17L19 10Z" fill="#009CDE"/>
      <path d="M23 10H27C29.2 10 31 11.8 31 14C31 16.2 29.2 18 27 18H25L24 22H21L23 10Z" fill="#012169"/>
    </svg>
  )
}
