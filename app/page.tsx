"use client";

import { FormEvent, useEffect, useState } from "react";

const decorativeGlyphs = [
  { char: "⌘", className: "glyph glyph-a" },
  { char: "∑", className: "glyph glyph-b" },
  { char: "✎", className: "glyph glyph-c" },
  { char: "⌂", className: "glyph glyph-d" },
  { char: "◌", className: "glyph glyph-e" },
  { char: "∴", className: "glyph glyph-f" },
  { char: "⊞", className: "glyph glyph-g" },
  { char: "✦", className: "glyph glyph-h" },
];

const countdown = [{ label: "Days" }, { label: "Hours" }, { label: "Mins" }];

const targetDate = new Date("2026-05-10T12:00:00");

function getCountdownValues() {
  const totalMillis = Math.max(0, targetDate.getTime() - Date.now());
  const totalMinutes = Math.floor(totalMillis / 60000);
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  return [days, hours, minutes];
}

export default function Home() {
  const [countdownValues, setCountdownValues] = useState(getCountdownValues());
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formValues, setFormValues] = useState({ name: "", email: "" });
  const [formError, setFormError] = useState("");

  useEffect(() => {
    const updateCountdown = () => setCountdownValues(getCountdownValues());

    updateCountdown();

    const countdownTimer = window.setInterval(updateCountdown, 1000);

    return () => {
      window.clearInterval(countdownTimer);
    };
  }, []);

  useEffect(() => {
    if (!isWaitlistOpen && !isSuccessOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isSuccessOpen, isWaitlistOpen]);

  useEffect(() => {
    if (!isSuccessOpen) {
      return;
    }

    const closeTimer = window.setTimeout(() => {
      setIsSuccessOpen(false);
    }, 2200);

    return () => {
      window.clearTimeout(closeTimer);
    };
  }, [isSuccessOpen]);

  const openWaitlist = () => {
    setFormError("");
    setIsWaitlistOpen(true);
  };

  const closeWaitlist = () => {
    if (isSubmitting) {
      return;
    }

    setIsWaitlistOpen(false);
    setFormError("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setFormError("");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
      });

      const payload = (await response.json().catch(() => ({}))) as {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(payload.error ?? "Unable to save your waitlist entry.");
      }

      setFormValues({ name: "", email: "" });
      setIsWaitlistOpen(false);
      setIsSuccessOpen(true);
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "Unable to save your waitlist entry."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="page-shell">
      <div className="backdrop" aria-hidden="true">
        {decorativeGlyphs.map((glyph) => (
          <span key={glyph.className} className={glyph.className}>
            {glyph.char}
          </span>
        ))}
      </div>

      <header className="topbar">
        <a className="brand" href="#top">
          UNISAGE
        </a>

        <button
          className="waitlist-button"
          onClick={openWaitlist}
          type="button"
        >
          Join Waitlist
        </button>
      </header>

      <section className="hero" id="top">
        <p className="eyebrow">UPES BTech CSE · AI Study Companion</p>
        <h1>UNISAGE</h1>
        <p className="hero-line">Your AI-Powered College Exam</p>
        <p className="hero-accent">Success Platform</p>

        <div className="countdown" aria-label="Launch countdown">
          {countdown.map((item, index) => (
            <div className="countdown-item" key={item.label}>
              <span className="countdown-value">
                {countdownValues[index].toString().padStart(2, "0")}
              </span>
              <span className="countdown-label">{item.label}</span>
              {index < countdown.length - 1 ? (
                <span className="countdown-separator">:</span>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-brand">UNISAGE</div>
        <p>© 2024 UNISAGE. ENGINEERED FOR ACADEMIC DOMINANCE.</p>
        <div className="footer-links">
          <a href="#">Privacy Protocol</a>
          <a href="#">Terms of Service</a>
          <a href="#">API Access</a>
          <a href="#">Contact Command</a>
        </div>
      </footer>

      {isWaitlistOpen ? (
        <div
          className="modal-backdrop"
          onClick={closeWaitlist}
          role="presentation"
        >
          <div
            aria-labelledby="waitlist-modal-title"
            aria-modal="true"
            className="waitlist-modal"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <div className="modal-header">
              <div>
                <p className="modal-kicker">Join the waitlist</p>
                <h2 id="waitlist-modal-title">Reserve your spot</h2>
              </div>
              <button
                aria-label="Close waitlist form"
                className="modal-close"
                onClick={closeWaitlist}
                type="button"
              >
                ×
              </button>
            </div>

            <p className="modal-copy">
              Add your name and email, and we’ll save it to the waitlist.
            </p>

            <form className="waitlist-form" onSubmit={handleSubmit}>
              <label className="field">
                <span>Name</span>
                <input
                  autoComplete="name"
                  name="name"
                  onChange={(event) =>
                    setFormValues((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  placeholder="Your name"
                  required
                  value={formValues.name}
                />
              </label>

              <label className="field">
                <span>Email</span>
                <input
                  autoComplete="email"
                  name="email"
                  onChange={(event) =>
                    setFormValues((current) => ({
                      ...current,
                      email: event.target.value,
                    }))
                  }
                  placeholder="you@example.com"
                  required
                  type="email"
                  value={formValues.email}
                />
              </label>

              {formError ? <p className="form-error">{formError}</p> : null}

              <button
                className="form-submit"
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting ? "Saving..." : "Join Waitlist"}
              </button>
            </form>
          </div>
        </div>
      ) : null}

      {isSuccessOpen ? (
        <div className="modal-backdrop success-backdrop" role="presentation">
          <div aria-live="polite" className="success-modal" role="alertdialog">
            <p className="modal-kicker">Received</p>
            <h2>You're on the list</h2>
            <p>We’ve saved your details and will reach out soon.</p>
            <button
              className="form-submit success-button"
              onClick={() => setIsSuccessOpen(false)}
              type="button"
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
    </main>
  );
}
