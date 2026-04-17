import SwiftUI

struct CheckFormView: View {
    @Environment(AppStore.self) private var store
    @State private var produced: Bool? = nil
    @State private var stayedInLanes: Bool? = nil

    var canSubmit: Bool { produced != nil && stayedInLanes != nil }

    var body: some View {
        VStack(alignment: .leading, spacing: 32) {
            Text("Two questions. That's it.")
                .foregroundStyle(Color(.systemGray))
                .padding(.horizontal)

            questionRow(
                prompt: "Did you produce something today?",
                answer: $produced
            )

            questionRow(
                prompt: "Did you stay in your lanes?",
                answer: $stayedInLanes
            )

            Spacer()

            Button {
                guard let p = produced, let s = stayedInLanes else { return }
                store.logCheck(produced: p, stayedInLanes: s)
            } label: {
                Text("Log it")
                    .fontWeight(.semibold)
                    .foregroundStyle(.black)
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color(hex: "#f59e0b"))
                    .clipShape(RoundedRectangle(cornerRadius: 12))
            }
            .disabled(!canSubmit)
            .opacity(canSubmit ? 1 : 0.4)
            .padding()
        }
        .background(Color(hex: "#09090b").ignoresSafeArea())
        .navigationTitle("Check")
        .navigationBarTitleDisplayMode(.large)
    }

    @ViewBuilder
    private func questionRow(prompt: String, answer: Binding<Bool?>) -> some View {
        VStack(alignment: .leading, spacing: 12) {
            Text(prompt)
                .foregroundStyle(.white)
                .fontWeight(.medium)
                .padding(.horizontal)

            HStack(spacing: 12) {
                answerButton(label: "Yes", isSelected: answer.wrappedValue == true) {
                    answer.wrappedValue = true
                }
                answerButton(label: "No", isSelected: answer.wrappedValue == false) {
                    answer.wrappedValue = false
                }
            }
            .padding(.horizontal)
        }
    }

    @ViewBuilder
    private func answerButton(label: String, isSelected: Bool, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            Text(label)
                .fontWeight(.medium)
                .foregroundStyle(isSelected ? .black : .white)
                .frame(maxWidth: .infinity)
                .padding()
                .background(isSelected ? Color.white : Color(hex: "#18181b"))
                .clipShape(RoundedRectangle(cornerRadius: 12))
        }
    }
}
