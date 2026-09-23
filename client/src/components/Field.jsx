export default function Field({ icon: Icon, label, right, ...props }) {
  return (
    <label className="field">
      <span className="lbl">{label}</span>
      <div className="inp">{Icon && <Icon size={16} />}<input {...props} />{right}</div>
    </label>
  );
}
export function Select({ icon: Icon, label, children, ...props }) {
  return (
    <label className="field">
      <span className="lbl">{label}</span>
      <div className="inp">{Icon && <Icon size={16} />}<select {...props}>{children}</select></div>
    </label>
  );
}
