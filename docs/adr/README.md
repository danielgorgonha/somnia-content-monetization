# Architecture Decision Records (ADRs)

This directory contains Architecture Decision Records (ADRs) for the Somnia Content Monetization project. ADRs document significant architectural decisions, their context, consequences, and alternatives considered.

## What are ADRs?

Architecture Decision Records are documents that capture important architectural decisions made during the development of a project. They help:

- **Document Decisions**: Record why certain architectural choices were made
- **Share Knowledge**: Help team members understand the reasoning behind decisions
- **Track Evolution**: Show how the architecture has evolved over time
- **Onboard New Developers**: Provide context for new team members
- **Avoid Repeating Mistakes**: Learn from past decisions and their outcomes

## ADR Format

Each ADR follows this structure:

1. **Status**: Current status (Proposed, Accepted, Rejected, Deprecated)
2. **Context**: The situation that led to the decision
3. **Decision**: The architectural decision made
4. **Consequences**: Positive, negative, and neutral consequences
5. **Implementation Details**: Technical implementation specifics
6. **Alternatives Considered**: Other options that were evaluated
7. **Related Decisions**: Links to other ADRs
8. **References**: External resources and documentation

## ADR Index

### Smart Contract Architecture

| ADR | Title | Status | Description |
|-----|-------|--------|-------------|
| [ADR-001](./001-content-type-enum.md) | Content Type Enum Design | Accepted | Design of content type enumeration system |
| [ADR-002](./002-micropayment-vault-design.md) | MicroPayVault Design | Accepted | Escrow system for micropayments |
| [ADR-003](./003-micropayment-amount-limits.md) | Micropayment Amount Limits | Accepted | Limits and validation for micropayments |
| [ADR-004](./004-monthly-limit-reset-strategy.md) | Monthly Limit Reset Strategy | Accepted | Strategy for resetting monthly spending limits |
| [ADR-005](./005-gas-optimization-strategy.md) | Gas Optimization Strategy | Accepted | Gas optimization for micropayments |

### Future ADRs (Planned)

| ADR | Title | Status | Description |
|-----|-------|--------|-------------|
| ADR-006 | Account Abstraction Implementation | Proposed | ERC-4337 smart wallet integration |
| ADR-007 | Session Key Management | Proposed | Temporary authorization for micropayments |
| ADR-008 | Content Metadata Storage | Proposed | IPFS vs on-chain metadata storage |
| ADR-009 | Multi-chain Support | Proposed | Cross-chain micropayment architecture |
| ADR-010 | Creator Revenue Distribution | Proposed | Revenue sharing and distribution models |

## How to Create an ADR

1. **Identify the Decision**: Determine if a decision warrants an ADR
2. **Create the File**: Use the template below
3. **Document the Decision**: Fill in all sections thoroughly
4. **Review and Approve**: Get team review and approval
5. **Update Index**: Add to this README
6. **Link Related ADRs**: Update related ADR references

### ADR Template

```markdown
# ADR-XXX: [Title]

## Status
[Proposed/Accepted/Rejected/Deprecated]

## Context
[Describe the situation that led to this decision]

## Decision
[Describe the architectural decision made]

## Consequences

### Positive
- ✅ [Positive consequence 1]
- ✅ [Positive consequence 2]

### Negative
- ❌ [Negative consequence 1]
- ❌ [Negative consequence 2]

### Neutral
- 🔄 [Neutral consequence 1]
- 🔄 [Neutral consequence 2]

## Implementation Details
[Technical implementation specifics]

## Alternatives Considered
[Other options that were evaluated]

## Related Decisions
[Links to other ADRs]

## References
[External resources and documentation]
```

## ADR Lifecycle

### 1. **Proposed**
- Initial ADR created
- Under review by team
- Open for discussion and feedback

### 2. **Accepted**
- Decision approved by team
- Implementation can proceed
- Considered active and binding

### 3. **Rejected**
- Decision not approved
- Alternative approach chosen
- Documented for future reference

### 4. **Deprecated**
- Decision superseded by newer ADR
- Implementation should be updated
- Kept for historical reference

## Best Practices

### When to Create an ADR
- **Architectural Decisions**: Changes to system architecture
- **Technology Choices**: Selection of frameworks, libraries, or tools
- **Design Patterns**: Implementation of specific design patterns
- **Security Decisions**: Security-related architectural choices
- **Performance Decisions**: Performance optimization strategies

### When NOT to Create an ADR
- **Implementation Details**: Specific code implementation
- **Bug Fixes**: Routine bug fixes and patches
- **Minor Changes**: Small, non-architectural changes
- **Temporary Decisions**: Decisions that will be revisited soon

### Writing Good ADRs
- **Be Specific**: Clearly state what was decided
- **Provide Context**: Explain why the decision was made
- **Consider Consequences**: Document all impacts
- **Link Related ADRs**: Show relationships between decisions
- **Keep Updated**: Update status as decisions evolve

## Contributing

1. **Fork the Repository**: Create your own fork
2. **Create ADR**: Add new ADR following the template
3. **Update Index**: Add to this README
4. **Submit PR**: Create pull request for review
5. **Get Approval**: Obtain team approval
6. **Merge**: Merge after approval

## References

- [ADR GitHub Repository](https://github.com/joelparkerhenderson/architecture_decision_record)
- [ADR Wikipedia](https://en.wikipedia.org/wiki/Architecture_decision_record)
- [ADR Best Practices](https://adr.github.io/)
- [ADR Template](https://github.com/joelparkerhenderson/architecture_decision_record/blob/main/adr_template.md)
