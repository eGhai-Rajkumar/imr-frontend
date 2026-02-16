// src/pages/admin/modules/QuotationManagement/components/QuotationPDFDocument.jsx
// PROPER PDF GENERATION using @react-pdf/renderer
import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

// PDF Styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: '#ffffff',
    fontSize: 11
  },
  header: {
    marginBottom: 20,
    borderBottom: '3px solid #667eea',
    paddingBottom: 15
  },
  companyName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 10
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 10,
    marginTop: 20,
    borderBottom: '2px solid #667eea',
    paddingBottom: 5
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
    fontWeight: 'bold'
  },
  text: {
    fontSize: 10,
    lineHeight: 1.6,
    marginBottom: 8,
    color: '#333'
  },
  heroImage: {
    width: '100%',
    maxHeight: 250,
    objectFit: 'cover',
    marginBottom: 20,
    borderRadius: 8
  },
  galleryImage: {
    width: '30%',
    height: 120,
    objectFit: 'cover',
    marginRight: '3%',
    marginBottom: 10,
    borderRadius: 5
  },
  galleryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    marginTop: 10
  },
  dayBox: {
    backgroundColor: '#f8f9ff',
    padding: 12,
    marginBottom: 12,
    borderLeft: '4px solid #667eea',
    borderRadius: 4
  },
  dayTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333'
  },
  table: {
    marginTop: 10,
    marginBottom: 20
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #ddd',
    paddingVertical: 8,
    paddingHorizontal: 5
  },
  tableHeader: {
    backgroundColor: '#667eea',
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 11
  },
  tableCell: {
    flex: 1,
    fontSize: 10
  },
  tableCellBold: {
    flex: 1,
    fontSize: 10,
    fontWeight: 'bold'
  },
  totalRow: {
    backgroundColor: '#667eea',
    color: '#ffffff',
    fontWeight: 'bold',
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  qrCodeContainer: {
    marginTop: 20,
    alignItems: 'center',
    backgroundColor: '#f9f9ff',
    padding: 15,
    borderRadius: 8
  },
  qrCode: {
    width: 150,
    height: 150,
    marginTop: 10,
    border: '2px solid #667eea',
    borderRadius: 8
  },
  footer: {
    marginTop: 30,
    paddingTop: 15,
    borderTop: '1px solid #ddd',
    textAlign: 'center',
    fontSize: 9,
    color: '#666'
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 15,
    flexWrap: 'wrap'
  },
  infoBox: {
    width: '48%',
    marginRight: '2%',
    marginBottom: 10
  }
});

