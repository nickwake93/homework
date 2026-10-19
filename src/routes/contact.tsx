import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Mail, Phone, Linkedin, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { StarRating } from "@/components/StarRating";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Nature Frames" },
      {
        name: "description",
        content:
          "Get in touch about commissions and prints, subscribe to the newsletter, or leave a review.",
      },
    ],
  }),
  component: ContactPage,
});

interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
  date: string;
}

function ContactPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <header className="mb-12">
        <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Contact</p>
        <h1 data-testid="contact-heading" className="mt-2 text-4xl sm:text-5xl">
          Let's talk
        </h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Commissions, prints, or just to say hello — pick whichever channel works best.
        </p>
      </header>

      <ContactInfo />
      <NewsletterForm />
      <ReviewsSection />
    </div>
  );
}

function ContactInfo() {
  return (
    <section
      id="contact-info"
      data-testid="contact-info"
      aria-labelledby="contact-info-heading"
      className="grid gap-4 sm:grid-cols-3"
    >
      <h2 id="contact-info-heading" className="sr-only">
        Contact information
      </h2>
      <a
        id="contact-phone-link"
        data-testid="contact-phone-link"
        href="tel:+447824553841"
        className="flex items-center gap-3 rounded-lg border border-border bg-card p-5 transition hover:border-foreground/40"
      >
        <Phone className="h-5 w-5 text-accent" />
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Phone</p>
          <p className="font-medium">+44 78245 53841</p>
        </div>
      </a>
      <a
        id="contact-email-link"
        data-testid="contact-email-link"
        href="mailto:nwake@hey.com"
        className="flex items-center gap-3 rounded-lg border border-border bg-card p-5 transition hover:border-foreground/40"
      >
        <Mail className="h-5 w-5 text-accent" />
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Email</p>
          <p className="font-medium">nwake@hey.com</p>
        </div>
      </a>
      <a
        id="contact-linkedin-link"
        data-testid="contact-linkedin-link"
        href="https://www.linkedin.com/in/nick-wake"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 rounded-lg border border-border bg-card p-5 transition hover:border-foreground/40"
      >
        <Linkedin className="h-5 w-5 text-accent" />
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">LinkedIn</p>
          <p className="font-medium">/in/nick-wake</p>
        </div>
      </a>
    </section>
  );
}

function NewsletterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  function validate() {
    const e: typeof errors = {};
    if (!name.trim()) e.name = "Name is required";
    if (!email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      e.email = "Please enter a valid email address";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Subscription failed");
      setStatus("success");
      setMessage("Thank you for subscribing to the Nature Frames newsletter.");
      toast.success("Subscribed! Check your inbox.");
      setName("");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong");
      toast.error("Subscription failed");
    }
  }

  return (
    <section
      id="newsletter-section"
      data-testid="newsletter-section"
      aria-labelledby="newsletter-heading"
      className="mt-20 rounded-lg border border-border bg-card p-8 sm:p-10"
    >
      <h2 id="newsletter-heading" data-testid="newsletter-heading" className="text-3xl">
        Newsletter
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        New prints, behind-the-scenes work, and commission slots — straight to your inbox.
      </p>

      <form
        id="newsletter-form"
        data-testid="newsletter-form"
        noValidate
        onSubmit={onSubmit}
        className="mt-6 grid gap-4 sm:grid-cols-2"
      >
        <div>
          <label htmlFor="newsletter-name-input" className="mb-1 block text-sm font-medium">
            Name
          </label>
          <input
            id="newsletter-name-input"
            data-testid="newsletter-name-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "newsletter-name-error" : undefined}
            required
            maxLength={100}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-foreground focus:outline-none"
          />
          {errors.name && (
            <p
              id="newsletter-name-error"
              data-testid="newsletter-name-error"
              role="alert"
              className="mt-1 text-xs text-destructive"
            >
              {errors.name}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="newsletter-email-input" className="mb-1 block text-sm font-medium">
            Email
          </label>
          <input
            id="newsletter-email-input"
            data-testid="newsletter-email-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "newsletter-email-error" : undefined}
            required
            maxLength={255}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-foreground focus:outline-none"
          />
          {errors.email && (
            <p
              id="newsletter-email-error"
              data-testid="newsletter-email-error"
              role="alert"
              className="mt-1 text-xs text-destructive"
            >
              {errors.email}
            </p>
          )}
        </div>

        <div className="sm:col-span-2 flex items-center gap-4">
          <button
            id="newsletter-submit-button"
            data-testid="newsletter-submit-button"
            type="submit"
            disabled={status === "loading"}
            className="inline-flex items-center gap-2 rounded-md bg-foreground px-5 py-2.5 text-sm font-medium text-background transition hover:opacity-90 disabled:opacity-50"
          >
            {status === "loading" && <Loader2 className="h-4 w-4 animate-spin" />}
            {status === "loading" ? "Subscribing…" : "Subscribe"}
          </button>
          <p
            id="newsletter-status"
            data-testid="newsletter-status"
            data-status={status}
            role="status"
            aria-live="polite"
            className={`text-sm ${
              status === "success"
                ? "text-accent"
                : status === "error"
                  ? "text-destructive"
                  : "text-muted-foreground"
            }`}
          >
            {message}
          </p>
        </div>
      </form>
    </section>
  );
}

function ReviewsSection() {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [errors, setErrors] = useState<{ name?: string; rating?: string; text?: string }>({});
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: "seed-1",
      name: "Most people he's worked with",
      rating: 5,
      text: "Great guy and really good tester, very modest too!",
      date: new Date(Date.now() - 86400000 * 6).toISOString(),
    },
  ]);
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const errs: typeof errors = {};
    if (!name.trim()) errs.name = "Name is required";
    if (!rating) errs.rating = "Please choose a rating";
    if (!text.trim()) errs.text = "Review text is required";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    const review: Review = {
      id: `review_${Date.now()}`,
      name: name.trim(),
      rating,
      text: text.trim(),
      date: new Date().toISOString(),
    };
    setReviews((prev) => [review, ...prev]);
    setName("");
    setRating(0);
    setText("");
    setSubmitted(true);
    toast.success("Thanks for your review!");
    setTimeout(() => setSubmitted(false), 4000);
  }

  return (
    <section
      id="reviews-section"
      data-testid="reviews-section"
      aria-labelledby="reviews-heading"
      className="mt-20"
    >
      <h2 id="reviews-heading" data-testid="reviews-heading" className="text-3xl">
        Reviews
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Worked with me? I'd love to hear about it.
      </p>

      <form
        id="review-form"
        data-testid="review-form"
        noValidate
        onSubmit={onSubmit}
        className="mt-6 rounded-lg border border-border bg-card p-6 sm:p-8"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="review-name-input" className="mb-1 block text-sm font-medium">
              Your name
            </label>
            <input
              id="review-name-input"
              data-testid="review-name-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "review-name-error" : undefined}
              maxLength={100}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-foreground focus:outline-none"
            />
            {errors.name && (
              <p
                id="review-name-error"
                data-testid="review-name-error"
                role="alert"
                className="mt-1 text-xs text-destructive"
              >
                {errors.name}
              </p>
            )}
          </div>
          <div>
            <span className="mb-1 block text-sm font-medium">Rating</span>
            <StarRating value={rating} onChange={setRating} idPrefix="review-rating" />
            <input
              type="hidden"
              id="review-rating-value"
              data-testid="review-rating-value"
              value={rating}
              readOnly
            />
            {errors.rating && (
              <p
                id="review-rating-error"
                data-testid="review-rating-error"
                role="alert"
                className="mt-1 text-xs text-destructive"
              >
                {errors.rating}
              </p>
            )}
          </div>
        </div>

        <div className="mt-4">
          <label htmlFor="review-text-input" className="mb-1 block text-sm font-medium">
            Your review
          </label>
          <textarea
            id="review-text-input"
            data-testid="review-text-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            aria-invalid={!!errors.text}
            aria-describedby={errors.text ? "review-text-error" : undefined}
            rows={4}
            maxLength={1000}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-foreground focus:outline-none"
          />
          {errors.text && (
            <p
              id="review-text-error"
              data-testid="review-text-error"
              role="alert"
              className="mt-1 text-xs text-destructive"
            >
              {errors.text}
            </p>
          )}
        </div>

        <div className="mt-4 flex items-center gap-4">
          <button
            id="submit-review-button"
            data-testid="submit-review-button"
            type="submit"
            className="rounded-md bg-foreground px-5 py-2.5 text-sm font-medium text-background transition hover:opacity-90"
          >
            Submit review
          </button>
          {submitted && (
            <p
              id="review-success"
              data-testid="review-success"
              role="status"
              aria-live="polite"
              className="text-sm text-accent"
            >
              Review submitted — thank you!
            </p>
          )}
        </div>
      </form>

      <ul id="review-list" data-testid="review-list" className="mt-8 grid gap-4">
        {reviews.map((r) => (
          <li
            key={r.id}
            id={`review-${r.id}`}
            data-testid="review-item"
            data-review-id={r.id}
            className="rounded-lg border border-border bg-card p-5"
          >
            <div className="flex items-center justify-between">
              <p data-testid="review-name" className="font-medium">
                {r.name}
              </p>
              <time
                data-testid="review-date"
                dateTime={r.date}
                className="text-xs text-muted-foreground"
              >
                {new Date(r.date).toLocaleDateString()}
              </time>
            </div>
            <div
              data-testid="review-rating"
              data-rating={r.rating}
              aria-label={`${r.rating} out of 5 stars`}
              className="mt-1 flex gap-0.5 text-amber-500"
            >
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} aria-hidden="true">
                  {i < r.rating ? "★" : "☆"}
                </span>
              ))}
            </div>
            <p data-testid="review-text" className="mt-2 text-sm text-muted-foreground">
              {r.text}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
