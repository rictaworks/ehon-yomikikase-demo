export function validate(body: Record<string, unknown>): boolean {
  const hpValue = body["hp_email"]
  return hpValue === "" || hpValue === undefined || hpValue === null
}
