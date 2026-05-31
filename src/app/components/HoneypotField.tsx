export default function HoneypotField() {
  return (
    <input
      type="text"
      name="hp_email"
      aria-hidden="true"
      tabIndex={-1}
      autoComplete="off"
      defaultValue=""
      style={{ display: "none" }}
    />
  )
}
