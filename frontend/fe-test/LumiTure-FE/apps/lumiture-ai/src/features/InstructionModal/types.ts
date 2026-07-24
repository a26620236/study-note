export enum InstructionName {
  OrgAndRole = 'Organization and Role',
  AuthAndResourceAssignment = 'Authorization and Resource Assignment',
}

export interface InstructionProps {
  onInstructionChange?: (instructionName: InstructionName) => void;
}
