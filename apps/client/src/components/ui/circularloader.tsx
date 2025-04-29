import "./style.css";

export default function ({ className }: { className?: string }) {
  return <div className={`${className} circularLoader`}></div>;
}
