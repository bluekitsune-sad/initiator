const VICIDIAL_URL = process.env.VICIDIAL_URL || 'https://dialer.synapselabs.us'
const API_USER = process.env.VICIDIAL_API_USER || 'hunain'
const API_PASS = process.env.VICIDIAL_API_PASS || 'HunainBro4321'

export interface VicidialAgent {
  user: string
  pass: string
  phone_login: string
  phone_pass: string
  campaign: string
}

export async function callVicidialApi(
  func: string,
  agentUser: string,
  params: Record<string, string> = {}
): Promise<string> {
  const queryParams = new URLSearchParams({
    source: 'crm',
    user: API_USER,
    pass: API_PASS,
    agent_user: agentUser,
    function: func,
    ...params,
  })

  const response = await fetch(`${VICIDIAL_URL}/agc/api.php?${queryParams.toString()}`, {
    method: 'GET',
    cache: 'no-store',
  })

  return response.text()
}

export async function pauseAgent(agentUser: string, value: string = 'PAUSE'): Promise<string> {
  return callVicidialApi('external_pause', agentUser, { value })
}

export async function resumeAgent(agentUser: string): Promise<string> {
  return pauseAgent(agentUser, 'RESUME')
}

export async function hangupAgent(agentUser: string): Promise<string> {
  return callVicidialApi('external_hangup', agentUser, { value: '1' })
}

export async function dialAgent(agentUser: string, phoneNumber: string): Promise<string> {
  return callVicidialApi('external_dial', agentUser, {
    phone_number: phoneNumber,
    search: 'YES',
    preview: 'YES',
    focus: 'YES',
  })
}

export async function setStatus(agentUser: string, status: string): Promise<string> {
  return callVicidialApi('external_status', agentUser, { value: status })
}

export async function logoutAgent(agentUser: string): Promise<string> {
  return callVicidialApi('logout', agentUser, { value: 'LOGOUT' })
}

export function getVicidialLoginUrl(agent: VicidialAgent): string {
  const params = new URLSearchParams({
    phone_login: agent.phone_login,
    phone_pass: agent.phone_pass,
    VD_login: agent.user,
    VD_pass: agent.pass,
    VD_campaign: agent.campaign,
  })
  return `${VICIDIAL_URL}/agc/vicidial.php?${params.toString()}`
}
