export function Card({ children, className = "", style = {} }: { 
  children: React.ReactNode; 
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div style={{
      background: "linear-gradient(135deg, #111827 0%, #1a2235 100%)",
      border: "1px solid #1e3a5f",
      borderRadius: "12px",
      boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
      ...style
    }}>
      {children}
    </div>
  );
}

export function CardHeader({ children, style = {} }: { 
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div style={{ padding: "16px 16px 8px 16px", ...style }}>
      {children}
    </div>
  );
}

export function CardTitle({ children, style = {} }: { 
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <h3 style={{ 
      fontWeight: "600", 
      color: "white", 
      fontSize: "14px",
      ...style 
    }}>
      {children}
    </h3>
  );
}

export function CardContent({ children, style = {} }: { 
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div style={{ padding: "0 16px 16px 16px", ...style }}>
      {children}
    </div>
  );
}