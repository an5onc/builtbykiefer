// Remediation H3: generated Supabase schema types. DO NOT EDIT BY HAND.
// Regenerate with: supabase gen types typescript --project-id yediihmkophbyknshmqw > src/lib/supabase/database.types.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      bills: {
        Row: {
          amount: number
          bill_number: string
          created_at: string
          due_date: string
          id: string
          notes: string
          project_id: string
          status: Database["public"]["Enums"]["bill_status"]
          vendor: string
        }
        Insert: {
          amount?: number
          bill_number: string
          created_at?: string
          due_date: string
          id?: string
          notes?: string
          project_id: string
          status?: Database["public"]["Enums"]["bill_status"]
          vendor: string
        }
        Update: {
          amount?: number
          bill_number?: string
          created_at?: string
          due_date?: string
          id?: string
          notes?: string
          project_id?: string
          status?: Database["public"]["Enums"]["bill_status"]
          vendor?: string
        }
        Relationships: [
          {
            foreignKeyName: "bills_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      change_order_line_items: {
        Row: {
          change_order_id: string
          description: string
          id: string
          quantity: number
          sort_order: number
          unit_price: number
        }
        Insert: {
          change_order_id: string
          description: string
          id?: string
          quantity: number
          sort_order?: number
          unit_price: number
        }
        Update: {
          change_order_id?: string
          description?: string
          id?: string
          quantity?: number
          sort_order?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "change_order_line_items_change_order_id_fkey"
            columns: ["change_order_id"]
            isOneToOne: false
            referencedRelation: "change_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      change_orders: {
        Row: {
          approved_at: string | null
          approved_by_name: string
          change_order_number: string
          client_id: string
          client_message: string
          created_at: string
          id: string
          internal_notes: string
          project_id: string
          reason: string
          schedule_impact_days: number
          status: Database["public"]["Enums"]["change_order_status"]
          title: string
        }
        Insert: {
          approved_at?: string | null
          approved_by_name?: string
          change_order_number: string
          client_id: string
          client_message?: string
          created_at?: string
          id?: string
          internal_notes?: string
          project_id: string
          reason?: string
          schedule_impact_days?: number
          status?: Database["public"]["Enums"]["change_order_status"]
          title: string
        }
        Update: {
          approved_at?: string | null
          approved_by_name?: string
          change_order_number?: string
          client_id?: string
          client_message?: string
          created_at?: string
          id?: string
          internal_notes?: string
          project_id?: string
          reason?: string
          schedule_impact_days?: number
          status?: Database["public"]["Enums"]["change_order_status"]
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "change_orders_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "change_orders_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          auth_user_id: string | null
          created_at: string
          email: string
          id: string
          name: string
          phone: string
        }
        Insert: {
          auth_user_id?: string | null
          created_at?: string
          email: string
          id?: string
          name: string
          phone: string
        }
        Update: {
          auth_user_id?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string
        }
        Relationships: []
      }
      daily_logs: {
        Row: {
          created_at: string
          crew_count: number
          delays: string
          deliveries: string
          id: string
          inspections: string
          next_steps: string
          project_id: string
          report_date: string
          safety_notes: string
          superintendent: string
          visibility: Database["public"]["Enums"]["file_visibility"]
          weather: string
          work_performed: string
        }
        Insert: {
          created_at?: string
          crew_count?: number
          delays?: string
          deliveries?: string
          id?: string
          inspections?: string
          next_steps?: string
          project_id: string
          report_date: string
          safety_notes?: string
          superintendent: string
          visibility?: Database["public"]["Enums"]["file_visibility"]
          weather: string
          work_performed: string
        }
        Update: {
          created_at?: string
          crew_count?: number
          delays?: string
          deliveries?: string
          id?: string
          inspections?: string
          next_steps?: string
          project_id?: string
          report_date?: string
          safety_notes?: string
          superintendent?: string
          visibility?: Database["public"]["Enums"]["file_visibility"]
          weather?: string
          work_performed?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_logs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_line_items: {
        Row: {
          description: string
          id: string
          invoice_id: string
          quantity: number
          sort_order: number
          unit_price: number
        }
        Insert: {
          description: string
          id?: string
          invoice_id: string
          quantity: number
          sort_order?: number
          unit_price: number
        }
        Update: {
          description?: string
          id?: string
          invoice_id?: string
          quantity?: number
          sort_order?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoice_line_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          client_id: string
          created_at: string
          due_date: string
          id: string
          invoice_number: string
          issue_date: string
          notes: string
          project_id: string
          status: Database["public"]["Enums"]["invoice_status"]
        }
        Insert: {
          client_id: string
          created_at?: string
          due_date: string
          id?: string
          invoice_number: string
          issue_date: string
          notes?: string
          project_id: string
          status?: Database["public"]["Enums"]["invoice_status"]
        }
        Update: {
          client_id?: string
          created_at?: string
          due_date?: string
          id?: string
          invoice_number?: string
          issue_date?: string
          notes?: string
          project_id?: string
          status?: Database["public"]["Enums"]["invoice_status"]
        }
        Relationships: [
          {
            foreignKeyName: "invoices_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      land_leads: {
        Row: {
          account_number: string
          acreage: number | null
          county: Database["public"]["Enums"]["land_lead_county"]
          created_at: string
          dedupe_key: string | null
          deed_type: string
          first_seen_at: string
          id: string
          improvement_actual_value: number | null
          in_target_market: boolean
          is_entity_owner: boolean
          is_likely_vacant: boolean
          land_actual_value: number | null
          land_use: string
          last_refreshed_at: string
          last_seen_at: string
          lead_reason: string
          lead_score: number
          mailing_address1: string
          mailing_address2: string
          mailing_city: string
          mailing_differs_from_situs: boolean
          mailing_state: string
          mailing_zip: string
          notes: string
          owner_name: string
          owner_name_secondary: string
          parcel_number: string
          property_class: string
          sale_date: string | null
          sale_price: number | null
          situs_address: string
          situs_city: string
          situs_state: string
          situs_zip: string
          source_dataset: string
          source_row_hash: string
          status: Database["public"]["Enums"]["land_lead_status"]
          total_actual_value: number | null
          updated_at: string
          zoning: string
        }
        Insert: {
          account_number?: string
          acreage?: number | null
          county: Database["public"]["Enums"]["land_lead_county"]
          created_at?: string
          dedupe_key?: string | null
          deed_type?: string
          first_seen_at?: string
          id?: string
          improvement_actual_value?: number | null
          in_target_market?: boolean
          is_entity_owner?: boolean
          is_likely_vacant?: boolean
          land_actual_value?: number | null
          land_use?: string
          last_refreshed_at?: string
          last_seen_at?: string
          lead_reason?: string
          lead_score?: number
          mailing_address1?: string
          mailing_address2?: string
          mailing_city?: string
          mailing_differs_from_situs?: boolean
          mailing_state?: string
          mailing_zip?: string
          notes?: string
          owner_name?: string
          owner_name_secondary?: string
          parcel_number?: string
          property_class?: string
          sale_date?: string | null
          sale_price?: number | null
          situs_address?: string
          situs_city?: string
          situs_state?: string
          situs_zip?: string
          source_dataset?: string
          source_row_hash?: string
          status?: Database["public"]["Enums"]["land_lead_status"]
          total_actual_value?: number | null
          updated_at?: string
          zoning?: string
        }
        Update: {
          account_number?: string
          acreage?: number | null
          county?: Database["public"]["Enums"]["land_lead_county"]
          created_at?: string
          dedupe_key?: string | null
          deed_type?: string
          first_seen_at?: string
          id?: string
          improvement_actual_value?: number | null
          in_target_market?: boolean
          is_entity_owner?: boolean
          is_likely_vacant?: boolean
          land_actual_value?: number | null
          land_use?: string
          last_refreshed_at?: string
          last_seen_at?: string
          lead_reason?: string
          lead_score?: number
          mailing_address1?: string
          mailing_address2?: string
          mailing_city?: string
          mailing_differs_from_situs?: boolean
          mailing_state?: string
          mailing_zip?: string
          notes?: string
          owner_name?: string
          owner_name_secondary?: string
          parcel_number?: string
          property_class?: string
          sale_date?: string | null
          sale_price?: number | null
          situs_address?: string
          situs_city?: string
          situs_state?: string
          situs_zip?: string
          source_dataset?: string
          source_row_hash?: string
          status?: Database["public"]["Enums"]["land_lead_status"]
          total_actual_value?: number | null
          updated_at?: string
          zoning?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          budget_range: string
          created_at: string
          email: string
          id: string
          name: string
          next_follow_up: string | null
          notes: string
          phone: string
          project_type: string
          status: Database["public"]["Enums"]["lead_status"]
        }
        Insert: {
          budget_range: string
          created_at?: string
          email: string
          id?: string
          name: string
          next_follow_up?: string | null
          notes?: string
          phone: string
          project_type: string
          status?: Database["public"]["Enums"]["lead_status"]
        }
        Update: {
          budget_range?: string
          created_at?: string
          email?: string
          id?: string
          name?: string
          next_follow_up?: string | null
          notes?: string
          phone?: string
          project_type?: string
          status?: Database["public"]["Enums"]["lead_status"]
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          role?: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
        }
        Relationships: []
      }
      project_comments: {
        Row: {
          author_name: string
          body: string
          created_at: string
          created_by: string | null
          id: string
          project_id: string
          visibility: Database["public"]["Enums"]["file_visibility"]
        }
        Insert: {
          author_name: string
          body: string
          created_at?: string
          created_by?: string | null
          id?: string
          project_id: string
          visibility?: Database["public"]["Enums"]["file_visibility"]
        }
        Update: {
          author_name?: string
          body?: string
          created_at?: string
          created_by?: string | null
          id?: string
          project_id?: string
          visibility?: Database["public"]["Enums"]["file_visibility"]
        }
        Relationships: [
          {
            foreignKeyName: "project_comments_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_comments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_files: {
        Row: {
          file_type: string
          id: string
          name: string
          project_id: string
          size_label: string
          storage_bucket: string
          storage_path: string
          uploaded_at: string
          visibility: Database["public"]["Enums"]["file_visibility"]
        }
        Insert: {
          file_type: string
          id?: string
          name: string
          project_id: string
          size_label?: string
          storage_bucket: string
          storage_path: string
          uploaded_at?: string
          visibility?: Database["public"]["Enums"]["file_visibility"]
        }
        Update: {
          file_type?: string
          id?: string
          name?: string
          project_id?: string
          size_label?: string
          storage_bucket?: string
          storage_path?: string
          uploaded_at?: string
          visibility?: Database["public"]["Enums"]["file_visibility"]
        }
        Relationships: [
          {
            foreignKeyName: "project_files_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_finance_snapshots: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          inputs: Json
          notes: string
          outputs: Json
          project_id: string
          title: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          inputs: Json
          notes?: string
          outputs: Json
          project_id: string
          title: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          inputs?: Json
          notes?: string
          outputs?: Json
          project_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_finance_snapshots_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_finance_snapshots_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_financial_targets: {
        Row: {
          budgeted_cost: number
          contingency_percent: number
          contract_value: number
          project_id: string
          target_margin_percent: number
          updated_at: string
        }
        Insert: {
          budgeted_cost?: number
          contingency_percent?: number
          contract_value?: number
          project_id: string
          target_margin_percent?: number
          updated_at?: string
        }
        Update: {
          budgeted_cost?: number
          contingency_percent?: number
          contract_value?: number
          project_id?: string
          target_margin_percent?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_financial_targets_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: true
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_phases: {
        Row: {
          date_label: string
          description: string
          id: string
          project_id: string
          sort_order: number
          status: Database["public"]["Enums"]["phase_status"]
          title: string
        }
        Insert: {
          date_label: string
          description: string
          id?: string
          project_id: string
          sort_order?: number
          status?: Database["public"]["Enums"]["phase_status"]
          title: string
        }
        Update: {
          date_label?: string
          description?: string
          id?: string
          project_id?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["phase_status"]
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_phases_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_photos: {
        Row: {
          caption: string
          category: Database["public"]["Enums"]["project_photo_category"]
          id: string
          image_url: string
          photo_date: string
          project_id: string
          title: string
          uploaded_at: string
          visibility: Database["public"]["Enums"]["file_visibility"]
        }
        Insert: {
          caption?: string
          category?: Database["public"]["Enums"]["project_photo_category"]
          id?: string
          image_url: string
          photo_date: string
          project_id: string
          title: string
          uploaded_at?: string
          visibility?: Database["public"]["Enums"]["file_visibility"]
        }
        Update: {
          caption?: string
          category?: Database["public"]["Enums"]["project_photo_category"]
          id?: string
          image_url?: string
          photo_date?: string
          project_id?: string
          title?: string
          uploaded_at?: string
          visibility?: Database["public"]["Enums"]["file_visibility"]
        }
        Relationships: [
          {
            foreignKeyName: "project_photos_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_rfis: {
        Row: {
          answer: string
          answered_at: string | null
          created_at: string
          due_date: string
          id: string
          project_id: string
          question: string
          requested_by: string
          status: Database["public"]["Enums"]["rfi_status"]
          title: string
          visibility: Database["public"]["Enums"]["file_visibility"]
        }
        Insert: {
          answer?: string
          answered_at?: string | null
          created_at?: string
          due_date: string
          id?: string
          project_id: string
          question: string
          requested_by: string
          status?: Database["public"]["Enums"]["rfi_status"]
          title: string
          visibility?: Database["public"]["Enums"]["file_visibility"]
        }
        Update: {
          answer?: string
          answered_at?: string | null
          created_at?: string
          due_date?: string
          id?: string
          project_id?: string
          question?: string
          requested_by?: string
          status?: Database["public"]["Enums"]["rfi_status"]
          title?: string
          visibility?: Database["public"]["Enums"]["file_visibility"]
        }
        Relationships: [
          {
            foreignKeyName: "project_rfis_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_selections: {
        Row: {
          allowance_amount: number
          approved_at: string | null
          approved_by_name: string
          category: string
          client_notes: string
          created_at: string
          due_date: string
          id: string
          internal_notes: string
          project_id: string
          selected_option: string
          status: Database["public"]["Enums"]["selection_status"]
          title: string
          vendor: string
        }
        Insert: {
          allowance_amount?: number
          approved_at?: string | null
          approved_by_name?: string
          category: string
          client_notes?: string
          created_at?: string
          due_date: string
          id?: string
          internal_notes?: string
          project_id: string
          selected_option?: string
          status?: Database["public"]["Enums"]["selection_status"]
          title: string
          vendor?: string
        }
        Update: {
          allowance_amount?: number
          approved_at?: string | null
          approved_by_name?: string
          category?: string
          client_notes?: string
          created_at?: string
          due_date?: string
          id?: string
          internal_notes?: string
          project_id?: string
          selected_option?: string
          status?: Database["public"]["Enums"]["selection_status"]
          title?: string
          vendor?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_selections_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_tasks: {
        Row: {
          assigned_worker_id: string | null
          completed_at: string | null
          created_at: string
          due_date: string
          id: string
          notes: string
          priority: Database["public"]["Enums"]["task_priority"]
          project_id: string
          status: Database["public"]["Enums"]["task_status"]
          title: string
        }
        Insert: {
          assigned_worker_id?: string | null
          completed_at?: string | null
          created_at?: string
          due_date: string
          id?: string
          notes?: string
          priority?: Database["public"]["Enums"]["task_priority"]
          project_id: string
          status?: Database["public"]["Enums"]["task_status"]
          title: string
        }
        Update: {
          assigned_worker_id?: string | null
          completed_at?: string | null
          created_at?: string
          due_date?: string
          id?: string
          notes?: string
          priority?: Database["public"]["Enums"]["task_priority"]
          project_id?: string
          status?: Database["public"]["Enums"]["task_status"]
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_tasks_assigned_worker_id_fkey"
            columns: ["assigned_worker_id"]
            isOneToOne: false
            referencedRelation: "workers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_updates: {
        Row: {
          body: string
          created_at: string
          created_by: string | null
          id: string
          project_id: string
          title: string
          update_date: string
          visibility: Database["public"]["Enums"]["file_visibility"]
        }
        Insert: {
          body: string
          created_at?: string
          created_by?: string | null
          id?: string
          project_id: string
          title: string
          update_date?: string
          visibility?: Database["public"]["Enums"]["file_visibility"]
        }
        Update: {
          body?: string
          created_at?: string
          created_by?: string | null
          id?: string
          project_id?: string
          title?: string
          update_date?: string
          visibility?: Database["public"]["Enums"]["file_visibility"]
        }
        Relationships: [
          {
            foreignKeyName: "project_updates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_updates_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_vendor_assignments: {
        Row: {
          created_at: string
          end_date: string | null
          id: string
          project_id: string
          scope: string
          start_date: string
          status: Database["public"]["Enums"]["project_vendor_assignment_status"]
          vendor_id: string
          visibility: Database["public"]["Enums"]["file_visibility"]
        }
        Insert: {
          created_at?: string
          end_date?: string | null
          id?: string
          project_id: string
          scope: string
          start_date: string
          status?: Database["public"]["Enums"]["project_vendor_assignment_status"]
          vendor_id: string
          visibility?: Database["public"]["Enums"]["file_visibility"]
        }
        Update: {
          created_at?: string
          end_date?: string | null
          id?: string
          project_id?: string
          scope?: string
          start_date?: string
          status?: Database["public"]["Enums"]["project_vendor_assignment_status"]
          vendor_id?: string
          visibility?: Database["public"]["Enums"]["file_visibility"]
        }
        Relationships: [
          {
            foreignKeyName: "project_vendor_assignments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_vendor_assignments_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          budget_range: string
          client_id: string
          created_at: string
          current_phase: string
          estimated_completion: string
          hero_image: string
          id: string
          location: string
          name: string
          notes: string
          progress: number
          start_date: string
          status: Database["public"]["Enums"]["project_status"]
          type: string
        }
        Insert: {
          budget_range: string
          client_id: string
          created_at?: string
          current_phase: string
          estimated_completion: string
          hero_image?: string
          id?: string
          location: string
          name: string
          notes?: string
          progress?: number
          start_date: string
          status?: Database["public"]["Enums"]["project_status"]
          type: string
        }
        Update: {
          budget_range?: string
          client_id?: string
          created_at?: string
          current_phase?: string
          estimated_completion?: string
          hero_image?: string
          id?: string
          location?: string
          name?: string
          notes?: string
          progress?: number
          start_date?: string
          status?: Database["public"]["Enums"]["project_status"]
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      proposal_line_items: {
        Row: {
          description: string
          id: string
          is_optional: boolean
          proposal_id: string
          quantity: number
          section: string
          sort_order: number
          unit_price: number
        }
        Insert: {
          description: string
          id?: string
          is_optional?: boolean
          proposal_id: string
          quantity: number
          section: string
          sort_order?: number
          unit_price: number
        }
        Update: {
          description?: string
          id?: string
          is_optional?: boolean
          proposal_id?: string
          quantity?: number
          section?: string
          sort_order?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "proposal_line_items_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "proposals"
            referencedColumns: ["id"]
          },
        ]
      }
      proposals: {
        Row: {
          client_email: string
          client_name: string
          created_at: string
          id: string
          internal_notes: string
          lead_id: string
          proposal_number: string
          scope_summary: string
          status: Database["public"]["Enums"]["proposal_status"]
          title: string
          valid_until: string
        }
        Insert: {
          client_email: string
          client_name: string
          created_at?: string
          id?: string
          internal_notes?: string
          lead_id: string
          proposal_number: string
          scope_summary?: string
          status?: Database["public"]["Enums"]["proposal_status"]
          title: string
          valid_until: string
        }
        Update: {
          client_email?: string
          client_name?: string
          created_at?: string
          id?: string
          internal_notes?: string
          lead_id?: string
          proposal_number?: string
          scope_summary?: string
          status?: Database["public"]["Enums"]["proposal_status"]
          title?: string
          valid_until?: string
        }
        Relationships: [
          {
            foreignKeyName: "proposals_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_orders: {
        Row: {
          amount: number
          created_at: string
          due_date: string
          id: string
          notes: string
          po_number: string
          project_id: string
          status: Database["public"]["Enums"]["purchase_order_status"]
          title: string
          vendor: string
        }
        Insert: {
          amount?: number
          created_at?: string
          due_date: string
          id?: string
          notes?: string
          po_number: string
          project_id: string
          status?: Database["public"]["Enums"]["purchase_order_status"]
          title: string
          vendor: string
        }
        Update: {
          amount?: number
          created_at?: string
          due_date?: string
          id?: string
          notes?: string
          po_number?: string
          project_id?: string
          status?: Database["public"]["Enums"]["purchase_order_status"]
          title?: string
          vendor?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchase_orders_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      time_entries: {
        Row: {
          clock_in: string
          clock_out: string | null
          created_at: string
          id: string
          notes: string
          project_id: string
          worker_id: string
        }
        Insert: {
          clock_in: string
          clock_out?: string | null
          created_at?: string
          id?: string
          notes?: string
          project_id: string
          worker_id: string
        }
        Update: {
          clock_in?: string
          clock_out?: string | null
          created_at?: string
          id?: string
          notes?: string
          project_id?: string
          worker_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "time_entries_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "time_entries_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "workers"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_rfi_responses: {
        Row: {
          assignment_id: string
          created_at: string
          id: string
          project_id: string
          responder_name: string
          response_body: string
          rfi_id: string
          vendor_id: string
        }
        Insert: {
          assignment_id: string
          created_at?: string
          id?: string
          project_id: string
          responder_name: string
          response_body: string
          rfi_id: string
          vendor_id: string
        }
        Update: {
          assignment_id?: string
          created_at?: string
          id?: string
          project_id?: string
          responder_name?: string
          response_body?: string
          rfi_id?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_rfi_responses_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "project_vendor_assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_rfi_responses_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_rfi_responses_rfi_id_fkey"
            columns: ["rfi_id"]
            isOneToOne: false
            referencedRelation: "project_rfis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_rfi_responses_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_submittals: {
        Row: {
          assignment_id: string
          category: Database["public"]["Enums"]["vendor_submittal_category"]
          id: string
          mime_type: string
          project_id: string
          review_comment: string
          reviewed_at: string | null
          reviewed_by: string | null
          size_label: string
          status: Database["public"]["Enums"]["vendor_submittal_status"]
          storage_bucket: string
          storage_path: string
          submitted_at: string
          title: string
          vendor_id: string
        }
        Insert: {
          assignment_id: string
          category?: Database["public"]["Enums"]["vendor_submittal_category"]
          id?: string
          mime_type: string
          project_id: string
          review_comment?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          size_label?: string
          status?: Database["public"]["Enums"]["vendor_submittal_status"]
          storage_bucket?: string
          storage_path: string
          submitted_at?: string
          title: string
          vendor_id: string
        }
        Update: {
          assignment_id?: string
          category?: Database["public"]["Enums"]["vendor_submittal_category"]
          id?: string
          mime_type?: string
          project_id?: string
          review_comment?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          size_label?: string
          status?: Database["public"]["Enums"]["vendor_submittal_status"]
          storage_bucket?: string
          storage_path?: string
          submitted_at?: string
          title?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_submittals_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "project_vendor_assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_submittals_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_submittals_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_submittals_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendors: {
        Row: {
          auth_email: string
          company_type: Database["public"]["Enums"]["vendor_company_type"]
          created_at: string
          email: string
          id: string
          name: string
          notes: string
          phone: string
          portal_access: boolean
          status: Database["public"]["Enums"]["vendor_status"]
          trade: string
        }
        Insert: {
          auth_email?: string
          company_type?: Database["public"]["Enums"]["vendor_company_type"]
          created_at?: string
          email: string
          id?: string
          name: string
          notes?: string
          phone?: string
          portal_access?: boolean
          status?: Database["public"]["Enums"]["vendor_status"]
          trade: string
        }
        Update: {
          auth_email?: string
          company_type?: Database["public"]["Enums"]["vendor_company_type"]
          created_at?: string
          email?: string
          id?: string
          name?: string
          notes?: string
          phone?: string
          portal_access?: boolean
          status?: Database["public"]["Enums"]["vendor_status"]
          trade?: string
        }
        Relationships: []
      }
      warranty_items: {
        Row: {
          created_at: string
          description: string
          due_date: string
          id: string
          item_type: Database["public"]["Enums"]["warranty_item_type"]
          location: string
          priority: Database["public"]["Enums"]["warranty_item_priority"]
          project_id: string
          requested_by: string
          resolved_at: string | null
          status: Database["public"]["Enums"]["warranty_item_status"]
          title: string
          visibility: Database["public"]["Enums"]["file_visibility"]
        }
        Insert: {
          created_at?: string
          description: string
          due_date: string
          id?: string
          item_type?: Database["public"]["Enums"]["warranty_item_type"]
          location?: string
          priority?: Database["public"]["Enums"]["warranty_item_priority"]
          project_id: string
          requested_by: string
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["warranty_item_status"]
          title: string
          visibility?: Database["public"]["Enums"]["file_visibility"]
        }
        Update: {
          created_at?: string
          description?: string
          due_date?: string
          id?: string
          item_type?: Database["public"]["Enums"]["warranty_item_type"]
          location?: string
          priority?: Database["public"]["Enums"]["warranty_item_priority"]
          project_id?: string
          requested_by?: string
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["warranty_item_status"]
          title?: string
          visibility?: Database["public"]["Enums"]["file_visibility"]
        }
        Relationships: [
          {
            foreignKeyName: "warranty_items_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      workers: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          name: string
          role: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          role: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          role?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
      is_project_client: { Args: { project_uuid: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "customer" | "employee" | "subcontractor"
      bill_status: "draft" | "received" | "paid"
      change_order_status: "draft" | "sent" | "approved" | "declined"
      file_visibility: "internal" | "customer"
      invoice_status: "draft" | "sent" | "paid"
      land_lead_county: "larimer" | "weld"
      land_lead_status:
        | "new"
        | "reviewed"
        | "contacted"
        | "not_a_fit"
        | "do_not_contact"
      lead_status:
        | "new"
        | "contacted"
        | "qualified"
        | "proposal"
        | "won"
        | "lost"
      phase_status: "completed" | "in-progress" | "upcoming"
      project_photo_category:
        | "progress"
        | "selections"
        | "issue"
        | "before"
        | "after"
        | "closeout"
      project_status: "planning" | "active" | "paused" | "completed"
      project_vendor_assignment_status:
        | "invited"
        | "scheduled"
        | "active"
        | "complete"
      proposal_status: "draft" | "sent" | "approved" | "declined"
      purchase_order_status: "draft" | "sent" | "approved" | "received"
      rfi_status: "open" | "answered" | "closed"
      selection_status: "needed" | "submitted" | "approved" | "ordered"
      task_priority: "low" | "normal" | "high" | "urgent"
      task_status: "open" | "in-progress" | "done"
      vendor_company_type: "subcontractor" | "vendor"
      vendor_status: "active" | "inactive"
      vendor_submittal_category:
        | "insurance"
        | "w9"
        | "submittal"
        | "closeout"
        | "warranty"
        | "other"
      vendor_submittal_status:
        | "submitted"
        | "reviewed"
        | "approved"
        | "rejected"
      warranty_item_priority: "low" | "normal" | "high"
      warranty_item_status: "open" | "scheduled" | "resolved" | "closed"
      warranty_item_type: "warranty" | "punch-list"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "customer", "employee", "subcontractor"],
      bill_status: ["draft", "received", "paid"],
      change_order_status: ["draft", "sent", "approved", "declined"],
      file_visibility: ["internal", "customer"],
      invoice_status: ["draft", "sent", "paid"],
      land_lead_county: ["larimer", "weld"],
      land_lead_status: [
        "new",
        "reviewed",
        "contacted",
        "not_a_fit",
        "do_not_contact",
      ],
      lead_status: ["new", "contacted", "qualified", "proposal", "won", "lost"],
      phase_status: ["completed", "in-progress", "upcoming"],
      project_photo_category: [
        "progress",
        "selections",
        "issue",
        "before",
        "after",
        "closeout",
      ],
      project_status: ["planning", "active", "paused", "completed"],
      project_vendor_assignment_status: [
        "invited",
        "scheduled",
        "active",
        "complete",
      ],
      proposal_status: ["draft", "sent", "approved", "declined"],
      purchase_order_status: ["draft", "sent", "approved", "received"],
      rfi_status: ["open", "answered", "closed"],
      selection_status: ["needed", "submitted", "approved", "ordered"],
      task_priority: ["low", "normal", "high", "urgent"],
      task_status: ["open", "in-progress", "done"],
      vendor_company_type: ["subcontractor", "vendor"],
      vendor_status: ["active", "inactive"],
      vendor_submittal_category: [
        "insurance",
        "w9",
        "submittal",
        "closeout",
        "warranty",
        "other",
      ],
      vendor_submittal_status: [
        "submitted",
        "reviewed",
        "approved",
        "rejected",
      ],
      warranty_item_priority: ["low", "normal", "high"],
      warranty_item_status: ["open", "scheduled", "resolved", "closed"],
      warranty_item_type: ["warranty", "punch-list"],
    },
  },
} as const
