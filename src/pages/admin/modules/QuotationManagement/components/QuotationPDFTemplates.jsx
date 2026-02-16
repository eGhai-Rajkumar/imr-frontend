// src/pages/admin/modules/QuotationManagement/components/QuotationPDFTemplates.jsx
// COMPLETE FILE: All three templates with Modern Professional updated to exact design
import React from 'react';
import { Box, Typography, Divider, Grid } from '@mui/material';
import { Email, Phone, Hotel, FlightTakeoff } from '@mui/icons-material';

// --- Helper to get image URL safely ---
const getImageUrl = (quotation, fieldName) => {
  let url = quotation[fieldName];
  
  if (!url && quotation.trip) {
    url = quotation.trip[fieldName];
  }

  if (fieldName === 'gallery_images' && Array.isArray(url)) {
    return url.filter(img => typeof img === 'string' && img.length > 0);
  }

  return url || '';
};

// =========================================================
// TEMPLATE 1: MODERN PROFESSIONAL (Exact Wanderlust Journeys Design)
// =========================================================
export const ModernProfessionalTemplate = ({ quotation }) => {
  const { 
    client_name, client_email, client_mobile, display_title, overview, 
    itinerary, costing, policies, payment, company, __client_name, 
    __client_email, __client_mobile, transport_details
  } = quotation;

  const finalClientName = __client_name || client_name || 'Valued Customer';
  const finalClientEmail = __client_email || client_email || '';
  const finalClientMobile = __client_mobile || client_mobile || '';
  const heroImage = getImageUrl(quotation, 'hero_image');
  const galleryImages = getImageUrl(quotation, 'gallery_images');
  
  const hotelOptions = quotation.hotel_options || [];
  const flightDetails = transport_details?.flight_details || null;
  const groundTransport = transport_details?.ground_transport || null;

  return (
    <Box sx={{ 
      background: '#f5f5f5',
      minHeight: '100vh',
      fontFamily: 'Arial, Helvetica, sans-serif',
      p: 3
    }}>
      {/* HEADER */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #4472C4 0%, #5B9BD5 100%)',
        color: '#fff',
        p: 2,
        borderRadius: '8px',
        mb: 2,
        pageBreakInside: 'avoid',
        breakInside: 'avoid'
      }}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ 
              width: 35, 
              height: 35, 
              borderRadius: '50%', 
              bgcolor: '#fff', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Box sx={{ 
                width: 28, 
                height: 28, 
                borderRadius: '50%', 
                bgcolor: '#4472C4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '0.7rem',
                fontWeight: 'bold',
                overflow: 'hidden'
              }}>
                {company?.logo_url ? (
                  <img src={company.logo_url} alt="Logo" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  'LOGO'
                )}
              </Box>
            </Box>
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '1.1rem', lineHeight: 1.2 }}>
                {company?.name || 'Wanderlust Journeys'}
              </Typography>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', opacity: 0.9 }}>
                Your Adventure Partner
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6} sx={{ textAlign: { xs: 'left', md: 'right' }, mt: { xs: 1, md: 0 } }}>
            <Typography variant="caption" sx={{ fontSize: '0.65rem', display: 'block', lineHeight: 1.4 }}>
              <strong>Address:</strong> {company?.address || '123 Travel Lane, City, 12345'}
            </Typography>
            <Typography variant="caption" sx={{ fontSize: '0.65rem', display: 'block', lineHeight: 1.4 }}>
              <strong>Contact:</strong> {company?.mobile || '+1 (555) 123-4567'}
            </Typography>
            <Typography variant="caption" sx={{ fontSize: '0.65rem', display: 'block', lineHeight: 1.4 }}>
              <strong>Email:</strong> {company?.email || 'info@wanderlust.com'}
            </Typography>
            <Typography variant="caption" sx={{ fontSize: '0.65rem', display: 'block', lineHeight: 1.4 }}>
              <strong>GST No:</strong> {payment?.gst_number || '22ABCDE1234F1Z5'}
            </Typography>
          </Grid>
        </Grid>
      </Box>

      {/* HERO IMAGE WITH TITLE OVERLAY */}
      <Box sx={{ 
        background: heroImage 
          ? `linear-gradient(rgba(84, 110, 122, 0.7), rgba(84, 110, 122, 0.7)), url(${heroImage})`
          : 'linear-gradient(135deg, #546E7A 0%, #607D8B 100%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#fff',
        p: 4,
        borderRadius: '8px',
        mb: 2,
        minHeight: '140px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pageBreakInside: 'avoid',
        breakInside: 'avoid'
      }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', textAlign: 'center', fontSize: '1.4rem' }}>
          {display_title || 'Quotation for a Trip to Paris'}
        </Typography>
      </Box>

      {/* MAIN CONTENT */}
      <Grid container spacing={2}>
        {/* LEFT COLUMN */}
        <Grid item xs={12} md={7}>

          {/* CUSTOMER DETAILS */}
          <Box sx={{ 
            bgcolor: '#fff', 
            p: 2, 
            borderRadius: '6px', 
            mb: 2,
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            pageBreakInside: 'avoid',
            breakInside: 'avoid'
          }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1.5, fontSize: '0.9rem' }}>
              Customer Details
            </Typography>
            <Grid container spacing={1.5}>
              <Grid item xs={6}>
                <Typography variant="caption" sx={{ fontSize: '0.75rem', display: 'block' }}>
                  <strong>Name:</strong> {finalClientName}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" sx={{ fontSize: '0.75rem', display: 'block' }}>
                  <strong>Email:</strong> {finalClientEmail}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" sx={{ fontSize: '0.75rem', display: 'block' }}>
                  <strong>Contact:</strong> {finalClientMobile}
                </Typography>
              </Grid>
              {company?.name && (
                <Grid item xs={6}>
                  <Typography variant="caption" sx={{ fontSize: '0.75rem', display: 'block' }}>
                    <strong>Company:</strong> {company.name}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Box>

          {/* DESTINATION HIGHLIGHTS */}
          {overview && (
            <Box sx={{ 
              bgcolor: '#fff', 
              p: 2, 
              borderRadius: '6px', 
              mb: 2,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              pageBreakInside: 'avoid',
              breakInside: 'avoid'
            }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1.5, fontSize: '0.9rem' }}>
                Destination Highlights
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '0.75rem', lineHeight: 1.6, color: '#333', whiteSpace: 'pre-line' }}>
                {overview}
              </Typography>
            </Box>
          )}

          {/* HOTEL OPTIONS */}
          {hotelOptions && hotelOptions.length > 0 && (
            <Box sx={{ mb: 2, pageBreakInside: 'avoid', breakInside: 'avoid' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1.5, fontSize: '0.9rem' }}>
                Hotel Options
              </Typography>
              <Grid container spacing={1.5}>
                {hotelOptions.map((hotel, idx) => (
                  <Grid item xs={12} sm={6} key={idx}>
                    <Box sx={{ bgcolor: '#fff', borderRadius: '6px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                      <Box sx={{ 
                        height: 140, 
                        bgcolor: '#E0E0E0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#999',
                        fontSize: '0.85rem',
                        fontWeight: '500'
                      }}>
                        {hotel.image_url ? (
                          <img src={hotel.image_url} alt={hotel.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          `Hotel Option ${idx + 1}`
                        )}
                      </Box>
                      <Box sx={{ p: 1.5 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', fontSize: '0.8rem', mb: 0.5 }}>
                          {hotel.name}
                        </Typography>
                        <Typography variant="caption" sx={{ fontSize: '0.7rem', lineHeight: 1.4, color: '#666', display: 'block' }}>
                          {hotel.description}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* ITINERARY */}
          {itinerary && itinerary.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1.5, fontSize: '0.9rem' }}>
                Day-Wise Itinerary
              </Typography>
              {itinerary.map((day, idx) => (
                <Grid container spacing={1} key={idx} sx={{ mb: 1.5, pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                  <Grid item xs={3} sm={2.5}>
                    <Box sx={{ 
                      bgcolor: '#5B9BD5', 
                      color: '#fff', 
                      p: 1.5,
                      borderRadius: '6px',
                      textAlign: 'center',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minHeight: '80px'
                    }}>
                      <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '0.9rem', lineHeight: 1.2 }}>
                        {day.title?.split(':')[0]?.trim() || day.title?.split(' ').slice(0, 2).join(' ') || `Day ${day.day}`}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={9} sm={9.5}>
                    <Box sx={{ 
                      bgcolor: '#fff', 
                      p: 1.5, 
                      borderRadius: '6px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                      height: '100%'
                    }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', fontSize: '0.8rem', mb: 0.5, color: '#333' }}>
                        {day.title?.includes(':') ? day.title : `Day ${day.day}: ${day.title}`}
                      </Typography>
                      <Typography variant="caption" sx={{ fontSize: '0.7rem', lineHeight: 1.4, color: '#666', display: 'block', mb: 0.5 }}>
                        {day.description}
                      </Typography>
                      {(day.hotel || day.activities || day.meal_plan) && (
                        <Box sx={{ mt: 0.5, pt: 0.5, borderTop: '1px solid #eee' }}>
                          {day.hotel && (
                            <Typography variant="caption" sx={{ fontSize: '0.65rem', display: 'block', color: '#555' }}>
                              <strong>Hotel:</strong> {day.hotel}
                            </Typography>
                          )}
                          {day.activities && (
                            <Typography variant="caption" sx={{ fontSize: '0.65rem', display: 'block', color: '#555' }}>
                              <strong>Activities:</strong> {day.activities}
                            </Typography>
                          )}
                          {day.meal_plan && (
                            <Typography variant="caption" sx={{ fontSize: '0.65rem', display: 'block', color: '#555' }}>
                              <strong>Meal Plan:</strong> {day.meal_plan}
                            </Typography>
                          )}
                        </Box>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              ))}
            </Box>
          )}
        </Grid>

        {/* RIGHT COLUMN */}
        <Grid item xs={12} md={5}>
          {/* TRANSPORT */}
          {(flightDetails || groundTransport) && (
            <Box sx={{ 
              bgcolor: '#fff', 
              p: 2, 
              borderRadius: '6px', 
              mb: 2,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              pageBreakInside: 'avoid',
              breakInside: 'avoid'
            }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1.5, fontSize: '0.9rem' }}>
                Transport Details
              </Typography>
              
              {flightDetails && (
                <>
                  <Typography variant="caption" sx={{ fontWeight: 'bold', fontSize: '0.75rem', display: 'block', mb: 0.5 }}>
                    Flight Details
                  </Typography>
                  <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.3, color: '#555' }}>
                    Airline: {flightDetails.airline}, Flight: {flightDetails.flight}
                  </Typography>
                  <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 1, color: '#555' }}>
                    Departure: {flightDetails.departure}, Arrival: {flightDetails.arrival}
                  </Typography>
                </>
              )}

              {groundTransport && (
                <>
                  <Typography variant="caption" sx={{ fontWeight: 'bold', fontSize: '0.75rem', display: 'block', mb: 0.5 }}>
                    Ground Transport
                  </Typography>
                  <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', color: '#555' }}>
                    {groundTransport}
                  </Typography>
                </>
              )}
            </Box>
          )}

          {/* INCLUSIONS */}
          <Box sx={{ 
            bgcolor: '#E8F5E9', 
            border: '1px solid #A5D6A7',
            p: 1.5, 
            borderRadius: '6px', 
            mb: 1.5,
            pageBreakInside: 'avoid',
            breakInside: 'avoid'
          }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', fontSize: '0.8rem', mb: 1, color: '#2E7D32', display: 'flex', alignItems: 'center' }}>
              <Box component="span" sx={{ mr: 0.5, fontSize: '1rem' }}>✅</Box> Inclusions
            </Typography>
            <Typography variant="caption" component="div" sx={{ fontSize: '0.7rem', lineHeight: 1.5, color: '#1B5E20' }}>
              • Round-trip international flights<br />
              • 4 nights of luxury accommodation<br />
              • Daily breakfast and specified dinners<br />
              • All airport transfers and city tours<br />
              • Entry fees to mentioned attractions
            </Typography>
          </Box>

          {/* EXCLUSIONS */}
          <Box sx={{ 
            bgcolor: '#FFEBEE', 
            border: '1px solid #EF9A9A',
            p: 1.5, 
            borderRadius: '6px', 
            mb: 2,
            pageBreakInside: 'avoid',
            breakInside: 'avoid'
          }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', fontSize: '0.8rem', mb: 1, color: '#C62828', display: 'flex', alignItems: 'center' }}>
              <Box component="span" sx={{ mr: 0.5, fontSize: '1rem' }}>❌</Box> Exclusions
            </Typography>
            <Typography variant="caption" component="div" sx={{ fontSize: '0.7rem', lineHeight: 1.5, color: '#B71C1C' }}>
              • Visa fees and travel insurance<br />
              • Lunches and meals not specified<br />
              • Personal expenses and gratuities<br />
              • Optional tours and activities
            </Typography>
          </Box>

          {/* TOTAL COST */}
          {costing?.total_amount && (
            <Box sx={{ 
              bgcolor: '#FFF9C4', 
              border: '2px solid #FBC02D',
              p: 2, 
              borderRadius: '6px', 
              mb: 2,
              textAlign: 'center',
              pageBreakInside: 'avoid',
              breakInside: 'avoid'
            }}>
              <Typography variant="caption" sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#F57F17', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 0.5 }}>
                <Box component="span" sx={{ mr: 0.5, fontSize: '1rem' }}>📊</Box> Total Trip Cost
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#E65100', fontSize: '2rem', lineHeight: 1 }}>
                ${costing.total_amount.toLocaleString('en-US')} USD
              </Typography>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', color: '#555', display: 'block', mt: 0.3 }}>
                (per person, based on double occupancy)
              </Typography>
            </Box>
          )}

          {/* PAYMENT DETAILS */}
          {(payment?.bank_name || payment?.account_number || payment?.qr_code_url) && (
            <Box sx={{ 
              bgcolor: '#E3F2FD', 
              border: '1px solid #90CAF9',
              p: 2, 
              borderRadius: '6px', 
              mb: 2,
              pageBreakInside: 'avoid',
              breakInside: 'avoid'
            }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', fontSize: '0.85rem', mb: 1.5, color: '#1565C0' }}>
                Payment Details
              </Typography>
              {payment?.bank_name && (
                <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.3 }}>
                  <strong>Bank Name:</strong> {payment.bank_name}
                </Typography>
              )}
              {payment?.bank_address && (
                <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.3 }}>
                  <strong>Address:</strong> {payment.bank_address}
                </Typography>
              )}
              {payment?.account_number && (
                <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.3 }}>
                  <strong>Account Number:</strong> {payment.account_number}
                </Typography>
              )}
              {payment?.ifsc_code && (
                <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 1 }}>
                  <strong>IFSC Code:</strong> {payment.ifsc_code}
                </Typography>
              )}

              {payment?.qr_code_url && (
                <Box sx={{ textAlign: 'center', mt: 1.5, p: 1.5, bgcolor: '#fff', borderRadius: '6px' }}>
                  <Typography variant="caption" sx={{ fontWeight: 'bold', fontSize: '0.75rem', display: 'block', mb: 1 }}>
                    QR Code
                  </Typography>
                  <Box sx={{ 
                    width: 100, 
                    height: 100, 
                    bgcolor: '#f5f5f5', 
                    mx: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '4px',
                    border: '1px solid #ddd'
                  }}>
                    <img 
                      src={payment.qr_code_url} 
                      alt="Payment QR" 
                      style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }}
                    />
                  </Box>
                </Box>
              )}
            </Box>
          )}

          {/* PAYMENT TERMS */}
          {policies?.payment_terms && (
            <Box sx={{ 
              bgcolor: '#FFF3E0', 
              border: '1px solid #FFB74D',
              p: 1.5, 
              borderRadius: '6px', 
              mb: 1.5,
              pageBreakInside: 'avoid',
              breakInside: 'avoid'
            }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', fontSize: '0.8rem', mb: 1, color: '#E65100' }}>
                Payment Terms
              </Typography>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', lineHeight: 1.5, color: '#555', whiteSpace: 'pre-line' }}>
                {policies.payment_terms}
              </Typography>
            </Box>
          )}

          {/* CANCELLATION POLICY */}
          {policies?.cancellation_policy && (
            <Box sx={{ 
              bgcolor: '#FCE4EC', 
              border: '1px solid #F48FB1',
              p: 1.5, 
              borderRadius: '6px', 
              mb: 1.5,
              pageBreakInside: 'avoid',
              breakInside: 'avoid'
            }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', fontSize: '0.8rem', mb: 1, color: '#C2185B' }}>
                Cancellation & Refund Policy
              </Typography>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', lineHeight: 1.5, color: '#555', whiteSpace: 'pre-line' }}>
                {policies.cancellation_policy}
              </Typography>
            </Box>
          )}

          {/* TERMS */}
          {policies?.terms_and_conditions && (
            <Box sx={{ 
              bgcolor: '#F3E5F5', 
              border: '1px solid #CE93D8',
              p: 1.5, 
              borderRadius: '6px', 
              mb: 1.5,
              pageBreakInside: 'avoid',
              breakInside: 'avoid'
            }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', fontSize: '0.8rem', mb: 1, color: '#6A1B9A' }}>
                Terms and Conditions
              </Typography>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', lineHeight: 1.5, color: '#555', whiteSpace: 'pre-line' }}>
                {policies.terms_and_conditions}
              </Typography>
            </Box>
          )}

          {/* SALES REP */}
          {(quotation.agent?.name || quotation.agent?.contact || quotation.agent?.email) && (
            <Box sx={{ 
              bgcolor: '#E0F2F1', 
              border: '1px solid #80CBC4',
              p: 1.5, 
              borderRadius: '6px', 
              mb: 2,
              pageBreakInside: 'avoid',
              breakInside: 'avoid'
            }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', fontSize: '0.8rem', mb: 1, color: '#00695C' }}>
                Sales Representative
              </Typography>
              {quotation.agent?.name && (
                <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.3 }}>
                  <strong>Name:</strong> {quotation.agent.name}
                </Typography>
              )}
              {quotation.agent?.contact && (
                <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.3 }}>
                  <strong>Contact:</strong> {quotation.agent.contact}
                </Typography>
              )}
              {quotation.agent?.email && (
                <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block' }}>
                  <strong>Email:</strong> {quotation.agent.email}
                </Typography>
              )}
            </Box>
          )}

          {/* GALLERY */}
          {galleryImages && galleryImages.length > 0 && (
            <Box sx={{ 
              bgcolor: '#fff', 
              p: 1.5, 
              borderRadius: '6px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              pageBreakInside: 'avoid',
              breakInside: 'avoid'
            }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', fontSize: '0.85rem', mb: 1, color: '#333' }}>
                Trip Gallery
              </Typography>
              <Grid container spacing={1}>
                {galleryImages.slice(0, 6).map((img, idx) => (
                  <Grid item xs={4} key={idx}>
                    <Box sx={{ 
                      height: 80, 
                      borderRadius: '4px',
                      overflow: 'hidden',
                      bgcolor: '#5B9BD5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontSize: '0.7rem'
                    }}>
                      {img ? (
                        <img src={img} alt={`Gallery ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        `Image ${idx + 1}`
                      )}
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Grid>
      </Grid>

      {/* FOOTER */}
      <Box sx={{ 
        bgcolor: '#37474F', 
        color: '#fff', 
        p: 2, 
        borderRadius: '6px',
        mt: 3,
        textAlign: 'center',
        pageBreakInside: 'avoid',
        breakInside: 'avoid'
      }}>
        <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.3 }}>
          <strong>Contact:</strong> {company?.mobile || '+1 (555) 123-4567'} | <strong>Email:</strong> {company?.email || 'info@wanderlust.com'}
        </Typography>
        <Typography variant="caption" sx={{ fontSize: '0.65rem' }}>
          © {new Date().getFullYear()} {company?.name || 'Wanderlust Journeys'}. All rights reserved.
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
          ✨ {company?.name || 'Luxury Holidays Planners'} ✨
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
          ✨ Package Overview
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
              📸 Moments to Come
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
            🗓️ Your Journey, Day by Day
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
                Day {day.day} • {day.title}
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
          💎 Investment Details
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
                  Quantity: {item.quantity} × ₹{item.unit_price?.toLocaleString('en-IN')}
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#8B4513' }}>
                ₹{(item.quantity * item.unit_price)?.toLocaleString('en-IN')}
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
              ₹{costing?.total_amount?.toLocaleString('en-IN')}
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
          📜 Important Guidelines
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
          💳 Payment Information
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
// TEMPLATE 3: MINIMALIST CLASSIC (Preserved Original)
// =========================================================
export const MinimalistClassicTemplate = ({ quotation }) => {
  const { 
    client_name, client_email, client_mobile, display_title, overview, 
    itinerary, costing, policies, payment, company, __client_name, 
    __client_email, __client_mobile
  } = quotation;

  const finalClientName = __client_name || client_name || 'Customer';
  const finalClientEmail = __client_email || client_email || '';
  const finalClientMobile = __client_mobile || client_mobile || '';
  const heroImage = getImageUrl(quotation, 'hero_image');
  const galleryImages = getImageUrl(quotation, 'gallery_images');

  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      
      <Box sx={{ 
        bgcolor: '#fff', 
        p: 3,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        pageBreakInside: 'avoid',
        breakInside: 'avoid'
      }}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ 
                width: 40, 
                height: 40, 
                borderRadius: '50%', 
                bgcolor: '#4A90E2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 'bold'
              }}>
                T
              </Box>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333' }}>
                  {company?.name || 'TechYaadi'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Your Journey, Our Priority
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item>
            <Typography variant="caption" sx={{ display: 'block', textAlign: 'right' }}>
              {company?.address || '123 Global Avenue, New York, NY 10001'}
            </Typography>
            <Typography variant="caption" sx={{ display: 'block', textAlign: 'right' }}>
              Phone: {company?.mobile || '+1(000) 555-0199'} | Email: {company?.email || 'info@techyaadi.com'}
            </Typography>
          </Grid>
        </Grid>
      </Box>

      {heroImage && (
        <Box sx={{ 
          height: 200, 
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          pageBreakInside: 'avoid',
          breakInside: 'avoid'
        }}>
          <Box sx={{ 
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            bgcolor: 'rgba(0,0,0,0.6)',
            color: '#fff',
            p: 2
          }}>
            <Typography variant="h4" fontWeight="bold">
              {display_title || 'Your Himalayan Adventure'}
            </Typography>
            <Typography variant="subtitle1">
              The Manali Bliss - {itinerary?.length || 7} Days / {(itinerary?.length || 7) - 1} Nights
            </Typography>
          </Box>
        </Box>
      )}

      <Box sx={{ maxWidth: '1200px', mx: 'auto', p: 3 }}>
        
        <Box sx={{ 
          bgcolor: '#fff', 
          p: 3, 
          borderRadius: 2, 
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          mb: 3,
          pageBreakInside: 'avoid',
          breakInside: 'avoid'
        }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1, color: '#333' }}>
                Quotation Details
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Quote Number: #{quotation.id || 'WE2025-MANAL-002'}
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Customer Name</Typography>
                  <Typography variant="body1" fontWeight="medium">{finalClientName}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Contact Details</Typography>
                  <Typography variant="body2">{finalClientEmail}</Typography>
                  <Typography variant="body2">{finalClientMobile}</Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ 
                bgcolor: '#E3F2FD', 
                p: 2, 
                borderRadius: 2, 
                textAlign: 'center',
                border: '2px solid #2196F3'
              }}>
                <Typography variant="subtitle2" sx={{ mb: 1, color: '#1976D2' }}>
                  Total Package Cost
                </Typography>
                <Typography variant="h4" fontWeight="bold" color="primary">
                  ₹{costing?.total_amount?.toLocaleString('en-IN') || '1,90,000'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  For {costing?.pax || '2'} Pax
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ 
          bgcolor: '#fff', 
          p: 3, 
          borderRadius: 2, 
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          mb: 3,
          pageBreakInside: 'avoid',
          breakInside: 'avoid'
        }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, pb: 1, borderBottom: '2px solid #000' }}>
            Package Highlights
          </Typography>
          <Typography variant="body2" sx={{ lineHeight: 1.8, color: '#555', whiteSpace: 'pre-line' }}>
            {overview || 'Discover the majestic beauty of the Himalayas with our exclusive tour. This package is designed for thrill-seekers and nature lovers, offering a perfect mix of scenic beauty, adventure sports, and cultural exploration in Manali.'}
          </Typography>
        </Box>

        {itinerary && itinerary.length > 0 && (
          <Box sx={{ 
            bgcolor: '#fff', 
            p: 3, 
            borderRadius: 2, 
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            mb: 3
          }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, pb: 1, borderBottom: '2px solid #000' }}>
              Day-Wise Itinerary
            </Typography>
            {itinerary.map((day, idx) => (
              <Box 
                key={idx} 
                sx={{ 
                  mb: 2, 
                  pb: 2, 
                  borderBottom: idx < itinerary.length - 1 ? '1px solid #eee' : 'none',
                  pageBreakInside: 'avoid',
                  breakInside: 'avoid'
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, color: '#333' }}>
                  Day {day.day}: {day.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7, mb: 1, whiteSpace: 'pre-line' }}>
                  {day.description}
                </Typography>
                <Grid container spacing={2} sx={{ mt: 0.5 }}>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="caption" sx={{ color: '#666' }}>
                      <strong>Hotel:</strong> {day.hotel || 'Hotel SVH / Hotel Himgiri'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="caption" sx={{ color: '#666' }}>
                      <strong>Meal Plan:</strong> {day.meal_plan || 'Breakfast'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="caption" sx={{ color: '#666' }}>
                      <strong>Activities:</strong> {day.activities || 'Sightseeing'}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            ))}
          </Box>
        )}

        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <Box sx={{ 
              bgcolor: '#fff', 
              p: 3, 
              borderRadius: 2, 
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              height: '100%',
              pageBreakInside: 'avoid',
              breakInside: 'avoid'
            }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, pb: 1, borderBottom: '2px solid #000' }}>
                Inclusions & Exclusions
              </Typography>
              
              <Typography variant="subtitle2" fontWeight="bold" color="success.main" sx={{ mb: 1 }}>
                INCLUSIONS:
              </Typography>
              <Typography variant="body2" component="div" sx={{ mb: 2, lineHeight: 1.6 }}>
                • Round-trip flights (DEL to KUU)<br />
                • {itinerary?.length || 6} nights accommodation<br />
                • Daily breakfast<br />
                • All airport transfers and ground transport
              </Typography>

              <Typography variant="subtitle2" fontWeight="bold" color="error.main" sx={{ mb: 1 }}>
                EXCLUSIONS:
              </Typography>
              <Typography variant="body2" component="div" sx={{ lineHeight: 1.6 }}>
                • Lunch and dinner (unless specified)<br />
                • Personal expenses and Travel Insurance<br />
                • Tips and gratuities
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{ 
              bgcolor: '#fff', 
              p: 3, 
              borderRadius: 2, 
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              height: '100%',
              pageBreakInside: 'avoid',
              breakInside: 'avoid'
            }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, pb: 1, borderBottom: '2px solid #000' }}>
                Accommodation & Transport
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Hotel sx={{ fontSize: 18 }} /> Accommodation Details:
                </Typography>
                <Typography variant="body2" sx={{ ml: 3, fontWeight: 'medium', mb: 0.5 }}>
                  Hotel SVH / Hotel Himgiri (4-star)
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ ml: 3 }}>
                  Cozy hotels offering warm hospitality and stunning views.
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FlightTakeoff sx={{ fontSize: 18 }} /> Transport Details:
                </Typography>
                <Typography variant="body2" sx={{ ml: 3, fontWeight: 'medium', mb: 0.5 }}>
                  Ground Transport:
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ ml: 3 }}>
                  All ground transportation in Manali via Toyota Innova or similar.
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {galleryImages && galleryImages.length > 0 && (
          <Box sx={{ 
            bgcolor: '#fff', 
            p: 3, 
            borderRadius: 2, 
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            mb: 3,
            pageBreakInside: 'avoid',
            breakInside: 'avoid'
          }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, pb: 1, borderBottom: '2px solid #000' }}>
              Destination Gallery
            </Typography>
            <Grid container spacing={2}>
              {galleryImages.slice(0, 6).map((img, idx) => (
                <Grid item xs={4} key={idx}>
                  <Box sx={{ 
                    width: '100%', 
                    height: 150,
                    borderRadius: 2,
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    bgcolor: '#2196F3',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff'
                  }}>
                    {img ? (
                      <img 
                        src={img} 
                        alt={`Gallery ${idx + 1}`} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      `Image ${idx + 1}`
                    )}
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ 
              bgcolor: '#fff', 
              p: 3, 
              borderRadius: 2, 
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              height: '100%',
              pageBreakInside: 'avoid',
              breakInside: 'avoid'
            }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, pb: 1, borderBottom: '2px solid #000' }}>
                Payment & Booking Details
              </Typography>
              
              <Box sx={{ mb: 2, p: 2, border: '1px dashed #000', borderRadius: 1 }}>
                <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>Bank Transfer:</Typography>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  <strong>A/C Name:</strong> {payment?.account_name || 'TechYaadi'}
                </Typography>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  <strong>A/C Number:</strong> {payment?.account_number || '76543210'}
                </Typography>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  <strong>Bank:</strong> {payment?.bank_name || 'Bank International of Asia'}
                </Typography>
                <Typography variant="body2">
                  <strong>IFSC:</strong> {payment?.ifsc_code || 'ABCI01234567'}
                </Typography>
              </Box>

              {payment?.qr_code_url && (
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                  <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>Scan to Pay</Typography>
                  <Box sx={{ 
                    width: 120, 
                    height: 120, 
                    bgcolor: '#fff', 
                    mx: 'auto',
                    p: 1,
                    border: '1px dashed #ccc',
                    borderRadius: 1
                  }}>
                    <img 
                      src={payment.qr_code_url} 
                      alt="Payment QR Code" 
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  </Box>
                  {payment.upi_ids?.[0] && (
                    <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                      UPI ID: {payment.upi_ids[0]}
                    </Typography>
                  )}
                </Box>
              )}
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ 
              bgcolor: '#fff', 
              p: 3, 
              borderRadius: 2, 
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              height: '100%',
              pageBreakInside: 'avoid',
              breakInside: 'avoid'
            }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, pb: 1, borderBottom: '2px solid #000' }}>
                Payment Policy & Terms
              </Typography>
              
              <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>Payment Policy:</Typography>
              <Typography variant="body2" sx={{ lineHeight: 1.6, mb: 2, whiteSpace: 'pre-line' }}>
                {policies?.payment_terms || '50% non-refundable advance payment is required to confirm the booking. The remaining 50% is due 30 days before travel start.'}
              </Typography>

              <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>Terms and Conditions:</Typography>
              <Typography variant="body2" sx={{ lineHeight: 1.6, mb: 2, whiteSpace: 'pre-line' }}>
                {policies?.terms_and_conditions || 'All bookings are subject to change based on flight and hotel availability. Travel insurance is highly recommended.'}
              </Typography>

              <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>Cancellation Policy:</Typography>
              <Typography variant="body2" sx={{ lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                {policies?.cancellation_policy || 'All cancellations are subject to the terms and conditions outlined in the booking policy.'}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ 
          mt: 4,
          bgcolor: '#E3F2FD', 
          p: 4, 
          borderRadius: 2, 
          textAlign: 'center',
          border: '3px solid #2196F3',
          pageBreakInside: 'avoid',
          breakInside: 'avoid'
        }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1, color: '#1976D2' }}>
            Total Package Cost
          </Typography>
          <Typography variant="h2" fontWeight="bold" color="primary">
            ₹{costing?.total_amount?.toLocaleString('en-IN') || '1,90,000'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            For {costing?.pax || '2'} Pax | All Inclusive
          </Typography>
        </Box>
      </Box>

      <Box sx={{ 
        bgcolor: '#263238', 
        color: '#fff', 
        p: 3, 
        mt: 4,
        textAlign: 'center',
        pageBreakInside: 'avoid',
        breakInside: 'avoid'
      }}>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Your Dedicated Travel Specialist:</strong> {quotation.agent?.name || 'Alex Chen'} ({quotation.agent?.email || 'alex.c@techyaadi.com'})
        </Typography>
        <Typography variant="caption">
          Visit our website: {company?.website || 'www.techyaadi.com'}
        </Typography>
        <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
          © {new Date().getFullYear()} {company?.name || 'TechYaadi'}. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};