import 'server-only';
import type { FinalModerationDecision } from '@/lib/discussion/moderation-policy';
import { prisma } from '@/lib/prisma';
import { createNotification } from '@/lib/notifications';
export async function notifyDiscussionReview(clerkId: string, postId: string, title: string, reviewId: string, decision: FinalModerationDecision) {
  // Notification delivery must never undo a completed moderation decision.
  try {
    const recipient = await prisma.user.findUnique({ where: { clerkId }, select: { id: true } });
    if (!recipient) return;
    const label = decision === 'APPROVE' ? 'Bài viết đã được duyệt' : decision === 'REVISION_REQUIRED' ? 'Bài viết cần chỉnh sửa' : decision === 'REJECT' ? 'Bài viết chưa được chấp nhận' : 'Bài viết cần được xem xét thêm';
    await createNotification({ recipientId: recipient.id, type: 'SYSTEM', title: label, body: title.slice(0, 140), href: `/discussion/review/${postId}`, entityType: 'MODERATION_REVIEW', entityId: reviewId, dedupeId: `review-${reviewId}` });
  } catch {
    console.error('Chưa gửi được thông báo kết quả duyệt bài.');
  }
}
