import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';

// Register for premium fonts if available, else use defaults
Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hiA.woff2', fontWeight: 700 },
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZ9hiA.woff2', fontWeight: 800 },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 0,
    backgroundColor: '#040d18',
    fontFamily: 'Inter',
    color: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  borderOuter: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    bottom: 20,
    border: '2pt solid #17B6A8',
    borderRadius: 4,
  },
  borderInner: {
    position: 'absolute',
    top: 30,
    left: 30,
    right: 30,
    bottom: 30,
    border: '1pt solid rgba(23,182,168,0.3)',
    borderRadius: 2,
  },
  header: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 4,
    color: '#17B6A8',
    marginBottom: 40,
    fontWeight: 800,
  },
  title: {
    fontSize: 42,
    fontWeight: 800,
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 50,
    textAlign: 'center',
  },
  recipientLabel: {
    fontSize: 10,
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.4)',
    marginBottom: 10,
  },
  recipientName: {
    fontSize: 32,
    fontWeight: 700,
    color: '#F5C842',
    marginBottom: 40,
    borderBottom: '1pt solid rgba(245,200,66,0.2)',
    paddingBottom: 10,
    minWidth: 300,
    textAlign: 'center',
  },
  description: {
    fontSize: 12,
    lineHeight: 1.6,
    color: 'rgba(255,255,255,0.7)',
    maxWidth: 450,
    textAlign: 'center',
    marginBottom: 60,
  },
  footer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 40,
  },
  signatureBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  signatureLine: {
    width: 150,
    borderTop: '1pt solid rgba(255,255,255,0.2)',
    marginBottom: 8,
  },
  signatureText: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.5)',
  },
  certId: {
    position: 'absolute',
    bottom: 45,
    right: 50,
    fontSize: 8,
    color: 'rgba(255,255,255,0.2)',
    fontFamily: 'Courier',
  },
  watermark: {
    position: 'absolute',
    top: '35%',
    left: '20%',
    fontSize: 120,
    color: 'rgba(23,182,168,0.03)',
    transform: 'rotate(-30deg)',
    fontWeight: 800,
  }
});

const OfficialCertificatePDF = ({ user, cert }) => (
  <Document>
    <Page size="A4" orientation="landscape" style={styles.page}>
      <View style={styles.borderOuter} />
      <View style={styles.borderInner} />
      
      <Text style={styles.watermark}>VOYAGER</Text>
      
      <Text style={styles.header}>SkillVoyager.AI Neural Network</Text>
      
      <Text style={styles.title}>CERTIFICATE OF ACHIEVEMENT</Text>
      <Text style={styles.subtitle}>This official document verifies the mastery of</Text>
      
      <Text style={styles.recipientLabel}>PROUDLY PRESENTED TO</Text>
      <Text style={styles.recipientName}>{user?.displayName?.toUpperCase() || 'VOYAGER'}</Text>
      
      <Text style={styles.description}>
        For exceptional performance and successful synchronization with the "{cert?.title || 'Advanced System Architecture'}" mission modules. 
        Through dedicated analysis and practical implementation, this voyager has demonstrated elite-level proficiency in the designated skill nodes.
      </Text>
      
      <View style={styles.footer}>
        <View style={styles.signatureBox}>
          <View style={styles.signatureLine} />
          <Text style={styles.signatureText}>AI Mentorship Protocol</Text>
        </View>
        <View style={styles.signatureBox}>
          <View style={styles.signatureLine} />
          <Text style={styles.signatureText}>{cert?.issuer || 'SkillVoyager.AI Official'}</Text>
        </View>
      </View>
      
      <Text style={styles.certId}>VALIDATED NODE ID: {cert?.certId || 'SV-X00000000'}</Text>
    </Page>
  </Document>
);

export default OfficialCertificatePDF;
