export function generateProposal(data: any) {
  return {
    greeting: `Dear ${data.clientName || 'Client'},`,
    executiveSummary: `We are excited to present this proposal for ${data.projectTitle || 'your project'}. This project will be completed within ${data.duration || 'the agreed timeframe'}.`,
    scopeOfWork: data.scope ? data.scope.split('\n').filter((s: string) => s.trim()) : ['Project execution'],
    timeline: `The project will be completed in ${data.duration || 'the agreed timeframe'}.`,
    terms: `Payment terms: ${data.depositPercent || 50}% deposit upfront, balance due upon completion.`,
    callToAction: `To proceed, please click the Pay Deposit button below. We look forward to working with you!`,
  }
}
