import { createClient, getSupabaseHost } from '@/lib/supabase/client'

export type RegistrationMode = 'manual' | 'voice'

export type RegistrationInput = {
  fullName: string
  mobileNumber: string
  dateOfBirth: string
  mode: RegistrationMode
}

export function parseDob(value: string): string | null {
  const match = value.trim().match(/^(\d{1,2})\s*[/\-. ]\s*(\d{1,2})\s*[/\-. ]\s*(\d{4})$/)
  if (!match) return null
  const [, d, m, y] = match
  const day = Number(d)
  const month = Number(m)
  const year = Number(y)
  const date = new Date(Date.UTC(year, month - 1, day))
  const valid =
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day &&
    year > 1900 &&
    date.getTime() <= Date.now()
  if (!valid) return null
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export async function registerUser(input: RegistrationInput): Promise<{ error: string | null }> {
  const fullName = input.fullName.trim()
  const mobileNumber = input.mobileNumber.replace(/\s+/g, '')
  const dateOfBirth = parseDob(input.dateOfBirth)

  if (fullName.length < 2 || fullName.length > 100) return { error: 'Please enter your full name.' }
  if (!/^[0-9]{10}$/.test(mobileNumber)) return { error: 'Please enter a valid 10-digit mobile number.' }
  if (!dateOfBirth) return { error: 'Please enter a valid date of birth as DD/MM/YYYY.' }

  try {
    const { error, status } = await createClient().from('users').insert({
      full_name: fullName,
      mobile_number: mobileNumber,
      date_of_birth: dateOfBirth,
      mode: input.mode,
    })

    if (error) {
      console.error(`Supabase insert into users failed (${getSupabaseHost()}, HTTP ${status}):`, error)
      return { error: `Could not save your details: ${error.message}${error.code ? ` (code ${error.code})` : ''}` }
    }
    console.log(`Supabase insert into users succeeded (${getSupabaseHost()}, HTTP ${status})`)
    return { error: null }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error(`Supabase request to ${getSupabaseHost()} threw:`, err)
    return { error: `Could not reach the database: ${message}` }
  }
}
