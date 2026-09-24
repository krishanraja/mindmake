import { readFile } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'

export const REQUIRED_COVERAGE = [
  'product_truth', 'storyboard_narrative', 'information_architecture_guidance', 'conversion_trust', 'visual_craft',
  'design_system_integrity', 'device_specific_interaction', 'motion_scroll_causality', 'accessibility_assistive_technology',
  'content_clarity_voice', 'functional_state_recovery', 'responsive_layout', 'performance_technical', 'originality_brand', 'evidence_provenance',
]

export const REQUIRED_CHECKS = [
  'artifact_identity', 'runtime_identity', 'fresh_self_owned_capture', 'broken_links_controls_assets', 'overflow_overlap_clipping',
  'layout_alignment', 'text_wrap_orphans_content_range', 'contrast', 'keyboard_focus_semantics', 'touch_targets',
  'viewport_safe_areas_fixed_chrome', 'reduced_motion', 'section_fit_scroll_contract', 'duplicate_components_claims',
  'placeholder_debug_backup_singer_copy', 'console_network_user_impact',
  'single_dom_scroll_context', 'continuous_forward_reverse_journey', 'section_seam_collision', 'judge_evidence_identity',
]

export const REQUIRED_BRIEF_FIELDS = [
  'accepted_outcomes', 'accepted_experience', 'authoritative_evidence', 'rejected_patterns', 'candidate_mapping', 'omissions', 'contradictions',
]

export const REQUIRED_FEEDBACK_FIELDS = [
  'id', 'exactFeedback', 'source', 'surface', 'section', 'device', 'element', 'classification', 'requiredOutcome', 'acceptanceTest', 'status', 'resolution', 'evidence',
]

const exactOwners = {
  orchestration: 'build-apps-with-krish', taste: 'krish-design', implementation: 'krish-build', taskValidation: 'ux-testing-agent',
  completion: 'verification-loop', materialApproval: 'Krish', exceptions: 'Krish', release: 'explicit-action-time-approval',
}

const hasAll = (values, required) => Array.isArray(values) && required.every((value) => values.includes(value))
const unique = (values) => Array.isArray(values) && new Set(values).size === values.length

