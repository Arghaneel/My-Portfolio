"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { contactFormSchema, ContactFormData } from "@/lib/validations";

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus(null);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Something went wrong.");
      }

      setSubmitStatus({
        type: "success",
        message: result.message || "Message sent successfully!",
      });
      reset(); // Clear form fields
    } catch (err: any) {
      console.error(err);
      setSubmitStatus({
        type: "error",
        message: err.message || "Failed to send message. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Status banner */}
      <AnimatePresence mode="wait">
        {submitStatus && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-4 rounded-xl border flex items-start gap-3 ${
              submitStatus.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                : "bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400"
            }`}
          >
            {submitStatus.type === "success" ? (
              <CheckCircle className="flex-shrink-0 mt-0.5" size={18} />
            ) : (
              <AlertCircle className="flex-shrink-0 mt-0.5" size={18} />
            )}
            <div className="text-sm font-medium">{submitStatus.message}</div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name Input */}
        <div className="space-y-1.5">
          <label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Your Name
          </label>
          <input
            id="name"
            type="text"
            {...register("name")}
            disabled={isSubmitting}
            className={`w-full px-4 py-3 rounded-xl bg-secondary/50 border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/45 transition-all ${
              errors.name ? "border-red-500 focus:ring-red-500/30" : "border-border/80 focus:border-primary/50"
            }`}
            placeholder="John Doe"
          />
          {errors.name && (
            <p className="text-xs font-semibold text-red-500">{errors.name.message}</p>
          )}
        </div>

        {/* Email Input */}
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            {...register("email")}
            disabled={isSubmitting}
            className={`w-full px-4 py-3 rounded-xl bg-secondary/50 border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/45 transition-all ${
              errors.email ? "border-red-500 focus:ring-red-500/30" : "border-border/80 focus:border-primary/50"
            }`}
            placeholder="johndoe@example.com"
          />
          {errors.email && (
            <p className="text-xs font-semibold text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Subject Input */}
        <div className="space-y-1.5">
          <label htmlFor="subject" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Subject
          </label>
          <input
            id="subject"
            type="text"
            {...register("subject")}
            disabled={isSubmitting}
            className={`w-full px-4 py-3 rounded-xl bg-secondary/50 border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/45 transition-all ${
              errors.subject ? "border-red-500 focus:ring-red-500/30" : "border-border/80 focus:border-primary/50"
            }`}
            placeholder="Inquiry / Partnership Proposal"
          />
          {errors.subject && (
            <p className="text-xs font-semibold text-red-500">{errors.subject.message}</p>
          )}
        </div>

        {/* Message Input */}
        <div className="space-y-1.5">
          <label htmlFor="message" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Message
          </label>
          <textarea
            id="message"
            rows={5}
            {...register("message")}
            disabled={isSubmitting}
            className={`w-full px-4 py-3 rounded-xl bg-secondary/50 border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/45 transition-all resize-none ${
              errors.message ? "border-red-500 focus:ring-red-500/30" : "border-border/80 focus:border-primary/50"
            }`}
            placeholder="Write your message details here..."
          />
          {errors.message && (
            <p className="text-xs font-semibold text-red-500">{errors.message.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/95 transition-all shadow-md shadow-primary/10 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              Sending Message
              <Loader2 className="h-[18px] w-[18px] animate-spin" />
            </>
          ) : (
            <>
              Send Message
              <Send size={16} />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
