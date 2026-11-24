'use client';

import React, { useState } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { useCouponStore } from '@/stores/useCouponStore';
import { showToast } from '@/components/ui/Toast';
import { formatPrice } from '@/lib/utils';
import { Plus, Trash2, TicketPercent, CheckCircle2, XCircle } from 'lucide-react';
import { Coupon } from '@/types';

export default function AdminCouponsPage() {
  const { coupons, addCoupon, updateCoupon, deleteCoupon } = useCouponStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [code, setCode] = useState('');
  const [type, setType] = useState<'PERCENTAGE' | 'FIXED' | 'FREE_SHIPPING'>('PERCENTAGE');
  const [value, setValue] = useState(20);
  const [minOrder, setMinOrder] = useState(100);
  const [expiry, setExpiry] = useState('2027-12-31');
  const [usageLimit, setUsageLimit] = useState(500);
  const [description, setDescription] = useState('Member promotional discount');

  const handleOpenAdd = () => {
    setCode(`DROP${Math.floor(10 + Math.random() * 90)}`);
    setType('PERCENTAGE');
    setValue(20);
    setMinOrder(100);
    setExpiry('2027-12-31');
    setUsageLimit(500);
    setDescription('Member promotional discount');
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    const created = addCoupon({
      code: code.trim().toUpperCase(),
      type,
      value: Number(value),
      minOrder: Number(minOrder),
      expiry,
      usageLimit: Number(usageLimit),
      active: true,
      description,
    });

    showToast(`PROMO CODE ${created.code} ARMED // AVAILABLE AT CHECKOUT`, 'success');
    setModalOpen(false);
  };

  const handleToggleActive = (coupon: Coupon) => {
    updateCoupon(coupon.id, { active: !coupon.active });
    showToast(
      `COUPON ${coupon.code} ${!coupon.active ? 'ACTIVATED' : 'DEACTIVATED'}`,
      'info'
    );
  };

  const handleDelete = (id: string, couponCode: string) => {
    if (confirm(`Revoke coupon code ${couponCode}?`)) {
      deleteCoupon(id);
      showToast(`COUPON ${couponCode} REVOKED`, 'info');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader
        title="PROMOTIONS & DISCOUNT PASSKEYS"
        subtitle="CHECKOUT REDEMPTION RULES & TELEMETRY"
        actions={
          <button
            onClick={handleOpenAdd}
            className="bg-accent text-on-accent font-label text-label-sm uppercase px-3 py-2 border border-accent hover:bg-primary font-bold flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> + Create Coupon
          </button>
        }
      />

      <main className="flex-1 p-gutter-md md:p-gutter-xl max-w-6xl mx-auto w-full flex flex-col gap-gutter-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter-lg">
          {coupons.map((coupon) => (
            <div
              key={coupon.id}
              className={`bg-surface-container border p-gutter-xl flex flex-col justify-between gap-gutter-md ${
                coupon.active ? 'border-outline' : 'border-outline/40 opacity-70'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-headline text-headline-md text-accent tracking-wider tabular-nums font-bold">
                      {coupon.code}
                    </span>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold border ${
                        coupon.active
                          ? 'bg-surface text-accent border-accent'
                          : 'bg-surface text-error border-error'
                      }`}
                    >
                      {coupon.active ? 'ACTIVE' : 'DISABLED'}
                    </span>
                  </div>
                  <span className="font-body text-body-md text-on-surface">
                    {coupon.description}
                  </span>
                </div>

                <div className="text-right">
                  <span className="font-headline text-headline-lg text-on-surface tabular-nums">
                    {coupon.type === 'PERCENTAGE'
                      ? `${coupon.value}% OFF`
                      : coupon.type === 'FIXED'
                      ? `$${coupon.value} OFF`
                      : 'FREE COURIER'}
                  </span>
                </div>
              </div>

              {/* Specifications */}
              <div className="grid grid-cols-3 gap-2 border-t border-b border-outline py-gutter-sm font-label text-label-sm uppercase text-on-surface-variant">
                <div>
                  <span className="block text-[10px]">Min Spend:</span>
                  <span className="text-on-surface font-semibold tabular-nums">
                    {coupon.minOrder > 0 ? `$${coupon.minOrder}` : 'None'}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px]">Redeemed:</span>
                  <span className="text-on-surface font-semibold tabular-nums">
                    {coupon.usedCount} / {coupon.usageLimit}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px]">Expiry:</span>
                  <span className="text-on-surface font-semibold tabular-nums">
                    {coupon.expiry}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between font-label text-label-sm uppercase">
                <button
                  type="button"
                  onClick={() => handleToggleActive(coupon)}
                  className={`text-xs underline flex items-center gap-1 ${
                    coupon.active ? 'text-on-surface-variant hover:text-error' : 'text-accent'
                  }`}
                >
                  {coupon.active ? 'Deactivate Coupon' : 'Re-activate Coupon'}
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(coupon.id, coupon.code)}
                  className="p-1.5 border border-outline hover:border-error text-on-surface-variant hover:text-error"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Create Coupon Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-surface/85 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative w-full max-w-md bg-surface-container border border-outline p-gutter-xl shadow-2xl z-10 flex flex-col gap-gutter-md font-label text-label-sm uppercase">
            <h3 className="font-headline text-headline-md text-on-surface border-b border-outline pb-2">
              Create Promotional Coupon
            </h3>

            <form onSubmit={handleSave} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-on-surface-variant">Coupon Code</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="bg-surface-container-low p-2.5 border border-outline text-accent font-bold uppercase focus:border-accent"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-on-surface-variant">Discount Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="bg-surface-container-low p-2.5 border border-outline text-on-surface focus:border-accent"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Fixed Amount ($)</option>
                    <option value="FREE_SHIPPING">Free Courier</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-on-surface-variant">Value</label>
                  <input
                    type="number"
                    min="0"
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value))}
                    className="bg-surface-container-low p-2.5 border border-outline text-on-surface tabular-nums focus:border-accent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-on-surface-variant">Min Order ($)</label>
                  <input
                    type="number"
                    min="0"
                    value={minOrder}
                    onChange={(e) => setMinOrder(Number(e.target.value))}
                    className="bg-surface-container-low p-2.5 border border-outline text-on-surface tabular-nums focus:border-accent"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-on-surface-variant">Max Usages</label>
                  <input
                    type="number"
                    min="1"
                    value={usageLimit}
                    onChange={(e) => setUsageLimit(Number(e.target.value))}
                    className="bg-surface-container-low p-2.5 border border-outline text-on-surface tabular-nums focus:border-accent"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-on-surface-variant">Expiration Date</label>
                <input
                  type="date"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  className="bg-surface-container-low p-2.5 border border-outline text-on-surface focus:border-accent"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-on-surface-variant">Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-surface-container-low p-2.5 border border-outline text-on-surface focus:border-accent"
                />
              </div>

              <div className="flex gap-2 mt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-accent text-on-accent font-bold"
                >
                  Arm Coupon
                </button>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-3 border border-outline text-on-surface hover:text-error"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
