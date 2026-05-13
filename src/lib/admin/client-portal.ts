import { changeOrderTotal, invoiceTotal } from "./formatters";
import type { ChangeOrder, Client, Invoice, Project, ProjectFile, ProjectUpdate } from "./types";

export interface ClientPortalView {
  project: Project;
  client: Client | null;
  files: ProjectFile[];
  updates: {
    id: string;
    title: string;
    body: string;
    updateDate: string;
  }[];
  invoices: {
    id: string;
    invoiceNumber: string;
    status: Invoice["status"];
    dueDate: string;
    total: number;
  }[];
  changeOrders: {
    id: string;
    changeOrderNumber: string;
    title: string;
    status: ChangeOrder["status"];
    scheduleImpactDays: number;
    clientMessage: string;
    total: number;
  }[];
}

export function buildClientPortalView({
  project,
  client,
  files,
  invoices,
  changeOrders,
  updates,
}: {
  project: Project;
  client: Client | null;
  files: ProjectFile[];
  updates: ProjectUpdate[];
  invoices: Invoice[];
  changeOrders: ChangeOrder[];
}): ClientPortalView {
  return {
    project: {
      ...project,
      notes: "",
    },
    client,
    files: files.filter((file) => file.visibility === "customer"),
    updates: updates
      .filter((update) => update.visibility === "customer")
      .map((update) => ({
        id: update.id,
        title: update.title,
        body: update.body,
        updateDate: update.updateDate,
      })),
    invoices: invoices.map((invoice) => ({
      id: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      status: invoice.status,
      dueDate: invoice.dueDate,
      total: invoiceTotal(invoice.lineItems),
    })),
    changeOrders: changeOrders.map((changeOrder) => ({
      id: changeOrder.id,
      changeOrderNumber: changeOrder.changeOrderNumber,
      title: changeOrder.title,
      status: changeOrder.status,
      scheduleImpactDays: changeOrder.scheduleImpactDays,
      clientMessage: changeOrder.clientMessage,
      total: changeOrderTotal(changeOrder.lineItems),
    })),
  };
}
