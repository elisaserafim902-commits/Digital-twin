import Sidebar from "../components/Sidebar"
import Topbar from "../components/Topbar"
import Card from "../components/Card"

export default function Dashboard() {
return (
<div className="flex bg-[#020617] min-h-screen">

<Sidebar />

<div className="flex-1">
<Topbar />

<div className="p-6 grid grid-cols-3 gap-6">
<Card title="Machines Active" value="24" />
<Card title="Alerts" value="3" />
<Card title="Efficiency" value="92%" />
</div>
</div>
</div>
)
} 
