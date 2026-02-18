// src/pages/admin/modules/QuotationManagement/components/QuotationPDFTemplates.jsx
import React from 'react';
import { Box, Typography, Grid } from '@mui/material';

// --- Helper to get image URL safely ---
const getImageUrl = (quotation, fieldName) => {
  let url = quotation[fieldName];
  if (!url && quotation.trip) url = quotation.trip[fieldName];
  if (fieldName === 'gallery_images' && Array.isArray(url))
    return url.filter(img => typeof img === 'string' && img.length > 0);
  return url || '';
};

// =========================================================
// ANIMATION STYLES (injected once, print-safe)
// =========================================================
const AnimationStyles = () => (
  <style>{`
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(24px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeInLeft {
      from { opacity: 0; transform: translateX(-24px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    @keyframes shimmer {
      0%   { background-position: -400px 0; }
      100% { background-position: 400px 0; }
    }
    @keyframes pulseBorder {
      0%, 100% { box-shadow: 0 0 0 0 rgba(212,160,23,0.4); }
      50%       { box-shadow: 0 0 0 8px rgba(212,160,23,0); }
    }
    .anim-fadeup  { animation: fadeInUp 0.6s ease both; }
    .anim-left    { animation: fadeInLeft 0.5s ease both; }
    .anim-delay-1 { animation-delay: 0.1s; }
    .anim-delay-2 { animation-delay: 0.2s; }
    .anim-delay-3 { animation-delay: 0.3s; }
    .anim-delay-4 { animation-delay: 0.4s; }
    .pulse-gold   { animation: pulseBorder 2s infinite; }
    @media print {
      .anim-fadeup, .anim-left, .pulse-gold { animation: none !important; opacity: 1 !important; transform: none !important; }
    }
  `}</style>
);

