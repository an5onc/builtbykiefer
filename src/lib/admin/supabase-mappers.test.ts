import { describe, expect, it } from "vitest";
import {
  mapClientRow,
  mapInvoiceRow,
  mapLeadRow,
  mapProposalRow,
  mapProjectFileRow,
  mapProjectRow,
  mapTimeEntryRow,
  mapWorkerRow,
} from "./supabase-mappers";

describe("Supabase admin row mappers", () => {
  it("maps project rows with nested phases into the existing Project shape", () => {
    expect(
      mapProjectRow({
        id: "project-1",
        client_id: "client-1",
        name: "Highland Ridge",
        location: "Windsor, CO",
        type: "Custom Home",
        status: "active",
        current_phase: "Interior rough-in",
        progress: 58,
        budget_range: "$950k-$1.15M",
        start_date: "2026-02-03",
        estimated_completion: "2026-09-18",
        notes: "Owner-ready update",
        hero_image: "/images/project.jpg",
        project_phases: [
          {
            id: "phase-1",
            title: "Preconstruction",
            description: "Selections",
            status: "completed",
            date_label: "Feb 2026",
            sort_order: 1,
          },
        ],
      }),
    ).toEqual({
      id: "project-1",
      clientId: "client-1",
      name: "Highland Ridge",
      location: "Windsor, CO",
      type: "Custom Home",
      status: "active",
      currentPhase: "Interior rough-in",
      progress: 58,
      budgetRange: "$950k-$1.15M",
      startDate: "2026-02-03",
      estimatedCompletion: "2026-09-18",
      notes: "Owner-ready update",
      heroImage: "/images/project.jpg",
      phases: [
        {
          id: "phase-1",
          title: "Preconstruction",
          description: "Selections",
          status: "completed",
          dateLabel: "Feb 2026",
        },
      ],
    });
  });

  it("maps CRM, file, labor, and invoice rows without leaking snake_case", () => {
    expect(
      mapLeadRow({
        id: "lead-1",
        name: "Danielle Porter",
        email: "danielle@example.com",
        phone: "(970) 555-0142",
        project_type: "Custom Home",
        budget_range: "$900k-$1.2M",
        status: "qualified",
        next_follow_up: "2026-05-12",
        notes: "Modern ranch",
      }),
    ).toMatchObject({ projectType: "Custom Home", budgetRange: "$900k-$1.2M" });

    expect(mapClientRow({ id: "client-1", name: "Avery", email: "a@example.com", phone: "555" })).toEqual({
      id: "client-1",
      name: "Avery",
      email: "a@example.com",
      phone: "555",
    });

    expect(
      mapProjectFileRow({
        id: "file-1",
        project_id: "project-1",
        name: "Rough-in packet.pdf",
        file_type: "document",
        visibility: "internal",
        uploaded_at: "2026-05-04T12:00:00Z",
        size_label: "1.8 MB",
      }),
    ).toMatchObject({ projectId: "project-1", type: "document", uploadedAt: "2026-05-04T12:00:00Z" });

    expect(mapWorkerRow({ id: "worker-1", name: "Caleb", role: "Lead", is_active: true })).toEqual({
      id: "worker-1",
      name: "Caleb",
      role: "Lead",
      status: "active",
    });

    expect(
      mapTimeEntryRow({
        id: "time-1",
        worker_id: "worker-1",
        project_id: "project-1",
        clock_in: "2026-05-06T07:12:00-06:00",
        clock_out: null,
        notes: "Active shift",
      }),
    ).toMatchObject({ workerId: "worker-1", projectId: "project-1", clockOut: null });

    expect(
      mapInvoiceRow({
        id: "invoice-1",
        invoice_number: "KBC-2026-001",
        project_id: "project-1",
        client_id: "client-1",
        status: "draft",
        issue_date: "2026-05-07",
        due_date: "2026-05-22",
        notes: "Demo",
        invoice_line_items: [
          {
            id: "line-1",
            description: "Labor",
            quantity: "42.50",
            unit_price: "86.00",
            sort_order: 1,
          },
        ],
      }),
    ).toMatchObject({
      invoiceNumber: "KBC-2026-001",
      lineItems: [{ quantity: 42.5, unitPrice: 86 }],
    });

    expect(
      mapProposalRow({
        id: "proposal-1",
        lead_id: "lead-1",
        proposal_number: "KBP-2026-001",
        title: "Guest Suite Addition",
        status: "draft",
        client_name: "Harper Stone",
        client_email: "harper@example.com",
        scope_summary: "Garage and guest suite pricing.",
        internal_notes: "Hold until site visit.",
        valid_until: "2026-06-15",
        created_at: "2026-05-12T10:00:00Z",
        proposal_line_items: [
          {
            id: "proposal-line-2",
            section: "Allowance",
            description: "Tile allowance",
            quantity: "1.00",
            unit_price: "4200.00",
            is_optional: true,
            sort_order: 2,
          },
          {
            id: "proposal-line-1",
            section: "Base Scope",
            description: "Framing labor",
            quantity: "12.50",
            unit_price: "95.00",
            is_optional: false,
            sort_order: 1,
          },
        ],
      }),
    ).toMatchObject({
      leadId: "lead-1",
      proposalNumber: "KBP-2026-001",
      clientName: "Harper Stone",
      lineItems: [
        { description: "Framing labor", quantity: 12.5, unitPrice: 95, isOptional: false },
        { description: "Tile allowance", quantity: 1, unitPrice: 4200, isOptional: true },
      ],
    });
  });
});
