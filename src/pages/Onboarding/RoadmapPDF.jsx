// src/components/Onboarding/RoadmapPDF.jsx
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 60,
    fontFamily: 'Helvetica',
    backgroundColor: '#0f172a',
    color: '#e2e8f0',
  },
  header: {
    marginBottom: 30,
    borderBottom: '2px solid #6366f1',
    paddingBottom: 15,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#c084fc',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#94a3b8',
    marginBottom: 25,
  },
  watermark: {
    position: 'absolute',
    top: 30,
    right: 30,
    opacity: 0.08,
    fontSize: 80,
    color: '#6366f1',
    transform: 'rotate(-45deg)',
  },
  section: {
    marginBottom: 28,
    padding: 16,
    backgroundColor: 'rgba(30,41,59,0.4)',
    borderRadius: 8,
    border: '1px solid rgba(99,102,241,0.15)',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#a5b4fc',
    marginBottom: 12,
    borderLeft: '4px solid #6366f1',
    paddingLeft: 12,
  },
  text: {
    fontSize: 12,
    lineHeight: 1.6,
    color: '#cbd5e1',
    marginBottom: 8,
  },
  bullet: {
    marginLeft: 20,
    marginBottom: 6,
  },
  skillContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  skillPill: {
    fontSize: 11,
    padding: '6px 12px',
    backgroundColor: 'rgba(99,102,241,0.08)',
    border: '1px solid rgba(99,102,241,0.25)',
    borderRadius: 999,
    color: '#c084fc',
  },
  phaseItem: {
    marginBottom: 12,
    paddingLeft: 16,
    borderLeft: '3px solid #7c3aed',
  },
  footer: {
    marginTop: 60,
    paddingTop: 20,
    borderTop: '1px solid rgba(99,102,241,0.2)',
    textAlign: 'center',
    fontSize: 10,
    color: '#94a3b8',
  },
});

const RoadmapPDF = ({ roadmapData, userName }) => (
  <Document>
    <Page size="A4">
      <View style={styles.page}>
        {/* Watermark */}
        <Text style={styles.watermark}>SkillVoyager</Text>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Your Personalized Learning Roadmap</Text>
          <Text style={styles.subtitle}>
            Crafted for {userName || 'Voyager'} • {new Date().toLocaleDateString('en-GB')}
          </Text>
        </View>

        {/* Target & Timeline */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mission Target</Text>
          <Text style={styles.text}>
            <Text style={{ fontWeight: 'bold', color: '#c084fc' }}>Desired Role:</Text> {roadmapData?.targetCareer || 'To be defined'}
          </Text>
          <Text style={styles.text}>
            <Text style={{ fontWeight: 'bold', color: '#c084fc' }}>Timeline Commitment:</Text>{' '}
            {roadmapData?.timeline === '3-months' ? '3 Months – High Intensity' :
             roadmapData?.timeline === '6-months' ? '6 Months – Balanced Growth' :
             roadmapData?.timeline === '1-year' ? '12 Months – Deep Mastery' : 'Flexible Pace'}
          </Text>
        </View>

        {/* Current Skills */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Current Arsenal</Text>
          <View style={styles.skillContainer}>
            {roadmapData?.skills?.length > 0 ? (
              roadmapData.skills.map((skill, i) => (
                <Text key={i} style={styles.skillPill}>{skill}</Text>
              ))
            ) : (
              <Text style={{ ...styles.text, color: '#94a3b8', fontStyle: 'italic' }}>
                No skills added yet – let's build your foundation!
              </Text>
            )}
          </View>
        </View>

        {/* Recommended Path */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Strategic Learning Path</Text>
          <View>
            <View style={styles.phaseItem}>
              <Text style={{ ...styles.text, fontWeight: 'bold', color: '#a5b4fc' }}>Phase 1: Foundation Building</Text>
              <Text style={styles.text}>Weeks 1–4 • Master core concepts and tools</Text>
            </View>
            <View style={styles.phaseItem}>
              <Text style={{ ...styles.text, fontWeight: 'bold', color: '#a5b4fc' }}>Phase 2: Real-World Application</Text>
              <Text style={styles.text}>Weeks 5–12 • Build 3–5 portfolio projects</Text>
            </View>
            <View style={styles.phaseItem}>
              <Text style={{ ...styles.text, fontWeight: 'bold', color: '#a5b4fc' }}>Phase 3: Specialization & Mastery</Text>
              <Text style={styles.text}>Month 3+ • Deep dive into {roadmapData?.targetCareer || 'your target domain'}</Text>
            </View>
            <View style={styles.phaseItem}>
              <Text style={{ ...styles.text, fontWeight: 'bold', color: '#a5b4fc' }}>Phase 4: Career Launch Prep</Text>
              <Text style={styles.text}>Portfolio polishing • Resume optimization • Interview readiness</Text>
            </View>
          </View>
          <Text style={{ ...styles.text, marginTop: 16, color: '#94a3b8', fontStyle: 'italic' }}>
            Pro Tip: Track your progress weekly and update your profile to refine this roadmap.
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Generated with precision by SkillVoyager.AI</Text>
          <Text style={{ marginTop: 4 }}>Accelerate your career • One milestone at a time</Text>
        </View>
      </View>
    </Page>
  </Document>
);

export default RoadmapPDF;