# DESIGN-002: Team Tokens & Member Management

**Status:** Planned  
**Date:** 2026-01-26

## Context
Currently, sharing a Redenv project requires sharing the **Master Password** or a **Service Token**. 
- The Master Password is "root" access and is difficult to rotate because it affects every user. 
- Service Tokens are currently implemented and documented specifically for "machine" access (CI/CD, Servers).

This RFC proposes adapting the Service Token architecture to support human **"Team Members"**. This bridges the gap between individual developers and full enterprise RBAC.

## Core Concept
We will allow project owners to generate unique, revocable tokens for individual team members. These tokens will function exactly like Service Tokens cryptographically (they wrap the Project Encryption Key), but will be managed under a "Member" context in the CLI.

## Implementation Strategy

### 1. Cryptographic Mechanism
*   **Generate Secret:** The CLI generates a random, high-entropy string (the "Invite Token").
*   **Wrap PEK:** The CLI fetches the decrypted Project Encryption Key (PEK).
*   **Encrypt:** It generates a salt and encrypts the PEK using the new Invite Token.
*   **Store:** The encrypted PEK wrapper is stored in the project metadata in Redis.

### 2. Data Structure
We will store members in the `meta@<project>` hash, either extending the `serviceTokens` JSON or creating a parallel `members` JSON field to distinguish humans from machines.

**Proposed Schema (in `meta@project`):**
```json
{
  "members": {
    "mem_abc123": {
      "name": "Alice",
      "email": "alice@company.com",
      "salt": "hex_salt",
      "encryptedPEK": "hex_ciphertext",
      "role": "write", 
      "createdAt": "ISO_DATE",
      "createdBy": "admin_user"
    }
  }
}
```

*Note: The `role` field ("read", "write", "admin") will be enforced **client-side** by the CLI in this phase. True enforcement requires a server-side gateway (Redenv Cloud).*

### 3. CLI UX
New command suite: `redenv member`

*   **`redenv member add <name>`**
    *   Prompts for an optional email (for auditing).
    *   Generates and displays the token **once**.
    *   *Output:* "Share this token securely with [name]: `redenv_mem_...`"
*   **`redenv member list`**
    *   Shows all active members, their roles, and who invited them.
*   **`redenv member revoke <name|id>`**
    *   Removes the entry from Redis.
    *   *Effect:* That specific token can no longer decrypt the PEK. Access is revoked immediately without affecting other users.

### 4. Benefits
1.  **No Master Password Sharing:** The Master Password remains with the owner (or can be forgotten/rotated if enough admin tokens exist).
2.  **Granular Revocation:** Offboarding an employee is as simple as running `redenv member revoke`.
3.  **Better Auditing:** Since every member has a unique token, the CLI can automatically tag secret updates with the specific user's identity (instead of a generic "admin").