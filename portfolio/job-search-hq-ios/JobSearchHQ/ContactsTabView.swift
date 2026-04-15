import SwiftUI
import ClarityUI

struct ContactsTabView: View {
    @Environment(JobSearchStore.self) private var store
    @State private var editorContact: JobContact?

    var body: some View {
        NavigationStack {
            Group {
                if store.data.contacts.isEmpty {
                    ContentUnavailableView(
                        "No contacts",
                        systemImage: "person.2",
                        description: Text("Tap + to add someone from networking.")
                    )
                    .foregroundStyle(JSHQTheme.textMuted)
                } else {
                    List {
                        ForEach(store.data.contacts) { contact in
                            Button {
                                editorContact = contact
                            } label: {
                                contactRow(contact)
                            }
                            .listRowBackground(JSHQTheme.surface)
                        }
                        .onDelete(perform: deleteAt)
                    }
                    .listStyle(.plain)
                    .scrollContentBackground(.hidden)
                }
            }
            .background(JSHQTheme.background)
            .navigationTitle("Contacts")
            .navigationBarTitleDisplayMode(.large)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button {
                        editorContact = JobContact(id: JobSearchId.generate())
                    } label: {
                        Image(systemName: "plus")
                    }
                    .accessibilityLabel("Add contact")
                    .frame(minWidth: ClarityMetrics.minTapTarget, minHeight: ClarityMetrics.minTapTarget)
                }
            }
            .sheet(item: $editorContact) { c in
                ContactEditorSheet(initial: c) { updated in
                    store.upsertContact(updated)
                }
            }
        }
    }

    private func contactRow(_ c: JobContact) -> some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(c.name.isEmpty ? "Name" : c.name)
                .font(ClarityTypography.headline)
                .foregroundStyle(JSHQTheme.textPrimary)
            if !c.company.isEmpty || !c.role.isEmpty {
                Text([c.role, c.company].filter { !$0.isEmpty }.joined(separator: " · "))
                    .font(ClarityTypography.body)
                    .foregroundStyle(JSHQTheme.textMuted)
            }
            Text("Outreach: \(c.outreachStatus)")
                .font(ClarityTypography.caption)
                .foregroundStyle(JSHQTheme.accentPurple)
        }
        .padding(.vertical, 4)
    }

    private func deleteAt(_ offsets: IndexSet) {
        for i in offsets {
            let id = store.data.contacts[i].id
            store.deleteContact(id: id)
        }
    }
}
