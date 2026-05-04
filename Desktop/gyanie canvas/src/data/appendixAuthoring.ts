/**
 * Default authoring payloads for Appendix A1 (Proofs in Mathematics) tasks.
 * Text aligns with NCERT Mathematics Class 10, Appendix 1 (pages 218–238).
 */

export type BlockType =
  | 'text'
  | 'heading1'
  | 'heading2'
  | 'heading3'
  | 'bulletList'
  | 'numberedList'
  | 'quote'
  | 'callout'
  | 'divider'
  | 'image'
  | 'code';

export interface AppendixBlock {
  id: string;
  type: BlockType;
  content: string;
  imageUrl?: string;
  imageScale?: number;
}

export interface QuizQ {
  id: string;
  text: string;
  type: 'MCQ' | 'TrueFalse' | 'Short';
  options: string[];
  correctIdx: number;
}

export interface ProblemSeed {
  id: string;
  text: string;
  answer?: string;
  explanation?: string;
}

export interface DeliverableSeed {
  id: string;
  text: string;
  done: boolean;
  fileType: 'Document' | 'PDF' | 'Image' | 'Presentation' | 'Spreadsheet' | 'Any';
}

export interface AppendixAuthoringSeed {
  editorBlocks?: AppendixBlock[];
  videoUrl?: string;
  problems?: ProblemSeed[];
  quizQuestions?: QuizQ[];
  writePrompt?: string;
  notesInstructions?: string;
  deliverables?: DeliverableSeed[];
  flashCards?: { id: string; front: string; back: string }[];
  wordLimit?: number;
}

/** Shipped with AuthoringStage for non–Appendix A1 tasks. */
export const NON_APPENDIX_DEFAULT_READING_BLOCKS: AppendixBlock[] = [
  { id: 'def-h1', type: 'heading2', content: 'Introduction' },
  { id: 'def-t1', type: 'text', content: 'This is the reading assignment. Students will review this before moving on to the next step.' },
  { id: 'def-c1', type: 'callout', content: 'Pay close attention to the key terms highlighted in the document.' },
  { id: 'def-h2', type: 'heading3', content: 'Section 1: Foundations' },
  { id: 'def-t2', type: 'text', content: 'The cosmos is everything that exists — all of space and time and their contents, including planets, moons, minor planets and stars.' },
  { id: 'def-b1', type: 'bulletList', content: 'Stars are born in clouds of dust and gas called nebulae' },
  { id: 'def-b2', type: 'bulletList', content: 'Gravity pulls the dust and gas together to form a protostar' },
  { id: 'def-b3', type: 'bulletList', content: 'Nuclear fusion ignites in the core, and a star is born' },
  { id: 'def-d1', type: 'divider', content: '' },
  { id: 'def-q1', type: 'quote', content: 'The nitrogen in our DNA, the calcium in our teeth, the iron in our blood — were made in the interiors of collapsing stars. — Carl Sagan' },
];

export const NON_APPENDIX_DEFAULT_PROBLEMS: ProblemSeed[] = [
  { id: 'def-pr1', text: 'Evaluate the expression for x = 3' },
  { id: 'def-pr2', text: 'Simplify the polynomial' },
  { id: 'def-pr3', text: 'Factor the quadratic equation' },
];

export const NON_APPENDIX_DEFAULT_QUIZ: QuizQ[] = [
  { id: 'def-qz1', text: 'What is the closest star to Earth?', type: 'MCQ', options: ['The Sun', 'Proxima Centauri', 'Sirius', 'Alpha Centauri A'], correctIdx: 0 },
  { id: 'def-qz2', text: 'The Moon is a star.', type: 'TrueFalse', options: ['True', 'False'], correctIdx: 1 },
];

export const NON_APPENDIX_DEFAULT_DELIVERABLES: DeliverableSeed[] = [
  { id: 'def-d1', text: 'Rough Draft Document', done: false, fileType: 'Document' },
  { id: 'def-d2', text: 'Final Submission (PDF)', done: false, fileType: 'PDF' },
];

