export type StepType =
  | "theory"
  | "single_choice"
  | "fill_blank"
  | "line_ordering"
  | "code_order"
  | "bug_hunt";

export type MascotMood =
  | "idle"
  | "thinking"
  | "alert"
  | "happy"
  | "confused"
  | "celebrate";

export interface BaseStep {
  id: string;
  type: StepType;
  title?: string;
  mascotMood?: MascotMood;
  mascotDialogue?: string;
}

export interface TheoryStep extends BaseStep {
  type: "theory";
  content: string;
  codeSnippet?: string;
  explanation?: string;
  continueText?: string;
}

export interface SingleChoiceStep extends BaseStep {
  type: "single_choice";
  question: string;
  codeSnippet?: string;
  options: string[];
  correctAnswer: string;
  correctIndex?: number;
  explanation?: string;
}

export interface FillBlankStep extends BaseStep {
  type: "fill_blank";
  instruction: string;
  codeTemplate: string;
  options?: string[];
  correctAnswer: string;
  acceptedAnswers?: string[];
  explanation?: string;
}

export interface LineOrderingStep extends BaseStep {
  type: "line_ordering" | "code_order";
  instruction: string;
  lines: string[];
  correctOrder: number[];
  explanation?: string;
}

export interface BugHuntStep extends BaseStep {
  type: "bug_hunt";
  instruction: string;
  codeSnippet?: string;
  codeLines?: string[];
  options?: string[];
  correctAnswer?: string;
  correctIndex?: number;
  buggyLineIndex?: number;
  explanation?: string;
}

export type LessonStep =
  | TheoryStep
  | SingleChoiceStep
  | FillBlankStep
  | LineOrderingStep
  | BugHuntStep;

export interface LessonContent {
  nodeId: string;
  title: string;
  totalXp: number;
  steps: LessonStep[];
}

export type LessonUserInput = string | number | boolean | number[] | null;

export type StepRendererProps<T extends LessonStep = LessonStep> = {
  step: T;
  value: LessonUserInput;
  onChange: (value: LessonUserInput) => void;
  isSubmitted: boolean;
  isCorrect?: boolean;
  isShaking?: boolean;
};
