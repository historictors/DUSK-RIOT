'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import { useOrderStore } from '@/stores/useOrderStore';
import { useWishlistStore } from '@/stores/useWishlistStore';
import { showToast } from '@/components/ui/Toast';
import { CustomerAddress } from '@/types';
import { Plus, Edit2, Trash2, CheckCircle2, User, MapPin, Package, Heart } from 'lucide-react';

export default function CustomerAccountPage() {
  const router = useRouter();
  const {
    currentUser,
    isAuthenticated,
    isHydrated,
    logout,
    updateProfile,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
  } = useAuthStore();

  React.useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.replace('/auth');
    }
  }, [isHydrated, isAuthenticated, router]);

  const orders = useOrderStore((state) => state.orders);
  const wishlistCount = useWishlistStore((state) => state.items.length);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState(currentUser?.name || 'KAI VANCE');
  const [profileEmail, setProfileEmail] = useState(currentUser?.email || 'kai.vance@duskriot.club');
  const [profilePhone, setProfilePhone] = useState(currentUser?.phone || '+1 (212) 555-0194');

  // Address modal state
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addrName, setAddrName] = useState('');
  const [addrLine, setAddrLine] = useState('');
  const [addrCity, setAddrCity] = useState('');
  const [addrZip, setAddrZip] = useState('');
  const [addrPhone, setAddrPhone] = useState('');
  const [addrIsDefault, setAddrIsDefault] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: profileName.toUpperCase(),
      email: profileEmail,
      phone: profilePhone,
    });
    setIsEditingProfile(false);
    showToast('PROFILE DOSSIER UPDATED', 'success');
  };

  const handleOpenNewAddress = () => {
    setEditingAddressId(null);
    setAddrName(currentUser?.name || '');
    setAddrLine('');
    setAddrCity('NEW YORK, NY');
    setAddrZip('10013');
    setAddrPhone(currentUser?.phone || '');
    setAddrIsDefault(false);
    setShowAddressModal(true);
  };

  const handleOpenEditAddress = (addr: CustomerAddress) => {
    setEditingAddressId(addr.id);
    setAddrName(addr.fullName);
    setAddrLine(addr.addressLine);
    setAddrCity(addr.city);
    setAddrZip(addr.postalCode);
    setAddrPhone(addr.phone);
    setAddrIsDefault(addr.isDefault);
    setShowAddressModal(true);
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrLine || !addrCity || !addrZip) {
      showToast('Please complete address fields', 'error');
      return;
    }

    if (editingAddressId) {
      updateAddress(editingAddressId, {
        fullName: addrName.toUpperCase(),
        addressLine: addrLine.toUpperCase(),
        city: addrCity.toUpperCase(),
        postalCode: addrZip,
        phone: addrPhone,
        isDefault: addrIsDefault,
      });
      showToast('ADDRESS RECORD UPDATED', 'success');
    } else {
      addAddress({
        fullName: addrName.toUpperCase(),
        addressLine: addrLine.toUpperCase(),
        city: addrCity.toUpperCase(),
        state: 'NY',
        postalCode: addrZip,
        country: 'United States',
        phone: addrPhone,
        isDefault: addrIsDefault,
      });
      showToast('NEW DISPATCH ADDRESS STORED', 'success');
    }
    setShowAddressModal(false);
  };

  const activeOrdersCount = orders.filter((o) => o.status !== 'DELIVERED' && o.status !== 'CANCELLED').length;
  const completedDropsCount = orders.filter((o) => o.status === 'DELIVERED').length;

  return (
    <div className="bg-surface min-h-screen">
      {/* Top Ticker (Stitch Reference) */}
      <div className="bg-surface-container-low border-b border-outline px-gutter-md md:px-page-margin py-2 flex items-center justify-between gap-gutter-md">
        <div className="flex items-center gap-gutter-sm">
          <span className="inline-block w-2 h-2 bg-accent" />
          <span className="font-label text-label-sm uppercase text-on-surface tracking-widest">
            DROP 04 // NOW LIVE — WORLDWIDE DISPATCH
          </span>
        </div>
        <span className="font-label text-label-sm uppercase text-accent tracking-widest">
          MEMBER ID // {currentUser?.memberId || 'DR-0492'}
        </span>
      </div>

      <main className="max-w-[1440px] mx-auto px-gutter-md md:px-page-margin py-section">
        {/* Header Block */}
        <div className="border-b border-outline pb-gutter-lg mb-gutter-xl flex flex-col sm:flex-row sm:items-end justify-between gap-gutter-md">
          <div className="flex flex-col gap-gutter-xs">
            <span className="font-label text-label-sm uppercase text-accent tracking-widest">
              {currentUser?.name || 'KAI VANCE'} // NYC STUDIO MEMBER
            </span>
            <h1 className="font-display text-display-lg-mobile md:text-display-lg uppercase text-on-surface">
              MEMBER ACCOUNT
            </h1>
          </div>
          <button
            type="button"
            onClick={() => {
              logout();
              router.push('/auth');
            }}
            className="font-label text-label-sm uppercase text-on-surface-variant hover:text-error border border-outline px-gutter-md py-2 w-fit"
          >
            Sign Out
          </button>
        </div>

        {/* Account Layout: Mobile Horizontal Tabs + Desktop Sidebar */}
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-gutter-lg sm:gap-gutter-xl items-start">
          {/* Mobile Horizontal Pill Navigation (< lg) */}
          <nav aria-label="Account navigation mobile" className="lg:hidden w-full flex items-center gap-2 overflow-x-auto scrollbar-none pb-2 border-b border-outline">
            <Link
              href="/account"
              className="px-3 py-2 bg-accent text-on-accent font-label text-xs uppercase font-bold shrink-0"
            >
              Profile & Addresses
            </Link>
            <Link
              href="/account/orders"
              className="px-3 py-2 bg-surface-container border border-outline text-on-surface font-label text-xs uppercase shrink-0 hover:text-accent"
            >
              Order History ({orders.length})
            </Link>
            <Link
              href={`/tracking/${orders[0]?.orderNumber || 'DR-90482'}`}
              className="px-3 py-2 bg-surface-container border border-outline text-on-surface font-label text-xs uppercase shrink-0 hover:text-accent"
            >
              Track Active
            </Link>
            <Link
              href="/wishlist"
              className="px-3 py-2 bg-surface-container border border-outline text-on-surface font-label text-xs uppercase shrink-0 hover:text-accent"
            >
              Wishlist ({wishlistCount})
            </Link>
          </nav>

          {/* Desktop Account Navigation Sidebar (lg:col-span-3) */}
          <nav aria-label="Account navigation desktop" className="hidden lg:flex lg:col-span-3 bg-surface-container border border-outline flex-col w-full">
            <Link
              href="/account"
              className="p-gutter-md font-label text-label-lg uppercase text-accent bg-surface-container-low border-b border-outline font-semibold"
            >
              Profile & Address
            </Link>
            <Link
              href="/account/orders"
              className="p-gutter-md font-label text-label-lg uppercase text-on-surface hover:text-accent border-b border-outline transition-colors"
            >
              Order History ({orders.length})
            </Link>
            <Link
              href={`/tracking/${orders[0]?.orderNumber || 'DR-90482'}`}
              className="p-gutter-md font-label text-label-lg uppercase text-on-surface hover:text-accent border-b border-outline transition-colors"
            >
              Track Active Order
            </Link>
            <Link
              href="/wishlist"
              className="p-gutter-md font-label text-label-lg uppercase text-on-surface hover:text-accent transition-colors"
            >
              Saved Wishlist ({wishlistCount})
            </Link>
          </nav>

          {/* Account Details & Management (9 cols on lg, full width on mobile) */}
          <div className="w-full lg:col-span-9 flex flex-col gap-gutter-lg sm:gap-gutter-xl">
            {/* Quick Stats Strip (Stitch Reference) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-gutter-md">
              <div className="bg-surface-container border border-outline p-gutter-lg flex flex-col gap-gutter-xs">
                <span className="font-label text-label-sm uppercase text-on-surface-variant">
                  Active Orders
                </span>
                <span className="font-headline text-headline-lg text-accent tabular-nums">
                  {activeOrdersCount < 10 ? `0${activeOrdersCount}` : activeOrdersCount}
                </span>
              </div>
              <div className="bg-surface-container border border-outline p-gutter-lg flex flex-col gap-gutter-xs">
                <span className="font-label text-label-sm uppercase text-on-surface-variant">
                  Completed Drops
                </span>
                <span className="font-headline text-headline-lg text-on-surface tabular-nums">
                  {completedDropsCount < 10 ? `0${completedDropsCount}` : completedDropsCount}
                </span>
              </div>
              <div className="bg-surface-container border border-outline p-gutter-lg flex flex-col gap-gutter-xs">
                <span className="font-label text-label-sm uppercase text-on-surface-variant">
                  Club Tier
                </span>
                <span className="font-headline text-headline-lg text-accent">
                  {currentUser?.tier || 'SYNDICATE // 03'}
                </span>
              </div>
            </div>

            {/* Profile Information Block */}
            <div className="bg-surface-container border border-outline p-gutter-xl flex flex-col gap-gutter-lg">
              <div className="flex items-center justify-between border-b border-outline pb-gutter-md">
                <h2 className="font-headline text-headline-md uppercase text-on-surface">
                  PROFILE INFORMATION
                </h2>
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  className="font-label text-label-sm uppercase text-accent hover:underline flex items-center gap-1"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>{isEditingProfile ? 'Cancel' : 'Edit Profile'}</span>
                </button>
              </div>

              {isEditingProfile ? (
                <form onSubmit={handleSaveProfile} className="grid grid-cols-1 sm:grid-cols-2 gap-gutter-md">
                  <div className="flex flex-col gap-1">
                    <label className="font-label text-label-sm uppercase text-on-surface-variant">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="bg-surface-container-low text-on-surface p-3 border border-outline uppercase focus:border-accent"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-label text-label-sm uppercase text-on-surface-variant">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={profileEmail}
                      onChange={(e) => setProfileEmail(e.target.value)}
                      className="bg-surface-container-low text-on-surface p-3 border border-outline focus:border-accent"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-label text-label-sm uppercase text-on-surface-variant">
                      Contact Phone
                    </label>
                    <input
                      type="text"
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      className="bg-surface-container-low text-on-surface p-3 border border-outline focus:border-accent"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full py-3 bg-accent text-on-accent font-label text-label-sm uppercase font-semibold"
                    >
                      Save Dossier
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-gutter-md font-label text-label-sm uppercase">
                  <div>
                    <span className="text-on-surface-variant block mb-1">Name</span>
                    <span className="text-on-surface font-semibold text-base">
                      {currentUser?.name || 'KAI VANCE'}
                    </span>
                  </div>
                  <div>
                    <span className="text-on-surface-variant block mb-1">Email</span>
                    <span className="text-on-surface font-semibold text-base">
                      {currentUser?.email || 'kai.vance@duskriot.club'}
                    </span>
                  </div>
                  <div>
                    <span className="text-on-surface-variant block mb-1">Phone</span>
                    <span className="text-on-surface font-semibold text-base">
                      {currentUser?.phone || '+1 (212) 555-0194'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Saved Addresses Section */}
            <div className="bg-surface-container border border-outline p-gutter-xl flex flex-col gap-gutter-lg">
              <div className="flex items-center justify-between border-b border-outline pb-gutter-md">
                <h2 className="font-headline text-headline-md uppercase text-on-surface">
                  SAVED ADDRESSES
                </h2>
                <button
                  type="button"
                  onClick={handleOpenNewAddress}
                  className="font-label text-label-sm uppercase bg-accent text-on-accent px-3 py-1.5 flex items-center gap-1.5 hover:bg-primary hover:text-on-primary transition-colors font-semibold"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Address</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-gutter-md">
                {currentUser?.addresses && currentUser.addresses.length > 0 ? (
                  currentUser.addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className={`p-gutter-md border flex flex-col justify-between gap-gutter-md ${
                        addr.isDefault
                          ? 'bg-surface-container-low border-accent'
                          : 'bg-surface border-outline'
                      }`}
                    >
                      <div className="flex flex-col gap-1 font-label text-label-sm uppercase">
                        <div className="flex items-center justify-between">
                          <span className="text-on-surface font-bold text-base">{addr.fullName}</span>
                          {addr.isDefault && (
                            <span className="bg-accent text-on-accent px-1.5 py-0.5 text-[10px] font-bold">
                              DEFAULT
                            </span>
                          )}
                        </div>
                        <span className="text-on-surface-variant">{addr.addressLine}</span>
                        <span className="text-on-surface-variant">
                          {addr.city}, {addr.postalCode}
                        </span>
                        <span className="text-on-surface-variant">{addr.country}</span>
                        <span className="text-on-surface-variant">{addr.phone}</span>
                      </div>

                      <div className="flex items-center justify-between border-t border-outline-variant pt-2 font-label text-label-sm uppercase">
                        {!addr.isDefault && (
                          <button
                            type="button"
                            onClick={() => setDefaultAddress(addr.id)}
                            className="text-on-surface-variant hover:text-accent text-xs underline"
                          >
                            Set Default
                          </button>
                        )}
                        <div className="flex items-center gap-2 ml-auto">
                          <button
                            type="button"
                            onClick={() => handleOpenEditAddress(addr)}
                            className="text-on-surface-variant hover:text-on-surface p-1"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteAddress(addr.id)}
                            className="text-on-surface-variant hover:text-error p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-on-surface-variant col-span-2">No saved addresses on record.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-surface/85 backdrop-blur-sm" onClick={() => setShowAddressModal(false)} />
          <div className="relative w-full max-w-md bg-surface-container border border-outline p-gutter-xl shadow-2xl z-10 flex flex-col gap-gutter-md">
            <h3 className="font-headline text-headline-md uppercase text-on-surface border-b border-outline pb-2">
              {editingAddressId ? 'Edit Address' : 'Add Dispatch Address'}
            </h3>
            <form onSubmit={handleSaveAddress} className="flex flex-col gap-3 font-label text-label-sm uppercase">
              <div className="flex flex-col gap-1">
                <label className="text-on-surface-variant">Full Name</label>
                <input
                  type="text"
                  required
                  value={addrName}
                  onChange={(e) => setAddrName(e.target.value)}
                  className="bg-surface-container-low p-2.5 border border-outline text-on-surface uppercase"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-on-surface-variant">Street Address</label>
                <input
                  type="text"
                  required
                  value={addrLine}
                  onChange={(e) => setAddrLine(e.target.value)}
                  className="bg-surface-container-low p-2.5 border border-outline text-on-surface uppercase"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-on-surface-variant">City</label>
                  <input
                    type="text"
                    required
                    value={addrCity}
                    onChange={(e) => setAddrCity(e.target.value)}
                    className="bg-surface-container-low p-2.5 border border-outline text-on-surface uppercase"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-on-surface-variant">Postal Code</label>
                  <input
                    type="text"
                    required
                    value={addrZip}
                    onChange={(e) => setAddrZip(e.target.value)}
                    className="bg-surface-container-low p-2.5 border border-outline text-on-surface uppercase"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-on-surface-variant">Contact Phone</label>
                <input
                  type="text"
                  value={addrPhone}
                  onChange={(e) => setAddrPhone(e.target.value)}
                  className="bg-surface-container-low p-2.5 border border-outline text-on-surface"
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer mt-1">
                <input
                  type="checkbox"
                  checked={addrIsDefault}
                  onChange={(e) => setAddrIsDefault(e.target.checked)}
                  className="text-accent bg-surface"
                />
                <span className="text-on-surface">Set as default dispatch address</span>
              </label>

              <div className="flex gap-2 mt-3">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-accent text-on-accent font-semibold"
                >
                  Save Address
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
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
