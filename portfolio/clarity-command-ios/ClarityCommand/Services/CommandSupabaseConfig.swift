import Foundation

/// Same shared portfolio Supabase project as web Clarity Command (`APP_KEY = command`).
enum CommandSupabaseConfig {
    static let projectURL = URL(string: "https://unqtnnxlltiadzbqpyhh.supabase.co")!
    /// Public anon key (RLS-scoped); matches `WellnessSupabaseConfig` / web CRA `.env`.
    static let anonKey =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVucXRubnhsbHRpYWR6YnFweWhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNzQwODksImV4cCI6MjA4OTk1MDA4OX0.SiLspiMZoQuE8jr-WcYLHPSAYsw7-JJ1T69zWO85rkY"
}
