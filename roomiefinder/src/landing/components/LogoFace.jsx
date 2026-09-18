export function LogoFace({ className = "", active = false }) {
  return (
    <svg
      viewBox="0 0 36.6526 36.6526"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <circle
        cx="18.3263"
        cy="18.3263"
        r="18.3263"
        fill={active ? "#256BEA" : "white"}
        style={{ transition: "fill 400ms cubic-bezier(0.23, 1, 0.32, 1)" }}
      />
      <circle
        cx="12.7487"
        cy="15.1391"
        r="3.18718"
        fill={active ? "white" : "#3076ED"}
        style={{ transition: "fill 400ms cubic-bezier(0.23, 1, 0.32, 1)" }}
      />
      <circle
        cx="23.903"
        cy="15.1391"
        r="3.18718"
        fill={active ? "white" : "#3076ED"}
        style={{ transition: "fill 400ms cubic-bezier(0.23, 1, 0.32, 1)" }}
      />
    </svg>
  );
}
