'use client';

import React from 'react';
import Link from 'next/link';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function AdminHeader({ title, subtitle, actions }: AdminHeaderProps) {
  return (
    <header className="min-h-[56px] sm:min-h-[64px] py-2.5 sm:py-0 bg-surface border-b border-outline px-gutter-md md:px-gutter-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-gutter-md">
      <div className="flex flex-col min-w-0">
        <h1 className="font-headline text-title-lg sm:text-headline-md uppercase text-on-surface leading-tight truncate">
          {title}
        </h1>
        {subtitle && (
          <span className="font-label text-[10px] sm:text-[11px] uppercase text-on-surface-variant tracking-wider mt-0.5 truncate">
            {subtitle}
          </span>
        )}
      </div>

      {actions && <div className="flex flex-wrap items-center gap-2 shrink-0">{actions}</div>}
    </header>
  );
}
