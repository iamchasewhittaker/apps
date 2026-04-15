import Foundation

/// Supabase parity contract — see `docs/SYNC_PHASE2.md`. Default is no-op until Phase 2.
protocol JobSearchRemoteSync: AnyObject {
    /// When remote `_syncAt` is newer, return replacement blob; otherwise `nil`.
    func pullIfNewerThan(localSyncAt: Int64?) async throws -> JobSearchDataBlob?
    func push(_ blob: JobSearchDataBlob) async throws
}

final class NoOpJobSearchRemoteSync: JobSearchRemoteSync {
    func pullIfNewerThan(localSyncAt: Int64?) async throws -> JobSearchDataBlob? { nil }
    func push(_ blob: JobSearchDataBlob) async throws {}
}
