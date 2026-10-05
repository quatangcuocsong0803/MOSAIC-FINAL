"use server";

import { submitComment, listComments, retryOrReviseComment } from "@/lib/discussion/comment-service";

export async function submitDiscussionComment(postId: string, content: string, parentId: string | null, requestId: string) {
  return submitComment(postId, content, parentId, requestId);
}

export async function getDiscussionComments(postId: string) {
  return listComments(postId);
}

export async function retryDiscussionComment(id: string) {
  return retryOrReviseComment(id);
}

export async function reviseDiscussionComment(id: string, content: string) {
  return retryOrReviseComment(id, content);
}
