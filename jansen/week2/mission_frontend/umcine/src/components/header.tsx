export default function Header() {
  return (
    <header className="app-header">
      <span className="app-logo">UMCine</span>
      <nav className="app-nav">
        <span className="app-nav-item active">영화</span>
        <span className="app-nav-item">예매</span>
        <span className="app-nav-item">찜한 목록</span>
      </nav>
    </header>
  );
}