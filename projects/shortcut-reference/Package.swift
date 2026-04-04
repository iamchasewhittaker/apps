// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "ShortcutReference",
    platforms: [.macOS(.v13)],
    products: [
        .library(name: "ShortcutReferenceLibrary", targets: ["ShortcutReferenceLibrary"]),
        .executable(name: "ShortcutReference", targets: ["ShortcutReferenceCLI"]),
    ],
    targets: [
        .target(
            name: "ShortcutReferenceLibrary",
            path: "Sources/ShortcutReferenceLibrary"
        ),
        .executableTarget(
            name: "ShortcutReferenceCLI",
            dependencies: ["ShortcutReferenceLibrary"],
            path: "Sources/ShortcutReferenceCLI"
        ),
    ]
)
