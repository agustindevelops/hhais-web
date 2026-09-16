"use server"

const BASE = "https://api.brevo.com/v3"

async function brevoFetch(
  path: string,
  opts: { method?: string; body?: Record<string, unknown> }
) {
  const key = process.env.BREVO_API_KEY
  if (!key) throw new Error("Brevo API key not configured")

  const res = await fetch(`${BASE}${path}`, {
    method: opts.method ?? "GET",
    headers: { "api-key": key, "Content-Type": "application/json" },
    ...(opts.body && { body: JSON.stringify(opts.body) }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message ?? "Brevo request failed")
  return data
}

export async function subscribeBrevo(
  params: { email?: string; contact_id?: number },
  listId: number
) {
  const { email, contact_id } = params
  if (email?.trim()) {
    const normalized = email.trim().toLowerCase()
    const data = await brevoFetch("/contacts", {
      method: "POST",
      body: {
        email: normalized,
        listIds: [listId],
        updateEnabled: true,
      },
    })
    if (data.id != null) return { id: data.id }
    // Contact may have existed; fetch by email to get id
    const contact = await brevoFetch(`/contacts/${encodeURIComponent(normalized)}`, {})
    if (contact.id == null) throw new Error("Could not get contact ID")
    return { id: contact.id }
  }
  if (contact_id != null) {
    await brevoFetch(`/contacts/lists/${listId}/contacts/add`, {
      method: "POST",
      body: { ids: [contact_id] },
    })
    return { id: contact_id }
  }
  throw new Error("Either email or contact_id is required")
}

export async function updateBrevoContact(contactId: number, goals: string[]) {
  if (contactId == null) throw new Error("Contact ID is required")
  if (!goals?.length) throw new Error("At least one goal is required")
  const trimmed = goals.map((g) => g.trim()).filter(Boolean)
  if (!trimmed.length) throw new Error("At least one goal is required")
  await brevoFetch(
    `/contacts/${contactId}?identifierType=contact_id`,
    {
      method: "PUT",
      body: { attributes: { GOAL: trimmed } },
    }
  )
  return { success: true }
}
