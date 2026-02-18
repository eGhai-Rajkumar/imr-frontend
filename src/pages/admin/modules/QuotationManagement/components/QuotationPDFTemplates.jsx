// src/pages/admin/modules/QuotationManagement/components/QuotationPDFTemplates.jsx
import React from 'react';
import { Box, Typography, Grid, Divider, Chip } from '@mui/material';

// ── COMPANY DEFAULTS (Indian Mountain Rovers) ──────────────────────────────
const IMR_COMPANY = {
  name: 'Indian Mountain Rovers',
  email: 'sales@indianmountainrovers.com',
  mobile: '+91 82788 29941',
  website: 'https://www.indianmountainrovers.com',
  address: 'Near Govt. Printing Press, Lower Chakkar, Shimla–Manali Highway, NH205, HP - 171005',
  licence: 'TRV-12345',
  logo_url: '',
};

// ── DATA EXTRACTION HELPERS ────────────────────────────────────────────────
// The API schema stores trip data under quotation.trip
// But the form also copies some fields to root level for convenience.
// We check both places.

const getField = (quotation, field) => {
  // Check root first, then quotation.trip
  const root = quotation[field];
  const trip = quotation.trip?.[field];
  if (root && (typeof root !== 'string' || root.trim() !== '')) return root;
  if (trip && (typeof trip !== 'string' || trip.trim() !== '')) return trip;
  return null;
};

const getHeroImage = (quotation) => {
  const url = getField(quotation, 'hero_image');
  return typeof url === 'string' && url.trim() ? url : '';
};

const getGalleryImages = (quotation) => {
  // Check root gallery_images first, then trip.gallery_images
  const rootGallery = quotation.gallery_images;
  const tripGallery = quotation.trip?.gallery_images;
  const raw = (Array.isArray(rootGallery) && rootGallery.length > 0) ? rootGallery
    : (Array.isArray(tripGallery) && tripGallery.length > 0) ? tripGallery
      : [];

  return raw.map(img => {
    if (typeof img === 'string' && img.trim()) return img;
    if (img && typeof img === 'object') {
      return img.url || img.file || img.src || null;
    }
    return null;
  }).filter(Boolean);
};

const getDisplayTitle = (quotation) =>
  quotation.display_title || quotation.trip?.display_title || 'Your Exclusive Journey';

const getOverview = (quotation) =>
  quotation.overview || quotation.trip?.overview || '';

const getClientName = (quotation) =>
  quotation.__client_name || quotation.client_name || 'Valued Guest';

const getClientEmail = (quotation) =>
  quotation.__client_email || quotation.client_email || '';

const getClientMobile = (quotation) =>
  quotation.__client_mobile || quotation.client_mobile || '';

const getCompany = (quotation) => ({
  // Always use real IMR details — ignore old 'Holidays Planners' data in DB
  name: 'Indian Mountain Rovers',
  email: 'sales@indianmountainrovers.com',
  mobile: '+91 82788 29941',
  website: 'https://www.indianmountainrovers.com',
  address: 'Near Govt. Printing Press, Lower Chakkar, Shimla–Manali Highway, NH205, HP - 171005',
  licence: quotation.company?.licence || 'TRV-12345',
  // Only take logo from stored record if it exists
  logo_url: quotation.company?.logo_url || IMR_COMPANY.logo_url,
});

// ── INCLUSIONS / EXCLUSIONS HELPERS ───────────────────────────────────────
const parseListField = (raw) => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.map(item =>
    typeof item === 'string' ? item.trim() : (item.text || item.title || item.name || '')
  ).filter(Boolean);
  if (typeof raw === 'string') return raw.split('\n').map(s => s.trim()).filter(Boolean);
  return [];
};

const getInclusions = (quotation) =>
  parseListField(quotation.inclusions) ||
  parseListField(quotation.trip?.inclusions) ||
  parseListField(quotation.policies?.inclusions) ||
  [];

const getExclusions = (quotation) =>
  parseListField(quotation.exclusions) ||
  parseListField(quotation.trip?.exclusions) ||
  parseListField(quotation.policies?.exclusions) ||
  [];

const formatINR = (amount) => {
  const n = Number(amount) || 0;
  return '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: 0 });
};

