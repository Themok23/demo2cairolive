export class ModerationService {
  static shouldAutoApprove(autoApproveSetting: boolean): boolean {
    return autoApproveSetting;
  }

  static getInitialStatus(autoApprove: boolean): 'pending' | 'approved' {
    return autoApprove ? 'approved' : 'pending';
  }
}
