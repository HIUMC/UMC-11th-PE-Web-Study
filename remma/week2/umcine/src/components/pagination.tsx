export default function Pagination() {
  return (
    <div className="pagination" style={{ display: 'flex', justifyContent: 'center', marginTop: '40px', gap: '8px' }}>
      <button style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', background: 'white', cursor: 'pointer' }}>이전</button>
      <button style={{ padding: '8px 12px', border: 'none', borderRadius: '4px', background: '#3b82f6', color: 'white', fontWeight: 'bold' }}>1</button>
      <button style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', background: 'white', cursor: 'pointer' }}>다음</button>
    </div>
  );
}