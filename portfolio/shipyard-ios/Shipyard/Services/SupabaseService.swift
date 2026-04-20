import Foundation
import Supabase

/// Shared Supabase client — single instance for the whole app.
enum SupabaseService {
    static let client = SupabaseClient(
        supabaseURL: Config.supabaseURL,
        supabaseKey: Config.supabaseAnonKey
    )
}
