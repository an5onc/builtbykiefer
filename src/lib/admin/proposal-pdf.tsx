import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { Proposal } from "./types";
import { proposalTotal } from "./formatters";

const styles = StyleSheet.create({
  page: {
    padding: 42,
    fontSize: 10,
    color: "#171717",
    fontFamily: "Helvetica",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottomWidth: 2,
    borderBottomColor: "#b92516",
    paddingBottom: 18,
    marginBottom: 24,
  },
  logo: {
    width: 86,
    height: 86,
    objectFit: "contain",
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    textAlign: "right",
  },
  muted: {
    color: "#6b6258",
  },
  section: {
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 20,
  },
  h2: {
    fontSize: 12,
    fontWeight: 700,
    textTransform: "uppercase",
    marginBottom: 8,
    color: "#b92516",
  },
  callout: {
    backgroundColor: "#f4efe7",
    padding: 12,
    lineHeight: 1.5,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#151515",
    color: "#ffffff",
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ded6cc",
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  sectionCol: {
    flex: 0.85,
  },
  desc: {
    flex: 1.6,
  },
  qty: {
    flex: 0.45,
    textAlign: "right",
  },
  price: {
    flex: 0.75,
    textAlign: "right",
  },
  total: {
    flex: 0.75,
    textAlign: "right",
  },
  grandTotal: {
    marginTop: 16,
    alignSelf: "flex-end",
    width: 210,
    borderTopWidth: 2,
    borderTopColor: "#151515",
    paddingTop: 10,
  },
  grandTotalText: {
    fontSize: 16,
    fontWeight: 700,
    textAlign: "right",
  },
});

function currency(value: number) {
  return `$${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function ProposalPdf({ proposal, logoSrc }: { proposal: Proposal; logoSrc: string }) {
  const total = proposalTotal(proposal.lineItems);

  return (
    <Document title={`${proposal.proposalNumber} - Kiefer Built Contracting`}>
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          <View>
            {/* eslint-disable-next-line jsx-a11y/alt-text -- @react-pdf Image does not support alt text. */}
            <Image src={logoSrc} style={styles.logo} />
            <Text>Kiefer Built Contracting</Text>
            <Text style={styles.muted}>Windsor, Colorado</Text>
            <Text style={styles.muted}>info@kbuiltco.com · (970) 515-5059</Text>
          </View>
          <View>
            <Text style={styles.title}>Proposal</Text>
            <Text style={styles.muted}>{proposal.proposalNumber}</Text>
            <Text style={styles.muted}>Valid until {proposal.validUntil}</Text>
            <Text style={styles.muted}>Status {proposal.status}</Text>
          </View>
        </View>

        <View style={[styles.section, styles.row]}>
          <View>
            <Text style={styles.h2}>Prepared For</Text>
            <Text>{proposal.clientName}</Text>
            <Text style={styles.muted}>{proposal.clientEmail}</Text>
          </View>
          <View>
            <Text style={styles.h2}>Proposal</Text>
            <Text>{proposal.title}</Text>
            <Text style={styles.muted}>{proposal.proposalNumber}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.h2}>Scope Summary</Text>
          <Text style={styles.callout}>{proposal.scopeSummary}</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.tableHeader}>
            <Text style={styles.sectionCol}>Section</Text>
            <Text style={styles.desc}>Description</Text>
            <Text style={styles.qty}>Qty</Text>
            <Text style={styles.price}>Unit</Text>
            <Text style={styles.total}>Total</Text>
          </View>
          {proposal.lineItems.map((item) => (
            <View key={item.id} style={styles.tableRow}>
              <Text style={styles.sectionCol}>
                {item.section}
                {item.isOptional ? " (Optional)" : ""}
              </Text>
              <Text style={styles.desc}>{item.description}</Text>
              <Text style={styles.qty}>{item.quantity}</Text>
              <Text style={styles.price}>{currency(item.unitPrice)}</Text>
              <Text style={styles.total}>{currency(item.quantity * item.unitPrice)}</Text>
            </View>
          ))}
          <View style={styles.grandTotal}>
            <Text style={styles.grandTotalText}>Total {currency(total)}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
