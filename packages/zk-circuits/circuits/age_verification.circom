pragma circom 2.1.0;

// Circuit to verify age >= threshold without revealing exact age
// Inputs:
//   - birthYear (private): User's birth year
//   - currentYear (public): Current year
//   - threshold (public): Minimum age required (e.g., 18)
// Output:
//   - isValid: 1 if age >= threshold, 0 otherwise

template GreaterEqThan(n) {
    signal input in[2];
    signal output out;

    component lt = LessThan(n);
    lt.in[0] <== in[0];
    lt.in[1] <== in[1];

    out <== 1 - lt.out;
}

template LessThan(n) {
    assert(n <= 252);
    signal input in[2];
    signal output out;

    component num2Bits = Num2Bits(n);
    component lt = LessEqThan(n);

    num2Bits.in <== in[0] + (1<<n) - in[1];
    lt.in[0] <== num2Bits.out[n-1];
    lt.in[1] <== 0;

    out <== 1 - lt.out;
}

template LessEqThan(n) {
    signal input in[2];
    signal output out;

    out <== in[0] * in[1];
}

template Num2Bits(n) {
    signal input in;
    signal output out[n];
    var lc = 0;

    for (var i = 0; i < n; i++) {
        out[i] <-- (in >> i) & 1;
        out[i] * (out[i] - 1) === 0;
        lc += out[i] * (1 << i);
    }

    lc === in;
}

template AgeVerification() {
    // Private input - birth year (kept secret)
    signal input birthYear;

    // Public inputs - visible to verifier
    signal input currentYear;
    signal input threshold;

    // Output - result of verification
    signal output isValid;

    // Calculate age
    signal age;
    age <== currentYear - birthYear;

    // Verify age >= threshold
    component gte = GreaterEqThan(8); // 8 bits should be enough for age (0-255)
    gte.in[0] <== age;
    gte.in[1] <== threshold;

    isValid <== gte.out;
}

component main {public [currentYear, threshold]} = AgeVerification();