export function validateExperienceQualityProfile(profile, rubric, continuityContract) {
  const failures = []
  const require = (condition, message) => { if (!condition) failures.push(message) }
  require(profile?.schemaVersion === 1, 'schemaVersion must equal 1')
  require(profile?.contractVersion === '1.3.0', 'contractVersion must equal 1.3.0')
  require(profile?.stateRoute === 'project-documentation/website-redesign/STATE.md', 'stateRoute must point to the single redesign state')
  for (const [key, value] of Object.entries(exactOwners)) require(profile?.owners?.[key] === value, `owners.${key} must equal ${value}`)
  require(unique(profile?.surfaces) && hasAll(profile.surfaces, ['desktop', 'mobile']), 'surfaces must include unique desktop and mobile entries')
  require(unique(profile?.requiredCoverage) && hasAll(profile.requiredCoverage, REQUIRED_COVERAGE), 'requiredCoverage is incomplete')
  require(profile?.briefFidelity?.required === true, 'brief fidelity must be required')
  require(profile?.briefFidelity?.ownerDirectionIsHardGate === true, 'owner direction must be a brief-fidelity hard gate')
  require(profile?.briefFidelity?.candidateTraceRequired === true, 'candidate trace must be required')
  require(profile?.briefFidelity?.scoresCannotOverride === true, 'scores cannot override brief fidelity')
  require(profile?.briefFidelity?.blockOnUnresolved === true, 'unresolved omissions and contradictions must block')
  require(unique(profile?.briefFidelity?.requiredFields) && hasAll(profile.briefFidelity.requiredFields, REQUIRED_BRIEF_FIELDS), 'brief-fidelity fields are incomplete')
  require(unique(profile?.briefFidelity?.authoritativeSources) && profile.briefFidelity.authoritativeSources.length >= 1, 'brief fidelity requires authoritative sources')
  require(profile?.feedbackReconciliation?.required === true, 'feedback reconciliation must be required')
  require(profile?.feedbackReconciliation?.ledger === 'project-documentation/website-redesign/feedback-ledger.json', 'feedback ledger must point to the project register')
  require(profile?.feedbackReconciliation?.verbatimRequired === true, 'feedback must be preserved verbatim')
  require(profile?.feedbackReconciliation?.decisionNotesRequired === true, 'decision notes must be preserved')
  require(profile?.feedbackReconciliation?.overallNoteRequired === true, 'overall notes must be preserved')
  require(profile?.feedbackReconciliation?.submissionIsApproval === false, 'submission must not equal approval')
  require(profile?.feedbackReconciliation?.blockOnUnresolved === true, 'unresolved feedback must block approval')
  require(profile?.feedbackReconciliation?.judgesReceiveRequirements === true, 'judges must receive applicable feedback requirements')
  require(unique(profile?.feedbackReconciliation?.blockingStatuses) && hasAll(profile.feedbackReconciliation.blockingStatuses, ['open', 'implemented-awaiting-review']), 'feedback blocking statuses are incomplete')
  require(unique(profile?.feedbackReconciliation?.requiredFields) && hasAll(profile.feedbackReconciliation.requiredFields, REQUIRED_FEEDBACK_FIELDS), 'feedback fields are incomplete')
  require(unique(profile?.reviewReadiness?.blockingStatuses) && hasAll(profile.reviewReadiness.blockingStatuses, ['fail', 'inconclusive', 'not_run']), 'reviewReadiness must block fail, inconclusive and not_run')
  require(unique(profile?.reviewReadiness?.requiredChecks) && hasAll(profile.reviewReadiness.requiredChecks, REQUIRED_CHECKS), 'reviewReadiness checks are incomplete')
  require(profile?.reviewReadiness?.selfOwnedRuntime === true, 'review readiness must use a self-owned runtime')
  require(profile?.reviewReadiness?.candidateBoundEvidence === true, 'review readiness evidence must be candidate-bound')
  require(profile?.presentationFirewall?.required === true, 'presentation firewall must be required')
  require(profile?.presentationFirewall?.failClosed === true, 'presentation firewall must fail closed')
  require(profile?.presentationFirewall?.candidateManifestRequired === true, 'presentation firewall must require a candidate manifest')
  require(profile?.presentationFirewall?.singleDomScrollContextRequired === true, 'presentation firewall must require one DOM and scroll context')
  require(profile?.presentationFirewall?.embeddedFrameIntegrationAllowed === false, 'presentation firewall must reject embedded-frame integration')
  require(profile?.presentationFirewall?.candidateBoundReceiptRequired === true, 'presentation firewall must require a candidate-bound receipt')
  require(profile?.presentationFirewall?.directReviewCommandRequired === true, 'presentation firewall must require a direct review command')
  require(profile?.presentationFirewall?.adversarialSelfTestRequired === true, 'presentation firewall must require adversarial self-tests')
  require(unique(profile?.presentationFirewall?.blockingStatuses) && hasAll(profile.presentationFirewall.blockingStatuses, ['fail', 'inconclusive', 'not_run', 'stale', 'mismatch', 'missing']), 'presentation firewall blocking statuses are incomplete')
  require(profile?.continuity?.required === true && profile?.continuity?.blockOnAnyUnresolved === true, 'continuity must be required and block on any unresolved item')
  require(hasAll(profile?.continuity?.requiredFields, ['route', 'viewport', 'action', 'expected', 'observed', 'evidence']), 'continuity fields are incomplete')
  require(profile?.blindPanel?.required === true && profile?.blindPanel?.ownerHistoryVisible === false, 'blind panel must be required and history-blind')
  require(profile?.blindPanel?.minimumIndependentJurors >= 6, 'blind panel requires at least six independent jurors')
  require(profile?.blindPanel?.scoresCannotOverrideHardGates === true, 'scores cannot override hard gates')
  const roleIds = profile?.blindPanel?.roles?.map((role) => role.id) ?? []
  require(unique(roleIds) && roleIds.length === rubric.judges.length, 'profile roles must be unique and match all rubric judges')
  require(rubric.judges.every((judge) => roleIds.includes(judge.id)), 'profile is missing a rubric judge role')
  require(profile.blindPanel.roles.every((role) => rubric.judges.some((judge) => judge.id === role.id && judge.surface === role.surface)), 'profile role surfaces must match rubric v3')
  const roleCoverage = new Set(profile.blindPanel.roles.flatMap((role) => role.coverage))
  require(REQUIRED_COVERAGE.every((coverage) => roleCoverage.has(coverage)), 'blind role coverage does not cover every required discipline')
  require(rubric.jurors.length >= profile.blindPanel.minimumIndependentJurors, 'rubric has too few independent juror identities')
  require(rubric.hardGates.length >= 14, 'rubric does not preserve the full hard-gate floor')
  for (const gate of ['micro_layout_integrity', 'narrative_progression', 'contextual_journey', 'design_system_coherence', 'action_consequence']) {
    require(rubric.hardGates.some((candidate) => candidate.id === gate), `rubric is missing ${gate}`)
  }
  require(hasAll(profile?.releaseEvidence?.automatedBrowsers, ['Chromium', 'WebKit', 'Firefox']), 'release evidence must include Chromium, WebKit and Firefox')
  require(hasAll(profile?.releaseEvidence?.physicalDevices, ['iPhone Safari + VoiceOver', 'Android Chrome + TalkBack']), 'release evidence must include both physical assistive-device combinations')
  require(profile?.releaseEvidence?.physicalCannotBeInferred === true, 'physical evidence cannot be inferred')
  require(continuityContract.releaseBrowserDeviceMatrix.automated.some((item) => item.includes('Chromium')), 'continuity contract is missing Chromium')
  require(continuityContract.releaseBrowserDeviceMatrix.automated.some((item) => item.includes('WebKit')), 'continuity contract is missing WebKit')
  require(continuityContract.releaseBrowserDeviceMatrix.automated.some((item) => item.includes('Firefox')), 'continuity contract is missing Firefox')
  require(continuityContract.releaseBrowserDeviceMatrix.physical.some((item) => item.includes('iPhone Safari') && item.includes('VoiceOver')), 'continuity contract is missing physical iPhone Safari with VoiceOver')
  require(continuityContract.releaseBrowserDeviceMatrix.physical.some((item) => item.includes('Android Chrome') && item.includes('TalkBack')), 'continuity contract is missing physical Android Chrome with TalkBack')
  for (const command of ['definitions', 'reviewReadiness', 'presentation', 'continuity', 'blindPanel', 'status']) require(typeof profile?.commands?.[command] === 'string' && profile.commands[command].length > 0, `commands.${command} is required`)
  return failures
}

async function main() {
  const [profile, rubric, continuity] = await Promise.all([
    readFile(new URL('../../quality/website-redesign/experience-quality.profile.json', import.meta.url), 'utf8').then(JSON.parse),
    readFile(new URL('../../quality/award-panel/rubric.v3.json', import.meta.url), 'utf8').then(JSON.parse),
    readFile(new URL('../../quality/website-redesign/continuity-contract.v1.json', import.meta.url), 'utf8').then(JSON.parse),
  ])
  const failures = validateExperienceQualityProfile(profile, rubric, continuity)
  console.log(JSON.stringify({ projectId: profile.projectId, contractVersion: profile.contractVersion, specialistRoles: profile.blindPanel.roles.length, requiredCoverage: profile.requiredCoverage.length, reviewChecks: profile.reviewReadiness.requiredChecks.length, feedbackLedger: profile.feedbackReconciliation.ledger, failures }, null, 2))
  if (failures.length) process.exitCode = 1
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) main().catch((error) => { console.error(error); process.exitCode = 1 })