export const NON_APPENDIX_DEFAULT_FLASH_CARDS = [
  { id: 'def-f1', front: 'Supernova', back: 'The brilliant explosion of a star.' },
  { id: 'def-f2', front: 'Nebula', back: 'A giant cloud of dust and gas in space.' },
];

const short = (id: string, text: string): QuizQ => ({
  id,
  text,
  type: 'Short',
  options: [],
  correctIdx: 0,
});

const APPENDIX_SEEDS: Record<string, AppendixAuthoringSeed> = {
  't-app-1': {
    editorBlocks: [
      { id: 'a1-h', type: 'heading2', content: 'NCERT — A1.1 Introduction & A1.2 Mathematical Statements (pp. 218–220)' },
      { id: 'a1-t1', type: 'text', content: 'A mathematical proof is built from statements, each logically deduced from an earlier statement, a theorem, an axiom, or the hypotheses. The main tool is deductive reasoning.' },
      { id: 'a1-c1', type: 'callout', content: 'NCERT uses two everyday examples: a politician’s “vote for me for clean government” and an ad saying “The intelligent wear XYZ shoes.” Both can mislead; clear reasoning avoids such traps.' },
      { id: 'a1-h2', type: 'heading3', content: 'What counts as a mathematical statement?' },
      { id: 'a1-t2', type: 'text', content: 'A statement is a meaningful sentence that is not an order, exclamation, or question. In mathematics it is acceptable only if it is always true or always false — not ambiguous.' },
      { id: 'a1-b1', type: 'bulletList', content: 'Always true' },
      { id: 'a1-b2', type: 'bulletList', content: 'Always false' },
      { id: 'a1-b3', type: 'bulletList', content: 'Ambiguous (not allowed as a mathematical statement)' },
      { id: 'a1-d', type: 'divider', content: '' },
      { id: 'a1-q', type: 'quote', content: 'Example 1 (p. 219): Classify each statement as always true, always false, or ambiguous — e.g. “The Sun orbits the Earth” (always false), “Vehicles have four wheels” (ambiguous).' },
    ],
  },

  't-app-2': {
    videoUrl: '',
  },

  't-app-3': {
    problems: [
      {
        id: 'ex11-1',
        text: 'EXERCISE A1.1 (p. 221), Question 1. State whether the following statements are always true, always false or ambiguous. Justify your answers.\n(i) All mathematics textbooks are interesting.\n(ii) The distance from the Earth to the Sun is approximately 1.5 × 10^8 km.\n(iii) All human beings grow old.\n(iv) The journey from Uttarkashi to Harsil is tiring.\n(v) The woman saw an elephant through a pair of binoculars.',
      },
      {
        id: 'ex11-2',
        text: 'Question 2. State whether the following statements are true or false. Justify your answers.\n(i) All hexagons are polygons.\n(ii) Some polygons are pentagons.\n(iii) Not all even numbers are divisible by 2.\n(iv) Some real numbers are irrational.\n(v) Not all real numbers are rational.',
      },
      {
        id: 'ex11-3',
        text: 'Question 3. Let a and b be real numbers such that ab ≠ 0. Then which of the following statements are true? Justify your answers.\n(i) Both a and b must be zero.\n(ii) Both a and b must be non-zero.\n(iii) Either a or b must be non-zero.',
      },
      {
        id: 'ex11-4',
        text: 'Question 4. Restate the following statements with appropriate conditions, so that they become true.\n(i) If a² > b², then a > b.\n(ii) If x² = y², then x = y.\n(iii) If (x + y)² = x² + y², then x = 0.\n(iv) The diagonals of a quadrilateral bisect each other.',
      },
    ],
  },

  't-app-4': {
    quizQuestions: [
      short('qz4-1', "Q1. 'The temperature in Bhopal today is pleasant.' — Is this a mathematical statement? Why or why not?"),
      short('qz4-2', "Q2. Restate this as a true statement: 'If a² > b², then a > b.'"),
      short('qz4-3', "Q3. True or false — 'Between any two rational numbers there is no rational number.' Justify with a counter-example."),
    ],
  },

  't-app-5': {
    editorBlocks: [
      { id: 'a5-h', type: 'heading2', content: 'A1.3 Deductive Reasoning (pp. 222–223)' },
      { id: 'a5-t', type: 'text', content: 'Given statements are called premises or hypotheses. Deductive reasoning deduces conclusions from them. The process can be valid even if a premise is false in real life — what matters is logical structure.' },
      { id: 'a5-c', type: 'callout', content: 'Example 9: If “√p is irrational for all primes p” and “19423 is prime”, you conclude √19423 is irrational — NCERT assumes the prime premise for the sake of the argument without checking it.' },
    ],
  },

  't-app-6': {
    notesInstructions:
      'STRUCTURE FOR EVERY DEDUCTIVE ARGUMENT\nPremise 1 → Premise 2 → Deduction → Conclusion\n\nExample (algebra): Given y = −6x + 5 and x = 3, conclude y = −13.\nExample (geometry): Given ABCD is a parallelogram, opposite sides are equal — use hidden properties from the definition.\n\nUse this template before Exercise A1.2.',
  },

  't-app-7': {
    problems: [
      { id: 'ex12-1', text: 'EXERCISE A1.2 (p. 223), Q1. Given that all women are mortal, and suppose that A is a woman, what can we conclude about A?' },
      { id: 'ex12-2', text: 'Q2. Given that the product of two rational numbers is rational, and suppose a and b are rationals, what can you conclude about ab?' },
      { id: 'ex12-3', text: 'Q3. Given that the decimal expansion of irrational numbers is non-terminating, non-recurring, and √17 is irrational, what can we conclude about the decimal expansion of √17?' },
      { id: 'ex12-4', text: 'Q4. Given that y = x² + 6 and x = −1, what can we conclude about the value of y?' },
      { id: 'ex12-5', text: 'Q5. Given that ABCD is a parallelogram and ∠B = 80°. What can you conclude about the other angles of the parallelogram?' },
      { id: 'ex12-6', text: 'Q6. Given that PQRS is a cyclic quadrilateral and also its diagonals bisect each other. What can you conclude about the quadrilateral?' },
      {
        id: 'ex12-7',
        text: 'Q7. Given that √p is irrational for all primes p and also suppose that 3721 is a prime. Can you conclude that √3721 is an irrational number? Is your conclusion correct? Why or why not?',
        answer: 'The deduction would give √3721 irrational only if 3721 were prime. In fact 3721 = 61², so 3721 is not prime and √3721 = 61 is rational. The chain was valid; the premise “3721 is prime” was false.',
      },
    ],
  },

  't-app-8': {
    quizQuestions: [
      short('qz8-1', 'Q1. Given: All rectangles have equal diagonals. ABCD is a rectangle. What can you conclude about its diagonals?'),
      short('qz8-2', 'Q2. Given y = −3x + 7 and x = 4, deduce y. Name the two premises you used.'),
      short('qz8-3', "Q3. Q7 of Exercise A1.2 showed 3721 = 61², so √3721 is rational. What went wrong — the reasoning or a premise? One sentence."),
    ],
  },

  't-app-9': {
    editorBlocks: [
      { id: 'a9-h', type: 'heading2', content: 'A1.4 Conjectures, theorems, proofs (pp. 223–228)' },
      { id: 'a9-t', type: 'text', content: 'Verifying a formula for n = 1, 2, 3, 4, 5 is not a proof for all n. The circle-regions conjecture 2^(n−1) fails at n = 6 (31 regions, not 32) — one counter-example disproves a “for all” claim.' },
      { id: 'a9-h2', type: 'heading3', content: 'Direct proof and statement–analysis' },
      { id: 'a9-t2', type: 'text', content: 'Example 10: Sum of two rationals is rational (two-column Statements | Analysis). Example 11: primes > 3 have form 6k+1 or 6k+5 (proof by exhaustion). Theorem A1.1: Converse of Pythagoras — Step 2 constructs BD ⊥ AB with BD = BC.' },
    ],
  },

  't-app-10': {
    videoUrl: '',
  },

  't-app-11': {
    problems: [
      {
        id: 'ex13-1',
        text: 'EXERCISE A1.3 (p. 228), Q1. Prove that the sum of two consecutive odd numbers is divisible by 4. List all steps and give the reason for each step.',
      },
      {
        id: 'ex13-2',
        text: 'Q2. Take two consecutive odd numbers. Find the sum of their squares, and then add 6 to the result. Prove that the new number is always divisible by 8.',
      },
      {
        id: 'ex13-3',
        text: 'Q3. If p ≥ 5 is a prime number, show that p² + 2 is divisible by 3. [Hint: Use Example 11.]',
      },
      {
        id: 'ex13-4',
        text: 'Q4. Let x and y be rational numbers. Show that xy is a rational number.',
      },
      {
        id: 'ex13-5',
        text: 'Q5. If a and b are positive integers, then a = bq + r, 0 ≤ r < b, where q is a whole number. Prove that HCF(a, b) = HCF(b, r). [Hint: Let HCF(b, r) = h. So b = k₁h and r = k₂h, where k₁ and k₂ are coprime.]',
      },
      {
        id: 'ex13-6',
        text: 'Q6. A line parallel to side BC of a triangle ABC intersects AB and AC at D and E respectively. Prove that AD/DB = AE/EC.',
      },
    ],
  },

  't-app-12': {
    deliverables: [
      { id: 'as12-1', text: 'Proof 1 (number theory): e.g. product of three consecutive integers is divisible by 6 — two-column statement–analysis.', done: false, fileType: 'PDF' },
      { id: 'as12-2', text: 'Proof 2 (geometry): e.g. exterior angle of a triangle equals sum of two opposite interior angles — same format.', done: false, fileType: 'PDF' },
    ],
  },

  't-app-13': {
    quizQuestions: [
      short('qz13-1', 'Q1. The formula 2^(n−1) was verified for n = 1, 2, 3, 4, and 5. Why is this not enough to call it a theorem?'),
      short('qz13-2', 'Q2. In Example 10 (sum of two rationals), why confirm nq ≠ 0 as a separate step? What if we skipped it?'),
      short('qz13-3', 'Q3. Write the first two steps of a proof that the product of two consecutive even numbers is divisible by 8, with a reason for each step.'),
    ],
  },

  't-app-14': {
    editorBlocks: [
      { id: 'a14-h', type: 'heading2', content: 'A1.5 Negation of a statement (pp. 228–230)' },
      { id: 'a14-t', type: 'text', content: '~p is read “not p”. For “All teachers are female”, the negation is not “All teachers are not female” (misleading); it is “Not all teachers are female” / “Some teachers are not female”.' },
      { id: 'a14-c', type: 'callout', content: 'Criterion: ~p is true whenever p is false, and ~p is false whenever p is true. Working Rule (p. 230): write with “not”; if confusion remains, adjust statements involving “All” or “Some”.' },
    ],
  },

  't-app-15': {
    problems: [
      {
        id: 'ex14-1',
        text: 'EXERCISE A1.4 (p. 231), Q1. State the negations for the following statements:\n(i) Man is mortal.\n(ii) Line l is parallel to line m.\n(iii) This chapter has many exercises.\n(iv) All integers are rational numbers.\n(v) Some prime numbers are odd.\n(vi) No student is lazy.\n(vii) Some cats are not black.\n(viii) There is no real number x, such that √x = −1.\n(ix) 2 divides the positive integer a.\n(x) Integers a and b are coprime.',
      },
      {
        id: 'ex14-2',
        text: 'Q2. In each of the following, state if the second statement is the negation of the first.\n(i) Mumtaz is hungry. / Mumtaz is not hungry.\n(ii) Some cats are black. / Some cats are brown.\n(iii) All elephants are huge. / One elephant is not huge.\n(iv) All fire engines are red. / All fire engines are not red.\n(v) No man is a cow. / Some men are cows.',
      },
    ],
  },

  't-app-16': {
    quizQuestions: [
      short('qz16-1', "Q1. Negate: 'All prime numbers greater than 2 are odd.'"),
      short('qz16-2', "Q2. Negate: 'There is no real number x such that x² + 1 = 0.'"),
      short('qz16-3', "Q3. Is 'All fire engines are not red' a valid negation of 'All fire engines are red'? Explain in one sentence."),
    ],
  },

  't-app-17': {
    editorBlocks: [
      { id: 'a17-h', type: 'heading2', content: 'A1.6 Converse of a statement (pp. 231–233)' },
      { id: 'a17-t', type: 'text', content: 'If p ⇒ q, the converse is q ⇒ p. If p ⇒ q is true, the converse may be true or false — evaluate it separately.' },
      { id: 'a17-q', type: 'quote', content: 'Example: “If Ahmad is in Mumbai, then he is in India” is true; the converse “If Ahmad is in India, then he is in Mumbai” need not be true.' },
    ],
  },

  't-app-18': {
    problems: [
      {
        id: 'ex15-1',
        text: 'EXERCISE A1.5 (pp. 233–234), Q1. Write the converses of the following statements.\n(i) If it is hot in Tokyo, then Sharan sweats a lot.\n(ii) If Shalini is hungry, then her stomach grumbles.\n(iii) If Jaswant has a scholarship, then she can get a degree.\n(iv) If a plant has flowers, then it is alive.\n(v) If an animal is a cat, then it has a tail.',
      },
      {
        id: 'ex15-2',
        text: 'Q2. Write the converses of the following. Decide in each case whether the converse is true or false.\n(i) If triangle ABC is isosceles, then its base angles are equal.\n(ii) If an integer is odd, then its square is an odd integer.\n(iii) If x² = 1, then x = 1.\n(iv) If ABCD is a parallelogram, then AC and BD bisect each other.\n(v) If a, b and c are whole numbers, then a + (b + c) = (a + b) + c.\n(vi) If x and y are two odd numbers, then x + y is an even number.\n(vii) If vertices of a parallelogram lie on a circle, then it is a rectangle.',
      },
    ],
  },

  't-app-19': {
    quizQuestions: [
      short('qz19-1', 'Q1. Write the converse of: If two sides of a triangle are equal, then the angles opposite to them are equal. Is the converse true?'),
      short('qz19-2', 'Q2. Give your own example of a true statement whose converse is false (not from the textbook).'),
      short('qz19-3', "Q3. True or false: the converse of 'If x is even, then x² is even' is 'If x² is even, then x is even.' Is the converse true? Justify."),
    ],
  },

  't-app-20': {
    editorBlocks: [
      { id: 'a20-h', type: 'heading2', content: 'A1.7 Proof by contradiction (pp. 234–237)' },
      { id: 'a20-t', type: 'text', content: 'A contradiction: both p and ~p seem true. Method: (1) Assume what you want to prove is false. (2) Deduce logically. (3) Reach a contradiction. (4) Conclude the statement is true.' },
      { id: 'a20-c', type: 'callout', content: 'Example 15: rational × irrational is irrational. Theorem A1.2: shortest segment from a point to a line is the perpendicular — uses an extra construction (PN) even in contradiction proof.' },
    ],
  },

  't-app-21': {
    videoUrl: '',
  },

  't-app-22': {
    problems: [
      { id: 'ex16-1', text: 'EXERCISE A1.6 (p. 238), Q1. Suppose a + b = c + d, and a < c. Use proof by contradiction to show b > d.' },
      { id: 'ex16-2', text: 'Q2. Let r be rational and x irrational. Use proof by contradiction to show that r + x is irrational.' },
      {
        id: 'ex16-3',
        text: 'Q3. Use proof by contradiction to prove: if for an integer a, a² is even, then a is even. [Hint: Assume a is not even, i.e. a = 2n + 1 for some integer n, and proceed.]',
      },
      {
        id: 'ex16-4',
        text: 'Q4. Use proof by contradiction to prove: if for an integer a, a² is divisible by 3, then a is divisible by 3.',
      },
      { id: 'ex16-5', text: 'Q5. Use proof by contradiction to show that there is no value of n for which 6ⁿ ends with the digit zero.' },
      { id: 'ex16-6', text: 'Q6. Prove by contradiction that two distinct lines in a plane cannot intersect in more than one point.' },
    ],
  },

  't-app-23': {
    quizQuestions: [
      short('qz23-1', 'Q1. Write the four steps of proof by contradiction as a general template (no specific problem).'),
      short('qz23-2', 'Q2. In Example 15, what exactly is the contradiction that arises? One sentence.'),
      short('qz23-3', 'Q3. Use contradiction to show: if 3 divides a², then 3 divides a (attempt without looking at Exercise A1.6).'),
    ],
  },

  't-app-24': {
    wordLimit: 800,
    writePrompt:
      'From memory (timer ~20 min), write:\n\n1) What makes a mathematical statement valid? One example each: always true, always false, ambiguous.\n2) Structure of deductive reasoning; what are premises? Two-premise example and conclusion.\n3) Conjecture vs theorem; circle-regions example and counter-example at n = 6.\n4) Negation of “All students passed” — why “All students did not pass” is wrong.\n5) Converse of “If it rains, the ground is wet” — is the converse true? Why?\n6) Four steps of proof by contradiction; sketch √2 irrational from memory.\n\nThen open NCERT and mark gaps.',
  },

  't-app-25': {
    flashCards: [
      { id: 'fc1', front: 'A1.2 — When is a sentence a mathematical statement?', back: 'Only if always true or always false; ambiguous sentences are excluded.' },
      { id: 'fc2', front: 'A1.3 — What are premises?', back: 'Given statements assumed true for the argument; conclusions follow by deduction.' },
      { id: 'fc3', front: 'A1.4 — Conjecture vs theorem', back: 'A conjecture is a guess; a theorem is proved for all cases. One counter-example disproves a universal claim.' },
      { id: 'fc4', front: 'A1.5 — Negation of “All X are Y”', back: '“Some X are not Y” / “Not all X are Y” — not “All X are not Y”.' },
      { id: 'fc5', front: 'A1.6 — Converse of p ⇒ q', back: 'q ⇒ p — must be checked separately; truth does not automatically transfer.' },
      { id: 'fc6', front: 'A1.7 — Proof by contradiction (4 steps)', back: 'Assume ~p; deduce; reach contradiction; conclude p.' },
    ],
  },

  't-app-26': {
    quizQuestions: [
      short('ch26-1', "Q1. 'The speed of sound is approximately 340 m/s.' Always true, always false, or ambiguous? Justify."),
      short('ch26-2', "Q2. Restate as a true statement: 'If (x + y)² = x² + y², then x = 0.'"),
      short(
        'ch26-3',
        'Q3. Given: all parallelograms have diagonals that bisect each other; ABCD is a parallelogram; diagonal AC = 10 cm. What are the lengths of the two segments AC is divided into? Name the reasoning type.'
      ),
      short('ch26-4', "Q4. Negate: 'Some irrational numbers are integers.'"),
      short('ch26-5', "Q5. Negate: 'There is no integer n such that n² is negative.'"),
      short(
        'ch26-6',
        "Q6. Converse of: 'If a number ends in 0, then it is divisible by 5.' Is the converse true? Justify."
      ),
      short('ch26-7', "Q7. Give a counter-example to disprove: 'If x² > 9, then x > 3.'"),
      short(
        'ch26-8',
        'Q8. Prove: sum of a rational and an irrational number is irrational — proof by contradiction with all four steps explicit.'
      ),
      short(
        'ch26-9',
        'Q9. In Theorem A1.1 (Converse of Pythagoras), why is segment BD constructed in Step 2? What if we did not construct it?'
      ),
      short(
        'ch26-10',
        'Q10. First three steps of a direct proof that the product of two consecutive integers is always even — with reasons.'
      ),
      short('ch26-11', "Q11. Is 'Not all prime numbers are odd' the same as 'Some prime numbers are not odd'? Justify."),
      short('ch26-12', "Q12. True or false: 'p ⇒ q' and 'q ⇒ p' are logically equivalent? Justify with an example."),
    ],
  },
};

export function getAppendixAuthoringSeed(taskId: string | undefined): AppendixAuthoringSeed | undefined {
  if (!taskId) return undefined;
  return APPENDIX_SEEDS[taskId];
}
