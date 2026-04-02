// src/components/ProgressReportPDF.jsx
import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 60,
    backgroundColor: '#0b1120',
    color: '#e2e8f0',
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 40,
    textAlign: 'center',
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#c084fc',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 14,
    color: '#94a3b8',
    fontStyle: 'italic',
  },
  profileCard: {
    marginBottom: 36,
    padding: 20,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    borderLeftWidth: 5,
    borderLeftColor: '#818cf8',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 6,
  },
  meta: {
    fontSize: 13,
    color: '#94a3b8',
    marginBottom: 12,
  },
  quote: {
    fontSize: 14,
    color: '#a5b4fc',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 12,
  },
  masteryBlock: {
    alignItems: 'center',
    marginBottom: 40,
    padding: 24,
    backgroundColor: '#1e293b',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  masteryPercent: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  masteryLabel: {
    fontSize: 18,
    color: '#818cf8',
    marginTop: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 36,
  },
  statItem: {
    width: '48%',
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#1e293b',
    borderRadius: 10,
    borderLeftWidth: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#94a3b8',
    marginBottom: 6,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  sectionTitle: {
    fontSize: 20,
    color: '#c084fc',
    fontWeight: 'bold',
    marginBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#334155',
    paddingBottom: 8,
  },
  milestone: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#1e293b',
    borderRadius: 10,
    borderLeftWidth: 6,
  },
  milestoneCompleted: { borderLeftColor: '#34d399' },
  milestoneCurrent: { borderLeftColor: '#818cf8' },
  milestoneLocked: { borderLeftColor: '#475569', opacity: 0.8 },
  milestoneTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 6,
  },
  milestoneStatus: {
    fontSize: 12,
    marginTop: 6,
  },
  badgeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  badge: {
    width: '22%',
    alignItems: 'center',
  },
  badgeIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#334155',
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  badgeUnlocked: {
    backgroundColor: '#7c3aed',
    borderColor: '#a78bfa',
  },
  badgeName: {
    fontSize: 11,
    textAlign: 'center',
    color: '#cbd5e1',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 60,
    right: 60,
    textAlign: 'center',
    fontSize: 11,
    color: '#64748b',
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingTop: 16,
  },
  motivationalQuote: {
    fontSize: 14,
    color: '#a5b4fc',
    fontStyle: 'italic',
    marginTop: 12,
  },
});

const ProgressReportPDF = ({ userName, pct = 0, progressData = {}, dbUser = {} }) => {
  const completed = progressData?.milestones?.filter(m => m.status === 'completed')?.length || 0;
  const totalMilestones = progressData?.milestones?.length || 0;

  const streak = progressData?.streak || dbUser?.streak || 0;
  const xp = progressData?.xp || dbUser?.points || 0;
  const rank = progressData?.rank || 'N/A';
  const badges = progressData?.badges || [];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.mainTitle}>SkillVoyager Progress Overview</Text>
          <Text style={styles.tagline}>Your Personalized AI-Driven Learning Journey</Text>
        </View>

        {/* Profile */}
        <View style={styles.profileSection}>
          <Text style={styles.profileName}>{userName || 'Voyager'}</Text>
          <Text style={styles.meta}>
            {dbUser?.role ? dbUser.role.toUpperCase() : 'Active Learner'} • 
            Member since {new Date().toLocaleDateString('en-GB')}
          </Text>
          <Text style={styles.quote}>
            "The mind is not a vessel to be filled, but a fire to be kindled." — Plutarch
          </Text>
        </View>

        {/* Mastery Level */}
        <View style={styles.masterySection}>
          <Text style={styles.masteryNumber}>{pct}%</Text>
          <Text style={styles.masteryLabel}>Current Mastery Achievement</Text>
        </View>

        {/* Key Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance Highlights</Text>
          <View style={styles.statsGrid}>
            <View style={[styles.statItem, { borderLeftColor: '#6366f1' }]}>
              <Text style={styles.statLabel}>Total Experience Points</Text>
              <Text style={styles.statValue}>{xp.toLocaleString()} XP</Text>
            </View>
            <View style={[styles.statItem, { borderLeftColor: '#f59e0b' }]}>
              <Text style={styles.statLabel}>Global Ranking</Text>
              <Text style={styles.statValue}>{rank}</Text>
            </View>
            <View style={[styles.statItem, { borderLeftColor: '#f97316' }]}>
              <Text style={styles.statLabel}>Current Learning Streak</Text>
              <Text style={styles.statValue}>{streak} Days</Text>
            </View>
            <View style={[styles.statItem, { borderLeftColor: '#10b981' }]}>
              <Text style={styles.statLabel}>Milestones Completed</Text>
              <Text style={styles.statValue}>{completed} / {totalMilestones}</Text>
            </View>
          </View>
        </View>

        {/* Current Focus */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Learning Focus</Text>
          <View style={[styles.milestone, styles.milestoneCurrent]}>
            <Text style={[styles.milestoneTitle, { color: '#818cf8' }]}>
              {progressData?.currentMilestone || 'Fundamentals & Logic'}
            </Text>
            <Text style={{ fontSize: 12, color: '#cbd5e1', lineHeight: 1.5 }}>
              {progressData?.currentDescription || 
                'Active synchronization phase. Deep exploration of core systemic patterns and logic frameworks in progress.'}
            </Text>
          </View>
        </View>

        {/* Full Neural Path */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Complete Neural Path</Text>
          {(progressData?.milestones || []).map((m, i) => (
            <View 
              key={i}
              style={[
                styles.milestone,
                m.status === 'completed' ? styles.milestoneCompleted :
                m.status === 'current' ? styles.milestoneCurrent :
                styles.milestoneLocked
              ]}
            >
              <Text style={styles.milestoneTitle}>
                Phase {i + 1}: {m.title || `Phase ${i + 1}`}
              </Text>
              <Text style={[
                styles.milestoneStatus,
                m.status === 'completed' ? { color: '#34d399' } :
                m.status === 'current' ? { color: '#818cf8' } :
                { color: '#94a3b8' }
              ]}>
                {m.status === 'completed' ? '✓ Completed & Verified' : 
                 m.status === 'current' ? '⟳ In Active Progress' : '🔒 Upcoming Phase'}
              </Text>
            </View>
          ))}
        </View>

        {/* Recognition */}
        <View style={styles.badgeSection}>
          <Text style={styles.sectionTitle}>Recognition & Achievements</Text>
          <View style={styles.badgeGrid}>
          {(badges.length > 0 ? badges : [
            { name: "Initiation", unlocked: true },
            { name: "First Steps", unlocked: false },
          ]).map((b, i) => (
            <View key={i} style={styles.badge}>
              <View style={[styles.badgeIcon, b.unlocked ? styles.badgeUnlocked : {}]}>
                <Text style={{ fontSize: 24, color: b.unlocked ? '#ffffff' : '#475569' }}>
                  {b.unlocked ? '★' : '✗'}
                </Text>
              </View>
              <Text style={styles.badgeName}>{b.name}</Text>
            </View>
          ))}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Generated on {new Date().toLocaleDateString('en-GB')} at {new Date().toLocaleTimeString('en-GB')}</Text>
          <Text style={styles.motivationalQuote}>
            "Every milestone completed is a step closer to mastery. Keep the momentum — the next breakthrough awaits."
          </Text>
          <Text style={{ marginTop: 12, fontWeight: 'bold' }}>
            SkillVoyager.AI • AI-Powered Personalized Learning Platform
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default ProgressReportPDF;