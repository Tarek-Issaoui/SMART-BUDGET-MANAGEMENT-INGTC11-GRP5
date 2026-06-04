import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function AdminLayout({ children }) {
  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"var(--page-bg)" }}>
      <Sidebar />
      <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0 }}>
        <Navbar />
        <main style={{ flex:1, padding:"26px 28px 40px", overflowY:"auto" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
