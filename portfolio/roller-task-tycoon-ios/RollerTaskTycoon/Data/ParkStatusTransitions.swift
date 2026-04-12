import Foundation
import SwiftData

enum ParkStatusTransitions {
    /// Applies a new status, adjusts parkCash, and writes ledger entry on close.
    static func apply(
        _ newStatus: AttractionStatus,
        to item: ChecklistTaskItem,
        parkCash: inout Int,
        context: ModelContext
    ) {
        let old = item.status
        guard old != newStatus else { return }
        let reward = max(0, item.rewardDollars)

        if newStatus == .closed, old != .closed {
            parkCash += reward
            context.insert(ProfitLedgerEntry(amount: reward, taskId: item.id, note: "Close attraction"))
            item.closedAt = Date()
        }

        if old == .closed, newStatus != .closed {
            parkCash = max(0, parkCash - reward)
            item.closedAt = nil
        }

        item.status = newStatus
    }
}