// ── PACKAGE COST EXTRACTOR ─────────────────────────────────────────────────
const getPackageCostRows = (costing) => {
  if (!costing) return [];
  if (costing.type === 'person' && Array.isArray(costing.items) && costing.items.length > 0) {
    return costing.items.map(item => ({
      name: item.name || 'Item',
      desc: item.description || '',
      qty: item.quantity || 1,
      price: (item.unit_price || 0) * (item.quantity || 1),
    }));
  }
  // Package-based: extract selected package components
  if (costing.type === 'package' && Array.isArray(costing.packages)) {
    const selected = costing.packages.find(p => p.package_id === costing.selected_package_id)
      || costing.packages.find(p => p.is_active)
      || costing.packages[0];
    if (!selected) return [];
    const rows = [];
    (selected.components || []).forEach(comp => {
      const variant = comp.variants?.find(v => v.is_selected) || comp.variants?.[0];
      if (variant) {
        rows.push({
          name: comp.component_title || comp.component_type || 'Component',
          desc: variant.title || '',
          qty: 1,
          price: Number(variant.price_per_person) || 0,
        });
      }
    });
    return rows;
  }
  return [];
};

// =========================================================
// TEMPLATE 1: MAGAZINE MODERN (Visual & Immersive)
// =========================================================
export const MagazineModernTemplate = ({ quotation }) => {
  const company = getCompany(quotation);
  const clientName = getClientName(quotation);
  const displayTitle = getDisplayTitle(quotation);
  const overview = getOverview(quotation);
  const heroImage = getHeroImage(quotation);
  const galleryImages = getGalleryImages(quotation);
  const itinerary = quotation.itinerary || [];
  const costing = quotation.costing || {};
  const policies = quotation.policies || {};
  const payment = quotation.payment || {};
  const costRows = getPackageCostRows(costing);
  const totalAmount = costing.total_amount || quotation.amount || 0;
  const inclusions = getInclusions(quotation);
  const exclusions = getExclusions(quotation);

  // Theme
  const PRIMARY = '#1A3C40';
  const GOLD = '#D4A017';
  const TEXT = '#2C3E50';
  const LIGHT_BG = '#F9FAFB';

  return (
    <Box sx={{ bgcolor: '#fff', fontFamily: '"Georgia", serif', color: TEXT, width: '100%' }}>

      {/* ── COVER PAGE ── */}
      <Box sx={{
        minHeight: '1050px',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        color: '#fff',
        overflow: 'hidden',
        pageBreakAfter: 'always',
      }}>
        {/* Hero Background */}
        <Box sx={{
          position: 'absolute', inset: 0,
          bgcolor: heroImage ? 'transparent' : PRIMARY,
          backgroundImage: heroImage ? `url(${heroImage})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 0,
        }} />
        {/* Dark Overlay */}
        <Box sx={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.1) 100%)',
        }} />

        {/* Top Bar */}
        <Box sx={{
          position: 'absolute', top: 0, left: 0, right: 0, zIndex: 2,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          p: 4, pb: 2,
        }}>
          <Box>
            {company.logo_url
              ? <img src={company.logo_url} alt="Logo" style={{ height: 48, objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
              : <Typography sx={{ fontSize: '1.1rem', fontWeight: 800, letterSpacing: '0.05em', color: '#fff' }}>
                {company.name}
              </Typography>
            }
          </Box>
          <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Travel Quotation
          </Typography>
        </Box>

        {/* Cover Content */}
        <Box sx={{ position: 'relative', zIndex: 2, p: 6, pb: 8 }}>
          <Typography sx={{
            fontFamily: '"Montserrat", sans-serif', fontSize: '0.85rem',
            letterSpacing: '0.25em', textTransform: 'uppercase', color: GOLD, mb: 2,
          }}>
            A Journey Curated For
          </Typography>
          <Typography sx={{ fontSize: '3.2rem', fontWeight: 700, lineHeight: 1.1, mb: 1 }}>
            {clientName}
          </Typography>
          <Box sx={{ width: 80, height: 3, bgcolor: GOLD, mb: 3 }} />
          <Typography sx={{ fontSize: '1.4rem', fontStyle: 'italic', opacity: 0.9, mb: 5 }}>
            {displayTitle}
          </Typography>

          {/* Company Footer on Cover */}
          <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap', opacity: 0.85 }}>
            <Typography sx={{ fontSize: '0.8rem' }}>📧 {company.email}</Typography>
            <Typography sx={{ fontSize: '0.8rem' }}>📞 {company.mobile}</Typography>
            <Typography sx={{ fontSize: '0.8rem' }}>🌐 {company.website}</Typography>
          </Box>
        </Box>
      </Box>

      {/* ── OVERVIEW ── */}
      <Box sx={{ p: 6, bgcolor: '#fff' }}>
        <Typography sx={{
          fontFamily: '"Montserrat", sans-serif', color: GOLD,
          fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, mb: 1,
        }}>
          Begin The Adventure
        </Typography>
        <Typography sx={{ fontSize: '2rem', fontWeight: 700, color: PRIMARY, mb: 3 }}>
          Trip Overview
        </Typography>
        {overview ? (
          <Typography sx={{ fontSize: '1rem', lineHeight: 1.9, color: '#555', whiteSpace: 'pre-line' }}>
            {overview}
          </Typography>
        ) : (
          <Typography sx={{ fontSize: '1rem', color: '#999', fontStyle: 'italic' }}>
            Your personalized itinerary details are included below.
          </Typography>
        )}

        {/* Gallery Grid */}
        {galleryImages.length > 0 && (
          <Box sx={{ mt: 5, display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 2, height: '380px' }}>
            <Box sx={{
              backgroundImage: `url(${galleryImages[0]})`,
              backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: 2,
            }} />
            <Box sx={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: 2 }}>
              {galleryImages[1] && (
                <Box sx={{ backgroundImage: `url(${galleryImages[1]})`, backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: 2 }} />
              )}
              {galleryImages[2] && (
                <Box sx={{ backgroundImage: `url(${galleryImages[2]})`, backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: 2 }} />
              )}
            </Box>
          </Box>
        )}
      </Box>

      {/* ── ITINERARY ── */}
      {itinerary.length > 0 && (
        <Box sx={{ p: 6, bgcolor: LIGHT_BG }}>
          <Typography sx={{ fontSize: '2rem', fontWeight: 700, color: PRIMARY, mb: 5, textAlign: 'center' }}>
            Your Day-by-Day Itinerary
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {itinerary.map((day, i) => (
              <Box key={i} sx={{ display: 'flex', gap: 3, pageBreakInside: 'avoid' }}>
                {/* Day Number */}
                <Box sx={{ flex: '0 0 70px', textAlign: 'center' }}>
                  <Box sx={{
                    width: 56, height: 56, borderRadius: '50%', bgcolor: PRIMARY,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto',
                  }}>
                    <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem' }}>
                      {day.day}
                    </Typography>
                  </Box>
                  {i < itinerary.length - 1 && (
                    <Box sx={{ width: 2, height: 40, bgcolor: '#E5E7EB', mx: 'auto', mt: 1 }} />
                  )}
                </Box>
                {/* Content */}
                <Box sx={{ flex: 1, pb: 2 }}>
                  <Typography sx={{
                    fontFamily: '"Montserrat", sans-serif', fontSize: '0.75rem',
                    fontWeight: 700, color: GOLD, textTransform: 'uppercase', letterSpacing: '0.1em', mb: 0.5,
                  }}>
                    Day {day.day}
                  </Typography>
                  <Typography sx={{ fontSize: '1.3rem', fontWeight: 700, color: PRIMARY, mb: 1 }}>
                    {day.title}
                  </Typography>
                  <Typography sx={{ fontSize: '0.95rem', lineHeight: 1.7, color: '#555' }}>
                    {day.description}
                  </Typography>
                  {(day.hotel || day.meal_plan) && (
                    <Box sx={{ display: 'flex', gap: 2, mt: 1.5, flexWrap: 'wrap' }}>
                      {day.hotel && (
                        <Box sx={{ px: 2, py: 0.5, bgcolor: '#fff', border: '1px solid #E5E7EB', borderRadius: 10 }}>
                          <Typography sx={{ fontSize: '0.75rem', color: PRIMARY, fontWeight: 600 }}>
                            🏨 {day.hotel}
                          </Typography>
                        </Box>
                      )}
                      {day.meal_plan && (
                        <Box sx={{ px: 2, py: 0.5, bgcolor: '#fff', border: '1px solid #E5E7EB', borderRadius: 10 }}>
                          <Typography sx={{ fontSize: '0.75rem', color: PRIMARY, fontWeight: 600 }}>
                            🍽️ {day.meal_plan}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  )}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* ── INCLUSIONS / EXCLUSIONS ── */}
      <Box sx={{ p: 6, bgcolor: PRIMARY, color: '#fff', pageBreakInside: 'avoid' }}>
        <Grid container spacing={6}>
          <Grid item xs={12} md={6}>
            <Typography sx={{ fontFamily: '"Montserrat", sans-serif', fontWeight: 700, fontSize: '0.85rem', color: GOLD, mb: 3, letterSpacing: '0.1em' }}>
              ✓ INCLUSIONS
            </Typography>
            {inclusions.length > 0
              ? inclusions.map((line, i) => (
                <Typography key={i} sx={{ fontSize: '0.9rem', mb: 1, display: 'flex', gap: 1.5 }}>
                  <span style={{ color: GOLD }}>✓</span> {line}
                </Typography>
              ))
              : <Typography sx={{ fontSize: '0.9rem', opacity: 0.7 }}>As per standard package.</Typography>
            }
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography sx={{ fontFamily: '"Montserrat", sans-serif', fontWeight: 700, fontSize: '0.85rem', color: '#ff8a80', mb: 3, letterSpacing: '0.1em' }}>
              ✗ EXCLUSIONS
            </Typography>
            {exclusions.length > 0
              ? exclusions.map((line, i) => (
                <Typography key={i} sx={{ fontSize: '0.9rem', mb: 1, display: 'flex', gap: 1.5, opacity: 0.85 }}>
                  <span>✗</span> {line}
                </Typography>
              ))
              : <Typography sx={{ fontSize: '0.9rem', opacity: 0.7 }}>As per standard package.</Typography>
            }
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.15)', my: 5 }} />

        {/* Cost Breakdown */}
        {costRows.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography sx={{ fontFamily: '"Montserrat", sans-serif', fontWeight: 700, fontSize: '0.85rem', color: GOLD, mb: 2, letterSpacing: '0.1em' }}>
              COST BREAKDOWN
            </Typography>
            {costRows.map((row, i) => (
              <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <Box>
                  <Typography sx={{ fontSize: '0.9rem', fontWeight: 600 }}>{row.name}</Typography>
                  {row.desc && <Typography sx={{ fontSize: '0.8rem', opacity: 0.7 }}>{row.desc}</Typography>}
                </Box>
                <Typography sx={{ fontSize: '0.9rem', fontWeight: 600 }}>{formatINR(row.price)}</Typography>
              </Box>
            ))}
          </Box>
        )}

        {/* Total */}
        <Box sx={{ bgcolor: '#fff', color: TEXT, p: 4, borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: '#888', textTransform: 'uppercase' }}>
              Total Investment
            </Typography>
            {costing.pax && (
              <Typography sx={{ fontSize: '0.8rem', color: '#888' }}>Based on {costing.pax} Guests</Typography>
            )}
          </Box>
          <Typography sx={{ fontSize: '2.5rem', fontWeight: 700, color: PRIMARY }}>
            {formatINR(totalAmount)}
          </Typography>
        </Box>
      </Box>

      {/* ── PAYMENT TERMS ── */}
      {(policies.payment_terms || policies.cancellation_policy || payment.bank_name) && (
        <Box sx={{ p: 6, bgcolor: '#fff', pageBreakInside: 'avoid' }}>
          <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: PRIMARY, mb: 4 }}>
            Payment & Terms
          </Typography>
          <Grid container spacing={4}>
            {(policies.payment_terms || policies.cancellation_policy) && (
              <Grid item xs={12} md={6}>
                {policies.payment_terms && (
                  <Box sx={{ mb: 3 }}>
                    <Typography sx={{ fontWeight: 700, color: PRIMARY, mb: 1 }}>Payment Terms</Typography>
                    <Typography sx={{ fontSize: '0.9rem', color: '#555', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                      {policies.payment_terms}
                    </Typography>
                  </Box>
                )}
                {policies.cancellation_policy && (
                  <Box>
                    <Typography sx={{ fontWeight: 700, color: PRIMARY, mb: 1 }}>Cancellation Policy</Typography>
                    <Typography sx={{ fontSize: '0.9rem', color: '#555', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                      {policies.cancellation_policy}
                    </Typography>
                  </Box>
                )}
              </Grid>
            )}
            {(payment.bank_name || payment.qr_code_url) && (
              <Grid item xs={12} md={6}>
                <Typography sx={{ fontWeight: 700, color: PRIMARY, mb: 2 }}>Bank Details</Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  <Box sx={{ p: 2.5, border: '1px solid #E5E7EB', borderRadius: 2, flex: 1 }}>
                    {payment.bank_name && <Typography sx={{ fontSize: '0.85rem', mb: 0.5 }}><strong>Bank:</strong> {payment.bank_name}</Typography>}
                    {payment.account_number && <Typography sx={{ fontSize: '0.85rem', mb: 0.5 }}><strong>Account:</strong> {payment.account_number}</Typography>}
                    {payment.ifsc_code && <Typography sx={{ fontSize: '0.85rem', mb: 0.5 }}><strong>IFSC:</strong> {payment.ifsc_code}</Typography>}
                    {payment.branch_name && <Typography sx={{ fontSize: '0.85rem', mb: 0.5 }}><strong>Branch:</strong> {payment.branch_name}</Typography>}
                    {payment.upi_ids?.[0] && <Typography sx={{ fontSize: '0.85rem' }}><strong>UPI:</strong> {payment.upi_ids[0]}</Typography>}
                  </Box>
                  {payment.qr_code_url && (
                    <Box sx={{ textAlign: 'center', flexShrink: 0 }}>
                      <img src={payment.qr_code_url} alt="Pay via QR" style={{ width: 100, height: 100, objectFit: 'contain', border: '1px solid #E5E7EB', borderRadius: 8, padding: 4 }} />
                      <Typography sx={{ fontSize: '0.7rem', color: '#888', mt: 0.5 }}>Scan to Pay</Typography>
                    </Box>
                  )}
                </Box>
              </Grid>
            )}
          </Grid>
        </Box>
      )}

      {/* ── TEMPLATE FOOTER ── */}
      <Box sx={{ p: 4, textAlign: 'center', bgcolor: '#111', color: '#888' }}>
        <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff', mb: 0.5 }}>
          {company.name}
        </Typography>
        <Typography sx={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>
          {company.mobile} · {company.email} · {company.website}
        </Typography>
        <Typography sx={{ fontSize: '0.7rem', mt: 0.5, opacity: 0.6 }}>
          {company.address}
        </Typography>
      </Box>
    </Box>
  );
};

// =========================================================
// TEMPLATE 2: CORPORATE STRUCTURED (Clean & Detailed)
// =========================================================
export const CorporateStructuredTemplate = ({ quotation }) => {
  const company = getCompany(quotation);
  const clientName = getClientName(quotation);
  const clientEmail = getClientEmail(quotation);
  const clientMobile = getClientMobile(quotation);
  const displayTitle = getDisplayTitle(quotation);
  const overview = getOverview(quotation);
  const galleryImages = getGalleryImages(quotation);
  const itinerary = quotation.itinerary || [];
  const costing = quotation.costing || {};
  const policies = quotation.policies || {};
  const payment = quotation.payment || {};
  const costRows = getPackageCostRows(costing);
  const totalAmount = costing.total_amount || quotation.amount || 0;
  const inclusions = getInclusions(quotation);
  const exclusions = getExclusions(quotation);

  const ACCENT = '#1A3C40';   // IMR brand green
  const GOLD = '#D4A017';     // IMR brand gold
  const SECONDARY = '#334155';
  const BORDER = '#E2E8F0';
  const BG_HEAD = '#F1F5F9';
  const GREEN = '#166534';
  const RED = '#991b1b';

  return (
    <Box sx={{
      bgcolor: '#fff', fontFamily: '"Inter", "Segoe UI", sans-serif',
      color: '#1e293b', p: 5, width: '100%',
    }}>

      {/* ── HEADER ── */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 5, borderBottom: `3px solid ${ACCENT}`, pb: 3 }}>
        <Box>
          {company.logo_url
            ? <img src={company.logo_url} alt="Logo" style={{ height: 52, marginBottom: 8, objectFit: 'contain' }} />
            : <Typography sx={{ fontSize: '1.6rem', fontWeight: 800, color: ACCENT, letterSpacing: '-0.02em' }}>
              {company.name}
            </Typography>
          }
          <Typography sx={{ fontSize: '0.8rem', color: SECONDARY, mt: 0.5 }}>{company.address}</Typography>
          <Typography sx={{ fontSize: '0.8rem', color: SECONDARY }}>{company.email} · {company.mobile}</Typography>
          <Typography sx={{ fontSize: '0.8rem', color: SECONDARY }}>{company.website}</Typography>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Typography sx={{ fontSize: '2.2rem', fontWeight: 700, color: '#cbd5e1', letterSpacing: '-0.03em', lineHeight: 1 }}>
            QUOTATION
          </Typography>
          <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: ACCENT, mt: 0.5 }}>
            #{quotation.id || 'DRAFT'}
          </Typography>
          <Typography sx={{ fontSize: '0.8rem', color: SECONDARY, mt: 0.5 }}>
            Date: {quotation.date ? new Date(quotation.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </Typography>
        </Box>
      </Box>

      {/* ── CLIENT & TRIP SUMMARY ── */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, mb: 5 }}>
        <Box sx={{ p: 2.5, bgcolor: BG_HEAD, borderRadius: 1.5, border: `1px solid ${BORDER}` }}>
          <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', mb: 1.5 }}>
            Prepared For
          </Typography>
          <Typography sx={{ fontWeight: 700, fontSize: '1rem' }}>{clientName}</Typography>
          {clientEmail && <Typography sx={{ fontSize: '0.85rem', color: SECONDARY, mt: 0.5 }}>📧 {clientEmail}</Typography>}
          {clientMobile && <Typography sx={{ fontSize: '0.85rem', color: SECONDARY }}>📞 {clientMobile}</Typography>}
        </Box>
        <Box sx={{ p: 2.5, bgcolor: BG_HEAD, borderRadius: 1.5, border: `1px solid ${BORDER}` }}>
          <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', mb: 1.5 }}>
            Trip Summary
          </Typography>
          <Typography sx={{ fontWeight: 700, fontSize: '1rem' }}>{displayTitle}</Typography>
          <Typography sx={{ fontSize: '0.85rem', color: SECONDARY, mt: 0.5 }}>
            Duration: {itinerary.length > 0 ? `${itinerary.length} Days` : 'N/A'}
          </Typography>
          {costing.pax && (
            <Typography sx={{ fontSize: '0.85rem', color: SECONDARY }}>Travelers: {costing.pax}</Typography>
          )}
        </Box>
      </Box>

      {/* ── OVERVIEW ── */}
      {overview && (
        <Box sx={{ mb: 5, p: 3, bgcolor: BG_HEAD, borderRadius: 1.5, border: `1px solid ${BORDER}` }}>
          <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: ACCENT, mb: 1.5 }}>Trip Overview</Typography>
          <Typography sx={{ fontSize: '0.9rem', color: SECONDARY, lineHeight: 1.7, whiteSpace: 'pre-line' }}>
            {overview}
          </Typography>
        </Box>
      )}

      {/* ── GALLERY ── */}
      {galleryImages.length > 0 && (
        <Box sx={{ mb: 5, pageBreakInside: 'avoid' }}>
          <Typography sx={{ fontSize: '0.95rem', fontWeight: 700, color: ACCENT, mb: 2 }}>Trip Highlights</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(galleryImages.length, 5)}, 1fr)`, gap: 1.5 }}>
            {galleryImages.slice(0, 5).map((img, i) => (
              <Box key={i} sx={{
                height: 100, borderRadius: 1.5, bgcolor: '#e2e8f0',
                backgroundImage: `url(${img})`,
                backgroundSize: 'cover', backgroundPosition: 'center',
              }} />
            ))}
          </Box>
        </Box>
      )}

      {/* ── ITINERARY TABLE ── */}
      {itinerary.length > 0 && (
        <Box sx={{ mb: 5 }}>
          <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: ACCENT, mb: 2 }}>Itinerary Schedule</Typography>
          <Box sx={{ border: `1px solid ${BORDER}`, borderRadius: 1.5, overflow: 'hidden' }}>
            {/* Header */}
            <Box sx={{ display: 'grid', gridTemplateColumns: '55px 1fr 2fr', bgcolor: ACCENT, p: 1.5 }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#fff' }}>Day</Typography>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#fff' }}>Title</Typography>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#fff' }}>Details</Typography>
            </Box>
            {itinerary.map((day, i) => (
              <Box key={i} sx={{
                display: 'grid', gridTemplateColumns: '55px 1fr 2fr',
                borderBottom: i < itinerary.length - 1 ? `1px solid ${BORDER}` : 'none',
                p: 1.5, alignItems: 'start', pageBreakInside: 'avoid',
                bgcolor: i % 2 === 0 ? '#fff' : BG_HEAD,
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: '50%', bgcolor: ACCENT }}>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>{day.day}</Typography>
                </Box>
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, pt: 0.5 }}>{day.title}</Typography>
                <Box>
                  <Typography sx={{ fontSize: '0.82rem', color: SECONDARY, lineHeight: 1.6 }}>{day.description}</Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                    {day.hotel && <Chip label={`🏨 ${day.hotel}`} size="small" variant="outlined" sx={{ borderRadius: 1, fontSize: '0.7rem', height: 22 }} />}
                    {day.meal_plan && <Chip label={`🍽️ ${day.meal_plan}`} size="small" variant="outlined" sx={{ borderRadius: 1, fontSize: '0.7rem', height: 22 }} />}
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* ── INCLUSIONS / EXCLUSIONS ── */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, mb: 5, pageBreakInside: 'avoid' }}>
        <Box sx={{ p: 2.5, bgcolor: '#f0fdf4', borderRadius: 1.5, border: '1px solid #bbf7d0' }}>
          <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: GREEN, mb: 2, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            ✓ Included
          </Typography>
          {inclusions.length > 0
            ? inclusions.map((line, i) => (
              <Typography key={i} sx={{ fontSize: '0.82rem', color: '#14532d', mb: 0.5 }}>✓ {line}</Typography>
            ))
            : <Typography sx={{ fontSize: '0.82rem', color: '#14532d', opacity: 0.7 }}>As per standard package</Typography>
          }
        </Box>
        <Box sx={{ p: 2.5, bgcolor: '#fef2f2', borderRadius: 1.5, border: '1px solid #fecaca' }}>
          <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: RED, mb: 2, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            ✗ Excluded
          </Typography>
          {exclusions.length > 0
            ? exclusions.map((line, i) => (
              <Typography key={i} sx={{ fontSize: '0.82rem', color: '#7f1d1d', mb: 0.5 }}>✗ {line}</Typography>
            ))
            : <Typography sx={{ fontSize: '0.82rem', color: '#7f1d1d', opacity: 0.7 }}>As per standard package</Typography>
          }
        </Box>
      </Box>

      {/* ── COST BREAKDOWN TABLE ── */}
      {costRows.length > 0 && (
        <Box sx={{ mb: 5, pageBreakInside: 'avoid' }}>
          <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: ACCENT, mb: 2 }}>Cost Breakdown</Typography>
          <Box sx={{ border: `1px solid ${BORDER}`, borderRadius: 1.5, overflow: 'hidden' }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1fr', bgcolor: ACCENT, p: 1.5 }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#fff' }}>Description</Typography>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#fff', textAlign: 'center' }}>Qty</Typography>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#fff', textAlign: 'right' }}>Amount</Typography>
            </Box>
            {costRows.map((row, i) => (
              <Box key={i} sx={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1fr', borderBottom: `1px solid ${BORDER}`, p: 1.5, bgcolor: i % 2 === 0 ? '#fff' : BG_HEAD }}>
                <Box>
                  <Typography sx={{ fontSize: '0.88rem', fontWeight: 600 }}>{row.name}</Typography>
                  {row.desc && <Typography sx={{ fontSize: '0.78rem', color: SECONDARY }}>{row.desc}</Typography>}
                </Box>
                <Typography sx={{ fontSize: '0.88rem', textAlign: 'center', pt: 0.3 }}>{row.qty}</Typography>
                <Typography sx={{ fontSize: '0.88rem', fontWeight: 600, textAlign: 'right', pt: 0.3 }}>{formatINR(row.price)}</Typography>
              </Box>
            ))}
            {/* Total Row */}
            <Box sx={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1fr', bgcolor: ACCENT, p: 2 }}>
              <Typography sx={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', gridColumn: '1 / 3' }}>
                Total Package Cost
              </Typography>
              <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: '#fff', textAlign: 'right' }}>
                {formatINR(totalAmount)}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}

      {/* If no cost rows but we have a total */}
      {costRows.length === 0 && totalAmount > 0 && (
        <Box sx={{ mb: 5, p: 3, bgcolor: ACCENT, borderRadius: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>Total Package Cost</Typography>
          <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff' }}>{formatINR(totalAmount)}</Typography>
        </Box>
      )}

      {/* ── TERMS & BANK DETAILS ── */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, mb: 4, pageBreakInside: 'avoid' }}>
        {/* Bank Details + QR */}
        <Box>
          <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: ACCENT, mb: 1.5 }}>Bank Details</Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <Box sx={{ p: 2, border: `1px solid ${BORDER}`, borderRadius: 1.5, flex: 1 }}>
              {payment.bank_name
                ? <>
                  <Typography sx={{ fontSize: '0.82rem', mb: 0.5 }}><strong>Bank:</strong> {payment.bank_name}</Typography>
                  {payment.account_number && <Typography sx={{ fontSize: '0.82rem', mb: 0.5 }}><strong>Account:</strong> {payment.account_number}</Typography>}
                  {payment.ifsc_code && <Typography sx={{ fontSize: '0.82rem', mb: 0.5 }}><strong>IFSC:</strong> {payment.ifsc_code}</Typography>}
                  {payment.branch_name && <Typography sx={{ fontSize: '0.82rem', mb: 0.5 }}><strong>Branch:</strong> {payment.branch_name}</Typography>}
                  {payment.upi_ids?.[0] && <Typography sx={{ fontSize: '0.82rem' }}><strong>UPI:</strong> {payment.upi_ids[0]}</Typography>}
                </>
                : <Typography sx={{ fontSize: '0.82rem', color: SECONDARY }}>Contact us for payment details.</Typography>
              }
            </Box>
            {payment.qr_code_url && (
              <Box sx={{ textAlign: 'center', flexShrink: 0 }}>
                <img src={payment.qr_code_url} alt="Pay via QR" style={{ width: 90, height: 90, objectFit: 'contain', border: `1px solid ${BORDER}`, borderRadius: 8, padding: 4 }} />
                <Typography sx={{ fontSize: '0.65rem', color: SECONDARY, mt: 0.5 }}>Scan to Pay</Typography>
              </Box>
            )}
          </Box>
        </Box>
        {/* Terms */}
        <Box>
          <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: ACCENT, mb: 1.5 }}>Terms & Conditions</Typography>
          <Typography sx={{ fontSize: '0.78rem', color: SECONDARY, lineHeight: 1.6, whiteSpace: 'pre-line' }}>
            {policies.terms_and_conditions || 'Standard terms apply. Subject to availability.'}
          </Typography>
          {policies.payment_terms && (
            <Box sx={{ mt: 2 }}>
              <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: ACCENT, mb: 0.5 }}>Payment Terms</Typography>
              <Typography sx={{ fontSize: '0.78rem', color: SECONDARY, lineHeight: 1.6 }}>{policies.payment_terms}</Typography>
            </Box>
          )}
          {policies.cancellation_policy && (
            <Box sx={{ mt: 2 }}>
              <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: ACCENT, mb: 0.5 }}>Cancellation Policy</Typography>
              <Typography sx={{ fontSize: '0.78rem', color: SECONDARY, lineHeight: 1.6 }}>{policies.cancellation_policy}</Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* ── FOOTER ── */}
      <Box sx={{ mt: 4, pt: 3, borderTop: `2px solid ${ACCENT}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: ACCENT }}>{company.name}</Typography>
          <Typography sx={{ fontSize: '0.75rem', color: SECONDARY }}>{company.address}</Typography>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Typography sx={{ fontSize: '0.78rem', color: SECONDARY }}>{company.email}</Typography>
          <Typography sx={{ fontSize: '0.78rem', color: SECONDARY }}>{company.mobile}</Typography>
          <Typography sx={{ fontSize: '0.78rem', color: SECONDARY }}>{company.website}</Typography>
        </Box>
      </Box>
    </Box>
  );
};
