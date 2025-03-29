import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica'
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
    textDecoration: 'underline'
  },
  section: {
    marginBottom: 15
  },
  label: {
    fontWeight: 'bold',
    marginRight: 5
  },
  image: {
    marginTop: 20,
    maxWidth: '100%',
    height: 'auto'
  }
});

export const PDFReport = ({ report }) => (
  <Document>
    <Page style={styles.page}>
      <Text style={styles.title}>Report Details</Text>
      
      <View style={styles.section}>
        <Text><Text style={styles.label}>Title:</Text> {report.title}</Text>
      </View>
      
      <View style={styles.section}>
        <Text><Text style={styles.label}>Details:</Text> {report.details}</Text>
      </View>
      
      <View style={styles.section}>
        <Text><Text style={styles.label}>Type:</Text> {report.type}</Text>
      </View>
      
      <View style={styles.section}>
        <Text><Text style={styles.label}>Status:</Text> {report.status}</Text>
      </View>
      
      <View style={styles.section}>
        <Text><Text style={styles.label}>Location:</Text> {report.specific_place}</Text>
      </View>
      
      <View style={styles.section}>
        <Text><Text style={styles.label}>Reported By:</Text> {report.name}</Text>
      </View>
      
      <View style={styles.section}>
        <Text><Text style={styles.label}>Report Date:</Text> {new Date(report.created_at).toLocaleDateString()}</Text>
      </View>
      
      {report.accepted_by && (
        <View style={styles.section}>
          <Text><Text style={styles.label}>Accepted By:</Text> {report.accepted_by}</Text>
        </View>
      )}
      
      {report.image && (
        <Image 
          style={styles.image}
          src={report.image}
        />
      )}
    </Page>
  </Document>
);

export const MultiPDFReport = ({ reports }) => (
  <Document>
    {reports.map((report, index) => (
      <Page key={index} style={styles.page}>
        <PDFReport report={report} />
      </Page>
    ))}
  </Document>
);