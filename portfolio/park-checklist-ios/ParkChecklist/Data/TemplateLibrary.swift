import Foundation

struct TaskTemplate: Identifiable, Hashable {
    var id: String { title }
    let title: String
}

struct TemplateCategory: Identifiable {
    var id: String { name }
    let name: String
    let templates: [TaskTemplate]
}

enum TemplateLibrary {
    static let categories: [TemplateCategory] = [
        TemplateCategory(
            name: "Morning",
            templates: [
                TaskTemplate(title: "Stretch / mobility"),
                TaskTemplate(title: "Make bed"),
                TaskTemplate(title: "Water + vitamins"),
                TaskTemplate(title: "Review calendar"),
            ]
        ),
        TemplateCategory(
            name: "Home",
            templates: [
                TaskTemplate(title: "Dishes"),
                TaskTemplate(title: "Laundry"),
                TaskTemplate(title: "Take out trash"),
                TaskTemplate(title: "Quick tidy — 10 min"),
            ]
        ),
        TemplateCategory(
            name: "Errands",
            templates: [
                TaskTemplate(title: "Groceries"),
                TaskTemplate(title: "Pharmacy pickup"),
                TaskTemplate(title: "Gas / charge vehicle"),
                TaskTemplate(title: "Mail / packages"),
            ]
        ),
        TemplateCategory(
            name: "Work",
            templates: [
                TaskTemplate(title: "Clear inbox — 20 min"),
                TaskTemplate(title: "Update task board"),
                TaskTemplate(title: "Prep for tomorrow’s meetings"),
                TaskTemplate(title: "File expenses"),
            ]
        ),
    ]
}
