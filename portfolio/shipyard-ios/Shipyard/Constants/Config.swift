import Foundation

/// Supabase credentials — shared project with the web app.
/// Add SUPABASE_ANON_KEY to a gitignored Secrets.xcconfig before enabling live fetch.
enum Config {
    // URL is public (NEXT_PUBLIC_*); safe to hardcode.
    static let supabaseURL = URL(string: "https://unqtnnxlltiadzbqpyhh.supabase.co")!

    // TODO: move to Secrets.xcconfig + Info.plist once supabase-swift is added.
    // Never commit the real key here — this repo is public.
    static let supabaseAnonKey: String = {
        Bundle.main.infoDictionary?["SUPABASE_ANON_KEY"] as? String ?? ""
    }()

    static let ownerEmail = "chase.t.whittaker@gmail.com"
    static let userDefaultsKey = "chase_shipyard_ios_v1"
}
