import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { Client, Invoice, Project } from "./types";
import { invoiceTotal } from "./formatters";

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
    marginBottom: 28,
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
    marginBottom: 22,
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
  desc: {
    flex: 1.8,
  },
  qty: {
    flex: 0.5,
    textAlign: "right",
  },
  price: {
    flex: 0.8,
    textAlign: "right",
  },
  total: {
    flex: 0.8,
    textAlign: "right",
  },
  grandTotal: {
    marginTop: 16,
    alignSelf: "flex-end",
    width: 190,
    borderTopWidth: 2,
    borderTopColor: "#151515",
    paddingTop: 10,
  },
  grandTotalText: {
    fontSize: 16,
    fontWeight: 700,
    textAlign: "right",
  },
  notes: {
    backgroundColor: "#f4efe7",
    padding: 12,
    lineHeight: 1.5,
  },
});

function currency(value: number) {
  return `$${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function InvoicePdf({
  invoice,
  client,
  project,
  logoSrc,
}: {
  invoice: Invoice;
  client: Client;
  project: Project;
  logoSrc: string;
}) {
  const total = invoiceTotal(invoice.lineItems);

  return (
    <Document title={`${invoice.invoiceNumber} - Kiefer Built Contracting`}>
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Image src={logoSrc} style={styles.logo} />
            <Text>Kiefer Built Contracting</Text>
            <Text style={styles.muted}>Windsor, Colorado</Text>
            <Text style={styles.muted}>info@kbuiltco.com · (970) 515-5059</Text>
          </View>
          <View>
            <Text style={styles.title}>Invoice</Text>
            <Text style={styles.muted}>{invoice.invoiceNumber}</Text>
            <Text style={styles.muted}>Issued {invoice.issueDate}</Text>
            <Text style={styles.muted}>Due {invoice.dueDate}</Text>
          </View>
        </View>

        <View style={[styles.section, styles.row]}>
          <View>
            <Text style={styles.h2}>Bill To</Text>
            <Text>{client.name}</Text>
            <Text style={styles.muted}>{client.email}</Text>
            <Text style={styles.muted}>{client.phone}</Text>
          </View>
          <View>
            <Text style={styles.h2}>Project</Text>
            <Text>{project.name}</Text>
            <Text style={styles.muted}>{project.location}</Text>
            <Text style={styles.muted}>{project.type}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.tableHeader}>
            <Text style={styles.desc}>Description</Text>
            <Text style={styles.qty}>Qty</Text>
            <Text style={styles.price}>Unit</Text>
            <Text style={styles.total}>Total</Text>
          </View>
          {invoice.lineItems.map((item) => (
            <View key={item.id} style={styles.tableRow}>
              <Text style={styles.desc}>{item.description}</Text>
              <Text style={styles.qty}>{item.quantity}</Text>
              <Text style={styles.price}>{currency(item.unitPrice)}</Text>
              <Text style={styles.total}>
                {currency(item.quantity * item.unitPrice)}
              </Text>
            </View>
          ))}
          <View style={styles.grandTotal}>
            <Text style={styles.grandTotalText}>Total {currency(total)}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.h2}>Notes</Text>
          <Text style={styles.notes}>{invoice.notes}</Text>
        </View>
      </Page>
    </Document>
  );
}
