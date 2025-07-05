import { ContactForm } from "./contact-form";
import { MotionDiv } from "@/components/motion-div";
import { Mail, Phone } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="animate-fade-in">
       <section className="relative bg-secondary py-20 md:py-32">
         <div className="container mx-auto px-4 text-center">
            <h1 className="font-headline text-5xl md:text-7xl font-bold text-primary">Contact Us</h1>
            <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Ready to start your spiritual journey? Get in touch with us.
            </p>
         </div>
       </section>

       <section className="py-16 md:py-24">
         <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <MotionDiv>
                 <h2 className="font-headline text-4xl mb-6">Get in Touch</h2>
                 <p className="text-muted-foreground mb-8">
                   We are here to help you plan your perfect trip to the sacred cities of India. Fill out the form, and one of our travel experts will call you back shortly to discuss your requirements. You can also reach us directly via the contact details below.
                 </p>
                 <div className="space-y-4 text-lg">
                    <div className="flex items-center gap-4">
                        <Phone className="h-6 w-6 text-primary"/>
                        <a href="tel:+919876543210" className="hover:text-primary transition-colors">+91 98765 43210</a>
                    </div>
                     <div className="flex items-center gap-4">
                        <Mail className="h-6 w-6 text-primary"/>
                        <a href="mailto:info@utsavtravels.com" className="hover:text-primary transition-colors">info@utsavtravels.com</a>
                    </div>
                 </div>
              </MotionDiv>
               <MotionDiv>
                <ContactForm />
              </MotionDiv>
            </div>
         </div>
       </section>
    </div>
  );
}