const QuotationPDFDocument = ({ quotation }) => {
  const {
    company, display_title, overview, hero_image, gallery_images,
    itinerary, costing, policies, payment,
    __client_name, __client_email, __client_mobile
  } = quotation;

  const clientName = __client_name || quotation.client_name || 'Valued Customer';
  const clientEmail = __client_email || quotation.client_email || '';
  const clientMobile = __client_mobile || quotation.client_mobile || '';

  const heroImg = hero_image || quotation.trip?.hero_image;
  const galleryImgs = gallery_images || quotation.trip?.gallery_images || [];

  return (
    <Document>
      {/* PAGE 1: Header, Hero, Overview, Gallery */}
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.companyName}>{company?.name || 'Holidays Planners'}</Text>
          <Text style={styles.text}>{company?.email} | {company?.mobile}</Text>
          {company?.website && <Text style={styles.text}>{company.website}</Text>}
        </View>

        {/* Hero Image */}
        {heroImg && (
          <Image src={heroImg} style={styles.heroImage} />
        )}

        {/* Title & Client Info */}
        <Text style={styles.title}>{display_title || 'Exclusive Travel Quotation'}</Text>
        <Text style={[styles.text, { marginBottom: 15 }]}>Quotation ID: #{quotation.id || 'DRAFT'}</Text>

        <View style={styles.infoRow}>
          <View style={styles.infoBox}>
            <Text style={styles.subtitle}>Prepared For:</Text>
            <Text style={styles.text}>{clientName}</Text>
            {clientEmail && <Text style={styles.text}>📧 {clientEmail}</Text>}
            {clientMobile && <Text style={styles.text}>📱 {clientMobile}</Text>}
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.subtitle}>Quotation Date:</Text>
            <Text style={styles.text}>
              {new Date(quotation.date || Date.now()).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </Text>
          </View>
        </View>

        {/* Overview */}
        <Text style={styles.title}>Package Overview</Text>
        <Text style={styles.text}>{overview || 'Your personalized travel experience awaits.'}</Text>

        {/* Gallery Images */}
        {galleryImgs && galleryImgs.length > 0 && (
          <View>
            <Text style={styles.title}>Gallery</Text>
            <View style={styles.galleryContainer}>
              {galleryImgs.slice(0, 6).map((img, idx) => (
                <Image key={idx} src={img} style={styles.galleryImage} />
              ))}
            </View>
          </View>
        )}
      </Page>

      {/* PAGE 2+: Itinerary */}
      {itinerary && itinerary.length > 0 && (
        <Page size="A4" style={styles.page}>
          <Text style={styles.title}>📅 Day-wise Itinerary</Text>
          {itinerary.map((day, idx) => (
            <View key={idx} style={styles.dayBox}>
              <Text style={styles.dayTitle}>Day {day.day}: {day.title}</Text>
              <Text style={styles.text}>{day.description}</Text>
            </View>
          ))}
        </Page>
      )}

      {/* PAGE 3: Costing & Policies */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>💰 Investment Details</Text>
        {costing?.items && costing.items.length > 0 && (
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, { flex: 2 }]}>Item Name</Text>
              <Text style={styles.tableCell}>Qty</Text>
              <Text style={styles.tableCell}>Unit Price</Text>
              <Text style={styles.tableCell}>Total</Text>
            </View>
            {costing.items.map((item, idx) => (
              <View key={idx} style={styles.tableRow}>
                <Text style={[styles.tableCell, { flex: 2 }]}>{item.name}</Text>
                <Text style={styles.tableCell}>{item.quantity}</Text>
                <Text style={styles.tableCell}>₹{item.unit_price?.toLocaleString('en-IN')}</Text>
                <Text style={styles.tableCellBold}>₹{(item.quantity * item.unit_price)?.toLocaleString('en-IN')}</Text>
              </View>
            ))}
            <View style={styles.totalRow}>
              <Text style={{ fontSize: 13, fontWeight: 'bold' }}>GRAND TOTAL:</Text>
              <Text style={{ fontSize: 14, fontWeight: 'bold' }}>₹{costing.total_amount?.toLocaleString('en-IN')}</Text>
            </View>
          </View>
        )}

        {/* Policies */}
        <Text style={styles.title}>📋 Terms & Policies</Text>
        {policies?.payment_terms && (
          <View style={{ marginBottom: 12 }}>
            <Text style={styles.subtitle}>Payment Terms</Text>
            <Text style={styles.text}>{policies.payment_terms}</Text>
          </View>
        )}
        {policies?.cancellation_policy && (
          <View style={{ marginBottom: 12 }}>
            <Text style={styles.subtitle}>Cancellation Policy</Text>
            <Text style={styles.text}>{policies.cancellation_policy}</Text>
          </View>
        )}
        {policies?.terms_and_conditions && (
          <View style={{ marginBottom: 12 }}>
            <Text style={styles.subtitle}>Terms & Conditions</Text>
            <Text style={styles.text}>{policies.terms_and_conditions}</Text>
          </View>
        )}

        {/* Payment Info */}
        <Text style={styles.title}>💳 Payment Information</Text>
        <View style={styles.infoRow}>
          {payment?.bank_name && (
            <View style={styles.infoBox}>
              <Text style={styles.subtitle}>Bank Name</Text>
              <Text style={styles.text}>{payment.bank_name}</Text>
            </View>
          )}
          {payment?.account_number && (
            <View style={styles.infoBox}>
              <Text style={styles.subtitle}>Account Number</Text>
              <Text style={styles.text}>{payment.account_number}</Text>
            </View>
          )}
          {payment?.ifsc_code && (
            <View style={styles.infoBox}>
              <Text style={styles.subtitle}>IFSC Code</Text>
              <Text style={styles.text}>{payment.ifsc_code}</Text>
            </View>
          )}
          {payment?.branch_name && (
            <View style={styles.infoBox}>
              <Text style={styles.subtitle}>Branch</Text>
              <Text style={styles.text}>{payment.branch_name}</Text>
            </View>
          )}
          {payment?.gst_number && (
            <View style={styles.infoBox}>
              <Text style={styles.subtitle}>GST Number</Text>
              <Text style={styles.text}>{payment.gst_number}</Text>
            </View>
          )}
          {payment?.upi_ids?.[0] && (
            <View style={styles.infoBox}>
              <Text style={styles.subtitle}>UPI ID</Text>
              <Text style={styles.text}>{payment.upi_ids[0]}</Text>
            </View>
          )}
        </View>

        {/* QR Code */}
        {payment?.qr_code_url && (
          <View style={styles.qrCodeContainer}>
            <Text style={styles.subtitle}>Scan to Pay</Text>
            <Image src={payment.qr_code_url} style={styles.qrCode} />
          </View>
        )}

        {/* Footer */}
        <Text style={styles.footer}>
          Thank you for choosing {company?.name || 'Holidays Planners'}. We look forward to making your journey memorable!
        </Text>
      </Page>
    </Document>
  );
};

export default QuotationPDFDocument;