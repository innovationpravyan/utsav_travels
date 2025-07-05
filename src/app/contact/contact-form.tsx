'use client';

import { useFormStatus } from 'react-dom';
import { useActionState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { requestCallBack } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const initialState = {
  message: '',
  errors: {},
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Submitting...' : 'Request Call'}
    </Button>
  );
}

export function ContactForm() {
  const [state, formAction] = useActionState(requestCallBack, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      toast({
        title: 'Request Sent!',
        description: state.message,
      });
      formRef.current?.reset();
    } else if (state.message && state.errors && Object.keys(state.errors).length > 0) {
      toast({
        title: 'Error',
        description: state.message,
        variant: 'destructive',
      });
    }
  }, [state, toast]);

  return (
    <Card className="shadow-lg">
        <CardHeader>
            <CardTitle>Request a Call Back</CardTitle>
            <CardDescription>Leave your details and we'll call you back to plan your trip.</CardDescription>
        </CardHeader>
        <CardContent>
             <form ref={formRef} action={formAction}>
              <div className="grid gap-4">
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" placeholder="Your full name" required />
                  {state.errors?.name && <p className="text-sm text-destructive">{state.errors.name[0]}</p>}
                </div>
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" name="phone" placeholder="Your phone number" required />
                  {state.errors?.phone && <p className="text-sm text-destructive">{state.errors.phone[0]}</p>}
                </div>
                 <SubmitButton />
              </div>
            </form>
        </CardContent>
    </Card>
   
  );
}