// =========================================================
// TEMPLATE 1: MODERN PROFESSIONAL
// =========================================================
export const ModernProfessionalTemplate = ({ quotation }) => {
  const {
    client_name, client_email, client_mobile, display_title, overview,
    itinerary, costing, policies, payment, company,
    __client_name, __client_email, __client_mobile, transport_details
  } = quotation;

  const clientName = __client_name || client_name || 'Valued Guest';
  const clientEmail = __client_email || client_email || '';
  const clientMobile = __client_mobile || client_mobile || '';
  const heroImage = getImageUrl(quotation, 'hero_image');
  const galleryImages = getImageUrl(quotation, 'gallery_images');
  const hotelOptions = quotation.hotel_options || [];
  const flightDetails = transport_details?.flight_details || null;
  const groundTransport = transport_details?.ground_transport || null;

  const G = '#D4A017';   // gold
  const DG = '#1B4332';  // dark green
  const MG = '#2D6A4F';  // mid green
  const LG = '#D8F3DC';  // light green bg

  const sectionTitle = (text, delay = '') => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
      <Box sx={{ width: 4, height: 28, bgcolor: G, borderRadius: 2, flexShrink: 0 }} />
      <Typography variant="h6" className={`anim-left ${delay}`}
        sx={{ fontWeight: 800, color: DG, fontSize: '1rem', letterSpacing: 0.3 }}>
        {text}
      </Typography>
    </Box>
  );

  return (
    <Box sx={{ bgcolor: '#F4F6F0', fontFamily: "'Segoe UI', Arial, sans-serif", minHeight: '100vh' }}>
      <AnimationStyles />

      {/* â”€â”€ HEADER â”€â”€ */}
      <Box sx={{
        background: `linear-gradient(135deg, ${DG} 0%, ${MG} 100%)`,
        color: '#fff', px: 4, py: 2.5,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        pageBreakInside: 'avoid', breakInside: 'avoid'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {company?.logo_url ? (
            <img src={company.logo_url} alt="logo"
              style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', border: `2px solid ${G}` }} />
          ) : (
            <Box sx={{
              width: 52, height: 52, borderRadius: '50%', bgcolor: G,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 900, fontSize: '1.3rem', color: DG
            }}>
              {(company?.name || 'IMR')[0]}
            </Box>
          )}
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: '1.25rem', lineHeight: 1.2 }}>
              {company?.name || 'Indian Mountain Rovers'}
            </Typography>
            <Typography sx={{ fontSize: '0.72rem', opacity: 0.8, letterSpacing: 1 }}>
              CRAFTING MOUNTAIN MEMORIES
            </Typography>
          </Box>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          {company?.mobile && <Typography sx={{ fontSize: '0.72rem', opacity: 0.85 }}>ðŸ“ž {company.mobile}</Typography>}
          {company?.email && <Typography sx={{ fontSize: '0.72rem', opacity: 0.85 }}>âœ‰ {company.email}</Typography>}
          {company?.address && <Typography sx={{ fontSize: '0.7rem', opacity: 0.75, maxWidth: 220 }}>{company.address}</Typography>}
          {payment?.gst_number && <Typography sx={{ fontSize: '0.68rem', opacity: 0.7 }}>GST: {payment.gst_number}</Typography>}
        </Box>
      </Box>

      {/* â”€â”€ HERO â”€â”€ */}
      <Box sx={{
        position: 'relative', height: 260, overflow: 'hidden',
        background: heroImage
          ? `linear-gradient(rgba(27,67,50,0.55), rgba(27,67,50,0.75)), url(${heroImage}) center/cover no-repeat`
          : `linear-gradient(135deg, ${DG} 0%, ${MG} 60%, #40916C 100%)`,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        pageBreakInside: 'avoid', breakInside: 'avoid'
      }}>
        <Typography className="anim-fadeup" sx={{
          color: G, fontSize: '0.8rem', fontWeight: 700, letterSpacing: 4,
          textTransform: 'uppercase', mb: 1
        }}>
          Travel Quotation
        </Typography>
        <Typography className="anim-fadeup anim-delay-1" sx={{
          color: '#fff', fontSize: '2rem', fontWeight: 900,
          textAlign: 'center', px: 4, lineHeight: 1.25,
          textShadow: '0 2px 12px rgba(0,0,0,0.5)'
        }}>
          {display_title || 'Your Dream Mountain Journey'}
        </Typography>
        {itinerary?.length > 0 && (
          <Typography className="anim-fadeup anim-delay-2" sx={{
            color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem', mt: 1.5
          }}>
            {itinerary.length} Days Â· {itinerary.length - 1} Nights
          </Typography>
        )}
        {/* gold bottom bar */}
        <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, bgcolor: G }} />
      </Box>

      {/* â”€â”€ BODY â”€â”€ */}
      <Box sx={{ px: 3, py: 3 }}>

        {/* CLIENT CARD */}
        <Box className="anim-fadeup anim-delay-1" sx={{
          bgcolor: '#fff', borderRadius: 3, p: 3, mb: 3,
          boxShadow: '0 4px 20px rgba(27,67,50,0.1)',
          borderLeft: `5px solid ${G}`,
          pageBreakInside: 'avoid', breakInside: 'avoid'
        }}>
          <Typography sx={{ color: DG, fontWeight: 700, fontSize: '0.95rem', mb: 0.5 }}>
            Prepared Exclusively For
          </Typography>
          <Typography sx={{ color: DG, fontWeight: 900, fontSize: '1.5rem', mb: 1.5 }}>
            {clientName}
          </Typography>
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            {clientEmail && <Typography sx={{ fontSize: '0.82rem', color: '#555' }}>âœ‰ {clientEmail}</Typography>}
            {clientMobile && <Typography sx={{ fontSize: '0.82rem', color: '#555' }}>ðŸ“ž {clientMobile}</Typography>}
            <Typography sx={{ fontSize: '0.82rem', color: '#888' }}>
              Ref: #{quotation.id || 'IMR-2025'}
            </Typography>
          </Box>
        </Box>

        {/* OVERVIEW */}
        {overview && (
          <Box className="anim-fadeup anim-delay-2" sx={{
            bgcolor: '#fff', borderRadius: 3, p: 3, mb: 3,
            boxShadow: '0 4px 20px rgba(27,67,50,0.08)',
            pageBreakInside: 'avoid', breakInside: 'avoid'
          }}>
            {sectionTitle('Trip Overview')}
            <Typography sx={{ fontSize: '0.88rem', lineHeight: 1.8, color: '#444', whiteSpace: 'pre-line' }}>
              {overview}
            </Typography>
          </Box>
        )}

        {/* ITINERARY TIMELINE */}
        {itinerary?.length > 0 && (
          <Box className="anim-fadeup anim-delay-2" sx={{
            bgcolor: '#fff', borderRadius: 3, p: 3, mb: 3,
            boxShadow: '0 4px 20px rgba(27,67,50,0.08)'
          }}>
            {sectionTitle('Day-by-Day Itinerary')}
            {itinerary.map((day, idx) => (
              <Box key={idx} sx={{
                display: 'flex', gap: 2, mb: 2.5,
                pageBreakInside: 'avoid', breakInside: 'avoid'
              }}>
                {/* Day badge + line */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                  <Box sx={{
                    width: 44, height: 44, borderRadius: '50%',
                    background: `linear-gradient(135deg, ${DG}, ${MG})`,
                    color: '#fff', display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', flexShrink: 0
                  }}>
                    <Typography sx={{ fontSize: '0.55rem', fontWeight: 700, lineHeight: 1, opacity: 0.8 }}>DAY</Typography>
                    <Typography sx={{ fontSize: '0.95rem', fontWeight: 900, lineHeight: 1 }}>{day.day || idx + 1}</Typography>
                  </Box>
                  {idx < itinerary.length - 1 && (
                    <Box sx={{ width: 2, flex: 1, minHeight: 20, bgcolor: '#D8F3DC', mt: 0.5 }} />
                  )}
                </Box>
                {/* Content */}
                <Box sx={{ flex: 1, pb: 1 }}>
                  <Typography sx={{ fontWeight: 800, color: DG, fontSize: '0.95rem', mb: 0.5 }}>
                    {day.title || `Day ${day.day || idx + 1}`}
                  </Typography>
                  <Typography sx={{ fontSize: '0.82rem', color: '#555', lineHeight: 1.7, mb: 1, whiteSpace: 'pre-line' }}>
                    {day.description}
                  </Typography>
                  {(day.hotel || day.meal_plan || day.activities) && (
                    <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                      {day.hotel && (
                        <Box sx={{ bgcolor: LG, px: 1.5, py: 0.4, borderRadius: 10 }}>
                          <Typography sx={{ fontSize: '0.7rem', color: DG, fontWeight: 600 }}>ðŸ¨ {day.hotel}</Typography>
                        </Box>
                      )}
                      {day.meal_plan && (
                        <Box sx={{ bgcolor: '#FFF8E1', px: 1.5, py: 0.4, borderRadius: 10 }}>
                          <Typography sx={{ fontSize: '0.7rem', color: '#7B5E00', fontWeight: 600 }}>ðŸ½ {day.meal_plan}</Typography>
                        </Box>
                      )}
                      {day.activities && (
                        <Box sx={{ bgcolor: '#E8EAF6', px: 1.5, py: 0.4, borderRadius: 10 }}>
                          <Typography sx={{ fontSize: '0.7rem', color: '#3949AB', fontWeight: 600 }}>âš¡ {day.activities}</Typography>
                        </Box>
                      )}
                    </Box>
                  )}
                </Box>
              </Box>
            ))}
          </Box>
        )}

        {/* HOTEL OPTIONS */}
        {hotelOptions.length > 0 && (
          <Box className="anim-fadeup anim-delay-3" sx={{
            bgcolor: '#fff', borderRadius: 3, p: 3, mb: 3,
            boxShadow: '0 4px 20px rgba(27,67,50,0.08)',
            pageBreakInside: 'avoid', breakInside: 'avoid'
          }}>
            {sectionTitle('Hotel Options')}
            <Grid container spacing={2}>
              {hotelOptions.map((hotel, idx) => (
                <Grid item xs={12} sm={6} key={idx}>
                  <Box sx={{ borderRadius: 2, overflow: 'hidden', border: '1px solid #E0E0E0' }}>
                    {hotel.image_url ? (
                      <img src={hotel.image_url} alt={hotel.name}
                        style={{ width: '100%', height: 130, objectFit: 'cover' }} />
                    ) : (
                      <Box sx={{
                        height: 130, bgcolor: LG, display: 'flex', alignItems: 'center',
                        justifyContent: 'center', color: MG, fontSize: '0.8rem', fontWeight: 600
                      }}>
                        ðŸ¨ Hotel Option {idx + 1}
                      </Box>
                    )}
                    <Box sx={{ p: 1.5 }}>
                      <Typography sx={{ fontWeight: 700, fontSize: '0.88rem', color: DG }}>{hotel.name}</Typography>
                      {hotel.description && (
                        <Typography sx={{ fontSize: '0.75rem', color: '#666', mt: 0.5, lineHeight: 1.5 }}>
                          {hotel.description}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* INCLUSIONS / EXCLUSIONS */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <Box className="anim-fadeup anim-delay-2" sx={{
              bgcolor: '#F0FFF4', border: `1px solid #74C69D`, borderRadius: 3, p: 2.5, height: '100%',
              pageBreakInside: 'avoid', breakInside: 'avoid'
            }}>
              <Typography sx={{ fontWeight: 800, color: '#1B5E20', fontSize: '0.9rem', mb: 1.5 }}>
                âœ… Inclusions
              </Typography>
              <Typography component="div" sx={{ fontSize: '0.8rem', color: '#2E7D32', lineHeight: 2 }}>
                {policies?.inclusions ? (
                  policies.inclusions.split('\n').map((line, i) => line.trim() && <div key={i}>â€¢ {line.trim()}</div>)
                ) : (
                  <>
                    <div>â€¢ Accommodation as per itinerary</div>
                    <div>â€¢ Daily breakfast & specified meals</div>
                    <div>â€¢ All transfers & sightseeing</div>
                    <div>â€¢ Entry fees to mentioned attractions</div>
                    <div>â€¢ Dedicated tour manager</div>
                  </>
                )}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box className="anim-fadeup anim-delay-3" sx={{
              bgcolor: '#FFF5F5', border: `1px solid #FC8181`, borderRadius: 3, p: 2.5, height: '100%',
              pageBreakInside: 'avoid', breakInside: 'avoid'
            }}>
              <Typography sx={{ fontWeight: 800, color: '#C62828', fontSize: '0.9rem', mb: 1.5 }}>
                âŒ Exclusions
              </Typography>
              <Typography component="div" sx={{ fontSize: '0.8rem', color: '#B71C1C', lineHeight: 2 }}>
                {policies?.exclusions ? (
                  policies.exclusions.split('\n').map((line, i) => line.trim() && <div key={i}>â€¢ {line.trim()}</div>)
                ) : (
                  <>
                    <div>â€¢ Airfare / train tickets</div>
                    <div>â€¢ Visa & travel insurance</div>
                    <div>â€¢ Personal expenses & tips</div>
                    <div>â€¢ Meals not mentioned</div>
                    <div>â€¢ Optional activities</div>
                  </>
                )}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* TRANSPORT */}
        {(flightDetails || groundTransport) && (
          <Box className="anim-fadeup anim-delay-3" sx={{
            bgcolor: '#fff', borderRadius: 3, p: 3, mb: 3,
            boxShadow: '0 4px 20px rgba(27,67,50,0.08)',
            pageBreakInside: 'avoid', breakInside: 'avoid'
          }}>
            {sectionTitle('Transport Details')}
            <Grid container spacing={2}>
              {flightDetails && (
                <Grid item xs={12} sm={6}>
                  <Box sx={{ bgcolor: '#EFF6FF', borderRadius: 2, p: 2 }}>
                    <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: '#1E40AF', mb: 1 }}>âœˆ Flight Details</Typography>
                    <Typography sx={{ fontSize: '0.8rem', color: '#1E3A8A' }}>
                      {flightDetails.airline && <span><strong>Airline:</strong> {flightDetails.airline}<br /></span>}
                      {flightDetails.flight && <span><strong>Flight:</strong> {flightDetails.flight}<br /></span>}
                      {flightDetails.departure && <span><strong>Departure:</strong> {flightDetails.departure}<br /></span>}
                      {flightDetails.arrival && <span><strong>Arrival:</strong> {flightDetails.arrival}</span>}
                    </Typography>
                  </Box>
                </Grid>
              )}
              {groundTransport && (
                <Grid item xs={12} sm={6}>
                  <Box sx={{ bgcolor: LG, borderRadius: 2, p: 2 }}>
                    <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: DG, mb: 1 }}>ðŸš— Ground Transport</Typography>
                    <Typography sx={{ fontSize: '0.8rem', color: MG }}>{groundTransport}</Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Box>
        )}

        {/* COST BREAKDOWN */}
        {costing && (
          <Box className="anim-fadeup anim-delay-3" sx={{
            bgcolor: '#fff', borderRadius: 3, p: 3, mb: 3,
            boxShadow: '0 4px 20px rgba(27,67,50,0.08)',
            pageBreakInside: 'avoid', breakInside: 'avoid'
          }}>
            {sectionTitle('Cost Breakdown')}
            {costing.items?.length > 0 && (
              <Box sx={{ mb: 2, borderRadius: 2, overflow: 'hidden', border: '1px solid #E0E0E0' }}>
                {/* Table header */}
                <Box sx={{ display: 'flex', bgcolor: DG, color: '#fff', px: 2, py: 1 }}>
                  <Typography sx={{ flex: 3, fontSize: '0.78rem', fontWeight: 700 }}>Description</Typography>
                  <Typography sx={{ flex: 1, fontSize: '0.78rem', fontWeight: 700, textAlign: 'center' }}>Qty</Typography>
                  <Typography sx={{ flex: 1.5, fontSize: '0.78rem', fontWeight: 700, textAlign: 'right' }}>Unit Price</Typography>
                  <Typography sx={{ flex: 1.5, fontSize: '0.78rem', fontWeight: 700, textAlign: 'right' }}>Total</Typography>
                </Box>
                {costing.items.map((item, idx) => (
                  <Box key={idx} sx={{
                    display: 'flex', px: 2, py: 1.2,
                    bgcolor: idx % 2 === 0 ? '#FAFAFA' : '#fff',
                    borderTop: '1px solid #F0F0F0'
                  }}>
                    <Typography sx={{ flex: 3, fontSize: '0.82rem', color: '#333' }}>{item.name}</Typography>
                    <Typography sx={{ flex: 1, fontSize: '0.82rem', color: '#555', textAlign: 'center' }}>{item.quantity}</Typography>
                    <Typography sx={{ flex: 1.5, fontSize: '0.82rem', color: '#555', textAlign: 'right' }}>
                      â‚¹{item.unit_price?.toLocaleString('en-IN')}
                    </Typography>
                    <Typography sx={{ flex: 1.5, fontSize: '0.82rem', fontWeight: 600, color: DG, textAlign: 'right' }}>
                      â‚¹{(item.quantity * item.unit_price)?.toLocaleString('en-IN')}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
            {/* Grand Total */}
            <Box className="pulse-gold" sx={{
              background: `linear-gradient(135deg, ${DG} 0%, ${MG} 100%)`,
              borderRadius: 3, p: 3, textAlign: 'center',
              pageBreakInside: 'avoid', breakInside: 'avoid'
            }}>
              <Typography sx={{ color: G, fontSize: '0.8rem', fontWeight: 700, letterSpacing: 2, mb: 0.5 }}>
                TOTAL PACKAGE COST
              </Typography>
              <Typography sx={{ color: '#fff', fontSize: '2.4rem', fontWeight: 900, lineHeight: 1 }}>
                â‚¹{costing.total_amount?.toLocaleString('en-IN') || 'â€”'}
              </Typography>
              {costing.pax && (
                <Typography sx={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.8rem', mt: 0.5 }}>
                  For {costing.pax} Pax Â· All Inclusive
                </Typography>
              )}
            </Box>
          </Box>
        )}

        {/* PAYMENT DETAILS */}
        {(payment?.bank_name || payment?.account_number || payment?.qr_code_url) && (
          <Box className="anim-fadeup anim-delay-4" sx={{
            bgcolor: '#fff', borderRadius: 3, p: 3, mb: 3,
            boxShadow: '0 4px 20px rgba(27,67,50,0.08)',
            pageBreakInside: 'avoid', breakInside: 'avoid'
          }}>
            {sectionTitle('Payment Details')}
            <Grid container spacing={2} alignItems="flex-start">
              <Grid item xs={12} sm={payment?.qr_code_url ? 7 : 12}>
                <Box sx={{ bgcolor: '#F8F9FA', borderRadius: 2, p: 2, border: '1px dashed #CCC' }}>
                  {payment?.bank_name && <Typography sx={{ fontSize: '0.82rem', mb: 0.5 }}><strong>Bank:</strong> {payment.bank_name}</Typography>}
                  {payment?.bank_address && <Typography sx={{ fontSize: '0.82rem', mb: 0.5 }}><strong>Address:</strong> {payment.bank_address}</Typography>}
                  {payment?.account_name && <Typography sx={{ fontSize: '0.82rem', mb: 0.5 }}><strong>A/C Name:</strong> {payment.account_name}</Typography>}
                  {payment?.account_number && <Typography sx={{ fontSize: '0.82rem', mb: 0.5 }}><strong>A/C No:</strong> {payment.account_number}</Typography>}
                  {payment?.ifsc_code && <Typography sx={{ fontSize: '0.82rem', mb: 0.5 }}><strong>IFSC:</strong> {payment.ifsc_code}</Typography>}
                  {payment?.upi_ids?.[0] && <Typography sx={{ fontSize: '0.82rem' }}><strong>UPI:</strong> {payment.upi_ids[0]}</Typography>}
                </Box>
              </Grid>
              {payment?.qr_code_url && (
                <Grid item xs={12} sm={5}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#F8F9FA', borderRadius: 2, border: '1px dashed #CCC' }}>
                    <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: DG, mb: 1 }}>Scan to Pay</Typography>
                    <img src={payment.qr_code_url} alt="QR"
                      style={{ width: 110, height: 110, objectFit: 'contain', border: `2px solid ${G}`, borderRadius: 8 }} />
                  </Box>
                </Grid>
              )}
            </Grid>
          </Box>
        )}

        {/* POLICIES */}
        {(policies?.payment_terms || policies?.cancellation_policy || policies?.terms_and_conditions) && (
          <Box className="anim-fadeup anim-delay-4" sx={{
            bgcolor: '#fff', borderRadius: 3, p: 3, mb: 3,
            boxShadow: '0 4px 20px rgba(27,67,50,0.08)',
            pageBreakInside: 'avoid', breakInside: 'avoid'
          }}>
            {sectionTitle('Policies & Terms')}
            {policies.payment_terms && (
              <Box sx={{ mb: 2 }}>
                <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: DG, mb: 0.5 }}>ðŸ’³ Payment Terms</Typography>
                <Typography sx={{ fontSize: '0.8rem', color: '#555', lineHeight: 1.7, whiteSpace: 'pre-line' }}>{policies.payment_terms}</Typography>
              </Box>
            )}
            {policies.cancellation_policy && (
              <Box sx={{ mb: 2 }}>
                <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: '#C62828', mb: 0.5 }}>ðŸš« Cancellation Policy</Typography>
                <Typography sx={{ fontSize: '0.8rem', color: '#555', lineHeight: 1.7, whiteSpace: 'pre-line' }}>{policies.cancellation_policy}</Typography>
              </Box>
            )}
            {policies.terms_and_conditions && (
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: '#555', mb: 0.5 }}>ðŸ“‹ Terms & Conditions</Typography>
                <Typography sx={{ fontSize: '0.8rem', color: '#555', lineHeight: 1.7, whiteSpace: 'pre-line' }}>{policies.terms_and_conditions}</Typography>
              </Box>
            )}
          </Box>
        )}

        {/* GALLERY */}
        {galleryImages?.length > 0 && (
          <Box className="anim-fadeup anim-delay-4" sx={{
            bgcolor: '#fff', borderRadius: 3, p: 3, mb: 3,
            boxShadow: '0 4px 20px rgba(27,67,50,0.08)',
            pageBreakInside: 'avoid', breakInside: 'avoid'
          }}>
            {sectionTitle('Destination Gallery')}
            <Grid container spacing={1.5}>
              {galleryImages.slice(0, 6).map((img, idx) => (
                <Grid item xs={4} key={idx}>
                  <Box sx={{ height: 110, borderRadius: 2, overflow: 'hidden', bgcolor: LG }}>
                    <img src={img} alt={`Gallery ${idx + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* AGENT */}
        {(quotation.agent?.name || quotation.agent?.contact || quotation.agent?.email) && (
          <Box sx={{
            bgcolor: LG, borderRadius: 3, p: 2.5, mb: 3,
            border: `1px solid #74C69D`,
            pageBreakInside: 'avoid', breakInside: 'avoid'
          }}>
            <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: DG, mb: 1 }}>ðŸ‘¤ Your Travel Specialist</Typography>
            {quotation.agent.name && <Typography sx={{ fontSize: '0.82rem', color: '#333' }}><strong>Name:</strong> {quotation.agent.name}</Typography>}
            {quotation.agent.contact && <Typography sx={{ fontSize: '0.82rem', color: '#333' }}><strong>Phone:</strong> {quotation.agent.contact}</Typography>}
            {quotation.agent.email && <Typography sx={{ fontSize: '0.82rem', color: '#333' }}><strong>Email:</strong> {quotation.agent.email}</Typography>}
          </Box>
        )}
      </Box>

      {/* â”€â”€ FOOTER â”€â”€ */}
      <Box sx={{
        background: `linear-gradient(135deg, ${DG} 0%, ${MG} 100%)`,
        color: '#fff', px: 4, py: 3, textAlign: 'center',
        pageBreakInside: 'avoid', breakInside: 'avoid'
      }}>
        <Typography sx={{ color: G, fontWeight: 800, fontSize: '1.1rem', mb: 0.5 }}>
          Ready to Book Your Adventure?
        </Typography>
        <Typography sx={{ fontSize: '0.82rem', opacity: 0.85, mb: 1 }}>
          Contact us today and let's make your mountain dream a reality.
        </Typography>
        <Typography sx={{ fontSize: '0.75rem', opacity: 0.65 }}>
          {company?.mobile && `ðŸ“ž ${company.mobile}  `}
          {company?.email && `âœ‰ ${company.email}  `}
          {company?.website && `ðŸŒ ${company.website}`}
        </Typography>
        <Typography sx={{ fontSize: '0.65rem', opacity: 0.5, mt: 1 }}>
          Â© {new Date().getFullYear()} {company?.name || 'Indian Mountain Rovers'}. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

// =========================================================
// TEMPLATE 2: LUXURY GOLD (Preserved Original)
// =========================================================
export const LuxuryGoldTemplate = ({ quotation }) => {
  const {
    client_name, client_email, client_mobile, display_title, overview,
    itinerary, costing, policies, payment, company, __client_name,
    __client_email, __client_mobile
  } = quotation;

  const finalClientName = __client_name || client_name || 'Distinguished Guest';
  const finalClientEmail = __client_email || client_email || '';
  const finalClientMobile = __client_mobile || client_mobile || '';
  const heroImage = getImageUrl(quotation, 'hero_image');
  const galleryImages = getImageUrl(quotation, 'gallery_images');

  return (
    <Box sx={{
      background: '#fff',
      minHeight: '100vh',
      p: 4,
      fontFamily: 'Georgia, serif'
    }}>
      <Box sx={{
        textAlign: 'center',
        mb: 5,
        pb: 3,
        borderBottom: '5px solid #D4AF37',
        background: 'linear-gradient(90deg, #FFF8DC 0%, #FAEBD7 100%)',
        p: 3,
        borderRadius: 2,
        pageBreakInside: 'avoid',
        breakInside: 'avoid'
      }}>
        <Typography variant="h2" sx={{
          fontWeight: 'bold',
          color: '#8B4513',
          textShadow: '1px 1px 3px rgba(212,175,55,0.5)',
          fontFamily: 'Georgia, serif',
          mb: 1
        }}>
          âœ¨ {company?.name || 'Luxury Holidays Planners'} âœ¨
        </Typography>
        <Typography variant="h6" sx={{ color: '#D4AF37', fontStyle: 'italic', mt: 2, fontWeight: 'bold' }}>
          Crafting Premium Travel Experiences
        </Typography>
      </Box>

      {heroImage && (
        <Box sx={{
          mb: 4,
          borderRadius: 4,
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          pageBreakInside: 'avoid',
          breakInside: 'avoid'
        }}>
          <img
            src={heroImage}
            alt="Trip Hero"
            style={{ width: '100%', height: '350px', objectFit: 'cover' }}
          />
        </Box>
      )}

      <Box sx={{
        bgcolor: '#fff',
        p: 5,
        borderRadius: 4,
        boxShadow: '0 15px 50px rgba(0,0,0,0.1)',
        mb: 4,
        border: '2px solid #D4AF37',
        pageBreakInside: 'avoid',
        breakInside: 'avoid'
      }}>
        <Typography variant="h3" sx={{
          fontWeight: 'bold',
          color: '#D4AF37',
          mb: 3,
          fontFamily: 'Georgia, serif',
          borderBottom: '3px solid #D4AF37',
          pb: 2
        }}>
          {display_title || 'Exclusive Travel Quotation'}
        </Typography>
        <Typography variant="body1" sx={{ lineHeight: 2, fontSize: '1.1rem', color: '#555', mb: 3 }}>
          Dear <Typography component="span" fontWeight="bold" sx={{ color: '#8B4513' }}>{finalClientName}</Typography>, we are absolutely delighted to present you with an exclusive, tailor-made travel experience
          designed to exceed your expectations. Your journey of a lifetime awaits.
        </Typography>

        <Grid container spacing={2} sx={{ mt: 3, p: 2, bgcolor: '#FFF8DC', borderRadius: 2 }}>
          {finalClientEmail && (
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Email sx={{ color: '#D4AF37', fontSize: 20 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">Email</Typography>
                  <Typography variant="body2" fontWeight="medium">{finalClientEmail}</Typography>
                </Box>
              </Box>
            </Grid>
          )}
          {finalClientMobile && (
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Phone sx={{ color: '#D4AF37', fontSize: 20 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">Mobile</Typography>
                  <Typography variant="body2" fontWeight="medium">{finalClientMobile}</Typography>
                </Box>
              </Box>
            </Grid>
          )}
        </Grid>
      </Box>

      <Box sx={{
        bgcolor: '#fff',
        p: 5,
        borderRadius: 4,
        boxShadow: '0 15px 50px rgba(0,0,0,0.1)',
        mb: 4,
        pageBreakInside: 'avoid',
        breakInside: 'avoid'
      }}>
        <Typography variant="h4" sx={{
          fontWeight: 'bold',
          color: '#8B4513',
          mb: 3,
          fontFamily: 'Georgia, serif'
        }}>
          âœ¨ Package Overview
        </Typography>
        <Divider sx={{ mb: 3, borderColor: '#D4AF37', borderWidth: 2 }} />
        <Typography variant="body1" sx={{ lineHeight: 2, fontSize: '1.05rem', whiteSpace: 'pre-line' }}>
          {overview || 'An unforgettable journey awaits you.'}
        </Typography>
      </Box>

      {galleryImages && galleryImages.length > 0 && (
        <Box sx={{
          bgcolor: '#fff',
          p: 4,
          borderRadius: 4,
          mb: 4,
          boxShadow: '0 15px 50px rgba(0,0,0,0.1)',
          border: '1px solid #D4AF37',
          pageBreakInside: 'avoid',
          breakInside: 'avoid'
        }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, color: '#D4AF37', borderBottom: '3px solid #D4AF37', pb: 1 }}>
            ðŸ“¸ Moments to Come
          </Typography>
          <Grid container spacing={2}>
            {galleryImages.slice(0, 6).map((img, idx) => (
              <Grid item xs={4} key={idx}>
                <img
                  src={img}
                  alt={`Gallery Image ${idx + 1}`}
                  style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px' }}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {itinerary && itinerary.length > 0 && (
        <Box sx={{ bgcolor: '#fff', p: 5, borderRadius: 4, boxShadow: '0 15px 50px rgba(0,0,0,0.1)', mb: 4 }}>
          <Typography variant="h4" sx={{
            fontWeight: 'bold',
            color: '#D4AF37',
            mb: 4,
            fontFamily: 'Georgia, serif',
            borderBottom: '3px solid #D4AF37',
            pb: 2
          }}>
            ðŸ—“ï¸ Your Journey, Day by Day
          </Typography>
          {itinerary.map((day, idx) => (
            <Box key={idx} sx={{
              mb: 2,
              p: 3,
              bgcolor: '#FFF8DC',
              borderRadius: 3,
              borderLeft: '5px solid #D4AF37',
              boxShadow: '0 4px 15px rgba(212,175,55,0.2)',
              pageBreakInside: 'avoid',
              breakInside: 'avoid'
            }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#8B4513', mb: 1 }}>
                Day {day.day} â€¢ {day.title}
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.9, color: '#666', whiteSpace: 'pre-line' }}>
                {day.description}
              </Typography>
            </Box>
          ))}
        </Box>
      )}

      <Box sx={{
        bgcolor: '#fff',
        p: 5,
        borderRadius: 4,
        boxShadow: '0 15px 50px rgba(0,0,0,0.1)',
        mb: 4,
        pageBreakInside: 'avoid',
        breakInside: 'avoid'
      }}>
        <Typography variant="h4" sx={{
          fontWeight: 'bold',
          color: '#D4AF37',
          mb: 4,
          fontFamily: 'Georgia, serif'
        }}>
          ðŸ’Ž Investment Details
        </Typography>
        <Box sx={{ bgcolor: '#FFF8DC', p: 4, borderRadius: 3 }}>
          {costing?.items?.map((item, idx) => (
            <Box key={idx} sx={{
              display: 'flex',
              justifyContent: 'space-between',
              mb: 3,
              pb: 2,
              borderBottom: '2px dashed #D4AF37',
              alignItems: 'center'
            }}>
              <Box>
                <Typography variant="h6" fontWeight="medium">{item.name}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Quantity: {item.quantity} Ã— â‚¹{item.unit_price?.toLocaleString('en-IN')}
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#8B4513' }}>
                â‚¹{(item.quantity * item.unit_price)?.toLocaleString('en-IN')}
              </Typography>
            </Box>
          ))}
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            mt: 4,
            pt: 3,
            borderTop: '4px solid #D4AF37',
            alignItems: 'center'
          }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#8B4513', fontFamily: 'Georgia, serif' }}>
              TOTAL INVESTMENT
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#D4AF37', fontFamily: 'Georgia, serif' }}>
              â‚¹{costing?.total_amount?.toLocaleString('en-IN')}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{
        bgcolor: '#fff',
        p: 5,
        borderRadius: 4,
        boxShadow: '0 15px 50px rgba(0,0,0,0.1)',
        mb: 4,
        pageBreakInside: 'avoid',
        breakInside: 'avoid'
      }}>
        <Typography variant="h4" sx={{
          fontWeight: 'bold',
          color: '#8B4513',
          mb: 4,
          fontFamily: 'Georgia, serif'
        }}>
          ðŸ“œ Important Guidelines
        </Typography>
        {policies?.payment_terms && (
          <>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#D4AF37', mt: 2, mb: 1 }}>
              Payment Terms
            </Typography>
            <Typography variant="body2" sx={{ lineHeight: 1.8, whiteSpace: 'pre-line' }}>
              {policies.payment_terms}
            </Typography>
          </>
        )}
        {policies?.cancellation_policy && (
          <>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#D4AF37', mt: 3, mb: 1 }}>
              Cancellation Policy
            </Typography>
            <Typography variant="body2" sx={{ lineHeight: 1.8, whiteSpace: 'pre-line' }}>
              {policies.cancellation_policy}
            </Typography>
          </>
        )}
        {policies?.terms_and_conditions && (
          <>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#D4AF37', mt: 3, mb: 1 }}>
              Terms & Conditions
            </Typography>
            <Typography variant="body2" sx={{ lineHeight: 1.8, whiteSpace: 'pre-line' }}>
              {policies.terms_and_conditions}
            </Typography>
          </>
        )}
      </Box>

      <Box sx={{
        bgcolor: '#fff',
        p: 5,
        borderRadius: 4,
        boxShadow: '0 15px 50px rgba(0,0,0,0.1)',
        pageBreakInside: 'avoid',
        breakInside: 'avoid'
      }}>
        <Typography variant="h4" sx={{
          fontWeight: 'bold',
          color: '#D4AF37',
          mb: 4,
          fontFamily: 'Georgia, serif'
        }}>
          ðŸ’³ Payment Information
        </Typography>
        <Grid container spacing={3}>
          {payment?.bank_name && (
            <Grid item xs={6}>
              <Typography variant="caption" color="text.secondary">Bank Name</Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{payment.bank_name}</Typography>
            </Grid>
          )}
          {payment?.account_number && (
            <Grid item xs={6}>
              <Typography variant="caption" color="text.secondary">Account Number</Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{payment.account_number}</Typography>
            </Grid>
          )}
          {payment?.ifsc_code && (
            <Grid item xs={6}>
              <Typography variant="caption" color="text.secondary">IFSC Code</Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{payment.ifsc_code}</Typography>
            </Grid>
          )}
          {payment?.upi_ids && payment.upi_ids[0] && (
            <Grid item xs={6}>
              <Typography variant="caption" color="text.secondary">UPI ID</Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{payment.upi_ids[0]}</Typography>
            </Grid>
          )}
        </Grid>

        {payment?.qr_code_url && (
          <Box sx={{ mt: 4, textAlign: 'center', p: 3, bgcolor: '#FFF8DC', borderRadius: 2, border: '1px dashed #D4AF37' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#8B4513' }}>
              Scan to Pay
            </Typography>
            <img
              src={payment.qr_code_url}
              alt="Payment QR Code"
              style={{ maxWidth: '220px', maxHeight: '220px', border: '3px solid #D4AF37', borderRadius: '12px' }}
            />
          </Box>
        )}
      </Box>

      <Box sx={{
        mt: 5,
        textAlign: 'center',
        p: 4,
        bgcolor: '#8B4513',
        color: '#fff',
        borderRadius: 3,
        pageBreakInside: 'avoid',
        breakInside: 'avoid'
      }}>
        <Typography variant="h6" sx={{ mb: 1, color: '#D4AF37', fontFamily: 'Georgia, serif' }}>
          Thank You for Choosing Excellence
        </Typography>
        <Typography variant="body2">
          We look forward to crafting an unforgettable journey for you.
        </Typography>
      </Box>
    </Box>
  );
};

// =========================================================
// TEMPLATE 3: MINIMALIST CLASSIC (Redesigned — Clean & Elegant)
// =========================================================
export const MinimalistClassicTemplate = ({ quotation }) => {
  const {
    client_name, client_email, client_mobile, display_title, overview,
    itinerary, costing, policies, payment, company,
    __client_name, __client_email, __client_mobile, transport_details
  } = quotation;

  const clientName = __client_name || client_name || 'Valued Customer';
  const clientEmail = __client_email || client_email || '';
  const clientMobile = __client_mobile || client_mobile || '';
  const heroImage = getImageUrl(quotation, 'hero_image');
  const galleryImages = getImageUrl(quotation, 'gallery_images');
  const hotelOptions = quotation.hotel_options || [];
  const flightDetails = transport_details?.flight_details || null;
  const groundTransport = transport_details?.ground_transport || null;

  const ACC = '#2563EB'; // single blue accent

  return (
    <Box sx={{
      bgcolor: '#FFFFFF',
      fontFamily: "'Segoe UI', Arial, sans-serif",
      minHeight: '100vh',
      color: '#111'
    }}>
      <style>{`
        @keyframes minFadeIn { from { opacity: 0; } to { opacity: 1; } }
        .min-fade { animation: minFadeIn 0.4s ease both; }
        .min-fade-1 { animation-delay: 0.05s; }
        .min-fade-2 { animation-delay: 0.1s; }
        .min-fade-3 { animation-delay: 0.15s; }
        @media print {
          .min-fade { animation: none !important; opacity: 1 !important; }
        }
      `}</style>

      {/* ── HEADER ── */}
      <Box sx={{
        px: 5, py: 2.5,
        borderBottom: `3px solid ${ACC}`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        pageBreakInside: 'avoid', breakInside: 'avoid'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {company?.logo_url ? (
            <img src={company.logo_url} alt="logo"
              style={{ width: 44, height: 44, borderRadius: 6, objectFit: 'cover' }} />
          ) : (
            <Box sx={{
              width: 44, height: 44, borderRadius: 1, bgcolor: ACC,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 900, fontSize: '1.1rem'
            }}>
              {(company?.name || 'IMR')[0]}
            </Box>
          )}
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', color: '#111' }}>
              {company?.name || 'Indian Mountain Rovers'}
            </Typography>
            {company?.address && (
              <Typography sx={{ fontSize: '0.7rem', color: '#777' }}>{company.address}</Typography>
            )}
          </Box>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Typography sx={{ fontSize: '0.72rem', color: '#555', fontWeight: 700 }}>
            TRAVEL QUOTATION
          </Typography>
          <Typography sx={{ fontSize: '0.7rem', color: '#777' }}>
            Ref: #{quotation.id || 'IMR-2025'}
          </Typography>
          {company?.mobile && (
            <Typography sx={{ fontSize: '0.7rem', color: '#777' }}>{company.mobile}</Typography>
          )}
          {company?.email && (
            <Typography sx={{ fontSize: '0.7rem', color: '#777' }}>{company.email}</Typography>
          )}
        </Box>
      </Box>

      {/* ── HERO IMAGE ── */}
      {heroImage && (
        <Box sx={{
          height: 200, overflow: 'hidden',
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          position: 'relative',
          pageBreakInside: 'avoid', breakInside: 'avoid'
        }}>
          <Box sx={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.65))',
            display: 'flex', flexDirection: 'column',
            justifyContent: 'flex-end', px: 5, pb: 2.5
          }}>
            <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: '1.6rem', lineHeight: 1.2 }}>
              {display_title || 'Your Mountain Journey'}
            </Typography>
            {itinerary?.length > 0 && (
              <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', mt: 0.5 }}>
                {itinerary.length} Days · {itinerary.length - 1} Nights
              </Typography>
            )}
          </Box>
        </Box>
      )}

      {/* ── BODY ── */}
      <Box sx={{ px: 5, py: 3 }}>

        {/* TITLE (if no hero image) */}
        {!heroImage && (
          <Box sx={{ mb: 3, pb: 2, borderBottom: '1px solid #E5E5E5' }}>
            <Typography sx={{ fontWeight: 800, fontSize: '1.6rem', color: '#111' }}>
              {display_title || 'Your Mountain Journey'}
            </Typography>
            {itinerary?.length > 0 && (
              <Typography sx={{ fontSize: '0.85rem', color: '#777', mt: 0.5 }}>
                {itinerary.length} Days · {itinerary.length - 1} Nights
              </Typography>
            )}
          </Box>
        )}

        {/* CLIENT DETAILS */}
        <Box className="min-fade min-fade-1" sx={{
          border: '1px solid #E5E5E5', borderRadius: 2, p: 2.5, mb: 3,
          display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2,
          pageBreakInside: 'avoid', breakInside: 'avoid'
        }}>
          <Box>
            <Typography sx={{ fontSize: '0.7rem', color: '#888', fontWeight: 600, mb: 0.3, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Prepared For
            </Typography>
            <Typography sx={{ fontWeight: 800, fontSize: '1.15rem', color: '#111' }}>{clientName}</Typography>
            {clientEmail && <Typography sx={{ fontSize: '0.8rem', color: '#555', mt: 0.3 }}>{clientEmail}</Typography>}
            {clientMobile && <Typography sx={{ fontSize: '0.8rem', color: '#555' }}>{clientMobile}</Typography>}
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography sx={{ fontSize: '0.7rem', color: '#888', fontWeight: 600, mb: 0.3, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Issued By
            </Typography>
            <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#111' }}>{company?.name || 'Indian Mountain Rovers'}</Typography>
            {payment?.gst_number && <Typography sx={{ fontSize: '0.78rem', color: '#555', mt: 0.3 }}>GST: {payment.gst_number}</Typography>}
          </Box>
        </Box>

        {/* OVERVIEW */}
        {overview && (
          <Box className="min-fade min-fade-1" sx={{
            mb: 3, pb: 3, borderBottom: '1px solid #E5E5E5',
            pageBreakInside: 'avoid', breakInside: 'avoid'
          }}>
            <Typography sx={{ fontWeight: 700, fontSize: '0.78rem', color: ACC, mb: 1, textTransform: 'uppercase', letterSpacing: 0.8 }}>
              Package Overview
            </Typography>
            <Typography sx={{ fontSize: '0.88rem', lineHeight: 1.8, color: '#444', whiteSpace: 'pre-line' }}>
              {overview}
            </Typography>
          </Box>
        )}

        {/* ITINERARY */}
        {itinerary?.length > 0 && (
          <Box className="min-fade min-fade-2" sx={{ mb: 3 }}>
            <Typography sx={{ fontWeight: 700, fontSize: '0.78rem', color: ACC, mb: 2, textTransform: 'uppercase', letterSpacing: 0.8 }}>
              Day-by-Day Itinerary
            </Typography>
            {itinerary.map((day, idx) => (
              <Box key={idx} sx={{
                display: 'flex', gap: 2.5, mb: 2.5,
                pb: 2.5, borderBottom: idx < itinerary.length - 1 ? '1px solid #F0F0F0' : 'none',
                pageBreakInside: 'avoid', breakInside: 'avoid'
              }}>
                <Box sx={{
                  minWidth: 36, height: 36, borderRadius: '50%',
                  border: `2px solid ${ACC}`, color: ACC,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, fontSize: '0.85rem', flexShrink: 0, mt: 0.2
                }}>
                  {day.day || idx + 1}
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.92rem', color: '#111', mb: 0.5 }}>
                    {day.title || `Day ${day.day || idx + 1}`}
                  </Typography>
                  <Typography sx={{ fontSize: '0.82rem', color: '#555', lineHeight: 1.7, mb: 1, whiteSpace: 'pre-line' }}>
                    {day.description}
                  </Typography>
                  {(day.hotel || day.meal_plan || day.activities) && (
                    <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                      {day.hotel && (
                        <Typography sx={{ fontSize: '0.75rem', color: '#777' }}>
                          <strong style={{ color: '#333' }}>Hotel:</strong> {day.hotel}
                        </Typography>
                      )}
                      {day.meal_plan && (
                        <Typography sx={{ fontSize: '0.75rem', color: '#777' }}>
                          <strong style={{ color: '#333' }}>Meals:</strong> {day.meal_plan}
                        </Typography>
                      )}
                      {day.activities && (
                        <Typography sx={{ fontSize: '0.75rem', color: '#777' }}>
                          <strong style={{ color: '#333' }}>Activities:</strong> {day.activities}
                        </Typography>
                      )}
                    </Box>
                  )}
                </Box>
              </Box>
            ))}
          </Box>
        )}

        {/* HOTEL OPTIONS */}
        {hotelOptions.length > 0 && (
          <Box className="min-fade min-fade-2" sx={{
            mb: 3, pb: 3, borderBottom: '1px solid #E5E5E5',
            pageBreakInside: 'avoid', breakInside: 'avoid'
          }}>
            <Typography sx={{ fontWeight: 700, fontSize: '0.78rem', color: ACC, mb: 2, textTransform: 'uppercase', letterSpacing: 0.8 }}>
              Accommodation Options
            </Typography>
            <Grid container spacing={2}>
              {hotelOptions.map((hotel, idx) => (
                <Grid item xs={12} sm={6} key={idx}>
                  <Box sx={{ border: '1px solid #E5E5E5', borderRadius: 2, overflow: 'hidden' }}>
                    {hotel.image_url ? (
                      <img src={hotel.image_url} alt={hotel.name}
                        style={{ width: '100%', height: 110, objectFit: 'cover' }} />
                    ) : (
                      <Box sx={{
                        height: 110, bgcolor: '#F5F5F5', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', color: '#999', fontSize: '0.8rem'
                      }}>
                        Hotel Option {idx + 1}
                      </Box>
                    )}
                    <Box sx={{ p: 1.5 }}>
                      <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: '#111' }}>{hotel.name}</Typography>
                      {hotel.description && (
                        <Typography sx={{ fontSize: '0.75rem', color: '#666', mt: 0.3, lineHeight: 1.5 }}>
                          {hotel.description}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* INCLUSIONS / EXCLUSIONS */}
        <Box className="min-fade min-fade-2" sx={{
          mb: 3, pb: 3, borderBottom: '1px solid #E5E5E5',
          pageBreakInside: 'avoid', breakInside: 'avoid'
        }}>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6}>
              <Typography sx={{ fontWeight: 700, fontSize: '0.78rem', color: '#16A34A', mb: 1.5, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                Inclusions
              </Typography>
              <Typography component="div" sx={{ fontSize: '0.82rem', color: '#444', lineHeight: 2 }}>
                {policies?.inclusions ? (
                  policies.inclusions.split('\n').map((line, i) => line.trim() && <div key={i}>✓ {line.trim()}</div>)
                ) : (
                  <>
                    <div>✓ Accommodation as per itinerary</div>
                    <div>✓ Daily breakfast & specified meals</div>
                    <div>✓ All transfers & sightseeing</div>
                    <div>✓ Entry fees to mentioned attractions</div>
                    <div>✓ Dedicated tour manager</div>
                  </>
                )}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography sx={{ fontWeight: 700, fontSize: '0.78rem', color: '#DC2626', mb: 1.5, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                Exclusions
              </Typography>
              <Typography component="div" sx={{ fontSize: '0.82rem', color: '#444', lineHeight: 2 }}>
                {policies?.exclusions ? (
                  policies.exclusions.split('\n').map((line, i) => line.trim() && <div key={i}>✗ {line.trim()}</div>)
                ) : (
                  <>
                    <div>✗ Airfare / train tickets</div>
                    <div>✗ Visa & travel insurance</div>
                    <div>✗ Personal expenses & tips</div>
                    <div>✗ Meals not mentioned</div>
                    <div>✗ Optional activities</div>
                  </>
                )}
              </Typography>
            </Grid>
          </Grid>
        </Box>

        {/* TRANSPORT */}
        {(flightDetails || groundTransport) && (
          <Box className="min-fade min-fade-2" sx={{
            mb: 3, pb: 3, borderBottom: '1px solid #E5E5E5',
            pageBreakInside: 'avoid', breakInside: 'avoid'
          }}>
            <Typography sx={{ fontWeight: 700, fontSize: '0.78rem', color: ACC, mb: 1.5, textTransform: 'uppercase', letterSpacing: 0.8 }}>
              Transport Details
            </Typography>
            <Grid container spacing={3}>
              {flightDetails && (
                <Grid item xs={12} sm={6}>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.82rem', color: '#333', mb: 0.5 }}>Flight Details</Typography>
                  {flightDetails.airline && <Typography sx={{ fontSize: '0.8rem', color: '#555' }}><strong>Airline:</strong> {flightDetails.airline}</Typography>}
                  {flightDetails.flight && <Typography sx={{ fontSize: '0.8rem', color: '#555' }}><strong>Flight:</strong> {flightDetails.flight}</Typography>}
                  {flightDetails.departure && <Typography sx={{ fontSize: '0.8rem', color: '#555' }}><strong>Departure:</strong> {flightDetails.departure}</Typography>}
                  {flightDetails.arrival && <Typography sx={{ fontSize: '0.8rem', color: '#555' }}><strong>Arrival:</strong> {flightDetails.arrival}</Typography>}
                </Grid>
              )}
              {groundTransport && (
                <Grid item xs={12} sm={6}>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.82rem', color: '#333', mb: 0.5 }}>Ground Transport</Typography>
                  <Typography sx={{ fontSize: '0.8rem', color: '#555' }}>{groundTransport}</Typography>
                </Grid>
              )}
            </Grid>
          </Box>
        )}

        {/* COST BREAKDOWN */}
        {costing && (
          <Box className="min-fade min-fade-3" sx={{
            mb: 3, pb: 3, borderBottom: '1px solid #E5E5E5',
            pageBreakInside: 'avoid', breakInside: 'avoid'
          }}>
            <Typography sx={{ fontWeight: 700, fontSize: '0.78rem', color: ACC, mb: 2, textTransform: 'uppercase', letterSpacing: 0.8 }}>
              Cost Breakdown
            </Typography>
            {costing.items?.length > 0 && (
              <Box sx={{ border: '1px solid #E5E5E5', borderRadius: 2, overflow: 'hidden', mb: 2 }}>
                {/* Header */}
                <Box sx={{ display: 'flex', bgcolor: '#F8F9FA', px: 2, py: 1.2, borderBottom: '1px solid #E5E5E5' }}>
                  <Typography sx={{ flex: 3, fontSize: '0.75rem', fontWeight: 700, color: '#333', textTransform: 'uppercase' }}>Description</Typography>
                  <Typography sx={{ flex: 1, fontSize: '0.75rem', fontWeight: 700, color: '#333', textAlign: 'center', textTransform: 'uppercase' }}>Qty</Typography>
                  <Typography sx={{ flex: 1.5, fontSize: '0.75rem', fontWeight: 700, color: '#333', textAlign: 'right', textTransform: 'uppercase' }}>Unit Price</Typography>
                  <Typography sx={{ flex: 1.5, fontSize: '0.75rem', fontWeight: 700, color: '#333', textAlign: 'right', textTransform: 'uppercase' }}>Total</Typography>
                </Box>
                {costing.items.map((item, idx) => (
                  <Box key={idx} sx={{
                    display: 'flex', px: 2, py: 1.2,
                    bgcolor: idx % 2 === 0 ? '#fff' : '#FAFAFA',
                    borderBottom: '1px solid #F0F0F0'
                  }}>
                    <Typography sx={{ flex: 3, fontSize: '0.82rem', color: '#333' }}>{item.name}</Typography>
                    <Typography sx={{ flex: 1, fontSize: '0.82rem', color: '#555', textAlign: 'center' }}>{item.quantity}</Typography>
                    <Typography sx={{ flex: 1.5, fontSize: '0.82rem', color: '#555', textAlign: 'right' }}>
                      ₹{item.unit_price?.toLocaleString('en-IN')}
                    </Typography>
                    <Typography sx={{ flex: 1.5, fontSize: '0.82rem', fontWeight: 600, color: '#111', textAlign: 'right' }}>
                      ₹{(item.quantity * item.unit_price)?.toLocaleString('en-IN')}
                    </Typography>
                  </Box>
                ))}
                {/* Total row */}
                <Box sx={{
                  display: 'flex', px: 2, py: 1.5,
                  bgcolor: '#F8F9FA', borderTop: `2px solid ${ACC}`
                }}>
                  <Typography sx={{ flex: 5.5, fontSize: '0.88rem', fontWeight: 800, color: '#111' }}>Total Package Cost</Typography>
                  <Typography sx={{ flex: 1.5, fontSize: '1rem', fontWeight: 900, color: ACC, textAlign: 'right' }}>
                    ₹{costing.total_amount?.toLocaleString('en-IN')}
                  </Typography>
                </Box>
              </Box>
            )}
            {/* If no items, show just total */}
            {(!costing.items || costing.items.length === 0) && costing.total_amount && (
              <Box sx={{
                border: `1px solid ${ACC}`, borderRadius: 2, p: 2.5,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <Box>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#111' }}>Total Package Cost</Typography>
                  {costing.pax && <Typography sx={{ fontSize: '0.78rem', color: '#777' }}>For {costing.pax} Pax</Typography>}
                </Box>
                <Typography sx={{ fontWeight: 900, fontSize: '1.5rem', color: ACC }}>
                  ₹{costing.total_amount?.toLocaleString('en-IN')}
                </Typography>
              </Box>
            )}
          </Box>
        )}

        {/* PAYMENT DETAILS */}
        {(payment?.bank_name || payment?.account_number || payment?.qr_code_url) && (
          <Box className="min-fade min-fade-3" sx={{
            mb: 3, pb: 3, borderBottom: '1px solid #E5E5E5',
            pageBreakInside: 'avoid', breakInside: 'avoid'
          }}>
            <Typography sx={{ fontWeight: 700, fontSize: '0.78rem', color: ACC, mb: 2, textTransform: 'uppercase', letterSpacing: 0.8 }}>
              Payment Details
            </Typography>
            <Grid container spacing={3} alignItems="flex-start">
              <Grid item xs={12} sm={payment?.qr_code_url ? 7 : 12}>
                <Box sx={{ border: '1px dashed #CCC', borderRadius: 2, p: 2 }}>
                  {payment?.bank_name && <Typography sx={{ fontSize: '0.82rem', mb: 0.5 }}><strong>Bank:</strong> {payment.bank_name}</Typography>}
                  {payment?.bank_address && <Typography sx={{ fontSize: '0.82rem', mb: 0.5 }}><strong>Address:</strong> {payment.bank_address}</Typography>}
                  {payment?.account_name && <Typography sx={{ fontSize: '0.82rem', mb: 0.5 }}><strong>A/C Name:</strong> {payment.account_name}</Typography>}
                  {payment?.account_number && <Typography sx={{ fontSize: '0.82rem', mb: 0.5 }}><strong>A/C No:</strong> {payment.account_number}</Typography>}
                  {payment?.ifsc_code && <Typography sx={{ fontSize: '0.82rem', mb: 0.5 }}><strong>IFSC:</strong> {payment.ifsc_code}</Typography>}
                  {payment?.upi_ids?.[0] && <Typography sx={{ fontSize: '0.82rem' }}><strong>UPI:</strong> {payment.upi_ids[0]}</Typography>}
                </Box>
              </Grid>
              {payment?.qr_code_url && (
                <Grid item xs={12} sm={5}>
                  <Box sx={{ textAlign: 'center', border: '1px dashed #CCC', borderRadius: 2, p: 2 }}>
                    <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: '#333', mb: 1 }}>Scan to Pay</Typography>
                    <img src={payment.qr_code_url} alt="QR"
                      style={{ width: 100, height: 100, objectFit: 'contain' }} />
                    {payment.upi_ids?.[0] && (
                      <Typography sx={{ fontSize: '0.72rem', color: '#777', mt: 0.5 }}>{payment.upi_ids[0]}</Typography>
                    )}
                  </Box>
                </Grid>
              )}
            </Grid>
          </Box>
        )}

        {/* POLICIES */}
        {(policies?.payment_terms || policies?.cancellation_policy || policies?.terms_and_conditions) && (
          <Box className="min-fade min-fade-3" sx={{
            mb: 3, pb: 3, borderBottom: '1px solid #E5E5E5',
            pageBreakInside: 'avoid', breakInside: 'avoid'
          }}>
            <Typography sx={{ fontWeight: 700, fontSize: '0.78rem', color: ACC, mb: 2, textTransform: 'uppercase', letterSpacing: 0.8 }}>
              Policies & Terms
            </Typography>
            {policies.payment_terms && (
              <Box sx={{ mb: 2 }}>
                <Typography sx={{ fontWeight: 700, fontSize: '0.82rem', color: '#333', mb: 0.5 }}>Payment Terms</Typography>
                <Typography sx={{ fontSize: '0.8rem', color: '#555', lineHeight: 1.7, whiteSpace: 'pre-line' }}>{policies.payment_terms}</Typography>
              </Box>
            )}
            {policies.cancellation_policy && (
              <Box sx={{ mb: 2 }}>
                <Typography sx={{ fontWeight: 700, fontSize: '0.82rem', color: '#333', mb: 0.5 }}>Cancellation Policy</Typography>
                <Typography sx={{ fontSize: '0.8rem', color: '#555', lineHeight: 1.7, whiteSpace: 'pre-line' }}>{policies.cancellation_policy}</Typography>
              </Box>
            )}
            {policies.terms_and_conditions && (
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: '0.82rem', color: '#333', mb: 0.5 }}>Terms & Conditions</Typography>
                <Typography sx={{ fontSize: '0.8rem', color: '#555', lineHeight: 1.7, whiteSpace: 'pre-line' }}>{policies.terms_and_conditions}</Typography>
              </Box>
            )}
          </Box>
        )}

        {/* GALLERY */}
        {galleryImages?.length > 0 && (
          <Box className="min-fade min-fade-3" sx={{
            mb: 3, pb: 3, borderBottom: '1px solid #E5E5E5',
            pageBreakInside: 'avoid', breakInside: 'avoid'
          }}>
            <Typography sx={{ fontWeight: 700, fontSize: '0.78rem', color: ACC, mb: 2, textTransform: 'uppercase', letterSpacing: 0.8 }}>
              Gallery
            </Typography>
            <Grid container spacing={1.5}>
              {galleryImages.slice(0, 6).map((img, idx) => (
                <Grid item xs={4} key={idx}>
                  <Box sx={{ height: 100, borderRadius: 1.5, overflow: 'hidden', bgcolor: '#F5F5F5' }}>
                    <img src={img} alt={`Gallery ${idx + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* AGENT */}
        {(quotation.agent?.name || quotation.agent?.contact || quotation.agent?.email) && (
          <Box sx={{ mb: 3, pageBreakInside: 'avoid', breakInside: 'avoid' }}>
            <Typography sx={{ fontWeight: 700, fontSize: '0.78rem', color: ACC, mb: 1, textTransform: 'uppercase', letterSpacing: 0.8 }}>
              Your Travel Specialist
            </Typography>
            {quotation.agent.name && <Typography sx={{ fontSize: '0.82rem', color: '#333' }}><strong>Name:</strong> {quotation.agent.name}</Typography>}
            {quotation.agent.contact && <Typography sx={{ fontSize: '0.82rem', color: '#333' }}><strong>Phone:</strong> {quotation.agent.contact}</Typography>}
            {quotation.agent.email && <Typography sx={{ fontSize: '0.82rem', color: '#333' }}><strong>Email:</strong> {quotation.agent.email}</Typography>}
          </Box>
        )}
      </Box>

      {/* ── FOOTER ── */}
      <Box sx={{
        px: 5, py: 2, borderTop: `3px solid ${ACC}`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        pageBreakInside: 'avoid', breakInside: 'avoid'
      }}>
        <Typography sx={{ fontSize: '0.75rem', color: '#777' }}>
          {company?.mobile && `${company.mobile}  ·  `}
          {company?.email && `${company.email}  ·  `}
          {company?.website && company.website}
        </Typography>
        <Typography sx={{ fontSize: '0.72rem', color: '#AAA' }}>
          © {new Date().getFullYear()} {company?.name || 'Indian Mountain Rovers'}
        </Typography>
      </Box>
    </Box>
  );
};

