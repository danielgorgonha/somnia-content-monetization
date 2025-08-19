# Architecture Decision Records (ADRs)

This directory contains Architecture Decision Records (ADRs) for the Somnia Content Monetization project. ADRs document important architectural decisions, their context, and consequences.

## ADR Index

- [ADR-001: Content Type Enum](./001-content-type-enum.md) - Decision to use enum for content types
- [ADR-002: Micropayment Vault Design](./002-micropayment-vault-design.md) - Design of the MicroPayVault contract
- [ADR-003: Micropayments Amount Limits](./003-micropayments-amount-limits.md) - Limits for micropayment amounts
- [ADR-004: Monthly Limit Reset Strategy](./004-monthly-limit-reset-strategy.md) - Strategy for resetting monthly limits
- [ADR-005: Gas Optimization Strategy](./005-gas-optimization-strategy.md) - Strategy for gas optimization
- [ADR-006: Gas Optimization Implementation](./006-gas-optimization-implementation.md) - Implementation details of gas optimizations
- [ADR-007: Micropayment Precision Issue](./007-micropayment-precision-issue.md) - Issue with micropayment precision and solutions
- [ADR-008: Micropayment User Parameter Fix](./008-micropayment-user-parameter-fix.md) - Fix for micropayment user identification issue

## What is an ADR?

An Architecture Decision Record is a document that captures an important architectural decision made along with its context, consequences, and implementation details.

## ADR Template

Each ADR follows this structure:
- **Status**: Current status (Proposed, Accepted, Deprecated, etc.)
- **Context**: The problem or situation that led to the decision
- **Decision**: The architectural decision made
- **Consequences**: Positive and negative consequences of the decision
- **Implementation**: How the decision was implemented
- **References**: Related documents and resources
