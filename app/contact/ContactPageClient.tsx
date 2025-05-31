"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import type { SupabaseClient } from "@supabase/supabase-js";

const formSchema = z.object({
  full_name: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  work_email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
});

type FormData = z.infer<typeof formSchema>;

export default function ContactPageClient() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: "",
      work_email: "",
      message: "",
    },
  });

  useEffect(() => {
    // Initialize Supabase client only on the client side
    setSupabase(createBrowserSupabaseClient());
  }, []);

  const onSubmit = async (values: FormData) => {
    if (!supabase) {
      toast.error("Unable to connect to database. Please try again.");
      return;
    }

    try {
      setIsSubmitting(true);

      const { error } = await supabase.from("contact_submissions").insert([
        {
          full_name: values.full_name,
          work_email: values.work_email,
          message: values.message,
        },
      ]);

      if (error) {
        console.error("Error submitting contact form:", error);
        toast.error("Failed to send message. Please try again.");
        return;
      }

      toast.success("Message sent successfully! We'll get back to you soon.");
      form.reset();
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if all fields are filled and valid
  const watchedValues = form.watch();
  const hasValues =
    watchedValues.full_name?.trim() &&
    watchedValues.work_email?.trim() &&
    watchedValues.message?.trim();
  const hasErrors = Object.keys(form.formState.errors).length > 0;

  return (
    <div className="flex min-h-screen flex-col bg-background transition-colors duration-300 ease-in-out">
      <Header />

      <main className="flex-1 transition-colors duration-300 ease-in-out">
        <div className="container max-w-2xl pt-12 pb-12 md:pt-24 md:pb-24">
          <div className="flex flex-col">
            {/* Header Section */}
            <section className="mb-16">
              <h1 className="text-4xl font-bold tracking-tighter md:text-5xl text-foreground transition-colors duration-300 ease-in-out mb-4">
                Get in touch
              </h1>
            </section>

            {/* Contact Form */}
            <section className="space-y-8">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  {/* Full Name Field */}
                  <FormField
                    control={form.control}
                    name="full_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-medium">
                          Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Your name"
                            {...field}
                            className="bg-card border-border text-foreground placeholder:text-muted-foreground focus:ring-ring transition-colors duration-300 ease-in-out"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Work Email Field */}
                  <FormField
                    control={form.control}
                    name="work_email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-medium">
                          Work email
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="you@company.com"
                            {...field}
                            className="bg-card border-border text-foreground placeholder:text-muted-foreground focus:ring-ring transition-colors duration-300 ease-in-out"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Message Field */}
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-medium">
                          Message
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            rows={6}
                            {...field}
                            className="bg-card border-border text-foreground placeholder:text-muted-foreground focus:ring-ring transition-colors duration-300 ease-in-out resize-none"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Submit Button */}
                  <div className="pt-4">
                    <Button
                      type="submit"
                      disabled={
                        !hasValues || hasErrors || isSubmitting || !supabase
                      }
                      className="w-full md:w-auto px-8 py-2 bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ease-in-out"
                    >
                      {isSubmitting ? "Sending..." : "Send"}
                    </Button>
                  </div>
                </form>
              </Form>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
