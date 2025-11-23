# Zero-Knowledge Circuits for Spectra KYC

This package contains Circom circuits for privacy-preserving identity verification.

## Circuit: Age Verification

The `age_verification.circom` circuit allows proving that a user is above a certain age threshold without revealing their exact date of birth.

### How it works

- **Private Input**: `birthYear` - User's birth year (kept secret)
- **Public Inputs**:
  - `currentYear` - Current year
  - `threshold` - Minimum age required (e.g., 18)
- **Output**: `isValid` - 1 if age >= threshold, 0 otherwise

### Production Compilation

For production use, compile the circuit with:

```bash
# Install circom compiler
npm install -g circom

# Compile circuit
circom circuits/age_verification.circom --r1cs --wasm --sym --c

# Generate witness
node age_verification_js/generate_witness.js age_verification_js/age_verification.wasm input.json witness.wtns

# Setup (for Groth16)
snarkjs groth16 setup age_verification.r1cs pot12_final.ptau circuit_0000.zkey

# Generate verification key
snarkjs zkey export verificationkey circuit_final.zkey verification_key.json

# Generate proof
snarkjs groth16 prove circuit_final.zkey witness.wtns proof.json public.json

# Verify proof
snarkjs groth16 verify verification_key.json public.json proof.json
```

## Hackathon Note

For the hackathon MVP, we use a **simplified mock implementation** of ZK proofs that demonstrates the concept without requiring the full Circom toolchain setup. The mock service:

1. Generates cryptographic commitments to claims
2. Creates verifiable signatures
3. Demonstrates the ZK workflow

In production, this would be replaced with actual ZK-SNARK proofs compiled from these circuits.

## Benefits

- **Privacy**: Anchors verify age without seeing birth date
- **Reusability**: Same proof works for all anchors requiring age verification
- **Efficiency**: Small proof size (~200 bytes) vs full document data
- **Security**: Cryptographically sound, impossible to forge

## Future Enhancements

- Multi-attribute proofs (age + residency + sanctions check)
- Recursive proofs for credential aggregation
- Integration with identity standards (W3C DIDs)
- Hardware acceleration for proof generation
