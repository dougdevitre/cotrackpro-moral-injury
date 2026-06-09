import type { EvidenceItem, LongViewPathway } from "../types";

/**
 * The "Long view": how a single professional action or inaction can ripple
 * across a child's life — paired, in every case, with the protective move
 * within the professional's control, and a clean if-then habit to lock it in.
 *
 * Framing discipline:
 *  - Outcomes are PROBABILISTIC and BUFFERABLE, never predetermined. Language is
 *    "increases the risk of" / "is associated with", never "will cause".
 *  - Every harm pathway carries a `leverage` counter-move and a `habit`, because
 *    the science says the same levers (conflict, stability, a caring adult) cut
 *    both ways.
 *  - Educational only; not a diagnosis or a prediction about any real child.
 */

export const LONG_VIEW_PATHWAYS: LongViewPathway[] = [
  {
    id: "delay",
    action: "A months-long delay in resolving a custody matter",
    ruleId: "1.3",
    shortTerm:
      "The child lives in limbo — routines, school, and attachments held in suspension while the adults wait.",
    mechanism:
      "Prolonged uncertainty alongside ongoing conflict keeps a child's stress response switched on. Sustained ('toxic') stress without a stable, buffering relationship can affect the developing brain and body.",
    longTerm:
      "Childhood adversity accumulates in a dose-response way: the longer the instability runs, the higher the associated lifelong risk for anxiety, depression, and stress-related health problems.",
    leverage:
      "Every week you shorten the limbo lowers the dose. Push for interim stability — a settled routine, school continuity — even before final resolution.",
    habit: {
      cue: "When a custody matter starts to drag",
      then: "I will push for interim stability and the soonest realistic resolution",
    },
  },
  {
    id: "escalate",
    action: "Escalating conflict or scorched-earth tactics",
    ruleId: "4.4",
    shortTerm:
      "The child absorbs the hostility, feels caught between people they love, and grows hypervigilant around exchanges and hearings.",
    mechanism:
      "It is high interparental conflict — not the separation itself — that most strongly drives harm. Repeated hostility threatens a child's felt sense of emotional security in the family.",
    longTerm:
      "Sustained exposure is associated with depression, anxiety, aggression, sleep and academic problems, and difficulty trusting relationships into adulthood.",
    leverage:
      "You can lower the temperature. Every choice to de-escalate reduces the child's conflict exposure — the single most modifiable risk factor in the whole picture.",
    habit: {
      cue: "When I feel the urge to escalate",
      then: "I will choose the move that lowers the child's conflict exposure",
    },
  },
  {
    id: "leverage",
    action: "Using custody or the child as negotiating leverage",
    shortTerm:
      "The child senses they are the currency. They feel responsible, torn, and unsafe to openly love both parents.",
    mechanism:
      "Being positioned between parents drives a fear of abandonment, which research identifies as a pathway from conflict to mental-health problems.",
    longTerm:
      "Associated with internalized guilt, insecure attachment patterns, and later difficulty in close relationships.",
    leverage:
      "Refuse to treat the child as a bargaining chip. Reframe the negotiation around the child's actual needs — fully within your control, and protective.",
    habit: {
      cue: "When custody could be used as leverage",
      then: "I will reframe the negotiation around the child's actual needs",
    },
  },
  {
    id: "voice",
    action: "Deciding about a child without surfacing the child's needs or voice",
    shortTerm:
      "Decisions are made about the child without the child. They feel powerless, unseen, and unsure anyone understands their world.",
    mechanism:
      "A poor-fit arrangement plus the felt experience of being unheard undermines the child's sense of a secure base and adds instability.",
    longTerm:
      "Arrangements that do not fit a child's real circumstances are linked to poorer adjustment; feeling unseen compounds over time.",
    leverage:
      "Make sure the child's actual experience informs the decision, age-appropriately. A well-fitting, stable arrangement is itself a protective factor.",
    habit: {
      cue: "Before I finalize an arrangement for a child",
      then: "I will make sure the child's real experience has informed it",
    },
  },
  {
    id: "candor",
    action: "Letting the court rely on something false or misleading",
    ruleId: "3.3",
    shortTerm:
      "The child lands in an arrangement built on a falsehood — possibly less safe, or a poorer fit than the truth would have produced.",
    mechanism:
      "When the tribunal is misled, a one-time act can place a child into ongoing adversity, converting a single decision into a sustained source of stress.",
    longTerm:
      "A wrong, unsafe, or unstable placement is exactly the kind of prolonged adversity that accumulates dose-response across the lifespan.",
    leverage:
      "Candor protects the accuracy of the decision the child has to live inside. Correcting the record is never too late — and it is the protective act here.",
    habit: {
      cue: "When I notice the court may be relying on something false",
      then: "I will correct the record",
    },
  },
  {
    id: "inaction",
    action: "Not acting on a safety concern you noticed",
    shortTerm:
      "The child remains in a situation you had a chance to flag — abuse, neglect, or violence that continues unaddressed.",
    mechanism:
      "Inaction can leave a child exposed to core adverse experiences without the adult buffer that turns toxic stress into something tolerable.",
    longTerm:
      "Cumulative exposure to abuse, neglect, or household violence carries some of the strongest dose-response links to lifelong mental and physical health risk.",
    leverage:
      "Raising a concern through legitimate channels can be the act that removes the adversity or adds the buffer. Inaction is itself a choice with consequences.",
    habit: {
      cue: "When I notice a safety concern",
      then: "I will raise it through a legitimate channel rather than wait",
    },
  },
];

export const LONG_VIEW_EVIDENCE: EvidenceItem[] = [
  {
    label: "Adversity accumulates (dose-response)",
    cite: "Felitti et al. (1998), Adverse Childhood Experiences (ACE) Study, Am. J. Preventive Medicine — CDC / Kaiser Permanente.",
    url: "https://www.sciencedirect.com/science/article/abs/pii/S0749379798000178",
  },
  {
    label: "The mechanism — and the buffer",
    cite: "Center on the Developing Child, Harvard University: toxic stress, and how a stable, responsive adult relationship buffers it.",
    url: "https://developingchild.harvard.edu/key-concept/toxic-stress/",
  },
  {
    label: "It's the conflict, not the divorce",
    cite: "Cummings & Davies (emotional security theory); Amato (2001): high interparental conflict is the strongest driver of harm to children.",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC2597571/",
  },
  {
    label: "What protects",
    cite: "American Academy of Pediatrics (2021): safe, stable, nurturing relationships buffer adversity and build resilience.",
    url: "https://publications.aap.org/pediatrics/article/148/2/e2021052582/179805/Preventing-Childhood-Toxic-Stress-Partnering-With",
  },
];
