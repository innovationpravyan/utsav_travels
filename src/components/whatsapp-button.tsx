"use client";

import Link from "next/link";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

// WhatsApp SVG Icon
const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
  >
    <path
      fill="#4caf50"
      d="M45,34.4c-1.3-0.6-2.6-1.3-3.9-1.9c-1.8-0.9-3.4-1.5-3.4-1.5s-0.5,0.1-1.2,0.8c-0.6,0.7-1.3,1.5-1.5,1.7 c-0.2,0.2-0.5,0.3-0.9,0.1c-0.4-0.1-2-0.7-3.7-2.3c-2.3-2.2-3.8-4.9-4.1-5.6c-0.2-0.5-0.1-0.8,0.2-1.1c0.1-0.1,0.3-0.3,0.5-0.5 c0.2-0.2,0.4-0.4,0.6-0.6c0.2-0.2,0.3-0.5,0.3-0.8c0-0.3-0.2-0.7-0.3-0.8c-0.1-0.1-0.7-0.8-1.5-1.9c-0.8-1-1.6-2-1.6-2 s-0.4-0.2-1-0.2c-0.6,0-1,0.1-1.4,0.1c-0.4,0-0.8,0.1-1.3,0.6c-0.5,0.5-1.1,1.1-1.5,1.9c-0.4,0.8-0.7,1.7-0.7,2.7 c0,1,0.3,2,0.7,3c0.4,1,1.1,2.2,1.9,3.3c0.9,1.1,2.1,2.4,3.5,3.9c2.7,2.7,5.1,4.3,7.9,5.2c1,0.3,1.9,0.5,2.9,0.5 c1,0,1.9-0.2,2.7-0.7c0.8-0.5,1.5-1.2,2.1-2.1c0.4-0.6,0.6-1.2,0.6-1.7c0-0.4-0.1-0.8-0.2-1.2C45.3,34.7,45.2,34.6,45,34.4z"
    ></path>
    <path
      fill="#fff"
      d="M34.6,35.4c-0.2-0.1-0.4-0.2-0.6-0.3c-1.5-0.8-2.8-1.4-2.8-1.4s-0.3,0-0.8,0.5c-0.5,0.5-1,1.1-1.2,1.3 c-0.2,0.2-0.4,0.2-0.7,0.1c-0.3-0.1-1.6-0.6-3-2c-1.9-1.8-3.2-4-3.5-4.6c-0.2-0.5-0.1-0.7,0.2-1c0.1-0.1,0.2-0.2,0.4-0.4 c0.2-0.2,0.3-0.4,0.5-0.5c0.2-0.2,0.2-0.4,0.2-0.7c0-0.3-0.1-0.6-0.2-0.7c-0.1-0.1-0.6-0.7-1.3-1.6c-0.7-0.9-1.4-1.7-1.4-1.7 s-0.3-0.1-0.8-0.1c-0.5,0-0.8,0.1-1.1,0.1c-0.3,0-0.7,0.1-1.1,0.5c-0.4,0.4-0.9,1-1.3,1.7c-0.4,0.7-0.6,1.4-0.6,2.3 c0,0.9,0.2,1.7,0.6,2.6c0.4,0.9,1,1.9,1.7,2.9c0.7,1,1.8,2.2,3,3.4c2.4,2.4,4.6,3.8,7.1,4.7c0.9,0.3,1.7,0.4,2.5,0.4 c0.8,0,1.6-0.2,2.3-0.6c0.7-0.4,1.3-1,1.8-1.8c0.3-0.5,0.5-1,0.5-1.4c0-0.3-0.1-0.7-0.2-1C34.9,35.6,34.8,35.5,34.6,35.4z"
    ></path>
    <path
      fill="#fafafa"
      d="M24,4C12.9,4,4,12.9,4,24s8.9,20,20,20s20-8.9,20-20S35.1,4,24,4z"
      opacity=".05"
    ></path>
    <path
      fill="#000"
      d="M24,4.5c10.7,0,19.5,8.8,19.5,19.5S34.7,43.5,24,43.5S4.5,34.7,4.5,24S13.3,4.5,24,4.5 M24,3 C12.4,3,3,12.4,3,24s9.4,21,21,21s21-9.4,21-21S35.6,3,24,3L24,3z"
      opacity=".1"
    ></path>
  </svg>
);

export function WhatsappButton() {
  const phoneNumber = "1234567890"; // Replace with your business phone number

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={`https://wa.me/${phoneNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 h-16 w-16 rounded-full bg-background shadow-lg flex items-center justify-center transition-transform hover:scale-110"
            aria-label="Contact us on WhatsApp"
          >
            <WhatsAppIcon className="h-14 w-14" />
          </Link>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Chat with us on WhatsApp</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
