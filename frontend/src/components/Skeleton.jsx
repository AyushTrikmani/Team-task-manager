const Skeleton = ({ h = '16px', w = '100%', r = '8px', mb = '0' }) => (
  <div style={{ height: h, width: w, borderRadius: r, marginBottom: mb, background: 'linear-gradient(90deg,#1e293b 25%,#334155 50%,#1e293b 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
);

export const SkeletonCard = () => (
  <div className="skel-card">
    <Skeleton h="20px" w="60%" mb="12px" />
    <Skeleton h="14px" mb="8px" />
    <Skeleton h="14px" w="80%" mb="16px" />
    <Skeleton h="32px" />
  </div>
);

export const SkeletonStat = () => (
  <div className="skel-card" style={{ textAlign: 'center' }}>
    <Skeleton h="48px" w="60px" mb="12px" r="8px" />
    <Skeleton h="14px" w="80px" />
  </div>
);

export default Skeleton;
