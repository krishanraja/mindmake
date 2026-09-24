import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { validateExperienceQualityProfile } from './experience-quality-profile-check.mjs'

const [profile, rubric, continuity] = await Promise.all([
  readFile(new URL('../../quality/website-redesign/experience-quality.profile.json', import.meta.url), 'utf8').then(JSON.parse),
  readFile(new URL('../../quality/award-panel/rubric.v3.json', import.meta.url), 'utf8').then(JSON.parse),
  readFile(new URL('../../quality/website-redesign/continuity-contract.v1.json', import.meta.url), 'utf8').then(JSON.parse),
])
const clone = () => structuredClone(profile)
assert.deepEqual(validateExperienceQualityProfile(profile, rubric, continuity), [])

const cases = [
  [(p) => { p.briefFidelity.ownerDirectionIsHardGate = false }, 'owner direction must be a brief-fidelity hard gate'],
  [(p) => { p.briefFidelity.candidateTraceRequired = false }, 'candidate trace must be required'],
  [(p) => { delete p.presentationFirewall }, 'presentation firewall must be required'],
  [(p) => { p.presentationFirewall.failClosed = false }, 'presentation firewall must fail closed'],
  [(p) => { p.presentationFirewall.embeddedFrameIntegrationAllowed = true }, 'presentation firewall must reject embedded-frame integration'],
  [(p) => { p.presentationFirewall.blockingStatuses = ['fail', 'inconclusive', 'not_run'] }, 'presentation firewall blocking statuses are incomplete'],
  [(p) => { delete p.commands.presentation }, 'commands.presentation is required'],
  [(p) => { p.briefFidelity.scoresCannotOverride = false }, 'scores cannot override brief fidelity'],
  [(p) => { p.briefFidelity.requiredFields = p.briefFidelity.requiredFields.filter((x) => x !== 'contradictions') }, 'brief-fidelity fields are incomplete'],
  [(p) => { p.feedbackReconciliation.verbatimRequired = false }, 'feedback must be preserved verbatim'],
  [(p) => { p.feedbackReconciliation.submissionIsApproval = true }, 'submission must not equal approval'],
  [(p) => { p.feedbackReconciliation.blockOnUnresolved = false }, 'unresolved feedback must block approval'],
  [(p) => { p.feedbackReconciliation.requiredFields = p.feedbackReconciliation.requiredFields.filter((x) => x !== 'exactFeedback') }, 'feedback fields are incomplete'],
  [(p) => { p.reviewReadiness.requiredChecks = p.reviewReadiness.requiredChecks.filter((x) => x !== 'layout_alignment') }, 'reviewReadiness checks are incomplete'],
  [(p) => { p.reviewReadiness.selfOwnedRuntime = false }, 'self-owned runtime'],
  [(p) => { p.blindPanel.roles = p.blindPanel.roles.filter((role) => role.id !== 'mobile_narrative_journey') }, 'match all rubric judges'],
  [(p) => { p.blindPanel.scoresCannotOverrideHardGates = false }, 'cannot override hard gates'],
  [(p) => { p.owners.materialApproval = 'blind-panel' }, 'owners.materialApproval'],
  [(p) => { p.releaseEvidence.physicalDevices = ['iPhone Safari + VoiceOver'] }, 'both physical assistive-device combinations'],
]

for (const [mutate, expected] of cases) {
  const candidate = clone()
  mutate(candidate)
  const failures = validateExperienceQualityProfile(candidate, rubric, continuity)
  assert(failures.some((failure) => failure.includes(expected)), `expected rejection containing ${expected}; got ${failures.join(' | ')}`)
}
console.log(`EXPERIENCE QUALITY SITE PROFILE SELF-TEST PASSED: ${cases.length + 1} cases`)
