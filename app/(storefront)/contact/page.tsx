'use client';

import React, { useState } from 'react';
import { showToast } from '@/components/ui/Toast';
import { Mail, MapPin, Phone, Send } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('ORDER');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      showToast('Please complete all message fields', 'error');
      return;
    }
    setSubmitted(true);
    showToast('DISPATCH INQUIRY LOGGED // STUDIO OPS WILL RESPOND', 'success');
  };

  return (
    <div className="bg-surface min-h-screen">
      <div className="border-b border-outline bg-surface-container-low">
        <div className="max-w-[1440px] mx-auto px-gutter-md md:px-page-margin py-gutter-lg sm:py-section flex flex-col gap-gutter-xs">
          <span className="font-label text-[11px] sm:text-label-sm uppercase text-accent tracking-widest">
            COMMUNICATIONS WIRE
          </span>
          <h1 className="font-display text-display-xl-mobile md:text-display-lg uppercase text-on-surface">
            STUDIO INQUIRIES
          </h1>
          <p className="font-body text-body-md sm:text-body-lg text-on-surface-variant max-w-xl text-pretty">
            Reach our NYC studio dispatch team for garment sizing assistance, order telemetry updates, or editorial press inquiries.
          </p>
        </div>
      </div>

      <main className="max-w-[1440px] mx-auto px-gutter-md md:px-page-margin py-gutter-lg sm:py-section">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg sm:gap-gutter-xl items-start">
          {/* Left 7 cols: Contact Form */}
          <div className="lg:col-span-7 bg-surface-container border border-outline p-gutter-md sm:p-gutter-xl flex flex-col gap-gutter-md sm:gap-gutter-lg">
            <h2 className="font-headline text-headline-md uppercase text-on-surface border-b border-outline pb-gutter-sm">
              TRANSMIT A MESSAGE
            </h2>

            {submitted ? (
              <div className="p-6 sm:p-8 bg-surface border border-accent flex flex-col items-center text-center gap-3">
                <span className="text-accent font-headline text-headline-md">TRANSMISSION RECEIVED</span>
                <p className="font-body text-body-md text-on-surface-variant max-w-sm">
                  Your inquiry has been logged in our studio terminal. An operator will review your message within 24 hours.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setMessage('');
                  }}
                  className="mt-2 text-accent underline font-label text-label-sm uppercase min-h-[40px]"
                >
                  Send Another Transmission
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-gutter-md font-label text-label-sm uppercase">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-gutter-md">
                  <div className="flex flex-col gap-1">
                    <label className="text-on-surface-variant">Full Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="KAI VANCE"
                      className="bg-surface-container-low p-3 border border-outline text-on-surface uppercase focus:border-accent text-base sm:text-sm min-h-[44px]"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-on-surface-variant">Email</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="NAME@DOMAIN.COM"
                      className="bg-surface-container-low p-3 border border-outline text-on-surface focus:border-accent text-base sm:text-sm min-h-[44px]"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-on-surface-variant">Inquiry Topic</label>
                  <select
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="bg-surface-container-low p-3 border border-outline text-on-surface focus:border-accent text-base sm:text-sm min-h-[44px]"
                  >
                    <option value="ORDER">Order & Waybill Telemetry</option>
                    <option value="SIZING">Sizing & Boxy Fit Consult</option>
                    <option value="PRESS">Press & Editorial Loan</option>
                    <option value="WHOLESALE">Wholesale & Stockist Application</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-on-surface-variant">Message Body</label>
                  <textarea
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="ENTER YOUR MESSAGE OR ORDER REFERENCE NUMBER..."
                    className="bg-surface-container-low p-3 border border-outline text-on-surface focus:border-accent resize-none text-base sm:text-sm"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-accent text-on-accent font-semibold tracking-wider hover:bg-primary hover:text-on-primary transition-colors flex items-center justify-center gap-2 touch-manipulation min-h-[48px]"
                >
                  <Send className="w-4 h-4" />
                  <span>Transmit Transmission</span>
                </button>
              </form>
            )}
          </div>

          {/* Right 5 cols: Studio Telemetry */}
          <div className="lg:col-span-5 flex flex-col gap-gutter-lg">
            <div className="bg-surface-container border border-outline p-gutter-md sm:p-gutter-lg flex flex-col gap-gutter-md font-label text-label-sm uppercase">
              <span className="text-accent tracking-widest border-b border-outline pb-2">
                STUDIO HEADQUARTERS
              </span>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-on-surface font-bold">DUSK RIOT NYC LAB</span>
                  <span className="text-on-surface-variant">418 MERCER STREET, STUDIO 4</span>
                  <span className="text-on-surface-variant">NEW YORK, NY 10013</span>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-2 border-t border-outline-variant">
                <Mail className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-on-surface font-bold">DISPATCH EMAIL</span>
                  <span className="text-on-surface-variant">ops@duskriot.club</span>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-2 border-t border-outline-variant">
                <Phone className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-on-surface font-bold">TELEPHONE</span>
                  <span className="text-on-surface-variant">+1 (212) 555-0194 (10:00–18:00 EST)</span>
                </div>
              </div>
            </div>

            <div className="p-gutter-md sm:p-gutter-lg bg-surface border border-outline flex flex-col gap-2 font-label text-label-sm uppercase">
              <span className="text-accent font-bold">DISPATCH HOURS:</span>
              <p className="text-on-surface-variant lowercase text-xs">
                Studio fulfillments run Monday through Friday from 09:00 to 18:00 EST. Orders placed after 15:00 dispatch next business morning.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
