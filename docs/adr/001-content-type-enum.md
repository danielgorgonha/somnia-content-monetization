# ADR 001: Content Type Enum Design

## Status
Accepted

## Context
We need to support multiple types of digital content (video, audio, text, recipes, books, etc.) in our micropayment platform. Each content type has different consumption patterns and pricing models.

## Decision
We will use a Solidity enum to define content types and store them in the CreatorRegistry contract.

## Consequences

### Positive
- Type safety at the contract level
- Clear categorization of content
- Easy to extend with new content types
- Gas efficient storage
- Clear interface for frontend integration

### Negative
- Requires contract upgrade to add new content types
- Limited to 256 different types (uint8 enum limit)

## Implementation
```solidity
enum ContentType {
    VIDEO,
    AUDIO,
    TEXT,
    RECIPE,
    BOOK,
    COURSE,
    PODCAST,
    ARTICLE
}
```

## Alternatives Considered
1. **String-based types**: More flexible but gas expensive
2. **Separate contracts per type**: Better isolation but complex deployment
3. **External registry**: More flexible but adds complexity

## Related
- CreatorRegistry contract
- Content consumption tracking
- Pricing models
