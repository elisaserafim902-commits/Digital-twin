import "./globals.css"
import LayoutShell from "./components/LayoutShell"

export default function RootLayout({
children,
}: {
children: React.ReactNode
}) {
return (
<html lang="pt-br">
<body>
<LayoutShell>{children}</LayoutShell>
</body>
</html>
)
}