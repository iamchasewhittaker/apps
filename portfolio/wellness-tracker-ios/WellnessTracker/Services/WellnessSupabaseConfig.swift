import Foundation

/// Shared portfolio Supabase project (same anon key as web CRA apps; RLS protects user rows).
enum WellnessSupabaseConfig {
    static let projectURL = URL(string: "https://unqtnnxlltiadzbqpyhh.supabase.co")!
    /// Public anon key (documented in repo handoffs; safe with RLS).
    static let anonKey =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVucXRubnhsbHRpYWR6YnFweWhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNzQwODksImV4cCI6MjA4OTk1MDA4OX0.SiLspiMZoQuE8jr-WcYLHPSAYsw7-JJ1T69zWO85rkY"
}
