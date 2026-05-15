import { describe, expect, it } from "vitest";
import {
  mapClientRow,
  mapChangeOrderRow,
  mapBillRow,
  mapDailyLogRow,
  mapInvoiceRow,
  mapLeadRow,
  mapProposalRow,
  mapProjectRfiRow,
  mapProjectSelectionRow,
  mapProjectCommentRow,
  mapProjectFinancialTargetRow,
  mapProjectFileRow,
  mapProjectPhotoRow,
  mapPurchaseOrderRow,
  mapProjectVendorAssignmentRow,
  mapProjectRow,
  mapProjectTaskRow,
  mapProjectUpdateRow,
  mapTimeEntryRow,
  mapVendorRow,
  mapWarrantyItemRow,
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
        storage_bucket: "project-documents",
        storage_path: "project-1/documents/rough-in-packet.pdf",
        uploaded_at: "2026-05-04T12:00:00Z",
        size_label: "1.8 MB",
      }),
    ).toMatchObject({
      projectId: "project-1",
      type: "document",
      storageBucket: "project-documents",
      storagePath: "project-1/documents/rough-in-packet.pdf",
      uploadedAt: "2026-05-04T12:00:00Z",
    });

    expect(
      mapProjectTaskRow({
        id: "task-1",
        project_id: "project-1",
        assigned_worker_id: "worker-1",
        title: "Confirm cabinet layout",
        notes: "Review with client before ordering.",
        status: "open",
        priority: "high",
        due_date: "2026-05-18",
        created_at: "2026-05-13T10:00:00Z",
        completed_at: null,
      }),
    ).toEqual({
      id: "task-1",
      projectId: "project-1",
      assignedWorkerId: "worker-1",
      title: "Confirm cabinet layout",
      notes: "Review with client before ordering.",
      status: "open",
      priority: "high",
      dueDate: "2026-05-18",
      createdAt: "2026-05-13T10:00:00Z",
      completedAt: null,
    });

    expect(
      mapProjectUpdateRow({
        id: "update-1",
        project_id: "project-1",
        title: "Rough-in inspection passed",
        body: "Electrical and plumbing rough-ins passed.",
        visibility: "customer",
        update_date: "2026-05-13",
        created_at: "2026-05-13T10:00:00Z",
      }),
    ).toEqual({
      id: "update-1",
      projectId: "project-1",
      title: "Rough-in inspection passed",
      body: "Electrical and plumbing rough-ins passed.",
      visibility: "customer",
      updateDate: "2026-05-13",
      createdAt: "2026-05-13T10:00:00Z",
    });

    expect(
      mapProjectCommentRow({
        id: "comment-1",
        project_id: "project-1",
        author_name: "Avery Thompson",
        body: "Client approved the tile direction.",
        visibility: "customer",
        created_at: "2026-05-14T16:00:00Z",
      }),
    ).toEqual({
      id: "comment-1",
      projectId: "project-1",
      authorName: "Avery Thompson",
      body: "Client approved the tile direction.",
      visibility: "customer",
      createdAt: "2026-05-14T16:00:00Z",
    });

    expect(
      mapProjectSelectionRow({
        id: "selection-1",
        project_id: "project-1",
        category: "Tile",
        title: "Primary bath floor tile",
        allowance_amount: "4200.00",
        selected_option: "Large format porcelain",
        vendor: "Flooring Studio",
        due_date: "2026-05-29",
        status: "approved",
        internal_notes: "Order after client sign-off.",
        client_notes: "Warm gray finish.",
        created_at: "2026-05-14T16:00:00Z",
        approved_at: "2026-05-14T16:30:00Z",
        approved_by_name: "Avery Thompson",
      }),
    ).toEqual({
      id: "selection-1",
      projectId: "project-1",
      category: "Tile",
      title: "Primary bath floor tile",
      allowanceAmount: 4200,
      selectedOption: "Large format porcelain",
      vendor: "Flooring Studio",
      dueDate: "2026-05-29",
      status: "approved",
      internalNotes: "Order after client sign-off.",
      clientNotes: "Warm gray finish.",
      createdAt: "2026-05-14T16:00:00Z",
      approvedAt: "2026-05-14T16:30:00Z",
      approvedByName: "Avery Thompson",
    });

    expect(
      mapProjectRfiRow({
        id: "rfi-1",
        project_id: "project-1",
        title: "Clarify shower niche layout",
        question: "Center on valve wall?",
        answer: "",
        requested_by: "Caleb Morgan",
        due_date: "2026-05-24",
        status: "open",
        visibility: "internal",
        created_at: "2026-05-14T16:00:00Z",
        answered_at: null,
      }),
    ).toEqual({
      id: "rfi-1",
      projectId: "project-1",
      title: "Clarify shower niche layout",
      question: "Center on valve wall?",
      answer: "",
      requestedBy: "Caleb Morgan",
      dueDate: "2026-05-24",
      status: "open",
      visibility: "internal",
      createdAt: "2026-05-14T16:00:00Z",
      answeredAt: null,
    });

    expect(
      mapDailyLogRow({
        id: "log-1",
        project_id: "project-1",
        report_date: "2026-05-14",
        superintendent: "Caleb Jensen",
        weather: "Clear, 68F",
        crew_count: 6,
        work_performed: "Completed porch framing.",
        deliveries: "LVL package delivered.",
        inspections: "Rough framing inspection scheduled.",
        delays: "No delays.",
        safety_notes: "Morning ladder huddle complete.",
        next_steps: "Prep inspection packet.",
        visibility: "customer",
        created_at: "2026-05-14T15:00:00Z",
      }),
    ).toEqual({
      id: "log-1",
      projectId: "project-1",
      reportDate: "2026-05-14",
      superintendent: "Caleb Jensen",
      weather: "Clear, 68F",
      crewCount: 6,
      workPerformed: "Completed porch framing.",
      deliveries: "LVL package delivered.",
      inspections: "Rough framing inspection scheduled.",
      delays: "No delays.",
      safetyNotes: "Morning ladder huddle complete.",
      nextSteps: "Prep inspection packet.",
      visibility: "customer",
      createdAt: "2026-05-14T15:00:00Z",
    });

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
      mapPurchaseOrderRow({
        id: "po-1",
        project_id: "project-1",
        po_number: "KBPO-2026-001",
        title: "Cabinet deposit",
        vendor: "Front Range Cabinetry",
        amount: "18500.00",
        status: "sent",
        due_date: "2026-05-30",
        notes: "Release shop drawings.",
        created_at: "2026-05-14T16:00:00Z",
      }),
    ).toMatchObject({
      id: "po-1",
      projectId: "project-1",
      poNumber: "KBPO-2026-001",
      amount: 18500,
    });

    expect(
      mapBillRow({
        id: "bill-1",
        project_id: "project-1",
        bill_number: "BILL-1042",
        vendor: "Rocky Mountain Tile",
        amount: "2400.50",
        status: "received",
        due_date: "2026-06-05",
        notes: "Tile material invoice.",
        created_at: "2026-05-14T16:00:00Z",
      }),
    ).toMatchObject({
      id: "bill-1",
      projectId: "project-1",
      billNumber: "BILL-1042",
      amount: 2400.5,
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

    expect(
      mapChangeOrderRow({
        id: "change-order-1",
        change_order_number: "KBCO-2026-001",
        project_id: "project-1",
        client_id: "client-1",
        title: "Add covered patio",
        status: "draft",
        reason: "Owner requested larger outdoor living.",
        schedule_impact_days: 5,
        client_message: "Covered patio framing and electrical prep.",
        internal_notes: "Check beam lead time.",
        created_at: "2026-05-13T10:00:00Z",
        approved_at: null,
        approved_by_name: "",
        change_order_line_items: [
          {
            id: "co-line-2",
            description: "Electrical rough-in allowance",
            quantity: "1.00",
            unit_price: "2400.00",
            sort_order: 2,
          },
          {
            id: "co-line-1",
            description: "Patio framing labor",
            quantity: "18.00",
            unit_price: "92.00",
            sort_order: 1,
          },
        ],
      }),
    ).toMatchObject({
      changeOrderNumber: "KBCO-2026-001",
      projectId: "project-1",
      scheduleImpactDays: 5,
      approvedAt: null,
      approvedByName: "",
      lineItems: [
        { description: "Patio framing labor", quantity: 18, unitPrice: 92 },
        { description: "Electrical rough-in allowance", quantity: 1, unitPrice: 2400 },
      ],
    });

    expect(
      mapWarrantyItemRow({
        id: "warranty-1",
        project_id: "project-1",
        item_type: "punch-list",
        title: "Adjust primary bath door reveal",
        description: "Door rubs slightly at the strike side casing.",
        location: "Primary bath",
        requested_by: "Avery Thompson",
        status: "open",
        priority: "normal",
        due_date: "2026-06-04",
        visibility: "customer",
        created_at: "2026-05-14T12:00:00Z",
        resolved_at: null,
      }),
    ).toEqual({
      id: "warranty-1",
      projectId: "project-1",
      itemType: "punch-list",
      title: "Adjust primary bath door reveal",
      description: "Door rubs slightly at the strike side casing.",
      location: "Primary bath",
      requestedBy: "Avery Thompson",
      status: "open",
      priority: "normal",
      dueDate: "2026-06-04",
      visibility: "customer",
      createdAt: "2026-05-14T12:00:00Z",
      resolvedAt: null,
    });

    expect(
      mapProjectPhotoRow({
        id: "photo-1",
        project_id: "project-1",
        title: "Kitchen rough-in progress",
        photo_date: "2026-05-14",
        category: "progress",
        visibility: "customer",
        image_url: "/images/project-3/kitchen-progress.jpg",
        caption: "Rough-in wall prep before insulation.",
        uploaded_at: "2026-05-14T15:30:00Z",
      }),
    ).toEqual({
      id: "photo-1",
      projectId: "project-1",
      title: "Kitchen rough-in progress",
      photoDate: "2026-05-14",
      category: "progress",
      visibility: "customer",
      imageUrl: "/images/project-3/kitchen-progress.jpg",
      caption: "Rough-in wall prep before insulation.",
      uploadedAt: "2026-05-14T15:30:00Z",
    });

    expect(
      mapVendorRow({
        id: "vendor-1",
        name: "Front Range Cabinetry",
        company_type: "subcontractor",
        trade: "Cabinetry",
        email: "schedule@frcabinetry.example",
        phone: "(970) 555-0199",
        status: "active",
        portal_access: true,
        notes: "Preferred cabinet partner.",
        created_at: "2026-05-14T09:00:00Z",
      }),
    ).toMatchObject({
      id: "vendor-1",
      name: "Front Range Cabinetry",
      companyType: "subcontractor",
      trade: "Cabinetry",
      portalAccess: true,
    });

    expect(
      mapProjectVendorAssignmentRow({
        id: "vendor-assignment-1",
        project_id: "project-1",
        vendor_id: "vendor-1",
        scope: "Cabinet layout.",
        start_date: "2026-05-20",
        end_date: "2026-06-12",
        status: "active",
        visibility: "customer",
        created_at: "2026-05-14T09:30:00Z",
      }),
    ).toMatchObject({
      id: "vendor-assignment-1",
      projectId: "project-1",
      vendorId: "vendor-1",
      scope: "Cabinet layout.",
      status: "active",
      visibility: "customer",
    });

    expect(
      mapProjectFinancialTargetRow({
        project_id: "project-1",
        contract_value: "950000.00",
        budgeted_cost: "760000.00",
        target_margin_percent: "20.00",
        contingency_percent: "5.00",
        updated_at: "2026-05-14T12:00:00Z",
      }),
    ).toEqual({
      projectId: "project-1",
      contractValue: 950000,
      budgetedCost: 760000,
      targetMarginPercent: 20,
      contingencyPercent: 5,
      updatedAt: "2026-05-14T12:00:00Z",
    });
  });
});
