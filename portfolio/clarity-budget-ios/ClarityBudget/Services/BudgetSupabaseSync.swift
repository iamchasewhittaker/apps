import Foundation

/// Cloud sync hook — **web** implements full Supabase `user_data` sync. iOS keeps blob shape + `_syncAt` for parity.
/// Wire `supabase-swift` + auth UI here when you add `ClaritySupabaseURL` / `ClaritySupabaseAnonKey` to the target Info.plist.
@MainActor
enum BudgetSupabaseSync {
    static func pullIntoStore(_ store: BudgetStore) async {}
    static func pushBlob(_ blob: BudgetBlob) async { _ = blob }
}
