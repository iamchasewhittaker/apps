import Foundation

/// Supabase credentials — shared portfolio project (same as wellness-tracker-ios, web apps).
/// Anon key is the public `NEXT_PUBLIC_SUPABASE_ANON_KEY` — safe with RLS enabled.
enum Config {
    static let supabaseURL = URL(string: "https://unqtnnxlltiadzbqpyhh.supabase.co")!

    static let supabaseAnonKey =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVucXRubnhsbHRpYWR6YnFweWhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNzQwODksImV4cCI6MjA4OTk1MDA4OX0.SiLspiMZoQuE8jr-WcYLHPSAYsw7-JJ1T69zWO85rkY"

    static let ownerEmail = "chase.t.whittaker@gmail.com"
    static let userDefaultsKey = "chase_shipyard_ios_v1"
}
