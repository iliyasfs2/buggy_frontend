import type { ComponentType } from "react";
import type { LessonStep, StepType, StepRendererProps } from "@/types/lesson";
import {
  TheoryRenderer,
  SingleChoiceRenderer,
  FillBlankRenderer,
  LineOrderingRenderer,
  BugHuntRenderer
} from "./renderers";

type StepRendererComponent = ComponentType<StepRendererProps>;

const asStepRenderer = <T extends LessonStep>(
  renderer: ComponentType<StepRendererProps<T>>
): StepRendererComponent => renderer as unknown as StepRendererComponent;

export const STEP_REGISTRY: Record<StepType, StepRendererComponent> = {
  theory: asStepRenderer(TheoryRenderer),
  single_choice: asStepRenderer(SingleChoiceRenderer),
  fill_blank: asStepRenderer(FillBlankRenderer),
  line_ordering: asStepRenderer(LineOrderingRenderer),
  code_order: asStepRenderer(LineOrderingRenderer),
  bug_hunt: asStepRenderer(BugHuntRenderer)
};

export function getStepRenderer(type: StepType): StepRendererComponent {
  return STEP_REGISTRY[type] || asStepRenderer(TheoryRenderer);
}
